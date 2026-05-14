export async function getFreePcGames() {
  const url = "/api/gamerpowerProvider";
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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
