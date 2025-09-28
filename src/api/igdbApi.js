import { LIMIT } from "@/constants/constant";

export async function getAllGames({
  filters = [],
  sortBy,
  page = 1,
  search,
  limit,
  isUpcoming,
}) {
  // if there is filters split them by &
  const filtersString =
    filters?.length !== 0 ? " & " + filters.join(" & ") : "";
  const offset = (page - 1) * LIMIT;
  // if there is sortBy and no search then sort by sortBy
  const sortByString =
    sortBy && !search
      ? `sort ${sortBy} ${sortBy === "name" ? "asc" : "desc"};`
      : isUpcoming
        ? `sort hypes desc;`
        : "";
  const searchString = search ? `search "${search}";` : "";

  const releaseDateString = search
    ? ``
    : isUpcoming
      ? ` & first_release_date > ${Math.floor(Date.now() / 1000)}`
      : ` & first_release_date <= ${Math.floor(Date.now() / 1000)}`;

  const response = await fetch("/api/igdbProvider", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: "games",
      query: `fields name,cover.url,first_release_date;
      limit ${limit || LIMIT};
      offset ${offset};
      ${sortByString}
      where game_type = (0,8,9) & version_parent = null & platforms = (6) &
      themes != (42) 
      ${releaseDateString}
      ${filtersString};
      ${searchString}
      `,
    }),
  });
  const data = await response.json();

  return data;
}

export async function getFreeGameData(search) {
  const searchString = search ? `search "${search}";` : "";
  const response = await fetch("/api/igdbProvider", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: "games",

      query: `fields name,cover.url;
      ${searchString};limit 1;
      `,
    }),
  });
  const data = await response.json();
  return data;
}

export async function getOneGame(id) {
  const response = await fetch("/api/igdbProvider", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: "games",

      query: `fields name,cover.url,first_release_date,summary,
      age_ratings.rating,age_ratings.category,
      total_rating,total_rating_count,
      genres.name,themes.name,
      involved_companies.company.name,
      screenshots.url,
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
    }),
  });
  const data = await response.json();
  return data;
}

export async function getNumberOfResults({
  filters,
  search,
  isUpcoming = false,
}) {
  // if there is filters split them by &
  const filtersString = filters.length !== 0 ? " & " + filters.join(" & ") : "";

  const searchString = search ? `search "${search}";` : "";

  const response = await fetch("/api/igdbProvider", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: "games/count",

      query: `fields name,cover.url;
      where game_type = (0,1,8,9) & version_parent = null & platforms = (6) &
      first_release_date ${isUpcoming ? ">" : "<="} ${Math.floor(Date.now() / 1000)} & themes != (42)
    ${filtersString};
    ${searchString}
      `,
    }),
  });
  const data = await response.json();
  return data;
}

export async function getGenres() {
  const response = await fetch("/api/igdbProvider", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: "genres",

      query: `fields name; limit 500;`,
    }),
  });
  const data = await response.json();
  return data;
}

export async function getGameModes() {
  const response = await fetch("/api/igdbProvider", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: "game_modes",

      query: `fields name; limit 500;`,
    }),
  });
  const data = await response.json();
  return data;
}

export async function getThemes() {
  const response = await fetch("/api/igdbProvider", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: "themes",

      query: `fields name; limit 500;`,
    }),
  });
  const data = await response.json();
  return data;
}

export async function getTimeToBeat(id) {
  const response = await fetch("/api/igdbProvider", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      endpoint: "game_time_to_beats",

      query: `fields completely,hastily,normally; limit 500; where game_id = ${id};`,
    }),
  });
  const data = await response.json();
  return data;
}
