import { LIMIT } from "@/constants/constant";

async function igdbFetch(endpoint, query) {
  const response = await fetch("/api/igdbProvider", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint, query }),
  });
  const data = await response.json();

  return data;
}

export async function getAllGames({
  filters = [],
  platform,
  sortBy,
  page = 1,
  search,
  limit,
  isUpcoming,
  player_perspectives,
}) {
  // if there is filters split them by &
  const filtersString =
    filters?.length !== 0 ? " & " + filters.join(" & ") : "";
  const offset = (page - 1) * LIMIT;
  // if there is sortBy and no search then sort by sortBy
  const sortByString =
    sortBy && !search
      ? `sort ${sortBy} ${sortBy === "name" || (isUpcoming && sortBy === "first_release_date") ? "asc" : "desc"};`
      : "";

  const searchString = search ? `search "${search}";` : "";
  const platformString =
    platform === "all" || !platform
      ? "& platforms = (6,48,167,49,169,130)"
      : ` & platforms = (${platform})`;
  const player_perspectivesString =
    player_perspectives === "all" || !player_perspectives
      ? ""
      : ` & player_perspectives = ${player_perspectives}`;

  const releaseDateString = search
    ? ``
    : isUpcoming
      ? ` & first_release_date > ${Math.floor(Date.now() / 1000)}`
      : ` & first_release_date <= ${Math.floor(Date.now() / 1000)}`;

  return igdbFetch(
    "games",
    `fields name,cover.url,first_release_date;
      limit ${limit || LIMIT};
      offset ${offset};
      ${sortByString}
      where game_type = (0,8,9) & version_parent = null &
      themes != (42)  & (game_status = null | game_status != (5,6,7,8))
      ${platformString}
      ${player_perspectivesString} 
      ${releaseDateString}
      ${filtersString};
      ${searchString}`,
  );
}

export async function getFreeGameData(search) {
  const searchString = search ? `search "${search}";` : "";
  return igdbFetch(
    "games",
    `fields name,cover.url;
      ${searchString};limit 1;
      `,
  );
}

export async function getOneGame(id) {
  return igdbFetch(
    "games",
    `fields name,cover.url,artworks.url,artworks.artwork_type,first_release_date,summary,keywords.name,
      age_ratings.rating,age_ratings.category,player_perspectives.name,
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
  );
}

export async function getNumberOfResults({
  filters,
  search,
  isUpcoming = false,
}) {
  // if there is filters split them by &
  const filtersString = filters.length !== 0 ? " & " + filters.join(" & ") : "";

  const searchString = search ? `search "${search}";` : "";
  return igdbFetch(
    "games/count",
    `fields name,cover.url;
      where game_type = (0,1,8,9) & version_parent = null & platforms = (6) &
      first_release_date ${isUpcoming ? ">" : "<="} ${Math.floor(Date.now() / 1000)} & themes != (42)
    ${filtersString};
    ${searchString}
      `,
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

export async function getGamesForRecommending({ platform, playedGamesIds }) {
  const platformString =
    platform === "all" || !platform
      ? "& platforms = (6,48,167,49,169,130)"
      : ` & platforms = (${platform})`;

  return igdbFetch(
    "games",
    `fields name,cover.url,total_rating,genres.name,themes.name,keywords.name,first_release_date,summary,
    game_modes.name,player_perspectives.name,involved_companies.company.name;
    limit 500;
    sort total_rating_count desc;
              where  
                    id != (${playedGamesIds.join(",")}) & 
                    version_parent = null & 
                    game_type = (0,8,9) & 
                    themes != (42) & 
                    first_release_date > ${Math.floor(Date.now() / 1000) - 15 * 365 * 24 * 60 * 60} &
                    (game_status = null | game_status != (5,6,7,8))
                    ${platformString};
      `,
  );
}
