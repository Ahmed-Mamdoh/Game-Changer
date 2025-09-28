import { getFreeGameData } from "@/api/igdbApi";
import { useQuery } from "@tanstack/react-query";

export function useGetFreeGameData(gamesCleanNames) {
  const { data, isLoading } = useQuery({
    queryKey: ["igdb-game", gamesCleanNames],
    queryFn: async () => {
      const result = await Promise.all(
        gamesCleanNames.map((gameName) => getFreeGameData(gameName)),
      );
      return result;
    },
  });
  return { data, isLoading };
}
