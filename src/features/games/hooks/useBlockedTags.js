import { getBlockedTags, saveBlockedTags } from "@/api/supabase";
import { getCompanyGameIds } from "@/api/igdbApi";
import {
  BLOCKED_LIMIT,
  blockKey,
  cleanBlocked,
  readBlocked,
  readBlockedGameIds,
  writeBlocked,
  writeBlockedGameIds,
} from "@/features/games/blockedTags";
import { clearSavedPicks } from "@/features/games/hooks/useGetRecommendations";
import { UserToken } from "@/hooks/useUserToken";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Loads the blocked studios' games when the studios changed, so lists can
// leave them out
async function syncStudioGames(user_id, list) {
  const companyIds = list
    .filter((item) => item.kind === "company")
    .map((item) => item.id)
    .sort((a, b) => a - b);
  const saved = readBlockedGameIds(user_id);
  if (saved.companyIds.join() === companyIds.join()) return false;
  const gameIds = await getCompanyGameIds(companyIds);
  writeBlockedGameIds(user_id, companyIds, gameIds);
  return true;
}

// Every game list, row and pick is built again with the new list
function refetchGames(queryClient, user_id) {
  clearSavedPicks(user_id);
  return queryClient.invalidateQueries({
    predicate: (query) => query.queryKey[0] !== "blocked_tags",
  });
}

// The player's "Never show" list: genres, themes, tags and studios that are
// left out of browse, home rows, For You and the chat's picks
export function useBlockedTags() {
  const user_id = UserToken()?.user?.id;
  const queryClient = useQueryClient();
  const queryKey = ["blocked_tags", user_id];

  const { data: blocked = [] } = useQuery({
    queryKey,
    // Another device may have changed it since this browser saved its copy
    queryFn: async () => {
      const local = readBlocked(user_id);
      const { data, error } = await getBlockedTags();
      const remote = error ? null : cleanBlocked(data);
      // Never saved on the account yet: this browser's copy goes up
      if (!remote) {
        if (local.length && !error) saveBlockedTags(local);
        return local;
      }
      const changed =
        remote.map(blockKey).join() !== local.map(blockKey).join();
      writeBlocked(user_id, remote);
      const studiosChanged = await syncStudioGames(user_id, remote).catch(
        () => false,
      );
      if (changed || studiosChanged) refetchGames(queryClient, user_id);
      return remote;
    },
    initialData: () => readBlocked(user_id),
    initialDataUpdatedAt: 0,
    enabled: !!user_id,
    staleTime: 5 * 60 * 1000,
  });

  async function save(next) {
    const list = cleanBlocked(next) || [];
    writeBlocked(user_id, list);
    queryClient.setQueryData(queryKey, list);
    const { error } = await saveBlockedTags(list);
    await syncStudioGames(user_id, list).catch(() => false);
    await refetchGames(queryClient, user_id);
    return { error };
  }

  const has = (item) => blocked.some((b) => blockKey(b) === blockKey(item));

  return {
    blocked,
    isFull: blocked.length >= BLOCKED_LIMIT,
    has,
    block: (item) => (has(item) ? null : save([...blocked, item])),
    unblock: (item) =>
      save(blocked.filter((b) => blockKey(b) !== blockKey(item))),
    setAll: save,
  };
}
