import { LIMIT } from "@/constants/constant";
import { rankSearchResults } from "@/utils/searchRanking";

async function igdbFetch(endpoint, query) {
  const response = await fetch("/api/igdbProvider", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint, query }),
  });
  const data = await response.json();

  return data;
}

// IGDB strings are double-quoted; escape backslashes and quotes so user input
// can't break out of the string and corrupt the query.
export function escapeIgdbString(value = "") {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// IGDB keyword ids for unofficial games: fangames, demakes, ROM hacks,
// bootlegs, homebrew and unofficial ports/remakes/crossovers.
const UNOFFICIAL_KEYWORDS = [
  1603, 1617, 1787, 2004, 16696, 24124, 24799, 25362, 25548, 25908, 27055,
  27117, 27216, 29423, 30303, 37863, 38275, 38511, 52180,
];

// Shared where-clause so the list and the result count always agree.
function buildGamesWhere({
  filters = [],
  platform,
  player_perspectives,
  isUpcoming,
  isReleased,
}) {
  const filtersString =
    filters?.length !== 0 ? " & " + filters.join(" & ") : "";
  const platformString =
    platform === "all" || !platform
      ? "& platforms = (6,48,167,49,169,130)"
      : ` & platforms = (${platform})`;
  const player_perspectivesString =
    player_perspectives === "all" || !player_perspectives
      ? ""
      : ` & player_perspectives = ${player_perspectives}`;

  const releaseDateString = isUpcoming
    ? ` & first_release_date > ${Math.floor(Date.now() / 1000)}`
    : isReleased
      ? ` & first_release_date <= ${Math.floor(Date.now() / 1000)}`
      : ``;

  return `where game_type = (0,8,9) & version_parent = null &
      themes != (42) & keywords != (${UNOFFICIAL_KEYWORDS.join(",")}) & (game_status = null | game_status != (5,6,7,8))
      ${platformString}
      ${player_perspectivesString} 
      ${releaseDateString}
      ${filtersString};`;
}

// Browse's default sort
export const DEFAULT_BROWSE_SORT = "first_release_date";

// Days-old releases are mostly tiny uploads nobody has heard of yet, so the
// Newest sort only lists released games with some anticipation or ratings.
const NEWEST_NOTABLE = "(hypes >= 10 | total_rating_count >= 10)";

// Browse sorts that also narrow the list, so the count applies them too.
function browseScope({ filters = [], sortBy, isUpcoming }) {
  if (!isUpcoming && sortBy === "first_release_date")
    return { filters: [...filters, NEWEST_NOTABLE], isReleased: true };
  return { filters };
}

const LIST_FIELDS =
  "name,cover.url,first_release_date,genres.name,artworks.url,artworks.artwork_type,artworks.width,total_rating_count,hypes,game_status";

export async function getAllGames({
  filters = [],
  platform,
  sortBy = "total_rating_count",
  page = 1,
  limit,
  isUpcoming,
  isReleased,
  player_perspectives,
}) {
  const offset = (page - 1) * LIMIT;
  const scope = browseScope({ filters, sortBy, isUpcoming });

  const sortByString = sortBy
    ? `sort ${sortBy} ${sortBy === "name" || (isUpcoming && sortBy === "first_release_date") ? "asc" : "desc"};`
    : "";

  return igdbFetch(
    "games",
    `fields ${LIST_FIELDS};
      limit ${limit || LIMIT};
      offset ${offset};
      ${sortByString}
      ${buildGamesWhere({ platform, player_perspectives, isUpcoming, isReleased, ...scope })}`,
  );
}

// Only games out within this window count as "popular now", so evergreen
// streams (LoL, GTA V, CS2) don't crowd out what people are into today.
const POPULAR_NOW_MAX_AGE_YEARS = 2;

// Twitch's top 100 includes tiny streamer-bait indies; keep games with some
// IGDB anticipation (hypes) or an established player base (ratings).
const POPULAR_NOW_NOTABLE = "(hypes >= 5 | total_rating_count >= 20)";

// Games with the most live Twitch viewers right now, released recently,
// resolved to full IGDB games in Twitch rank order.
export async function getPopularNowGames(limit) {
  const response = await fetch("/api/twitchTopGames");
  const top = await response.json();
  const ids = Array.isArray(top) ? top.map((g) => g.igdb_id) : [];
  if (!ids.length) throw new Error("No Twitch data");

  const since = Math.floor(
    (Date.now() - POPULAR_NOW_MAX_AGE_YEARS * 365 * 24 * 60 * 60 * 1000) / 1000,
  );
  const games = await igdbFetch(
    "games",
    `fields ${LIST_FIELDS};
      limit ${ids.length};
      ${buildGamesWhere({
        filters: [
          `id = (${ids.join(",")})`,
          `first_release_date >= ${since}`,
          POPULAR_NOW_NOTABLE,
        ],
        isReleased: true,
      })}`,
  );
  if (!Array.isArray(games)) throw new Error("Failed to load popular games");

  const rank = new Map(ids.map((id, i) => [id, i]));
  games.sort((a, b) => rank.get(a.id) - rank.get(b.id));
  return pickAcrossGenres(games, limit).sort(
    (a, b) => rank.get(a.id) - rank.get(b.id),
  );
}

// IGDB tags most games with several genres (nearly everything is also
// "Adventure"), so each game gets one main genre: the first of these it has,
// most specific first.
const MAIN_GENRE_ORDER = [
  "Shooter",
  "Fighting",
  "Racing",
  "Sport",
  "Platform",
  "Puzzle",
  "Real Time Strategy (RTS)",
  "Strategy",
  "Tactical",
  "Hack and slash/Beat 'em up",
  "Role-playing (RPG)",
  "Simulator",
  "Adventure",
  "Indie",
];

function mainGenre(game) {
  const names = (game.genres || []).map((g) => g.name);
  return MAIN_GENRE_ORDER.find((n) => names.includes(n)) || names[0] || "";
}

// Takes the most popular game of each main genre first, so the shelf isn't
// all shooters, then fills any open slots in popularity order.
function pickAcrossGenres(games, limit) {
  const seen = new Set();
  const picks = [];
  for (const game of games) {
    if (picks.length >= limit) break;
    const genre = mainGenre(game);
    if (seen.has(genre)) continue;
    seen.add(genre);
    picks.push(game);
  }
  for (const game of games) {
    if (picks.length >= limit) break;
    if (!picks.includes(game)) picks.push(game);
  }
  return picks;
}

// IGDB caps a single request at 500 results.
export const SEARCH_POOL_SIZE = 500;

// Uses IGDB's relevance search, then re-ranks the whole pool (exact and prefix
// matches first, then popularity). Paging happens on the ranked pool, so every
// page is full and the count matches what is shown.
export async function searchGames({
  search,
  filters = [],
  platform,
  player_perspectives,
  isUpcoming,
  isReleased,
  poolSize = SEARCH_POOL_SIZE,
}) {
  const response = await igdbFetch(
    "games",
    `search "${escapeIgdbString(search)}";
      fields ${LIST_FIELDS};
      limit ${poolSize};
      ${buildGamesWhere({ filters, platform, player_perspectives, isUpcoming, isReleased })}`,
  );
  return rankSearchResults(response, search);
}

// Typeahead lookup. IGDB's `search` matches whole words only, so a half-typed
// title ("zeld") finds nothing; a name-contains query fills that gap.
const QUICK_FIELDS =
  "name,cover.url,first_release_date,total_rating_count,hypes";

export async function quickSearchGames(search, poolSize = 50) {
  const escaped = escapeIgdbString(search);
  const where = buildGamesWhere({});
  const [searched, contains] = await Promise.all([
    igdbFetch(
      "games",
      `search "${escaped}"; fields ${QUICK_FIELDS}; limit ${poolSize}; ${where}`,
    ),
    igdbFetch(
      "games",
      `fields ${QUICK_FIELDS}; limit ${poolSize}; sort total_rating_count desc;
      ${where.replace(/;$/, "")} & name ~ *"${escaped}"*;`,
    ),
  ]);
  const seen = new Set();
  const pool = [searched, contains]
    .filter(Array.isArray)
    .flat()
    .filter((game) => !seen.has(game.id) && seen.add(game.id));
  return rankSearchResults(pool, search);
}

export async function getUserGamesData(userGamesIds) {
  return igdbFetch(
    "games",
    `fields name,cover.url,first_release_date,genres.name,themes.name,artworks.url,artworks.artwork_type,artworks.width;
      limit 500;
      where id = (${userGamesIds.join(",")});
      `,
  );
}

export async function getFreeGameData(search) {
  const searchString = search ? `search "${escapeIgdbString(search)}";` : "";
  return igdbFetch(
    "games",
    `fields name,cover.url,total_rating_count,hypes;
      ${searchString};limit 1;
      `,
  );
}

export async function getOneGame(id) {
  return igdbFetch(
    "games",
    `fields name,cover.url,artworks.url,artworks.artwork_type,artworks.width,first_release_date,summary,storyline,keywords.name,
      age_ratings.rating,age_ratings.category,player_perspectives.name,
      total_rating,total_rating_count,game_status,
      genres.name,themes.name,
      involved_companies.company.name,involved_companies.developer,involved_companies.publisher,
      platforms.name,platforms.abbreviation,
      screenshots.url,screenshots.width,
      dlcs.name,dlcs.cover.url,
      external_games.url,external_games.category,
      franchises.name,
      franchises.games.name,franchises.games.cover.url,franchises.games.game_type,franchises.games.version_parent,franchises.games.first_release_date,
      language_supports.language.name,language_supports.language_support_type.name,
      similar_games.name,similar_games.cover.url,
      videos.name,videos.video_id,
      game_modes.name;
      where id = ${id};
      `,
  );
}

export async function getNumberOfResults({
  filters = [],
  platform,
  player_perspectives,
  isUpcoming = false,
  sortBy,
}) {
  return igdbFetch(
    "games/count",
    buildGamesWhere({
      platform,
      player_perspectives,
      isUpcoming,
      ...browseScope({ filters, sortBy, isUpcoming }),
    }),
  );
}

export async function getGenres() {
  return igdbFetch("genres", `fields name; limit 500;`);
}

export async function getGameModes() {
  return igdbFetch("game_modes", `fields name; limit 500;`);
}

export async function getThemes() {
  return igdbFetch("themes", `fields name; limit 500;`);
}

export async function getTimeToBeat(id) {
  return igdbFetch(
    "game_time_to_beats",
    `fields completely,hastily,normally; limit 500; where game_id = ${id};`,
  );
}

export async function getCompany(id) {
  return igdbFetch("companies", `fields name; where id = ${id};`);
}

// Tag fields the recommender reads (see src/utils/tasteProfile.js)
const TASTE_FIELDS =
  "genres.name,themes.name,keywords.name,player_perspectives.name,game_modes.name,involved_companies.company,involved_companies.developer,franchises,collections";

// Library games with their tags and IGDB's similar_games links.
export async function getTasteDetails(ids) {
  if (!ids?.length) return [];
  return igdbFetch(
    "games",
    `fields name,${TASTE_FIELDS},similar_games;
      where id = (${ids.join(",")});
      limit 500;`,
  );
}

// Released, official base games only, with what a pick card needs.
const CANDIDATE_FIELDS = `name,cover.url,first_release_date,total_rating,total_rating_count,artworks.url,artworks.artwork_type,artworks.width,${TASTE_FIELDS}`;
const candidateWhere = () => `game_type = (0,8,9) & version_parent = null &
      themes != (42) & keywords != (${UNOFFICIAL_KEYWORDS.join(",")}) &
      (game_status = null | game_status != (5,6,7,8)) &
      first_release_date <= ${Math.floor(Date.now() / 1000)}`;

// Real games to recommend from: the similar_games of liked library games,
// plus well-rated games sharing the player's top genres/themes and keywords.
export async function getRecommendationCandidates({
  similarIds = [],
  genreIds = [],
  themeIds = [],
  keywordIds = [],
}) {
  const queries = [];
  if (similarIds.length)
    queries.push(
      igdbFetch(
        "games",
        `fields ${CANDIDATE_FIELDS};
          where id = (${similarIds.join(",")}) & ${candidateWhere()};
          limit 500;`,
      ),
    );
  if (genreIds.length && themeIds.length)
    queries.push(
      igdbFetch(
        "games",
        `fields ${CANDIDATE_FIELDS};
          where genres = (${genreIds.join(",")}) & themes = (${themeIds.join(",")}) &
            total_rating_count > 40 & ${candidateWhere()};
          sort total_rating desc;
          limit 80;`,
      ),
    );
  if (keywordIds.length)
    queries.push(
      igdbFetch(
        "games",
        `fields ${CANDIDATE_FIELDS};
          where keywords = (${keywordIds.join(",")}) &
            total_rating_count > 25 & ${candidateWhere()};
          sort total_rating_count desc;
          limit 80;`,
      ),
    );
  const results = await Promise.all(queries);
  return results.flatMap((result) => (Array.isArray(result) ? result : []));
}
