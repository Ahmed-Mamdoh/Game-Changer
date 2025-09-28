import { useQuery } from "@tanstack/react-query";
import { getNumberOfResults } from "../../api/igdbApi";
import { useSearchParams } from "react-router-dom";
export function useGetNumberOfResults(path) {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const genre = searchParams.get("genre");
  const themes = searchParams.get("theme");
  let filters = [];
  if (genre) {
    filters.push(`genres = (${genre})`);
  }
  if (themes) {
    filters.push(`themes = (${themes})`);
  }
  let isUpcoming = false;
  if (path === "/upcomingGames") isUpcoming = true;

  const { data, isLoading, error } = useQuery({
    queryKey: ["numberOfResults", "all", search, filters, isUpcoming],
    queryFn: () => getNumberOfResults({ filters, search, isUpcoming }),
  });

  return { data, isLoading, error };
}
