import { X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  activeChips,
  withoutFilters,
  withoutItem,
} from "../hooks/useFilterParams";

// One removable chip per picked value, so a single filter can go without
// opening its menu. Phones scroll the row sideways.
function ActiveFilterChips({ menus, className = "" }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const chips = activeChips(searchParams, menus);
  if (chips.length === 0) return null;

  return (
    <ul
      aria-label="Active filters"
      className={`no-scrollbar flex items-center gap-1.5 max-sm:-mx-4 max-sm:overflow-x-auto max-sm:px-4 sm:flex-wrap ${className}`}
    >
      {chips.map(({ key, label, filter, item }) => (
        <li key={key} className="shrink-0">
          <button
            type="button"
            onClick={() =>
              setSearchParams(withoutItem(searchParams, filter, item))
            }
            aria-label={`Remove ${label}`}
            className="border-stroke-brand bg-pulse-primary/10 text-text-main hover:bg-pulse-primary/20 flex h-8 cursor-pointer items-center gap-1.5 rounded-full border pr-2 pl-3 text-sm whitespace-nowrap transition-colors duration-100"
          >
            {item.icon && (
              <item.icon
                className="text-text-dim h-4 w-4 shrink-0"
                aria-hidden="true"
              />
            )}
            {label}
            <X className="text-text-dim h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </li>
      ))}
      <li className="shrink-0">
        <button
          type="button"
          onClick={() => setSearchParams(withoutFilters(searchParams))}
          className="text-text-brand h-8 cursor-pointer px-2 text-sm font-semibold whitespace-nowrap hover:underline hover:underline-offset-4"
        >
          Clear all
        </button>
      </li>
    </ul>
  );
}

export default ActiveFilterChips;
