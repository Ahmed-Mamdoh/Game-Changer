import { searchGames } from "@/api/igdbApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// The model links games as search pages; these find the matching game page
// and fall back to the search page when no game matches.
function searchTerm(link) {
  return new URLSearchParams(link.split("?")[1] || "").get("search");
}

function gamePathQuery(link) {
  const name = searchTerm(link);
  return {
    queryKey: ["chat_game_path", name?.toLowerCase()],
    enabled: Boolean(name),
    staleTime: Infinity,
    queryFn: async () => {
      const [best] = await searchGames({ search: name, poolSize: 10 });
      return best?.id ? `/game/${best.id}` : link;
    },
  };
}

export function isSearchLink(href) {
  return Boolean(href?.startsWith("/games/allGames") && searchTerm(href));
}

// For links shown in a reply: the game page once found, the search page until then
export function useGamePath(link) {
  const { data } = useQuery({
    ...gamePathQuery(link),
    enabled: isSearchLink(link),
  });
  return data || link;
}

// For jumping straight to a pick; shares the cache with useGamePath
export function useResolveGamePath() {
  const queryClient = useQueryClient();
  return async (link) => {
    if (!isSearchLink(link)) return link;
    try {
      return await queryClient.fetchQuery(gamePathQuery(link));
    } catch {
      return link;
    }
  };
}
