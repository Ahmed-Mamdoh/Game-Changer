import fetch from "node-fetch";
import { checkOrigin, rateLimit, requireUser } from "./_lib/guard.js";

// Only the models the app rotates through (see src/features/ChatBot/hooks/useChat.jsx)
const ALLOWED_MODELS = new Set([
  "openai/gpt-oss-120b",
  "moonshotai/kimi-k2-instruct-0905",
  "openai/gpt-oss-safeguard-20b",
  "groq/compound",
  "groq/compound-mini",
  "openai/gpt-oss-20b",
  "meta-llama/llama-guard-4-12b",
  "meta-llama/llama-prompt-guard-2-22m",
  "meta-llama/llama-prompt-guard-2-86m",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
]);
const ALLOWED_ROLES = new Set(["system", "user", "assistant"]);
const MAX_MESSAGES = 50;
const MAX_TOTAL_CHARS = 100000;

function validMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return null;
  if (messages.length > MAX_MESSAGES) return null;
  let total = 0;
  const cleaned = [];
  for (const m of messages) {
    if (!m || !ALLOWED_ROLES.has(m.role) || typeof m.content !== "string")
      return null;
    total += m.content.length;
    // Drop extra fields (e.g. reasoning) the client echoes back
    cleaned.push({ role: m.role, content: m.content });
  }
  return total <= MAX_TOTAL_CHARS ? cleaned : null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!checkOrigin(req, res)) return;
  if (!rateLimit(req, res, { key: "groq-ip", limit: 30, windowMs: 60_000 }))
    return;

  const user = await requireUser(req, res);
  if (!user) return;
  if (
    !rateLimit(req, res, {
      key: "groq-user",
      id: user.id,
      limit: 20,
      windowMs: 60_000,
    })
  )
    return;

  const { messages, model } = req.body || {};
  if (!ALLOWED_MODELS.has(model)) {
    return res.status(400).json({ error: "Model not allowed" });
  }
  const cleanedMessages = validMessages(messages);
  if (!cleanedMessages) {
    return res.status(400).json({ error: "Invalid messages" });
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model,
          messages: cleanedMessages,
        }),
      },
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Groq fetch error:", err);
    res.status(500).json({ error: "Failed to fetch Groq data" });
  }
}
