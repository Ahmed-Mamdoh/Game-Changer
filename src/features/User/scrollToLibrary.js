// Brings the library's status tabs into view, after the tab change renders
export function scrollToLibrary() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  requestAnimationFrame(() =>
    document.getElementById("library")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    }),
  );
}
