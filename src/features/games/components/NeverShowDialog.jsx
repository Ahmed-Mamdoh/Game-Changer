import { useEffect, useId, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Ban, Check, LoaderCircle, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { searchBlockOptions } from "@/api/igdbApi";
import {
  BLOCKED_LIMIT,
  BLOCK_KINDS,
  blockKey,
} from "@/features/games/blockedTags";
import { useBlockedTags } from "@/features/games/hooks/useBlockedTags";
import { useGetGenres } from "@/features/games/hooks/useGetGenres";
import { useGetThemes } from "@/features/games/hooks/useGetThemes";

// IGDB's erotic theme is always left out, so it isn't offered
const HIDDEN_THEMES = new Set([42]);
// The blocked list, grouped in this order
const GROUPS = [
  { kind: "genre", title: "Genres" },
  { kind: "theme", title: "Themes" },
  { kind: "keyword", title: "Tags" },
  { kind: "company", title: "Studios" },
];

const byName = (a, b) => a.name.localeCompare(b.name);

function useDebounced(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// One field that finds anything to hide. Focused and empty it lists every
// genre and theme; typed into, it also searches IGDB tags and studios.
function BlockCombobox({ has, onPick, isFull }) {
  const listId = useId();
  const inputRef = useRef(null);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const query = useDebounced(text.trim(), 300);
  const typed = text.trim().toLowerCase();

  const { data: genres } = useGetGenres();
  const { data: themes } = useGetThemes();
  const local = [
    ...(Array.isArray(genres) ? genres : [])
      .map(({ id, name }) => ({ kind: "genre", id, name }))
      .sort(byName),
    ...(Array.isArray(themes) ? themes : [])
      .filter(({ id }) => !HIDDEN_THEMES.has(id))
      .map(({ id, name }) => ({ kind: "theme", id, name }))
      .sort(byName),
  ];

  const remote = useQuery({
    queryKey: ["blocked_tags", "search", query.toLowerCase()],
    queryFn: () => searchBlockOptions(query),
    enabled: query.length >= 2,
    staleTime: 10 * 60 * 1000,
  });
  // Names that start with what was typed come first
  const starts = (item) => item.name.toLowerCase().startsWith(typed);
  const options = typed
    ? [
        ...local.filter((item) => item.name.toLowerCase().includes(typed)),
        ...(query.length >= 2 && query.toLowerCase() === typed
          ? remote.data || []
          : []),
      ].sort((a, b) => starts(b) - starts(a))
    : local;
  const searching =
    typed.length >= 2 && (remote.isFetching || query.toLowerCase() !== typed);
  const index = Math.min(active, Math.max(options.length - 1, 0));

  function pick(item) {
    if (!item || (isFull && !has(item))) return;
    onPick(item);
    // Closes so the item just added shows in the list below
    setText("");
    setActive(0);
    setOpen(false);
    inputRef.current?.focus();
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((index + step + options.length) % Math.max(options.length, 1));
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      pick(options[index]);
    } else if (e.key === "Escape" && (open || text)) {
      // Closes the list first, the dialog only on a second press
      e.stopPropagation();
      if (text) setText("");
      else setOpen(false);
    }
  }

  return (
    <div>
      <div className="relative">
        <Search
          className="text-text-dim pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && options[index] ? `${listId}-${index}` : undefined
          }
          aria-label="Find a genre, theme, tag or studio to hide"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onClick={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          placeholder={
            isFull
              ? `List is full (${BLOCKED_LIMIT}). Remove one to add more.`
              : "Racing, survivors like, Ubisoft…"
          }
          disabled={isFull}
          autoComplete="off"
          spellCheck={false}
          className="glass-input h-11 w-full pr-10 pl-10 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        />
        {searching ? (
          <LoaderCircle
            className="text-text-dim absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 animate-spin motion-reduce:animate-none"
            aria-label="Searching"
          />
        ) : (
          text && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setText("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="text-text-dim hover:text-text-main absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )
        )}
      </div>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Things you can hide"
          // Keeps focus in the field while an option is pressed
          onMouseDown={(e) => e.preventDefault()}
          className="bg-bg-raised border-stroke-medium mt-1.5 max-h-64 overflow-y-auto overscroll-contain rounded-lg border p-1"
        >
          {options.length === 0 ? (
            <li className="text-text-dim px-3 py-2.5 text-sm">
              {searching
                ? "Searching tags and studios…"
                : `No match for "${text.trim()}".`}
            </li>
          ) : (
            options.map((item, i) => {
              const on = has(item);
              return (
                <li
                  key={blockKey(item)}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === index}
                  aria-disabled={on}
                  onMouseMove={() => i !== index && setActive(i)}
                  onClick={() => !on && pick(item)}
                  className={`flex min-h-10 items-center gap-3 rounded-sm px-3 text-sm max-sm:min-h-11 ${
                    i === index ? "bg-bg-chip" : ""
                  } ${on ? "cursor-default" : "cursor-pointer"}`}
                >
                  <span
                    className={`min-w-0 flex-1 truncate ${on ? "text-text-dim" : "text-text-main font-semibold"}`}
                  >
                    {item.name}
                  </span>
                  {on ? (
                    <span className="text-text-dim flex shrink-0 items-center gap-1 text-xs">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      Hidden
                    </span>
                  ) : (
                    <span className="text-text-muted shrink-0 text-xs">
                      {BLOCK_KINDS[item.kind].label}
                    </span>
                  )}
                </li>
              );
            })
          )}
          {!typed && (
            <li className="text-text-muted border-stroke-subtle mt-1 border-t px-3 pt-2 pb-1.5 text-xs">
              Type to search tags and studios too.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

// What's hidden, grouped by kind, each with the way back
function BlockedList({ blocked, onRemove }) {
  if (!blocked.length)
    return (
      <div className="border-stroke-subtle flex items-start gap-3 rounded-xl border border-dashed px-4 py-5">
        <Ban
          className="text-text-dim mt-0.5 h-5 w-5 shrink-0"
          aria-hidden="true"
        />
        <p className="text-text-dim text-sm">
          Nothing hidden yet. Search above, or press{" "}
          <span className="text-text-main font-semibold">Not for me</span> on a
          pick in For You to hide its genre in one go.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col gap-5">
      {GROUPS.map(({ kind, title }) => {
        const items = blocked.filter((item) => item.kind === kind);
        if (!items.length) return null;
        return (
          <section key={kind} aria-label={title}>
            <h3 className="text-text-dim mb-2 flex items-baseline gap-2 text-xs font-semibold">
              {title}
              <span className="text-text-muted tabular font-normal">
                {items.length}
              </span>
            </h3>
            <ul className="panel divide-stroke-subtle divide-y overflow-hidden">
              {items.map((item) => (
                <li
                  key={blockKey(item)}
                  className="flex min-h-11 items-center gap-3 py-1 pr-1.5 pl-3.5"
                >
                  <Ban
                    className="text-pulse-error h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-text-main min-w-0 flex-1 truncate text-sm font-semibold">
                    {item.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(item)}
                    aria-label={`Show ${item.name} again`}
                    className="text-text-dim hover:text-text-main flex h-9 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition-colors duration-120 hover:bg-white/[0.06]"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                    Show again
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

// "Never show": genres, themes, tags and studios left out of every list,
// row and pick. Searching a game by name still finds it.
function NeverShowDialog({ trigger }) {
  const { blocked, has, block, unblock, isFull } = useBlockedTags();
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        overlayClassName="confirm-overlay"
        className="log-panel bg-bg-surface border-stroke-medium flex max-h-[min(85dvh,44rem)] flex-col gap-0 overflow-hidden rounded-2xl border p-0 shadow-[var(--shadow-float)] max-sm:top-auto max-sm:bottom-0 max-sm:max-h-[92dvh] max-sm:max-w-full max-sm:translate-y-0 max-sm:rounded-b-none sm:max-w-[32rem]"
      >
        <div className="flex flex-col gap-4 px-5 pt-5 pb-4">
          <div className="pr-8">
            <div className="flex items-baseline justify-between gap-3">
              <DialogTitle className="text-text-main text-lg leading-tight font-semibold">
                Never show
              </DialogTitle>
              <span className="text-text-muted tabular text-xs">
                {blocked.length} / {BLOCKED_LIMIT}
              </span>
            </div>
            <DialogDescription className="text-text-dim mt-1 text-sm text-pretty">
              Hidden from browse, home rows, For You and chat picks. Searching a
              game by name still finds it.
            </DialogDescription>
          </div>
          <BlockCombobox has={has} onPick={block} isFull={isFull} />
        </div>
        <div className="border-stroke-subtle min-h-0 flex-1 overflow-y-auto border-t px-5 pt-4 pb-5">
          <BlockedList blocked={blocked} onRemove={unblock} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NeverShowDialog;
