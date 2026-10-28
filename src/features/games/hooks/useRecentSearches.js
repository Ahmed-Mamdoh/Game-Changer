import { useCallback, useState } from "react";

const STORAGE_KEY = "gc:recent-searches";
const MAX_RECENT = 6;

// Entries are { type: "game", id, name, cover, year } or { type: "query", text }
function read() {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function write(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage blocked (private mode): recents just don't persist
  }
}

const keyOf = (item) =>
  item.type === "game" ? `game:${item.id}` : `query:${item.text.toLowerCase()}`;

// Recent header searches, kept in this browser only
export function useRecentSearches() {
  const [recent, setRecent] = useState(read);

  const add = useCallback((item) => {
    setRecent((current) => {
      const next = [
        item,
        ...current.filter((entry) => keyOf(entry) !== keyOf(item)),
      ].slice(0, MAX_RECENT);
      write(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    write([]);
    setRecent([]);
  }, []);

  return { recent, add, clear };
}
