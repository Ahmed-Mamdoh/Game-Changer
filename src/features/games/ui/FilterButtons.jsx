import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useFilterParams, useActiveItems } from "../hooks/useFilterParams";

const keyOf = (item) => `${item.param || ""}${item.id}`;

function sorted(category, sort) {
  return [...category].sort((a, b) =>
    sort ? a.name.localeCompare(b.name) : 0,
  );
}

const isTouch = () => window.matchMedia("(pointer: coarse)").matches;

// "Match all selected": only meaningful once two or more are picked
function MatchAllSwitch({ on, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="flex w-full cursor-pointer items-center gap-3 rounded-sm px-2.5 py-2 text-left hover:bg-white/[0.04]"
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-semibold">Match all selected</span>
        <span className="text-text-muted text-xs">
          {on ? "Games have every pick" : "Games have any of your picks"}
        </span>
      </span>
      <span
        className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-150 ${
          on ? "bg-action" : "bg-white/15"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full shadow transition-transform duration-150 ease-(--ease-out-expo) ${
            on ? "bg-on-action translate-x-4" : "bg-text-main"
          }`}
        />
      </span>
    </button>
  );
}

// From/To years for the Released menu
function YearRange({ onApply }) {
  const thisYear = new Date().getFullYear();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const valid = (v) => /^\d{4}$/.test(v) && v >= 1950 && v <= thisYear;
  const ready = valid(from) && valid(to);

  const field =
    "border-stroke-medium bg-bg-base/60 h-9 w-full min-w-0 rounded-md border px-2.5 text-sm tabular outline-none focus:border-stroke-brand max-sm:h-11 max-sm:text-base";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (ready) onApply(`${Math.min(from, to)}..${Math.max(from, to)}`);
      }}
      className="flex flex-col gap-2 px-2.5 py-2"
    >
      <span className="text-text-dim text-xs font-semibold">Custom range</span>
      <div className="flex items-center gap-2">
        <input
          inputMode="numeric"
          maxLength={4}
          placeholder="From"
          aria-label="From year"
          value={from}
          onChange={(e) => setFrom(e.target.value.replace(/\D/g, ""))}
          className={field}
        />
        <span className="text-text-muted" aria-hidden="true">
          –
        </span>
        <input
          inputMode="numeric"
          maxLength={4}
          placeholder="To"
          aria-label="To year"
          value={to}
          onChange={(e) => setTo(e.target.value.replace(/\D/g, ""))}
          className={field}
        />
        <button
          type="submit"
          disabled={!ready}
          className="bg-action text-on-action h-9 shrink-0 cursor-pointer rounded-md px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 max-sm:h-11"
        >
          Apply
        </button>
      </div>
    </form>
  );
}

// Searchable option list shared by the desktop menus and the phone sheet.
// It mounts each time it opens, so what was checked then sits on top and
// stays put while the list is open. Focus stays in the search box: arrow
// keys move a highlight through the options and Enter toggles it.
export function FilterOptions({
  category = [],
  name,
  paramName,
  sort = true,
  or = false,
  defaultValue = [],
  matchable = false,
  yearRange = false,
  note,
  inputRef: outerInputRef,
}) {
  const { isOn, toggle, clear, set, matchAll, setMatchAll } = useFilterParams(
    paramName,
    or,
    defaultValue,
  );
  const options = sorted(category, sort);
  const activeItems = options.filter(
    (item) => isOn(item) && !defaultValue.includes(String(item.id)),
  );
  const [query, setQuery] = useState("");
  const [pinned] = useState(() => activeItems.map(keyOf));
  const [activeIndex, setActiveIndex] = useState(0);
  const ownInputRef = useRef(null);
  const inputRef = outerInputRef || ownInputRef;
  const listRef = useRef(null);
  const listId = useId();

  const q = query.trim().toLowerCase();
  const matches = options.filter((item) => item.name.toLowerCase().includes(q));
  const top = matches.filter((item) => pinned.includes(keyOf(item)));
  const rest = matches.filter((item) => !pinned.includes(keyOf(item)));
  const flat = [...top, ...rest];
  const current = Math.min(activeIndex, flat.length - 1);
  const optionId = (i) => `${listId}-${i}`;

  // Keep the highlighted option in view while arrowing through a long list
  useEffect(() => {
    if (current < 0) return;
    listRef.current
      ?.querySelector(`[id="${optionId(current)}"]`)
      ?.scrollIntoView({ block: "nearest" });
    // optionId only depends on listId, which never changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // After a pick, hand focus back to the search with its text selected,
  // so typing again replaces the old query. On touch screens only while
  // searching, or every tap would pop the keyboard up.
  function pick(item, index) {
    toggle(item);
    setActiveIndex(index);
    if (isTouch() && !q) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }

  function onKeyDown(e) {
    const last = flat.length - 1;
    const moves = {
      ArrowDown: current >= last ? 0 : current + 1,
      ArrowUp: current <= 0 ? last : current - 1,
      Home: 0,
      End: last,
    };
    if (e.key in moves && last >= 0) {
      // Home/End keep their text-editing meaning once something is typed
      if ((e.key === "Home" || e.key === "End") && query) return;
      e.preventDefault();
      setActiveIndex(moves[e.key]);
    } else if (e.key === "Enter" && flat[current]) {
      e.preventDefault();
      pick(flat[current], current);
    }
  }

  function renderOption(item, index) {
    const on = isOn(item);
    return (
      <div
        key={keyOf(item)}
        id={optionId(index)}
        role="option"
        aria-selected={on}
        data-active={index === current}
        onClick={() => pick(item, index)}
        onMouseMove={() => index !== current && setActiveIndex(index)}
        className="pointer-fine:data-[active=true]:bg-bg-chip flex min-h-9 w-full shrink-0 cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-left text-sm max-sm:min-h-11"
      >
        <span
          className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
            or ? "rounded-full" : "rounded-[4px]"
          } ${on ? "bg-action border-action text-on-action" : "border-stroke-medium"}`}
        >
          {on && <Check className="h-3 w-3" strokeWidth={3} />}
        </span>
        {item.icon && (
          <item.icon
            className="text-text-dim h-[18px] w-[18px] shrink-0"
            aria-hidden="true"
          />
        )}
        {item.name}
      </div>
    );
  }

  return (
    <>
      <label className="border-stroke-subtle mb-1 flex h-9 items-center gap-2 border-b px-2.5 max-sm:h-11">
        <Search
          className="text-text-muted h-4 w-4 shrink-0"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={current >= 0 ? optionId(current) : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={onKeyDown}
          placeholder={`Search ${name.toLowerCase()}`}
          aria-label={`Search ${name.toLowerCase()}`}
          className="placeholder:text-text-muted w-full bg-transparent text-sm outline-none max-sm:text-base"
        />
      </label>
      {matchable && activeItems.length >= 2 && (
        <div className="border-stroke-subtle mb-1 border-b pb-1">
          <MatchAllSwitch on={matchAll} onChange={setMatchAll} />
        </div>
      )}
      <div
        ref={listRef}
        id={listId}
        role="listbox"
        aria-label={name}
        aria-multiselectable={!or}
        className="flex flex-col sm:max-h-80 sm:overflow-y-auto"
      >
        {top.map((item, i) => renderOption(item, i))}
        {top.length > 0 && rest.length > 0 && (
          <div
            role="separator"
            className="border-stroke-subtle mx-2.5 my-1 shrink-0 border-t"
          />
        )}
        {rest.map((item, i) => renderOption(item, top.length + i))}
        {matches.length === 0 && (
          <p className="text-text-muted px-2.5 py-2 text-sm">No matches</p>
        )}
      </div>
      {note && (
        <p className="text-text-muted max-w-[32ch] px-2.5 pt-1 pb-1.5 text-xs">
          {note}
        </p>
      )}
      {yearRange && (
        <div className="border-stroke-subtle mt-1 border-t">
          <YearRange onApply={(value) => set(paramName, value)} />
        </div>
      )}
      {activeItems.length > 0 && (
        <div className="border-stroke-subtle mt-1 border-t px-1 pt-1">
          <button
            type="button"
            onClick={() => {
              clear(options);
              if (!isTouch()) inputRef.current?.focus();
            }}
            className="text-text-brand h-8 w-full cursor-pointer rounded-sm px-1.5 text-left text-sm font-semibold hover:bg-white/[0.04]"
          >
            Clear {name.toLowerCase()}
          </button>
        </div>
      )}
    </>
  );
}

function FilterButtons(props) {
  const {
    category = [],
    name,
    paramName,
    sort = true,
    or = false,
    defaultValue = [],
    variant = "menu",
    icon: Icon,
    className = "",
  } = props;
  const { isOn, toggle } = useFilterParams(paramName, or, defaultValue);
  const activeItems = useActiveItems(props);
  const inputRef = useRef(null);
  const options = sorted(category, sort);

  // Few view-like options: show them all as a segmented control
  if (variant === "segmented") {
    return (
      <div
        role="radiogroup"
        aria-label={name}
        className={`segmented border-stroke-medium h-10 bg-white/[0.06] backdrop-blur-none ${className}`}
      >
        {options.map((item) => (
          <button
            key={keyOf(item)}
            type="button"
            role="radio"
            aria-checked={isOn(item)}
            onClick={() => !isOn(item) && toggle(item)}
            className="h-8! max-sm:flex-1 max-sm:justify-center"
          >
            {item.icon && (
              <item.icon className="h-4 w-4 max-sm:hidden" aria-hidden="true" />
            )}
            {item.name}
          </button>
        ))}
      </div>
    );
  }

  const label =
    activeItems.length === 0
      ? name
      : activeItems.length === 1
        ? activeItems[0].name.split("(")[0].trim()
        : `${name} · ${activeItems.length}`;

  return (
    <Popover>
      <PopoverTrigger
        className={`flex h-10 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-sm whitespace-nowrap transition-colors duration-100 ${
          activeItems.length
            ? "border-stroke-brand text-text-main bg-pulse-primary/15 font-semibold"
            : "border-stroke-medium text-text-main bg-white/[0.06] hover:border-white/25 hover:bg-white/[0.1]"
        } ${className}`}
      >
        {Icon && <Icon className="h-4 w-4 opacity-80" aria-hidden="true" />}
        {label}
        <ChevronDown className="h-4 w-4 opacity-70" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
        className="dropdown-pop bg-bg-raised border-stroke-medium text-text-main w-64 rounded-lg p-1 shadow-[var(--shadow-float)]"
      >
        <FilterOptions {...props} inputRef={inputRef} />
      </PopoverContent>
    </Popover>
  );
}

export default FilterButtons;
