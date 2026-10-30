import { UserToken } from "@/hooks/useUserToken";
import { isMoodClause } from "./moods";

// "Never show": genres, themes, keywords and studios the player never wants
// recommended. The list lives on the account (user_metadata, like the
// platforms) so it follows the player across devices; this browser keeps a
// copy so IGDB queries can read it the moment they run.
//
// Genres, themes and keywords are left out by the IGDB query itself. IGDB
// can't exclude a nested field like involved_companies.company, so a blocked
// studio's game ids are loaded once and filtered out of the results.

export const BLOCK_KINDS = {
  genre: { label: "Genre", field: "genres" },
  theme: { label: "Theme", field: "themes" },
  keyword: { label: "Tag", field: "keywords" },
  company: { label: "Studio", field: null },
};
export const BLOCKED_LIMIT = 40;

const STORAGE_PREFIX = "blockedTags:";
const GAMES_PREFIX = "blockedTags:games:";

const currentUserId = () => UserToken()?.user?.id;

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked, the account copy still has them
  }
}

// Keeps only well-formed entries, so a bad account value can't break queries
export function cleanBlocked(list) {
  if (!Array.isArray(list)) return null;
  const seen = new Set();
  return list
    .filter(
      (item) =>
        item &&
        BLOCK_KINDS[item.kind] &&
        Number.isInteger(item.id) &&
        typeof item.name === "string",
    )
    .filter((item) => {
      const key = blockKey(item);
      return !seen.has(key) && seen.add(key);
    })
    .slice(0, BLOCKED_LIMIT)
    .map(({ kind, id, name }) => ({ kind, id, name }));
}

export const blockKey = (item) => `${item.kind}:${item.id}`;

export function readBlocked(user_id = currentUserId()) {
  if (!user_id) return [];
  return cleanBlocked(read(STORAGE_PREFIX + user_id)) || [];
}

export function writeBlocked(user_id, list) {
  write(STORAGE_PREFIX + user_id, list);
}

// Game ids of the blocked studios, kept with the studio ids they came from
export function readBlockedGameIds(user_id = currentUserId()) {
  if (!user_id) return { companyIds: [], gameIds: new Set() };
  const saved = read(GAMES_PREFIX + user_id);
  return {
    companyIds: Array.isArray(saved?.companyIds) ? saved.companyIds : [],
    gameIds: new Set(Array.isArray(saved?.gameIds) ? saved.gameIds : []),
  };
}

export function writeBlockedGameIds(user_id, companyIds, gameIds) {
  write(GAMES_PREFIX + user_id, { companyIds, gameIds });
}

// Ids a filter string picks on purpose ("genres = (10)"): browsing Racing
// on purpose shows racing games even when Racing is blocked. A mood is not a
// pick on purpose, so its clause is skipped.
function pickedIds(filters, field) {
  const ids = new Set();
  const pattern = new RegExp(`\\b${field}\\s*=\\s*[([{]([\\d,\\s]+)`, "g");
  for (const filter of filters.filter((filter) => !isMoodClause(filter)))
    for (const match of String(filter).matchAll(pattern))
      match[1]
        .split(",")
        .map(Number)
        .forEach((id) => ids.add(id));
  return ids;
}

// IGDB where-clause parts that leave out the blocked genres, themes and
// keywords, e.g. ["genres != (10)", "keywords != (54488,57941)"]
export function blockedClauses(filters = []) {
  const blocked = readBlocked();
  return Object.entries(BLOCK_KINDS)
    .filter(([, { field }]) => field)
    .map(([kind, { field }]) => {
      const picked = pickedIds(filters, field);
      const ids = blocked
        .filter((item) => item.kind === kind && !picked.has(item.id))
        .map((item) => item.id);
      return ids.length ? `${field} != (${ids.join(",")})` : null;
    })
    .filter(Boolean);
}

// Drops games from a blocked studio out of an IGDB result
export function withoutBlockedGames(games) {
  if (!Array.isArray(games)) return games;
  const { gameIds } = readBlockedGameIds();
  if (!gameIds.size) return games;
  return games.filter((game) => !gameIds.has(game.id));
}
