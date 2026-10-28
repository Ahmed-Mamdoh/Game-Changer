import { memo } from "react";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_BROWSE_SORT } from "@/api/igdbApi";
import { sortOptions, useFilterMenus } from "../hooks/useFilterMenus";
import { withoutFilters } from "../hooks/useFilterParams";
import ActiveFilterChips from "./ActiveFilterChips";
import FilterButtons from "./FilterButtons";
import MobileFilters from "./MobileFilters";

function Filters({
  showSortBy = true,
  isAccount = false,
  showFavorite = false,
  isUpcoming = false,
  className = "",
  ...menuOptions
}) {
  const { menus, isLoading } = useFilterMenus(menuOptions);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search");

  const clearAll = () => setSearchParams(withoutFilters(searchParams));

  if (isLoading) return <div className={`box-content h-10 ${className}`} />;

  return (
    <div className={className}>
      {/* Phones get sort + one Filters button that opens a bottom sheet;
          wider screens show each menu and wrap onto a second line */}
      <div className="flex w-full flex-wrap items-center gap-2">
        {!search && showSortBy && (
          <FilterButtons
            category={sortOptions({ isAccount, isUpcoming })}
            name="Sort by"
            paramName="sortBy"
            or={true}
            sort={false}
            variant="segmented"
            className="max-sm:flex-1"
            defaultValue={
              isAccount ? [] : isUpcoming ? ["hypes"] : [DEFAULT_BROWSE_SORT]
            }
          />
        )}

        {menus.length > 0 && (
          <div className="flex flex-1 sm:hidden">
            <MobileFilters filters={menus} onClearAll={clearAll} />
          </div>
        )}
        {menus.map((menu) => (
          <FilterButtons key={menu.name} {...menu} className="max-sm:hidden" />
        ))}

        {showFavorite && (
          <label className="border-stroke-subtle text-text-dim has-checked:text-text-main has-checked:border-stroke-brand flex h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm">
            <input
              type="checkbox"
              className="accent-pulse-primary h-4 w-4"
              checked={searchParams.get("isFavorite") === "true"}
              onChange={(e) => {
                if (e.target.checked) searchParams.set("isFavorite", "true");
                else searchParams.delete("isFavorite");
                setSearchParams(searchParams);
              }}
            />
            Favorites only
          </label>
        )}
      </div>

      <ActiveFilterChips menus={menus} className="mt-3" />
    </div>
  );
}

export default memo(Filters);
