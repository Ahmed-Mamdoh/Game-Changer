import { useCallback, useEffect, useRef, useState } from "react";

// Tracks a horizontal row's scroll position so prev/next buttons can page it.
// `count` re-measures when the row's items change (data loaded, etc.).
export function useRowScroll(count) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ prev: false, next: false });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ prev: el.scrollLeft > 1, next: el.scrollLeft < max - 1 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure, count]);

  // One click pages most of a viewport, leaving a sliver of context
  const page = useCallback((dir) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollBy({
      left: dir * el.clientWidth * 0.85,
      behavior: reduce ? "auto" : "smooth",
    });
  }, []);

  return { ref, canPrev: edges.prev, canNext: edges.next, page };
}
