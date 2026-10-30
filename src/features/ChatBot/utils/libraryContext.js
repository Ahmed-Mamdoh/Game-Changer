// Builds the library summary the chat model reads. The whole library with
// full reviews can pass the proxy's 100,000-character limit, so only the
// games that say the most about the user's taste are described in detail.
const DETAILED_LIMIT = 30;
const NAMES_LIMIT = 150;
const REVIEW_LENGTH = 140;

function describe(game) {
  const parts = [game.status, `${game.hours_played ?? 0}h`];
  if (game.rating != null) parts.push(`rated ${game.rating}`);
  if (game.is_favorite) parts.push("favorite");
  const review = game.review?.trim();
  const snippet =
    review && review.length > REVIEW_LENGTH
      ? `${review.slice(0, REVIEW_LENGTH)}…`
      : review;
  return `${game.name} (${parts.filter(Boolean).join(", ")}${snippet ? `, review: "${snippet}"` : ""})`;
}

export function toLibraryGames(userGames = []) {
  return userGames.map((entry) => ({
    name: entry.game.name,
    status: entry.status,
    hours_played: entry.hours_played,
    is_favorite: entry.is_favorite,
    rating: entry.game.reviews?.[0]?.rating ?? null,
    review: entry.game.reviews?.[0]?.review || "",
  }));
}

export function buildLibraryContext(games) {
  if (!games.length) return "The user's library is currently empty.";

  const rated = games.filter((g) => g.rating != null);
  const byRating = [...rated].sort((a, b) => b.rating - a.rating);
  const picked = new Set([
    ...games.filter((g) => g.is_favorite),
    ...byRating.slice(0, 12),
    ...[...games].sort((a, b) => b.hours_played - a.hours_played).slice(0, 10),
    // Low ratings show what to avoid
    ...byRating.slice(-5).reverse(),
  ]);
  const detailed = [...picked].slice(0, DETAILED_LIMIT);
  const detailedSet = new Set(detailed);
  const others = games.filter((g) => !detailedSet.has(g));

  let context = `The user has ${games.length} games in their library. Key games: ${detailed.map(describe).join("; ")}.`;
  if (others.length) {
    const names = others.slice(0, NAMES_LIMIT).map((g) => g.name);
    context += ` Also in their library: ${names.join(", ")}`;
    if (others.length > NAMES_LIMIT)
      context += `, and ${others.length - NAMES_LIMIT} more`;
    context += ".";
  }
  return context;
}
