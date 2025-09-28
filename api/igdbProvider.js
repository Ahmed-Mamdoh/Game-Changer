import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { endpoint, query } = req.body;

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
    res.status(200).json(data);
  } catch (err) {
    console.error("IGDB fetch error:", err);
    res.status(500).json({ error: "Failed to fetch IGDB data" });
  }
}
