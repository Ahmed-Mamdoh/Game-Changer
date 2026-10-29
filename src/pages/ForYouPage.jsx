import { useGetRecommendations } from "@/features/games/hooks/useGetRecommendations";
import {
  STATUS_LABELS,
  useQuickStatus,
} from "@/features/games/hooks/useQuickStatus";
import { useRemoveGame } from "@/features/games/hooks/useRemoveGame";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { UserToken } from "@/hooks/useUserToken";
import BackdropImage from "@/ui/BackdropImage";
import { coverUrlOf } from "@/utils/igdbImage";
import {
  ArrowRight,
  Bookmark,
  Check,
  RefreshCw,
  Star,
  ThumbsDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";

const SEO = (
  <Helmet>
    <title>For You | Game-Changer</title>
    <meta
      name="description"
      content="Personal game picks on Game-Changer, built from the games, ratings and hours in your library."
    />
    <meta
      property="og:description"
      content="Personal game picks on Game-Changer, built from the games, ratings and hours in your library."
    />
    <link
      rel="canonical"
      href="https://game-changer-gg.vercel.app/games/forYou"
    />
  </Helmet>
);

const yearOf = (game) =>
  game?.first_release_date
    ? new Date(game.first_release_date * 1000).getFullYear()
    : null;

// How the pick ties back to the library, in the player's words
function tieOf(game) {
  const source = game.becauseOf?.name;
  if (!source) return null;
  if (game.link === "series") return `Same series as ${source}`;
  if (game.link === "studio")
    return game.studioName
      ? `From ${game.studioName}, like ${source}`
      : `Same studio as ${source}`;
  return `Because you played ${source}`;
}

function PageHeader({ onRefresh, isRefreshing, disabled }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-[length:var(--font-size-title)] leading-tight font-semibold tracking-tight">
        For you
      </h1>
      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          disabled={disabled}
          className="btn-on-art h-9 px-4 disabled:cursor-wait disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin motion-reduce:animate-none" : ""}`}
          />
          {isRefreshing ? "Refreshing" : "Refresh picks"}
        </button>
      )}
    </div>
  );
}

// Wishlist, played and "not for me" for the focused pick. Keyed by game so
// the remove hook always points at the game on screen.
function PickActions({ game, onDismiss }) {
  const { statusOf, setStatus } = useQuickStatus();
  const { removeGame } = useRemoveGame(game);
  const status = statusOf(game.id);
  const isWishlisted = status === "to play";
  const isPlayed = status === "playing" || status === "finished";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link to={`/game/${game.id}`} className="btn-primary h-11 px-6">
        Open game
      </Link>

      {isPlayed ? (
        <Link to={`/game/${game.id}`} className="btn-on-art h-11 px-4">
          <Star className="h-4 w-4" />
          Rate it
        </Link>
      ) : (
        <>
          <button
            type="button"
            aria-pressed={isWishlisted}
            onClick={() =>
              isWishlisted ? removeGame("wishlist") : setStatus(game, "to play")
            }
            className="btn-on-art h-11 px-4"
          >
            <Bookmark
              className={`text-pulse-warning h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
            />
            {isWishlisted ? "Wishlisted" : "Wishlist"}
          </button>
          <button
            type="button"
            onClick={() => setStatus(game, "finished")}
            className="btn-on-art h-11 px-4"
          >
            <Check className="text-pulse-success h-4 w-4" />
            Played it
          </button>
        </>
      )}

      {!status && (
        <button
          type="button"
          onClick={() => onDismiss(game)}
          className="btn-on-art h-11 px-4"
        >
          <ThumbsDown className="h-4 w-4" />
          Not for me
        </button>
      )}
    </div>
  );
}

function FocusedPick({ game, onDismiss }) {
  const { statusOf } = useQuickStatus();
  const status = statusOf(game.id);
  const tie = tieOf(game);
  const facts = [
    yearOf(game),
    (game.genres || [])
      .slice(0, 2)
      .map((genre) => genre.name)
      .join(" · "),
  ].filter(Boolean);

  return (
    <div className="max-w-2xl">
      {/* Two lines reserved and the name sits at the bottom of them, so long
          names don't push the page around and short ones hug the facts */}
      <div className="h1 mb-4 flex min-h-[2lh] items-end">
        <h2 className="h1 line-clamp-2 text-balance">{game.name}</h2>
      </div>

      <p className="text-text-dim tabular mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <span className="text-text-brand font-semibold">
          {game.matchScore}% match
        </span>
        {facts.map((fact) => (
          <span key={fact} className="flex items-center gap-2">
            <span aria-hidden="true">·</span>
            {fact}
          </span>
        ))}
        {status && (
          <span className="text-text-main flex items-center gap-2 font-semibold">
            <span aria-hidden="true" className="text-text-dim font-normal">
              ·
            </span>
            {STATUS_LABELS[status]}
          </span>
        )}
      </p>

      {tie && (
        <p className="text-text-main mb-4 flex items-center gap-3 text-sm font-semibold">
          {game.becauseOf.cover && (
            <img
              src={coverUrlOf({ cover: game.becauseOf.cover }, "t_cover_small")}
              alt=""
              className="aspect-[3/4] w-8 rounded-sm object-cover ring-1 ring-white/15"
            />
          )}
          {tie}
        </p>
      )}

      {/* Fixed height for three lines, so moving across the shelf doesn't
          make the actions jump */}
      <div className="mb-7 min-h-[calc(1.55em*3)] text-lg leading-[1.55]">
        <p className="text-text-main line-clamp-3 max-w-[58ch]">
          {game.recommendationReason}
        </p>
      </div>

      <PickActions key={game.id} game={game} onDismiss={onDismiss} />
    </div>
  );
}

function PicksStage({ picks, onDismiss, header }) {
  const [focusIndex, setFocusIndex] = useState(0);
  const tileRefs = useRef([]);
  const index = Math.min(focusIndex, Math.max(picks.length - 1, 0));
  const focused = picks[index];

  function onShelfKey(e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      e.key === "ArrowRight"
        ? Math.min(index + 1, picks.length - 1)
        : Math.max(index - 1, 0);
    setFocusIndex(next);
    tileRefs.current[next]?.focus();
  }

  return (
    <section
      aria-label="Your picks"
      className="relative isolate flex min-h-dvh w-full flex-col overflow-hidden"
    >
      {/* Backdrops: all mounted, only the focused one visible, so swaps are instant */}
      <div
        className="art-fade absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {picks.map((game, i) => (
          <BackdropImage
            key={game.id}
            game={game}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "low"}
            className={`absolute inset-0 transition-opacity duration-500 ease-out motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            imgClassName="brightness-90"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 pt-22 md:px-8">
        {header}
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 py-10 md:px-8">
        {focused && <FocusedPick game={focused} onDismiss={onDismiss} />}
      </div>

      {/* Shelf: pressing a cover focuses it; "Open game" opens it */}
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-8 md:px-8">
        <h2 className="text-text-dim mb-3 text-sm font-semibold tracking-normal">
          <span className="tabular">{picks.length}</span> picks for you
        </h2>
        <div
          role="group"
          aria-label="Picks"
          onKeyDown={onShelfKey}
          // Inset padding leaves room for the focused tile's outline, which
          // the scroll container would otherwise clip
          className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 py-1.5 md:-mx-3 md:gap-5 md:px-3"
        >
          {picks.map((game, i) => (
            <button
              key={game.id}
              ref={(el) => (tileRefs.current[i] = el)}
              type="button"
              aria-pressed={i === index}
              aria-label={`${game.name}, ${game.matchScore}% match`}
              onMouseEnter={() => setFocusIndex(i)}
              onFocus={() => setFocusIndex(i)}
              onClick={() => setFocusIndex(i)}
              className="group flex w-24 shrink-0 cursor-pointer flex-col gap-1.5 text-left md:w-28"
            >
              <span
                className={`bg-bg-raised block aspect-[3/4] w-full overflow-hidden rounded-md outline-2 outline-offset-[3px] transition-[outline-color] duration-150 ease-out ${
                  i === index
                    ? "outline-pulse-accent"
                    : "outline-transparent group-hover:outline-white/25"
                }`}
              >
                {coverUrlOf(game) && (
                  <img
                    src={coverUrlOf(game)}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </span>
              <span
                className={`tabular text-xs font-semibold ${
                  i === index ? "text-text-brand" : "text-text-dim"
                }`}
              >
                {game.matchScore}%
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// What the picks are built from: the library size and the heaviest tags
function TasteStrip({ tags, libraryCount }) {
  if (!tags.length) return null;
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 pt-6 pb-20 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:gap-8">
        <div className="md:w-80 md:shrink-0">
          <h2 className="mb-1 text-balance">What your picks lean on</h2>
          <p className="text-sm">
            <span className="tabular">{libraryCount}</span> games in your
            library, weighted by your ratings, hours and favorites. Dropped
            games count against their tags.
          </p>
        </div>
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag.key}
              className="bg-bg-chip text-text-main rounded-md px-3 py-1.5 text-sm font-semibold first-letter:uppercase"
            >
              {tag.name}
            </li>
          ))}
        </ul>
      </div>
      <Link to="/account" className="link-quiet mt-6">
        Your library
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

function StageSkeleton({ header }) {
  return (
    <section
      aria-label="Loading your picks"
      aria-busy="true"
      className="relative flex min-h-dvh w-full flex-col"
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-22 md:px-8">
        {header}
      </div>
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 py-10 md:px-8">
        <div className="max-w-2xl" aria-hidden="true">
          <div className="bg-bg-chip mb-5 h-14 w-[28rem] max-w-full animate-pulse rounded-md motion-reduce:animate-none" />
          <div className="bg-bg-chip mb-6 h-4 w-56 animate-pulse rounded-sm motion-reduce:animate-none" />
          <div className="bg-bg-chip mb-2.5 h-5 w-full animate-pulse rounded-sm motion-reduce:animate-none" />
          <div className="bg-bg-chip mb-8 h-5 w-4/5 animate-pulse rounded-sm motion-reduce:animate-none" />
          <p className="text-text-dim text-sm">
            Reading your library and lining up games that fit it.
          </p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-8 md:px-8">
        <div className="no-scrollbar flex gap-4 overflow-hidden md:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-bg-chip aspect-[3/4] w-24 shrink-0 animate-pulse rounded-md motion-reduce:animate-none md:w-28"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Message({ title, children, action }) {
  return (
    <div className="mx-auto flex min-h-[70dvh] w-full max-w-[1440px] flex-col justify-center px-4 pt-22 md:px-8">
      <div className="max-w-xl">
        <h2 className="mb-2">{title}</h2>
        <p className="mb-6 max-w-[50ch]">{children}</p>
        {action}
      </div>
    </div>
  );
}

function ForYouPage() {
  const user_id = UserToken()?.user?.id;
  const { data: userGamesResponse, isLoading: isLoadingUserGames } =
    useGetUserGames(user_id);
  const libraryCount = userGamesResponse?.user_games?.length || 0;
  const {
    recommendations,
    tasteTags,
    isLoading,
    isRefreshing,
    error,
    refresh,
    dismiss,
    undoDismiss,
  } = useGetRecommendations();

  // Back to the top when a fresh set arrives
  useEffect(() => {
    if (!isRefreshing) window.scrollTo({ top: 0 });
  }, [isRefreshing]);

  if (!user_id) return <Navigate to="/auth" replace />;

  function onDismiss(game) {
    const index = dismiss(game);
    toast(
      (t) => (
        <span className="flex items-center gap-3">
          <span>{game.name} won't come up again.</span>
          <button
            type="button"
            className="text-text-brand cursor-pointer font-semibold hover:underline hover:underline-offset-4"
            onClick={() => {
              undoDismiss(game, index);
              toast.dismiss(t.id);
            }}
          >
            Undo
          </button>
        </span>
      ),
      { duration: 6000 },
    );
  }

  const header = (
    <PageHeader
      onRefresh={recommendations?.length ? refresh : undefined}
      isRefreshing={isRefreshing}
      disabled={isLoading || isRefreshing}
    />
  );

  if (isLoadingUserGames || (libraryCount > 0 && isLoading))
    return (
      <>
        {SEO}
        <StageSkeleton header={<PageHeader />} />
      </>
    );

  if (libraryCount === 0)
    return (
      <>
        {SEO}
        <Message
          title="Log a few games first"
          action={
            <Link to="/games/allGames" className="btn-primary">
              Browse games
            </Link>
          }
        >
          Picks come from the games in your library. Add three or more you've
          played, with ratings, and your picks show up here.
        </Message>
      </>
    );

  if (error && !recommendations?.length)
    return (
      <>
        {SEO}
        <Message
          title="Your picks didn't load"
          action={
            <button onClick={refresh} className="btn-primary">
              Try again
            </button>
          }
        >
          Game data didn't come back in time. Your library is fine; try again in
          a moment.
        </Message>
      </>
    );

  if (!recommendations?.length)
    return (
      <>
        {SEO}
        <Message
          title="No picks this time"
          action={
            <button onClick={refresh} className="btn-primary">
              Refresh picks
            </button>
          }
        >
          Nothing new fit your library well enough. Log or rate a few more
          games, or refresh to recalculate.
        </Message>
      </>
    );

  return (
    <>
      {SEO}
      <PicksStage
        picks={recommendations}
        onDismiss={onDismiss}
        header={header}
      />
      <TasteStrip tags={tasteTags} libraryCount={libraryCount} />
    </>
  );
}

export default ForYouPage;
