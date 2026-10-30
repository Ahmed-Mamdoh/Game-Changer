// Facts from IGDB about the game a chat is opened from. The models know
// nothing about games released after their training, so without these they
// invent descriptions.
const SUMMARY_LENGTH = 900;

const names = (list) =>
  list
    ?.map((item) => item?.name)
    .filter(Boolean)
    .join(", ");

export function buildGameFacts(game, timeToBeat) {
  const hours = (seconds) => (seconds ? Math.round(seconds / 3600) : null);
  const developers = names(
    game.involved_companies?.filter((c) => c.developer).map((c) => c.company),
  );
  const release = game.first_release_date
    ? new Date(game.first_release_date * 1000).toISOString().slice(0, 10)
    : null;
  const summary = game.summary?.trim();

  const lines = [
    ["Name", game.name],
    ["Release date", release],
    ["Developer", developers],
    ["Genres", names(game.genres)],
    ["Themes", names(game.themes)],
    ["Modes", names(game.game_modes)],
    ["Platforms", names(game.platforms)],
    [
      "Rating",
      game.total_rating
        ? `${Math.round(game.total_rating)}/100 from ${game.total_rating_count} votes`
        : null,
    ],
    [
      "Time to beat, rushed",
      hours(timeToBeat?.hastily) && `${hours(timeToBeat.hastily)} hours`,
    ],
    [
      "Time to beat, normal pace",
      hours(timeToBeat?.normally) && `${hours(timeToBeat.normally)} hours`,
    ],
    [
      "Time to beat, 100%",
      hours(timeToBeat?.completely) && `${hours(timeToBeat.completely)} hours`,
    ],
    [
      "Summary",
      summary && summary.length > SUMMARY_LENGTH
        ? `${summary.slice(0, SUMMARY_LENGTH)}…`
        : summary,
    ],
  ];
  return lines
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}
