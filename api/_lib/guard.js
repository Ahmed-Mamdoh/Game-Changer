import fetch from "node-fetch";

// Shared protections for the serverless proxies in api/.
// Files under api/_lib are not exposed as routes by Vercel.

const DEFAULT_ORIGINS = [
  "https://game-changer-gg.vercel.app",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:4173",
];

function allowedOrigins() {
  const extra = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
  // Vercel preview / branch deployments
  const vercel = [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]
    .filter(Boolean)
    .map((host) => `https://${host}`);
  return new Set([...DEFAULT_ORIGINS, ...vercel, ...extra]);
}

function requestOrigin(req) {
  if (req.headers.origin) return req.headers.origin;
  // Same-origin GET requests usually omit Origin but send Referer
  const referer = req.headers.referer;
  if (!referer) return null;
  try {
    return new URL(referer).origin;
  } catch {
    return null;
  }
}

// Blocks other websites from using the proxies from their visitors' browsers.
// Non-browser clients can fake these headers, so this is paired with rate
// limiting (and auth for Groq).
export function checkOrigin(req, res) {
  const origin = requestOrigin(req);
  if (!origin || !allowedOrigins().has(origin)) {
    res.status(403).json({ error: "Origin not allowed" });
    return false;
  }
  return true;
}

export function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}

// Fixed-window limiter kept in memory. Each warm serverless instance has its
// own buckets, so this is a best-effort cap, not a global one.
const buckets = new Map();

// Buckets by client IP unless an id (such as a user id) is given.
export function rateLimit(req, res, { key, limit, windowMs, id }) {
  const now = Date.now();
  const bucketKey = `${key}:${id || clientIp(req)}`;
  let bucket = buckets.get(bucketKey);
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(bucketKey, bucket);
  }
  bucket.count++;

  if (buckets.size > 10000) {
    for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k);
  }

  res.setHeader("X-RateLimit-Limit", String(limit));
  res.setHeader(
    "X-RateLimit-Remaining",
    String(Math.max(0, limit - bucket.count)),
  );
  if (bucket.count > limit) {
    res.setHeader(
      "Retry-After",
      String(Math.ceil((bucket.resetAt - now) / 1000)),
    );
    res.status(429).json({ error: "Too many requests" });
    return false;
  }
  return true;
}

// Verifies a Supabase access token sent as "Authorization: Bearer <token>".
// Returns the user, or null after sending a 401.
export async function requireUser(req, res) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!token) {
    res.status(401).json({ error: "Sign in required" });
    return null;
  }
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase env vars missing for auth check");
    res.status(500).json({ error: "Server misconfigured" });
    return null;
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      res.status(401).json({ error: "Invalid or expired session" });
      return null;
    }
    const user = await response.json();
    if (!user?.id) {
      res.status(401).json({ error: "Invalid or expired session" });
      return null;
    }
    return user;
  } catch (err) {
    console.error("Supabase auth check failed:", err);
    res.status(502).json({ error: "Could not verify session" });
    return null;
  }
}
