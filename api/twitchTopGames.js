import fetch from "node-fetch";
import { checkOrigin, rateLimit } from "./_lib/guard.js";

// Twitch's most-watched games right now, reduced to their IGDB ids. Uses the
// same Twitch app credentials as the IGDB proxy.
const CACHE_MS = 5 * 60 * 1000;
let cache = { at: 0, games: null };

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!checkOrigin(req, res)) return;
  if (!rateLimit(req, res, { key: "twitch", limit: 60, windowMs: 60_000 }))
    return;

  if (cache.games && Date.now() - cache.at < CACHE_MS) {
    return res.status(200).json(cache.games);
  }

  try {
    const response = await fetch(
      "https://api.twitch.tv/helix/games/top?first=100",
      {
        headers: {
          "Client-Id": process.env.CLIENT_ID,
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      },
    );
    const body = await response.json();
    if (!response.ok) return res.status(response.status).json(body);

    // Categories like "Just Chatting" have no IGDB id
    const games = (body.data || [])
      .filter((g) => g.igdb_id)
      .map((g) => ({ igdb_id: Number(g.igdb_id), name: g.name }));
    cache = { at: Date.now(), games };
    res.status(200).json(games);
  } catch (err) {
    console.error("Twitch fetch error:", err);
    res.status(500).json({ error: "Failed to fetch Twitch data" });
  }
}
