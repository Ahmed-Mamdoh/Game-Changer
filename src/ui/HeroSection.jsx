import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { UserToken } from "@/hooks/useUserToken";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { STATUS_LABELS } from "@/features/games/hooks/useQuickStatus";
import { backdropSrcSet, coverUrlOf, pickBackdrop } from "@/utils/igdbImage";

const SHELF_SIZE = 8;

// Console home: the focused game's art fills the stage. Moving across the
// cover shelf (hover, focus or arrow keys) swaps the backdrop.
function HeroSection({ popularGames = [], isLoading }) {
  const navigate = useNavigate();
  const userToken = UserToken();
  const userId = userToken?.user?.id;
  const { data: userGamesData } = useGetUserGames(userId);

  const playing = (userGamesData?.user_games || [])
    .filter((g) => g.status === "playing")
    .map((g) => ({
      ...g.game,
      id: g.game_id,
      status: g.status,
      hours: g.hours_played || 0,
    }));

  const isContinue = Boolean(userId) && playing.length > 0;
  // Playing games come first; popular games fill the rest of the shelf so a
  // short library doesn't leave it looking empty
  const playingShelf = isContinue
    ? playing.filter((g) => g?.id).slice(0, SHELF_SIZE)
    : [];
  const playingIds = new Set(playingShelf.map((g) => g.id));
  const popularShelf = popularGames
    .filter((g) => g?.id && !playingIds.has(g.id))
    .slice(0, SHELF_SIZE - playingShelf.length);
  const shelf = [...playingShelf, ...popularShelf];
  const groups = [
    { label: "Continue playing", games: playingShelf, offset: 0 },
    { label: "Popular now", games: popularShelf, offset: playingShelf.length },
  ].filter((g) => g.games.length);

  const [focusIndex, setFocusIndex] = useState(0);
  const tileRefs = useRef([]);
  const index = Math.min(focusIndex, Math.max(shelf.length - 1, 0));
  const focused = shelf[index];

  function onShelfKey(e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      e.key === "ArrowRight"
        ? Math.min(index + 1, shelf.length - 1)
        : Math.max(index - 1, 0);
    tileRefs.current[next]?.focus();
  }

  const year = focused?.first_release_date
    ? new Date(focused.first_release_date * 1000).getFullYear()
    : null;
  const genres = (focused?.genres || [])
    .slice(0, 2)
    .map((g) => (typeof g === "string" ? g : g.name))
    .join(" · ");

  return (
    <section
      aria-label={isContinue ? "Continue playing" : "Popular now"}
      className="relative isolate flex min-h-dvh w-full flex-col overflow-hidden"
    >
      {/* Backdrops: all mounted, only the focused one visible, so swaps are instant */}
      <div
        className="art-fade absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {shelf.map((game, i) => (
          <img
            key={game.id}
            src={pickBackdrop(game)}
            srcSet={backdropSrcSet(game)}
            sizes="max(100vw, 178vh)"
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "low"}
            className={`absolute inset-0 h-full w-full object-cover brightness-90 transition-opacity duration-500 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent" />
      </div>

      {/* Focused game */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 pt-22 pb-4 md:px-8">
        {!userId && (
          <p className="text-text-main mb-4 max-w-[34ch] text-lg font-semibold md:text-xl">
            Track every game you play. Find the one you play next.
          </p>
        )}

        {focused ? (
          <div className="max-w-2xl">
            <p className="text-text-dim tabular mb-2 text-sm">
              {focused.status
                ? `${STATUS_LABELS[focused.status]} · ${focused.hours} h played`
                : [year, genres].filter(Boolean).join(" · ")}
            </p>
            {/* Two lines reserved so long names don't push the page around on hover */}
            <h1 className="mb-6 line-clamp-2 min-h-[2lh] text-balance">
              {focused.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              {userId ? (
                <button
                  className="btn-primary h-11 px-6"
                  onClick={() => navigate(`/game/${focused.id}`)}
                >
                  {focused.status ? "Continue" : "Open game"}
                </button>
              ) : (
                <button
                  className="btn-primary h-11 px-6"
                  onClick={() => navigate("/auth")}
                >
                  Start your library, free
                </button>
              )}
              <Link
                to={userId ? "/account" : `/game/${focused.id}`}
                className="text-text-main inline-flex max-w-full min-w-0 items-center gap-1 text-sm font-semibold hover:underline hover:underline-offset-4"
              >
                <span className="truncate">
                  {userId ? "Your library" : `About ${focused.name}`}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </div>
        ) : (
          isLoading && (
            <div className="max-w-2xl" aria-hidden="true">
              <div className="bg-bg-chip mb-3 h-4 w-40 animate-pulse rounded-sm" />
              <div className="bg-bg-chip h-14 w-96 max-w-full animate-pulse rounded-md" />
            </div>
          )
        )}
      </div>

      {/* Shelf */}
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-6 md:px-8">
        <div
          role="listbox"
          aria-label={isContinue ? "Continue playing" : "Popular now"}
          onKeyDown={onShelfKey}
          // Inset padding leaves room for the focused tile's scale + outline,
          // which the scroll container would otherwise clip
          className="no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 py-3 md:-mx-3 md:px-3"
        >
          {groups.map((group, g) => (
            <div key={group.label} className="flex shrink-0 gap-5">
              {g > 0 && (
                <div
                  className="bg-stroke-medium w-px self-stretch"
                  aria-hidden="true"
                />
              )}
              <div role="group" aria-label={group.label}>
                <h2 className="text-text-dim mb-3 text-sm font-semibold tracking-normal">
                  {group.label}
                </h2>
                <div className="flex gap-3">
                  {group.games.map((game, j) => {
                    const i = group.offset + j;
                    return (
                      <button
                        key={game.id}
                        ref={(el) => (tileRefs.current[i] = el)}
                        role="option"
                        aria-selected={i === index}
                        aria-label={game.name}
                        onMouseEnter={() => setFocusIndex(i)}
                        onFocus={() => setFocusIndex(i)}
                        onClick={() => navigate(`/game/${game.id}`)}
                        className={`relative aspect-[3/4] w-24 shrink-0 cursor-pointer overflow-hidden rounded-md outline-2 outline-offset-[3px] transition-[transform,outline-color] duration-150 ease-out md:w-28 ${
                          i === index
                            ? "outline-pulse-accent scale-[1.04]"
                            : "outline-transparent"
                        }`}
                      >
                        <img
                          src={coverUrlOf(game)}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && !shelf.length && (
            <div className="flex gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-bg-chip aspect-[3/4] w-24 shrink-0 animate-pulse rounded-md md:w-28"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
