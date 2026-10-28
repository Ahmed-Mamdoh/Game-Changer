import fetch from "node-fetch";
import { checkOrigin, rateLimit } from "./_lib/guard.js";

// Only the IGDB endpoints the app uses (see src/api/igdbApi.js)
const ALLOWED_ENDPOINTS = new Set([
  "games",
  "games/count",
  "genres",
  "game_modes",
  "themes",
  "game_time_to_beats",
  "companies",
]);
const MAX_QUERY_LENGTH = 8000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!checkOrigin(req, res)) return;
  if (!rateLimit(req, res, { key: "igdb", limit: 240, windowMs: 60_000 }))
    return;

  const { endpoint, query } = req.body || {};
  if (!ALLOWED_ENDPOINTS.has(endpoint)) {
    return res.status(400).json({ error: "Endpoint not allowed" });
  }
  if (typeof query !== "string" || query.length > MAX_QUERY_LENGTH) {
    return res.status(400).json({ error: "Invalid query" });
  }

  try {
    const response = await fetch(`https://api.igdb.com/v4/${endpoint}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": process.env.CLIENT_ID,
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
      body: query,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("IGDB fetch error:", err);
    res.status(500).json({ error: "Failed to fetch IGDB data" });
  }
}
