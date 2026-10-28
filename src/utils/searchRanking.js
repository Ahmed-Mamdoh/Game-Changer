// Ranks IGDB search results for the header dropdown and the results page.
// IGDB's own `search` order is used as the last tie-breaker.

function normalize(text = "") {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function matchTier(name, query) {
  const normalizedName = normalize(name);
  if (!query || !normalizedName) return 0;
  if (normalizedName === query) return 5;
  if (normalizedName.startsWith(query)) return 4;

  const nameWords = normalizedName.split(" ");
  const queryWords = query.split(" ");
  if (` ${normalizedName} `.includes(` ${query} `)) return 3;
  if (queryWords.every((word) => nameWords.includes(word))) return 2;
  if (normalizedName.includes(query)) return 1;
  // IGDB also matches alternative names and fuzzy spellings; keep those last
  return 0;
}

// People search for the game they have in mind,
// which is usually a well-known one. Popularity (ratings + pre-release hype,
// on a log scale) leads; match quality only nudges. So "hollow" puts Hollow
// Knight above an obscure game named exactly "Hollow".
const QUICK_MATCH_BONUS = { 5: 1.5, 4: 1, 3: 0.75, 2: 0.5, 1: 0.25, 0: -3 };

export function rankSearchResults(games, search) {
  if (!Array.isArray(games)) return [];
  const query = normalize(search);

  return games
    .map((game, index) => {
      const popularity = (game.total_rating_count || 0) + (game.hypes || 0);
      return {
        game,
        index,
        score:
          Math.log10(popularity + 1) * 2 +
          QUICK_MATCH_BONUS[matchTier(game.name, query)],
      };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ game }) => game);
}
