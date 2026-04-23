export async function getFreePcGames() {
  const url =
    "https://gamerpower.p.rapidapi.com/api/filter?platform=steam.gog.epic-games-store&type=game.beta&sort-by=value";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": import.meta.env.VITE_RAPID_API_KEY,
      "x-rapidapi-host": "gamerpower.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const filteredResult = result.filter(
      (offer) =>
        offer.title.includes("(Steam)") ||
        offer.title.includes("(Epic Games)") ||
        offer.title.includes("(GOG)"),
    );
    return filteredResult;
  } catch (error) {
    console.error(error);
  }
}
