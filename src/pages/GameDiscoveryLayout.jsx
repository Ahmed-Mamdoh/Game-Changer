import Filters from "@/features/games/ui/Filters";
import FullPagination from "@/features/games/ui/FullPagination";
import { UPCOMING_FILTERS } from "@/features/games/hooks/useFilterMenus";
import { useGetNumberOfResults } from "@/features/games/hooks/useGetNumberOfResults";
import Spinner from "@/ui/Spinner";
import { Suspense, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";

const PAGES = {
  "/games/allGames": { title: "Browse games", noun: "games", filters: {} },
  "/games/upcomingGames": {
    title: "Upcoming",
    noun: "upcoming games",
    filters: UPCOMING_FILTERS,
  },
  "/games/freeGames": {
    title: "Free to keep",
    note: "Free on Steam, Epic and GOG for a limited time. Claim them before the timer ends.",
  },
};

function ResultCount({ path, noun }) {
  const { data, isLoading } = useGetNumberOfResults(path);
  if (isLoading || data?.count == null) return <p className="h-6" />;
  return (
    <p className="tabular">
      {data.count.toLocaleString()} {noun}
    </p>
  );
}

function GameDiscoveryLayout() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const page = PAGES[location.pathname] || {};
  const sentinelRef = useRef(null);
  const [stuck, setStuck] = useState(false);

  // The filter row is stuck once the spot it started from scrolls under the nav
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !page.filters) return setStuck(false);
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: "-76px 0px 0px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [page.filters]);
  const paged = location.pathname !== "/games/freeGames";

  return (
    <div className="min-h-[100dvh] pt-24">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <header
          className={`border-stroke-subtle bg-bg-surface/80 border px-4 py-5 backdrop-blur-md md:px-6 ${
            page.filters ? "rounded-t-xl border-b-0" : "rounded-xl"
          }`}
        >
          <h1 className="mb-1 text-[length:var(--font-size-title)] font-semibold tracking-tight">
            {search && location.pathname === "/games/allGames"
              ? `Results for “${search}”`
              : page.title}
          </h1>
          {page.noun ? (
            <ResultCount path={location.pathname} noun={page.noun} />
          ) : (
            page.note && <p className="max-w-[65ch]">{page.note}</p>
          )}
        </header>
      </div>

      {/* Only the filter row sticks, so the page height never changes on scroll */}
      {page.filters && (
        <>
          <div ref={sentinelRef} className="h-px" aria-hidden="true" />
          <div className="sticky top-[4.75rem] z-30 mx-auto -mt-px w-full max-w-[1440px] px-4 md:px-8">
            <Filters
              {...page.filters}
              className={`border-stroke-subtle border px-4 py-3 backdrop-blur-md transition-[background-color,border-radius,box-shadow] duration-200 md:px-6 ${
                stuck
                  ? "bg-bg-surface/95 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
                  : "bg-bg-surface/80 rounded-b-xl"
              }`}
            />
          </div>
        </>
      )}

      <Suspense fallback={<Spinner />} key={location.pathname}>
        <Outlet />
      </Suspense>
      {paged && <FullPagination />}
    </div>
  );
}

export default GameDiscoveryLayout;
