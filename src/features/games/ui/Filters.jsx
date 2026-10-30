import { memo } from "react";
import { Ban } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { DEFAULT_BROWSE_SORT } from "@/api/igdbApi";
import { UserToken } from "@/hooks/useUserToken";
import NeverShowDialog from "../components/NeverShowDialog";
import { useBlockedTags } from "../hooks/useBlockedTags";
import { sortOptions, useFilterMenus } from "../hooks/useFilterMenus";
import { withoutFilters } from "../hooks/useFilterParams";
import ActiveFilterChips from "./ActiveFilterChips";
import FilterButtons from "./FilterButtons";
import MobileFilters from "./MobileFilters";

// An on/off filter stored in the URL as `param=true`
function Toggle({ param, label }) {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <label className="border-stroke-subtle text-text-dim has-checked:text-text-main has-checked:border-stroke-brand flex h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm whitespace-nowrap">
      <input
        type="checkbox"
        className="accent-pulse-primary h-4 w-4"
        checked={searchParams.get(param) === "true"}
        onChange={(e) => {
          const next = new URLSearchParams(searchParams);
          if (e.target.checked) next.set(param, "true");
          else next.delete(param);
          next.delete("page");
          setSearchParams(next);
        }}
      />
      {label}
    </label>
  );
}

// Opens the player's "Never show" list, with how many are on it
function NeverShowButton() {
  const { blocked } = useBlockedTags();
  return (
    <NeverShowDialog
      trigger={
        <button
          type="button"
          className={`flex h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm whitespace-nowrap ${
            blocked.length
              ? "border-stroke-brand text-text-main"
              : "border-stroke-subtle text-text-dim hover:text-text-main"
          }`}
        >
          <Ban className="h-4 w-4" aria-hidden="true" />
          Never show
          {blocked.length > 0 && (
            <span className="text-text-dim tabular">{blocked.length}</span>
          )}
        </button>
      }
    />
  );
}

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
  const isSignedIn = Boolean(UserToken()?.user?.id);

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

        {showFavorite && <Toggle param="isFavorite" label="Favorites only" />}
        {!isAccount && isSignedIn && (
          <Toggle param="hideLibrary" label="Hide my library" />
        )}
        {!isAccount && isSignedIn && <NeverShowButton />}
      </div>

      <ActiveFilterChips menus={menus} className="mt-3" />
    </div>
  );
}

export default memo(Filters);
