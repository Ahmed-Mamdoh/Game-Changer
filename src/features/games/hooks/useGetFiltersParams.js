import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { UserToken } from "@/hooks/useUserToken";
import { LENGTH_BANDS } from "@/api/igdbApi";
import { useSearchParams } from "react-router-dom";

// URL values go straight into the IGDB query, so only digits get through
const ids = (value) => (value || "").split("-").filter((v) => /^\d+$/.test(v));

// Players search by subgenre ("Soulslike"), which IGDB only has as community
// keywords, often several per idea. The URL keeps the small id, the query
// uses the keyword ids behind it.
export const SUBGENRES = [
  { id: 1, name: "Roguelike", keywords: [416, 41781, 27419] },
  { id: 2, name: "Roguelite", keywords: [17292] },
  { id: 3, name: "Soulslike", keywords: [17326] },
  { id: 4, name: "Metroidvania", keywords: [477] },
  { id: 5, name: "Deckbuilder", keywords: [38865, 25826, 27419] },
  { id: 6, name: "Bullet hell", keywords: [911] },
  { id: 7, name: "City builder", keywords: [3533] },
  { id: 8, name: "Tower defense", keywords: [77] },
  { id: 9, name: "Survival horror", keywords: [1836] },
  { id: 10, name: "JRPG", keywords: [521] },
  { id: 11, name: "Walking simulator", keywords: [1493] },
  { id: 12, name: "Detective", keywords: [215] },
  { id: 13, name: "Rhythm", keywords: [4137, 19205] },
  { id: 14, name: "Dungeon crawler", keywords: [2228] },
  { id: 15, name: "Life sim", keywords: [43] },
  { id: 16, name: "Farming sim", keywords: [18437, 1103] },
  { id: 17, name: "Precision platformer", keywords: [25831] },
  { id: 18, name: "Puzzle platformer", keywords: [4527] },
  { id: 19, name: "Shoot 'em up", keywords: [166, 844] },
  { id: 20, name: "Twin-stick shooter", keywords: [5311] },
  { id: 21, name: "Tycoon & management", keywords: [379, 994] },
  {
    id: 22,
    name: "Idle & incremental",
    keywords: [17003, 38703, 42080, 45034, 25000, 2072],
  },
  { id: 23, name: "Hidden object", keywords: [1140] },
  { id: 24, name: "Dating sim", keywords: [24697, 43508, 1937] },
  { id: 25, name: "Match 3", keywords: [734, 23494] },
  { id: 26, name: "Monster taming", keywords: [25792, 38723] },
  { id: 27, name: "Base building", keywords: [1905, 510] },
  { id: 28, name: "Mecha", keywords: [1448] },
  { id: 29, name: "Flight sim", keywords: [56, 36] },
  { id: 30, name: "Auto battler", keywords: [27510] },
  { id: 31, name: "Grand strategy", keywords: [149] },
  { id: 32, name: "Cozy", keywords: [24685] },
  { id: 33, name: "Boomer shooter", keywords: [27308] },
  { id: 34, name: "Run and gun", keywords: [660] },
  { id: 35, name: "Arena shooter", keywords: [1451] },
  { id: 36, name: "Vehicular combat", keywords: [25] },
  { id: 37, name: "Interactive fiction", keywords: [218] },
  { id: 38, name: "God game", keywords: [115] },
  { id: 39, name: "Colony sim", keywords: [25050] },
];

const keywordsOf = (tagIds) =>
  SUBGENRES.filter((s) => tagIds.includes(String(s.id))).map((s) => s.keywords);

const yearStart =(year) => Math.floor(Date.UTC(year, 0, 1) / 1000);

// `released` is "from..to" in years, both ends included
export function parseReleased(value) {
  const match = /^(\d{4})\.\.(\d{4})$/.exec(value || "");
  if (!match) return null;
  const from = Number(match[1]);
  const to = Number(match[2]);
  return from <= to ? { from, to } : { from: to, to: from };
}

// Midnight UTC today, so the query (and its cache key) stays the same all day
const today = () => Math.floor(new Date().setUTCHours(0, 0, 0, 0) / 1000);

// IGDB game_status ids. Most finished games have no status at all, so
// "released" means no status (or Released) and already out.
const STAGE_CLAUSES = {
  released: () =>
    `(game_status = null | game_status = 0) & first_release_date <= ${today()}`,
  early_access: () => "game_status = 4",
  beta: () => "game_status = 3",
  alpha: () => "game_status = 2",
};

// Builds the IGDB filter clauses from the URL. Pure, so the empty state can
// ask "how many games without this one filter?" without touching the URL.
// `libraryIds` are left out when "Hide my library" is on.
export function filtersFromParams(searchParams, libraryIds = []) {
  const genre = ids(searchParams.get("genre"));
  const theme = ids(searchParams.get("theme"));
  const tags = keywordsOf(ids(searchParams.get("tag")));
  const gameMode = ids(searchParams.get("gameMode"));
  const rating = ids(searchParams.get("rating"))[0];
  const released = parseReleased(searchParams.get("released"));
  const stage = STAGE_CLAUSES[searchParams.get("stage")];
  // Set from a developer or publisher link on a game page
  const company = ids(searchParams.get("company"))[0];
  const platform = ids(searchParams.get("platform")).join(",") || null;
  const player_perspectives =
    ids(searchParams.get("player_perspectives")).join(",") || null;
  // Resolved to game ids in igdbApi, since IGDB keeps lengths apart from games
  const length = LENGTH_BANDS[searchParams.get("length")]
    ? searchParams.get("length")
    : null;

  const filters = [];

  // Picks inside one menu widen the results unless "Match all" is on.
  // Genre, theme and subgenre share a menu, so "any" spans all three.
  if (searchParams.get("genreMatch") === "all") {
    if (genre.length) filters.push(`genres = [${genre}]`);
    if (theme.length) filters.push(`themes = [${theme}]`);
    for (const keywords of tags) filters.push(`keywords = (${keywords})`);
  } else {
    const anyOf = [
      genre.length && `genres = (${genre})`,
      theme.length && `themes = (${theme})`,
      tags.length && `keywords = (${[...new Set(tags.flat())]})`,
    ].filter(Boolean);
    if (anyOf.length) filters.push(`(${anyOf.join(" | ")})`);
  }

  if (gameMode.length) {
    filters.push(
      searchParams.get("gameModeMatch") === "all"
        ? `game_modes = [${gameMode}]`
        : `game_modes = (${gameMode})`,
    );
  }

  if (rating) filters.push(`total_rating >= ${rating}`);

  if (stage) filters.push(stage());

  if (company) filters.push(`involved_companies.company = ${company}`);

  if (searchParams.get("hideLibrary") === "true" && libraryIds.length)
    filters.push(`id != (${libraryIds.join(",")})`);

  if (released) {
    filters.push(
      `first_release_date >= ${yearStart(released.from)} & first_release_date < ${yearStart(released.to + 1)}`,
    );
  }

  return { filters, platform, player_perspectives, length };
}

// Ids of every game in the signed-in user's library, sorted so the query key
// stays stable
export function useLibraryIds() {
  const user_id = UserToken()?.user?.id;
  const { data } = useGetUserGames(user_id);
  return (data?.user_games || [])
    .map((g) => Number(g.game_id))
    .filter(Number.isInteger)
    .sort((a, b) => a - b);
}

function useGetFiltersParams() {
  const [searchParams] = useSearchParams();
  const libraryIds = useLibraryIds();
  const search = searchParams.get("search");
  const page = Number(searchParams.get("page")) || 1;
  const rawSort = searchParams.get("sortBy");
  const sortBy = search || !/^[a-z_]+$/.test(rawSort || "") ? null : rawSort;

  return {
    ...filtersFromParams(searchParams, libraryIds),
    sortBy,
    page,
    search,
  };
}

export default useGetFiltersParams;
