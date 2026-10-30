import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Ban, Check, Search, X } from "lucide-react";
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

const byName = (a, b) => a.name.localeCompare(b.name);

// One toggle: on means "never show"
function BlockChip({ item, on, disabled, onToggle }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled && !on}
      onClick={onToggle}
      className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-sm font-semibold transition-colors duration-120 disabled:cursor-not-allowed disabled:opacity-40 max-sm:min-h-11 ${
        on
          ? "border-pulse-error/60 bg-pulse-error/15 text-text-main"
          : "border-stroke-subtle text-text-dim hover:border-stroke-medium hover:text-text-main"
      }`}
    >
      {on && (
        <Ban className="text-pulse-error h-3.5 w-3.5" aria-hidden="true" />
      )}
      {item.name}
    </button>
  );
}

function useDebounced(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function NeverShowPanel() {
  const { blocked, has, block, unblock, isFull } = useBlockedTags();
  const { data: genres } = useGetGenres();
  const { data: themes } = useGetThemes();
  const [text, setText] = useState("");
  const query = useDebounced(text.trim(), 300);

  const genreItems = (Array.isArray(genres) ? genres : [])
    .map(({ id, name }) => ({ kind: "genre", id, name }))
    .sort(byName);
  const themeItems = (Array.isArray(themes) ? themes : [])
    .filter(({ id }) => !HIDDEN_THEMES.has(id))
    .map(({ id, name }) => ({ kind: "theme", id, name }))
    .sort(byName);

  const search = useQuery({
    queryKey: ["blocked_tags", "search", query.toLowerCase()],
    queryFn: () => searchBlockOptions(query),
    enabled: query.length >= 2,
    staleTime: 10 * 60 * 1000,
  });
  const needle = query.toLowerCase();
  const results =
    query.length >= 2
      ? [
          ...[...genreItems, ...themeItems].filter((item) =>
            item.name.toLowerCase().includes(needle),
          ),
          ...(search.data || []),
        ]
      : [];

  const toggle = (item) => (has(item) ? unblock(item) : block(item));

  return (
    <div className="flex max-h-[min(70dvh,40rem)] flex-col gap-5 overflow-y-auto px-5 pt-1 pb-5">
      <section aria-labelledby="never-show-blocked">
        <h3
          id="never-show-blocked"
          className="text-text-dim tabular mb-2 text-xs font-semibold"
        >
          Never shown · {blocked.length} of {BLOCKED_LIMIT}
        </h3>
        {blocked.length ? (
          <ul className="flex flex-wrap gap-2">
            {blocked.map((item) => (
              <li key={blockKey(item)}>
                <button
                  type="button"
                  onClick={() => unblock(item)}
                  aria-label={`Show ${item.name} again`}
                  className="border-pulse-error/60 bg-pulse-error/15 text-text-main hover:bg-pulse-error/25 inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-md border pr-2 pl-3 text-sm font-semibold max-sm:min-h-11"
                >
                  <span className="text-text-dim text-xs font-normal">
                    {BLOCK_KINDS[item.kind].label}
                  </span>
                  {item.name}
                  <X className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-dim text-sm">
            Nothing yet. Pick a genre below or search for a tag or studio.
          </p>
        )}
      </section>

      <section aria-labelledby="never-show-search">
        <label
          id="never-show-search"
          htmlFor="never-show-input"
          className="text-text-dim mb-2 block text-xs font-semibold"
        >
          Search genres, themes, tags and studios
        </label>
        <div className="relative">
          <Search
            className="text-text-dim pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            id="never-show-input"
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Survivors like, Ubisoft, Horror…"
            autoComplete="off"
            className="glass-input h-10 w-full pl-9 text-sm"
          />
        </div>
        {query.length >= 2 && (
          <div className="mt-2" aria-live="polite">
            {results.length ? (
              <ul className="panel divide-stroke-subtle divide-y overflow-hidden">
                {results.map((item) => {
                  const on = has(item);
                  return (
                    <li key={blockKey(item)}>
                      <button
                        type="button"
                        aria-pressed={on}
                        disabled={isFull && !on}
                        onClick={() => toggle(item)}
                        className="hover:bg-bg-raised flex min-h-11 w-full cursor-pointer items-center gap-3 px-3 py-2 text-left text-sm disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <span className="text-text-dim w-14 shrink-0 text-xs">
                          {BLOCK_KINDS[item.kind].label}
                        </span>
                        <span className="text-text-main min-w-0 flex-1 truncate font-semibold">
                          {item.name}
                        </span>
                        {on ? (
                          <span className="text-pulse-error flex items-center gap-1 text-xs font-semibold">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            Never shown
                          </span>
                        ) : (
                          <span className="text-text-dim text-xs">
                            Never show
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-text-dim text-sm">
                {search.isFetching
                  ? "Searching…"
                  : `Nothing matches "${query}".`}
              </p>
            )}
          </div>
        )}
      </section>

      <section aria-labelledby="never-show-genres">
        <h3
          id="never-show-genres"
          className="text-text-dim mb-2 text-xs font-semibold"
        >
          Genres
        </h3>
        <div className="flex flex-wrap gap-2">
          {genreItems.map((item) => (
            <BlockChip
              key={blockKey(item)}
              item={item}
              on={has(item)}
              disabled={isFull}
              onToggle={() => toggle(item)}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="never-show-themes">
        <h3
          id="never-show-themes"
          className="text-text-dim mb-2 text-xs font-semibold"
        >
          Themes
        </h3>
        <div className="flex flex-wrap gap-2">
          {themeItems.map((item) => (
            <BlockChip
              key={blockKey(item)}
              item={item}
              on={has(item)}
              disabled={isFull}
              onToggle={() => toggle(item)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// "Never show": genres, themes, tags and studios left out of every list,
// row and pick. Searching a game by name still finds it.
function NeverShowDialog({ trigger }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        overlayClassName="confirm-overlay"
        className="log-panel bg-bg-surface border-stroke-medium gap-0 overflow-hidden rounded-2xl border p-0 shadow-[var(--shadow-float)] max-sm:top-auto max-sm:bottom-0 max-sm:max-w-full max-sm:translate-y-0 max-sm:rounded-b-none sm:max-w-[36rem]"
      >
        <div className="px-5 pt-5 pr-12 pb-4">
          <DialogTitle className="text-text-main text-lg leading-tight font-semibold">
            Never show
          </DialogTitle>
          <DialogDescription className="text-text-dim mt-1 text-sm">
            Games with these stay out of browse, home rows, For You and the
            chat's picks. Searching a game by name still finds it.
          </DialogDescription>
        </div>
        <NeverShowPanel />
      </DialogContent>
    </Dialog>
  );
}

export default NeverShowDialog;
