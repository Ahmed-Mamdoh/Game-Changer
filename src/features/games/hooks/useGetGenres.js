import { useQuery } from "@tanstack/react-query";
import { getGenres } from "../../../api/igdbApi";

export function useGetGenres() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["genres"],
    queryFn: getGenres,
  });
  return { data, isLoading, error };
}
