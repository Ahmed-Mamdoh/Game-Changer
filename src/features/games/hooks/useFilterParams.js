import { useSearchParams } from "react-router-dom";

const paramOf = (filter, item) => item.param || filter.paramName;
const matchParam = (filter) => `${filter.paramName}Match`;

// A copy of the URL with one picked value taken out
export function withoutItem(searchParams, filter, item) {
  const param = paramOf(filter, item);
  const next = new URLSearchParams(searchParams);
  const rest = (searchParams.get(param)?.split("-") || []).filter(
    (v) => v !== String(item.id),
  );
  if (rest.length) next.set(param, rest.join("-"));
  else next.delete(param);
  next.delete("page");
  return next;
}

// Reads and writes filters in the URL. `or` = pick one, otherwise many.
// Items may carry their own `param`, so one menu can span several params.
export function useFilterParams(paramName, or, defaultValue) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = { paramName };
  const selectedIn = (param) =>
    searchParams.get(param)?.split("-") ||
    (param === paramName ? defaultValue : []);

  const isOn = (item) =>
    selectedIn(paramOf(filter, item)).includes(String(item.id));

  function toggle(item) {
    if (!or && isOn(item)) {
      setSearchParams(withoutItem(searchParams, filter, item));
      return;
    }
    const param = paramOf(filter, item);
    const value = String(item.id);
    const newParams = new URLSearchParams(searchParams);
    const current = searchParams.get(param)?.split("-") || [];
    newParams.delete("page");

    if (or) {
      if (current.includes(value) || defaultValue.includes(value)) {
        newParams.delete(param);
      } else {
        newParams.set(param, value);
      }
    } else {
      newParams.set(param, [...current, value].join("-"));
    }
    setSearchParams(newParams);
  }

  function set(param, value) {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(param, value);
    else newParams.delete(param);
    newParams.delete("page");
    setSearchParams(newParams);
  }

  function clear(items) {
    const newParams = new URLSearchParams(searchParams);
    for (const item of items) newParams.delete(paramOf(filter, item));
    newParams.delete(matchParam(filter));
    newParams.delete("page");
    setSearchParams(newParams);
  }

  // Picks inside one menu widen the results ("any") unless this is on
  const matchAll = searchParams.get(matchParam(filter)) === "all";
  const setMatchAll = (on) => set(matchParam(filter), on ? "all" : null);

  return { isOn, toggle, clear, set, matchAll, setMatchAll };
}

// The picked items of one filter, read straight from the URL
function activeIn(searchParams, filter) {
  return (filter.category || []).filter((item) =>
    searchParams
      .get(paramOf(filter, item))
      ?.split("-")
      .includes(String(item.id)),
  );
}

export function useActiveItems(filter) {
  const [searchParams] = useSearchParams();
  return activeIn(searchParams, filter);
}

export function useActiveCount(filters) {
  const [searchParams] = useSearchParams();
  return filters.reduce(
    (sum, filter) => sum + activeIn(searchParams, filter).length,
    0,
  );
}

// One removable chip per picked value, across every menu
export function activeChips(searchParams, menus) {
  return menus.flatMap((filter) =>
    activeIn(searchParams, filter).map((item) => ({
      key: `${paramOf(filter, item)}-${item.id}`,
      label: item.name.split("(")[0].trim(),
      filter,
      item,
    })),
  );
}

// Clears every filter but keeps the search, the sort order and the
// "Hide my library" toggle
export function withoutFilters(searchParams) {
  const next = new URLSearchParams();
  for (const key of ["search", "sortBy", "hideLibrary"]) {
    const value = searchParams.get(key);
    if (value) next.set(key, value);
  }
  return next;
}
