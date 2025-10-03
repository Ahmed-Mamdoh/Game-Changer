import { useQuery } from "@tanstack/react-query";
import { getThemes } from "../../../api/igdbApi";

export function useGetThemes() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["themes"],
    queryFn: getThemes,
  });
  return { data, isLoading, error };
}
