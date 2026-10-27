import FullPagination from "@/features/games/ui/FullPagination";
import { useGetNumberOfResults } from "@/features/games/hooks/useGetNumberOfResults";
import Spinner from "@/ui/Spinner";
import { Suspense } from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";

const PAGES = {
  "/games/allGames": { title: "Browse games", noun: "games" },
  "/games/upcomingGames": { title: "Upcoming", noun: "upcoming games" },
  "/games/freeGames": {
    title: "Free to keep",
    note: "Free on Steam, Epic and GOG for a limited time. Claim them before the timer ends.",
  },
  "/games/forYou": {
    title: "For you",
    note: "Picks based on the games in your library.",
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
  const paged =
    location.pathname !== "/games/freeGames" &&
    location.pathname !== "/games/forYou";

  return (
    <div className="min-h-[100dvh] pt-24">
      <header className="mx-auto w-full max-w-[1440px] px-4 pb-5 md:px-8">
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

      <Suspense fallback={<Spinner />} key={location.pathname}>
        <Outlet />
      </Suspense>
      {paged && <FullPagination />}
    </div>
  );
}

export default GameDiscoveryLayout;
