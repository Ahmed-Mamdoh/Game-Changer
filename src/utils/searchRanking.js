// Ranks IGDB search results by how well the name matches the query, then by
// popularity (total_rating_count). IGDB's own `search` order is used as the
// last tie-breaker.

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

export function rankSearchResults(games, search) {
  if (!Array.isArray(games)) return [];
  const query = normalize(search);

  return games
    .map((game, index) => ({
      game,
      index,
      tier: matchTier(game.name, query),
      popularity: game.total_rating_count || 0,
    }))
    .sort(
      (a, b) =>
        b.tier - a.tier || b.popularity - a.popularity || a.index - b.index,
    )
    .map(({ game }) => game);
}
