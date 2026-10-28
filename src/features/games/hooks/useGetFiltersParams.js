import { useSearchParams } from "react-router-dom";

// URL values go straight into the IGDB query, so only digits get through
const ids = (value) => (value || "").split("-").filter((v) => /^\d+$/.test(v));

const yearStart = (year) => Math.floor(Date.UTC(year, 0, 1) / 1000);

// `released` is "from..to" in years, both ends included
export function parseReleased(value) {
  const match = /^(\d{4})\.\.(\d{4})$/.exec(value || "");
  if (!match) return null;
  const from = Number(match[1]);
  const to = Number(match[2]);
  return from <= to ? { from, to } : { from: to, to: from };
}

// Builds the IGDB filter clauses from the URL. Pure, so the empty state can
// ask "how many games without this one filter?" without touching the URL.
export function filtersFromParams(searchParams) {
  const genre = ids(searchParams.get("genre"));
  const theme = ids(searchParams.get("theme"));
  const gameMode = ids(searchParams.get("gameMode"));
  const rating = ids(searchParams.get("rating"))[0];
  const released = parseReleased(searchParams.get("released"));
  const platform = ids(searchParams.get("platform")).join(",") || null;
  const player_perspectives =
    ids(searchParams.get("player_perspectives")).join(",") || null;

  const filters = [];

  // Picks inside one menu widen the results unless "Match all" is on.
  // Genre and theme share a menu, so "any" spans both.
  if (searchParams.get("genreMatch") === "all") {
    if (genre.length) filters.push(`genres = [${genre}]`);
    if (theme.length) filters.push(`themes = [${theme}]`);
  } else {
    const anyOf = [
      genre.length && `genres = (${genre})`,
      theme.length && `themes = (${theme})`,
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

  if (released) {
    filters.push(
      `first_release_date >= ${yearStart(released.from)} & first_release_date < ${yearStart(released.to + 1)}`,
    );
  }

  return { filters, platform, player_perspectives };
}

function useGetFiltersParams() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const page = Number(searchParams.get("page")) || 1;
  const rawSort = searchParams.get("sortBy");
  const sortBy = search || !/^[a-z_]+$/.test(rawSort || "") ? null : rawSort;

  return { ...filtersFromParams(searchParams), sortBy, page, search };
}

export default useGetFiltersParams;
