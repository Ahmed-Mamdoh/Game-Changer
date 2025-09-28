import { useQuery } from "@tanstack/react-query";
import { getGameModes } from "../../api/igdbApi";

export function useGetGameModes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["GameModes"],
    queryFn: getGameModes,
  });
  return { data, isLoading, error };
}
