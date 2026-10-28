import fetch from "node-fetch";
import { checkOrigin, rateLimit } from "./_lib/guard.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!checkOrigin(req, res)) return;
  if (!rateLimit(req, res, { key: "gamerpower", limit: 30, windowMs: 60_000 }))
    return;

  try {
    const url =
      "https://gamerpower.p.rapidapi.com/api/filter?platform=steam.gog.epic-games-store&type=game&sort-by=value";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "gamerpower.p.rapidapi.com",
      },
    });

    const data = await response.json();
    if (response.ok) {
      // Let Vercel's CDN serve repeat visits instead of spending RapidAPI quota
      res.setHeader(
        "Cache-Control",
        "public, s-maxage=900, stale-while-revalidate=3600",
      );
    }
    res.status(response.status).json(data);
  } catch (err) {
    console.error("GamerPower fetch error:", err);
    res.status(500).json({ error: "Failed to fetch GamerPower data" });
  }
}
