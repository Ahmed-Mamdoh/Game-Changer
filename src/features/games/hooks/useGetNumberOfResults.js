import { useQuery } from "@tanstack/react-query";
import { getNumberOfResults } from "../../../api/igdbApi";
import useGetFiltersParams from "./useGetFiltersParams";
export function useGetNumberOfResults(path) {
  const { filters, search } = useGetFiltersParams();
  let isUpcoming = false;
  if (path === "/upcomingGames") isUpcoming = true;

  const { data, isLoading, error } = useQuery({
    queryKey: ["numberOfResults", "all", search, filters, isUpcoming],
    queryFn: () => getNumberOfResults({ filters, search, isUpcoming }),
  });

  return { data, isLoading, error };
}
