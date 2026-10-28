import { useQueries } from "@tanstack/react-query";
import { SearchX } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { getNumberOfResults, DEFAULT_BROWSE_SORT } from "../../../api/igdbApi";
import { useFilterMenus } from "../hooks/useFilterMenus";
import {
  activeChips,
  withoutFilters,
  withoutItem,
} from "../hooks/useFilterParams";
import { filtersFromParams } from "../hooks/useGetFiltersParams";

// Shown when filters leave nothing. For each picked filter it counts what
// dropping just that one would bring back, and offers the best of those.
function NoResults({ isUpcoming = false, menuOptions }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { menus } = useFilterMenus(menuOptions);
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy") || DEFAULT_BROWSE_SORT;
  const chips = activeChips(searchParams, menus);

  // Counts mirror useGetNumberOfResults, so they share its cache
  const counts = useQueries({
    queries: chips.map((chip) => {
      const next = withoutItem(searchParams, chip.filter, chip.item);
      const { filters, platform, player_perspectives } =
        filtersFromParams(next);
      const params = isUpcoming
        ? { filters, isUpcoming }
        : { filters, platform, player_perspectives, isUpcoming, sortBy };
      return {
        queryKey: [
          "numberOfResults",
          isUpcoming ? "upcoming" : "all",
          filters,
          params.platform || null,
          params.player_perspectives || null,
          params.sortBy || null,
        ],
        queryFn: () => getNumberOfResults(params),
        enabled: !search,
        staleTime: 5 * 60 * 1000,
      };
    }),
  });

  const suggestions = chips
    .map((chip, i) => ({ ...chip, count: counts[i].data?.count }))
    .filter((chip) => chip.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  const counting = counts.some((c) => c.isLoading);

  return (
    <div className="col-span-full flex flex-col items-center px-4 py-16 text-center">
      <span className="bg-bg-raised border-stroke-subtle mb-4 flex h-14 w-14 items-center justify-center rounded-full border">
        <SearchX className="text-text-dim h-6 w-6" aria-hidden="true" />
      </span>
      <h3>
        {search ? `No results for “${search}”` : "No games match these filters"}
      </h3>
      <p className="mx-auto mt-1 max-w-[46ch]">
        {chips.length === 0
          ? "Try a different search."
          : suggestions.length > 0
            ? "Removing one filter brings games back:"
            : counting && !search
              ? "Looking for the filter that rules everything out…"
              : "Try fewer filters."}
      </p>

      {suggestions.length > 0 && (
        <ul className="mt-5 flex w-full max-w-sm flex-col gap-2">
          {suggestions.map(({ key, label, filter, item, count }) => (
            <li key={key}>
              <button
                type="button"
                onClick={() =>
                  setSearchParams(withoutItem(searchParams, filter, item))
                }
                className="bg-bg-raised border-stroke-medium hover:border-stroke-brand flex h-12 w-full cursor-pointer items-center gap-3 rounded-lg border px-4 text-left transition-colors duration-100"
              >
                {item.icon && (
                  <item.icon
                    className="text-text-dim h-[18px] w-[18px] shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span className="flex-1 truncate">
                  Remove <strong className="font-semibold">{label}</strong>
                </span>
                <span className="text-text-dim tabular text-sm whitespace-nowrap">
                  {count.toLocaleString()} {count === 1 ? "game" : "games"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {chips.length > 0 && (
        <button
          type="button"
          onClick={() => setSearchParams(withoutFilters(searchParams))}
          className="btn-primary mt-5"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

export default NoResults;
