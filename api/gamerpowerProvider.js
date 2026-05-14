import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const url = "https://gamerpower.p.rapidapi.com/api/filter?platform=steam.gog.epic-games-store&type=game.beta&sort-by=value";
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "gamerpower.p.rapidapi.com",
      },
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("GamerPower fetch error:", err);
    res.status(500).json({ error: "Failed to fetch GamerPower data" });
  }
}
