import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, History, Loader2, Search } from "lucide-react";
import { coverUrlOf } from "@/utils/igdbImage";
import { useQuickSearch } from "@/features/games/hooks/useQuickSearch";
import { useRecentSearches } from "@/features/games/hooks/useRecentSearches";

const RESULT_LIMIT = 5;

function yearOf(game) {
  return game.first_release_date
    ? new Date(game.first_release_date * 1000).getFullYear()
    : null;
}

// Bolds the first place the typed text appears in the name
function HighlightedName({ name, query }) {
  const index = name.toLowerCase().indexOf(query.toLowerCase());
  if (!query || index === -1) return name;
  return (
    <>
      {name.slice(0, index)}
      <mark className="text-text-main bg-transparent font-semibold">
        {name.slice(index, index + query.length)}
      </mark>
      {name.slice(index + query.length)}
    </>
  );
}

function Poster({ src, className }) {
  return (
    <div
      className={`bg-bg-raised shrink-0 overflow-hidden rounded-sm ${className}`}
    >
      {src && <img src={src} alt="" className="h-full w-full object-cover" />}
    </div>
  );
}

// Header search with instant results (ARIA combobox). Picking a result opens
// the game; Enter with nothing highlighted opens the full results page. With
// the box empty, it lists recent searches instead.
function SearchBox() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef(null);
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const listId = useId();
  const { recent, add: addRecent, clear: clearRecent } = useRecentSearches();

  const query = search.trim();
  const {
    data: games = [],
    enabled,
    isPending,
  } = useQuickSearch(search, RESULT_LIMIT);
  const showRecent = !query && recent.length > 0;
  const showList = open && (enabled || showRecent);

  // Every selectable row in display order, so keyboard and mouse share indexes
  const rows = enabled
    ? [
        ...games.map((game) => ({ kind: "game", game })),
        { kind: "all" },
      ]
    : showRecent
      ? recent.map((item) =>
          item.type === "game"
            ? { kind: "recent-game", item }
            : { kind: "recent-query", item },
        )
      : [];

  // Ctrl/Cmd + K or "/" focuses search
  useEffect(() => {
    function onKey(e) {
      const typing = ["INPUT", "TEXTAREA"].includes(e.target.tagName);
      if (
        (e.key === "k" && (e.ctrlKey || e.metaKey)) ||
        (e.key === "/" && !typing)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onPointerDown(e) {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function close() {
    setOpen(false);
    setActive(-1);
    inputRef.current?.blur();
  }

  // Runs on click (the Link navigates itself) and on Enter (navigate = true)
  function pickGame(game, { navigateTo = false } = {}) {
    addRecent({
      type: "game",
      id: game.id,
      name: game.name,
      cover: game.cover ?? null,
      year: game.year ?? yearOf(game),
    });
    close();
    setSearch("");
    if (navigateTo) navigate(`/game/${game.id}`);
  }

  function openAllResults(text = query) {
    if (!text) return;
    addRecent({ type: "query", text });
    close();
    navigate(`/games/allGames?search=${encodeURIComponent(text)}`);
  }

  function reuseQuery(text) {
    addRecent({ type: "query", text });
    setSearch(text);
    setActive(-1);
    inputRef.current?.focus();
  }

  function selectRow(row) {
    if (row.kind === "game") pickGame(row.game, { navigateTo: true });
    else if (row.kind === "recent-game")
      pickGame(row.item, { navigateTo: true });
    else if (row.kind === "recent-query") reuseQuery(row.item.text);
    else openAllResults();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (showList && rows[active]) selectRow(rows[active]);
    else openAllResults();
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      if (showList) {
        e.preventDefault();
        setOpen(false);
        setActive(-1);
      } else inputRef.current?.blur();
      return;
    }
    if (!rows.length || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
    e.preventDefault();
    setOpen(true);
    setActive((current) => {
      if (e.key === "ArrowDown")
        return current + 1 >= rows.length ? 0 : current + 1;
      return current <= 0 ? rows.length - 1 : current - 1;
    });
  }

  const optionId = (index) => `${listId}-option-${index}`;
  const optionProps = (index) => ({
    id: optionId(index),
    role: "option",
    "aria-selected": active === index,
  });
  const rowClass = (index) =>
    `flex w-full cursor-pointer items-center gap-3 px-3 text-left transition-colors duration-75 ${
      active === index ? "bg-white/[0.08]" : "hover:bg-white/[0.05]"
    }`;

  function renderResults() {
    const allIndex = games.length;
    return (
      <>
        {games.map((game, index) => {
          const year = yearOf(game);
          return (
            <li key={game.id} {...optionProps(index)}>
              <Link
                to={`/game/${game.id}`}
                tabIndex={-1}
                onClick={() => pickGame(game)}
                onMouseEnter={() => setActive(index)}
                className={`${rowClass(index)} py-2`}
              >
                <Poster
                  src={coverUrlOf(game, "t_cover_big")}
                  className="h-[75px] w-14"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-text-dim line-clamp-2 text-sm leading-snug">
                    <HighlightedName name={game.name} query={query} />
                  </span>
                  {year && (
                    <span className="text-text-muted tabular text-xs">
                      {year}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}

        {!games.length && (
          <li className="text-text-muted px-3 py-3 text-sm">
            {isPending ? "Searching…" : `No games match “${query}”`}
          </li>
        )}

        <li
          {...optionProps(allIndex)}
          className="border-stroke-subtle mt-1.5 border-t pt-1.5"
        >
          <button
            type="button"
            tabIndex={-1}
            onClick={() => openAllResults()}
            onMouseEnter={() => setActive(allIndex)}
            className={`${rowClass(allIndex)} text-text-dim py-2 text-sm`}
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1 truncate">
              See all results for{" "}
              <span className="text-text-main font-semibold">“{query}”</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </li>
      </>
    );
  }

  function renderRecent() {
    return (
      <>
        <li
          role="presentation"
          className="flex items-center justify-between px-3 pt-1 pb-1.5"
        >
          <span className="text-text-muted text-xs font-semibold tracking-wide uppercase">
            Recent
          </span>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              clearRecent();
              inputRef.current?.focus();
            }}
            className="text-text-muted hover:text-text-main cursor-pointer text-xs"
          >
            Clear
          </button>
        </li>
        {rows.map((row, index) =>
          row.kind === "recent-game" ? (
            <li key={`game:${row.item.id}`} {...optionProps(index)}>
              <Link
                to={`/game/${row.item.id}`}
                tabIndex={-1}
                onClick={() => pickGame(row.item)}
                onMouseEnter={() => setActive(index)}
                className={`${rowClass(index)} py-1.5`}
              >
                <Poster
                  src={coverUrlOf(row.item, "t_cover_big")}
                  className="h-12 w-9"
                />
                <span className="text-text-dim min-w-0 flex-1 truncate text-sm">
                  {row.item.name}
                </span>
                {row.item.year && (
                  <span className="text-text-muted tabular shrink-0 text-xs">
                    {row.item.year}
                  </span>
                )}
              </Link>
            </li>
          ) : (
            <li key={`query:${row.item.text}`} {...optionProps(index)}>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => reuseQuery(row.item.text)}
                onMouseEnter={() => setActive(index)}
                className={`${rowClass(index)} text-text-dim py-2 text-sm`}
              >
                <span className="flex w-9 shrink-0 justify-center">
                  <History className="text-text-muted h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 truncate">
                  {row.item.text}
                </span>
              </button>
            </li>
          ),
        )}
      </>
    );
  }

  return (
    <div ref={rootRef} className="relative ml-auto w-full max-w-72">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="border-stroke-subtle focus-within:border-stroke-brand flex h-9 w-full items-center gap-2 rounded-md border bg-black/40 px-2.5 backdrop-blur-md transition-colors"
      >
        {isPending && enabled ? (
          <Loader2 className="text-text-muted h-4 w-4 shrink-0 animate-spin" />
        ) : (
          <Search className="text-text-muted h-4 w-4 shrink-0" />
        )}
        <label htmlFor="search" className="sr-only">
          Search games
        </label>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showList && rows[active] ? optionId(active) : undefined
          }
          autoComplete="off"
          placeholder="Search games"
          value={search}
          id="search"
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="placeholder:text-text-muted w-full min-w-0 border-0 bg-transparent text-sm focus:outline-none"
        />
        <kbd className="text-text-muted border-stroke-subtle hidden rounded-sm border px-1.5 text-xs whitespace-nowrap md:block">
          Ctrl K
        </kbd>
      </form>

      {showList && (
        <div className="bg-bg-surface border-stroke-medium fixed inset-x-4 top-14 overflow-hidden rounded-lg border shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)] sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-96">
          <ul
            id={listId}
            role="listbox"
            aria-label={enabled ? "Games" : "Recent searches"}
            className="max-h-[calc(100dvh-5rem)] overflow-y-auto py-1.5"
          >
            {enabled ? renderResults() : renderRecent()}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBox;
