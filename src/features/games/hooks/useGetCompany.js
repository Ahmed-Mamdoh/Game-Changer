import { useQuery } from "@tanstack/react-query";
import { getCompany } from "../../../api/igdbApi";

// Name of the company in the `company` filter, for its chip
export function useGetCompany(id) {
  const { data, isLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompany(id),
    enabled: Boolean(id),
    staleTime: Infinity,
  });
  return { company: data?.[0], isLoading };
}
