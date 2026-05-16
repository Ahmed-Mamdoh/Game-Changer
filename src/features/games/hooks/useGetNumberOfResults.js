import { useQuery } from "@tanstack/react-query";
import { getNumberOfResults } from "../../../api/igdbApi";
import useGetFiltersParams from "./useGetFiltersParams";
export function useGetNumberOfResults(path) {
  const { filters, search } = useGetFiltersParams();
  const searchKey = search || "";
  let isUpcoming = false;
  if (path.includes("/upcomingGames")) isUpcoming = true;

  const { data, isLoading, error } = useQuery({
    queryKey: ["numberOfResults", "all", searchKey, filters, isUpcoming],
    queryFn: () =>
      getNumberOfResults({ filters, search: searchKey, isUpcoming }),
  });

  return { data, isLoading, error };
}
