import {
  addDismissedGames,
  deleteAllDismissedGames,
  deleteDismissedGame,
  getDismissedGames,
  setDismissReason,
} from "@/api/supabase";

// "Not for me" games live in Supabase so they follow the player across
// devices. This browser keeps a copy, which also covers the time before the
// dismissed_games table (or its reason column) exists; anything only stored
// here is uploaded once the table answers. Newest first.

export const DISMISSED_PREFIX = "recommendations:dismissed:";
// Why each game was dismissed, by id. Starts with DISMISSED_PREFIX so the
// recommendations cache cleanup keeps it.
const REASONS_PREFIX = DISMISSED_PREFIX + "reasons:";
const DISMISSED_LIMIT = 300;

// "old" teaches a soft cutoff year, "style" pushes down games with the same
// tags, "this" (or none) only hides the game
export const DISMISS_REASONS = [
  { reason: "old", label: "Too old" },
  { reason: "style", label: "Not my style" },
  { reason: "this", label: "Just this one" },
];

export function readStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked, picks still show for this visit
  }
}

const localIds = (user_id) => readStorage(DISMISSED_PREFIX + user_id) || [];
const localReasons = (user_id) => readStorage(REASONS_PREFIX + user_id) || {};

const toDismissed = (ids, reasons) => {
  const unique = [...new Set(ids)];
  return {
    ids: unique,
    hiddenIds: new Set(unique),
    reasons: new Map(
      Object.entries(reasons).map(([id, reason]) => [Number(id), reason]),
    ),
  };
};

// { ids (newest first), hiddenIds, reasons: Map id -> reason }
export async function loadDismissed(user_id) {
  const local = localIds(user_id);
  const reasons = localReasons(user_id);
  const { data: rows, error } = await getDismissedGames(user_id);
  if (error || !rows) return toDismissed(local, reasons);
  const remote = rows.map((row) => row.game_id);
  // Reasons saved here before the reason column existed go up once
  for (const row of rows)
    if (row.reason) reasons[row.game_id] = row.reason;
    else if (reasons[row.game_id] && "reason" in row)
      setDismissReason({
        user_id,
        game_id: row.game_id,
        reason: reasons[row.game_id],
      });
  const remoteSet = new Set(remote);
  const missing = local.filter((id) => !remoteSet.has(id));
  if (missing.length) {
    const { error: uploadError } = await addDismissedGames({
      user_id,
      game_ids: missing,
    });
    if (uploadError) return toDismissed([...remote, ...local], reasons);
  }
  const all = [...new Set([...remote, ...local])];
  writeStorage(DISMISSED_PREFIX + user_id, all.slice(0, DISMISSED_LIMIT));
  writeStorage(REASONS_PREFIX + user_id, reasons);
  return toDismissed(all, reasons);
}

export function addDismissed(user_id, game_id, reason) {
  writeStorage(
    DISMISSED_PREFIX + user_id,
    [game_id, ...localIds(user_id).filter((id) => id !== game_id)].slice(
      0,
      DISMISSED_LIMIT,
    ),
  );
  if (!reason) return addDismissedGames({ user_id, game_ids: [game_id] });
  // One request, so an Undo right after can't be overtaken by a late reason
  // write. Before the reason column is migrated, the game alone is saved.
  return setReason(user_id, game_id, reason).then((result) =>
    result.error ? addDismissedGames({ user_id, game_ids: [game_id] }) : result,
  );
}

export function setReason(user_id, game_id, reason) {
  writeStorage(REASONS_PREFIX + user_id, {
    ...localReasons(user_id),
    [game_id]: reason,
  });
  return setDismissReason({ user_id, game_id, reason });
}

export function removeDismissed(user_id, game_id) {
  writeStorage(
    DISMISSED_PREFIX + user_id,
    localIds(user_id).filter((id) => id !== game_id),
  );
  const reasons = localReasons(user_id);
  delete reasons[game_id];
  writeStorage(REASONS_PREFIX + user_id, reasons);
  return deleteDismissedGame({ user_id, game_id });
}

export async function clearDismissed(user_id) {
  const { error } = await deleteAllDismissedGames(user_id);
  if (error) return { error };
  try {
    localStorage.removeItem(DISMISSED_PREFIX + user_id);
    localStorage.removeItem(REASONS_PREFIX + user_id);
  } catch {
    // Storage blocked
  }
  return { error: null };
}
