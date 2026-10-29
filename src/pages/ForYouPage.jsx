import { useGetRecommendations } from "@/features/games/hooks/useGetRecommendations";
import {
  STATUS_LABELS,
  useQuickStatus,
} from "@/features/games/hooks/useQuickStatus";
import { useRemoveGame } from "@/features/games/hooks/useRemoveGame";
import LogGameDialog from "@/features/games/components/LogGameDialog";
import {
  PLATFORM_FAMILIES,
  useMyPlatforms,
} from "@/features/games/hooks/useMyPlatforms";
import { PLATFORM_ICONS } from "@/features/games/ui/filterIcons";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import { UserToken } from "@/hooks/useUserToken";
import BackdropImage from "@/ui/BackdropImage";
import { coverUrlOf } from "@/utils/igdbImage";
import {
  ArrowRight,
  Bookmark,
  Check,
  RefreshCw,
  ThumbsDown,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";

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

// Toggles for the platforms the player owns; none on means every platform
function PlatformPicker({ selected, onToggle }) {
  return (
    <div className="flex items-center gap-3">
      <span id="plays-on" className="text-text-dim text-sm font-semibold">
        Plays on
      </span>
      <div role="group" aria-labelledby="plays-on" className="flex gap-1.5">
        {PLATFORM_FAMILIES.map((family) => {
          const Icon = PLATFORM_ICONS[family.ids[0]];
          const on = selected.includes(family.key);
          return (
            <button
              key={family.key}
              type="button"
              aria-pressed={on}
              title={family.name}
              onClick={() => onToggle(family.key)}
              className={`btn-on-art h-9 px-3 transition-[background-color,border-color,color] ${
                on
                  ? "border-pulse-accent text-text-main"
                  : "text-text-dim hover:text-text-main"
              }`}
            >
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="max-sm:sr-only">{family.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PageHeader({
  onRefresh,
  isRefreshing,
  disabled,
  position,
  platforms,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
      <div className="flex items-baseline gap-3">
        <h1 className="text-[length:var(--font-size-title)] leading-tight font-semibold tracking-tight">
          For you
        </h1>
        {position && (
          <span className="text-text-dim tabular text-sm font-semibold">
            {position.index + 1} of {position.total}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        {platforms && (
          <PlatformPicker
            selected={platforms.selected}
            onToggle={platforms.toggle}
          />
        )}
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
    </div>
  );
}

// Open, wishlist, log as played and "not for me" for the focused pick. Keyed
// by game so the hooks always point at the game on screen.
function PickActions({ game, onDismiss, onLogged }) {
  const user_id = UserToken()?.user?.id;
  const { data } = useGetUserGames(user_id);
  const { statusOf, setStatus } = useQuickStatus();
  const { removeGame } = useRemoveGame(game);
  const status = statusOf(game.id);
  const isWishlisted = status === "to play";
  // A wishlisted pick already has a library row; the log updates it
  const userGame = data?.user_games?.find((g) => g.game_id === game.id);
  const userGameReview = userGame?.game?.reviews?.find(
    (review) => review.user_id === user_id,
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link to={`/game/${game.id}`} className="btn-primary h-11 px-6">
        Open game
      </Link>

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

      {/* Played it asks how it went: a played game can be a hated one */}
      <LogGameDialog
        game={game}
        userGame={userGame}
        userGameReview={userGameReview}
        defaultStatus="finished"
        requireRating
        onSaved={onLogged}
        trigger={
          <button type="button" className="btn-on-art h-11 px-4">
            <Check className="text-pulse-success h-4 w-4" />
            Played it
          </button>
        }
      />

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

function FocusedPick({ game, onDismiss, onLogged, reasonsPending }) {
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
      <div className="h1 short:mb-3 short:min-h-0 mb-4 flex min-h-[2lh] items-end">
        <h2 className="h1 short:text-5xl line-clamp-2 text-balance">
          {game.name}
        </h2>
      </div>

      <div className="short:mb-3 mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        {/* The match is this page's own signature: the home stage has none */}
        <p className="text-text-brand tabular flex items-baseline gap-1.5 font-semibold">
          <span className="text-4xl leading-none font-extrabold tracking-tight">
            {game.matchScore}%
          </span>
          <span className="text-sm">match</span>
        </p>
        <p className="text-text-dim tabular flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          {facts.map((fact, i) => (
            <span key={fact} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">·</span>}
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
      </div>

      {tie && (
        <p className="text-text-main short:mb-3 mb-4 flex items-center gap-3 text-sm font-semibold">
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
      <div className="short:mb-5 short:sm:min-h-[calc(1.55em*2)] mb-7 min-h-[calc(1.55em*4)] text-lg leading-[1.55] sm:min-h-[calc(1.55em*3)]">
        {reasonsPending ? (
          <div aria-live="polite" className="max-w-[58ch]">
            <div aria-hidden="true">
              <div className="bg-bg-chip/80 mt-1.5 mb-3 h-4 w-full animate-pulse rounded-sm motion-reduce:animate-none" />
              <div className="bg-bg-chip/80 mb-3 h-4 w-3/4 animate-pulse rounded-sm motion-reduce:animate-none" />
            </div>
            <p className="text-text-dim text-sm">Writing why this fits you</p>
          </div>
        ) : (
          <p className="text-text-main line-clamp-4 max-w-[58ch] sm:line-clamp-3">
            {game.recommendationReason}
          </p>
        )}
      </div>

      <PickActions
        key={game.id}
        game={game}
        onDismiss={onDismiss}
        onLogged={onLogged}
      />
    </div>
  );
}

function PicksStage({
  picks,
  index,
  setFocusIndex,
  onDismiss,
  onLogged,
  reasonsPending,
  header,
}) {
  const navigate = useNavigate();
  const tileRefs = useRef([]);
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
      // One screen tall, like the other stages; short screens tighten below
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

      <div className="short:pt-[4.5rem] mx-auto w-full max-w-[1440px] px-4 pt-22 md:px-8">
        {header}
      </div>

      <div className="short:py-3 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 py-10 md:px-8">
        {focused && (
          <FocusedPick
            game={focused}
            onDismiss={onDismiss}
            onLogged={onLogged}
            reasonsPending={reasonsPending}
          />
        )}
      </div>

      {/* Shelf: hovering or pressing a cover focuses it; pressing the focused
          cover opens the game. On touch the first tap focuses, the next opens. */}
      <div className="short:pb-4 mx-auto w-full max-w-[1440px] px-4 pb-8 md:px-8">
        {/* The header counter already says how many; short screens drop this line */}
        <h2 className="text-text-dim short:sr-only mb-3 text-sm font-semibold tracking-normal">
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
              aria-label={`${game.name}, ${game.matchScore}% match${i === index ? ", press to open" : ""}`}
              onMouseEnter={() => setFocusIndex(i)}
              onFocus={() => setFocusIndex(i)}
              onClick={() =>
                i === index ? navigate(`/game/${game.id}`) : setFocusIndex(i)
              }
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

function StageSkeleton({ header, note }) {
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
            {note || "Reading your library and lining up games that fit it."}
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

function Message({ title, children, action, header }) {
  return (
    <div className="mx-auto flex min-h-[70dvh] w-full max-w-[1440px] flex-col px-4 pt-22 md:px-8">
      {header}
      <div className="my-auto max-w-xl py-10">
        <h2 className="mb-2">{title}</h2>
        <p className="mb-6 max-w-[50ch]">{children}</p>
        {action}
      </div>
    </div>
  );
}

function ForYouPage() {
  const user_id = UserToken()?.user?.id;
  const queryClient = useQueryClient();
  const {
    data: userGamesResponse,
    isLoading: isLoadingUserGames,
    error: userGamesError,
  } = useGetUserGames(user_id);
  const libraryCount = userGamesResponse?.user_games?.length || 0;
  const platforms = useMyPlatforms();
  const {
    recommendations,
    tasteTags,
    reasonsPending,
    isLoading,
    isRefreshing,
    error,
    refresh,
    dismiss,
    undoDismiss,
  } = useGetRecommendations({ platformIds: platforms.platformIds });
  // A new set is on its way: Refresh picks, a platform change, or a log
  const isRebuilding = isRefreshing || platforms.isApplying;

  const [focusIndex, setFocusIndex] = useState(0);
  const index = Math.min(
    focusIndex,
    Math.max((recommendations?.length || 1) - 1, 0),
  );

  // A fresh set (Refresh picks, or picks recalculated after a log) starts at
  // its best pick, back at the top
  useEffect(() => {
    if (isRebuilding) return;
    setFocusIndex(0);
    window.scrollTo({ top: 0 });
  }, [isRebuilding]);

  if (!user_id) return <Navigate to="/auth" replace />;

  function onLogged() {
    toast.success("Logged. Your picks are updating with it.");
  }

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
      onRefresh={recommendations?.length || isRebuilding ? refresh : undefined}
      isRefreshing={isRebuilding}
      disabled={isLoading || isRebuilding}
      position={
        recommendations?.length && !isRebuilding
          ? { index, total: recommendations.length }
          : null
      }
      platforms={platforms}
    />
  );

  if (isLoadingUserGames || (libraryCount > 0 && isLoading))
    return (
      <>
        {SEO}
        <StageSkeleton header={<PageHeader platforms={platforms} />} />
      </>
    );

  // The old set gives way at once, so the press clearly did something
  if (isRebuilding && libraryCount > 0)
    return (
      <>
        {SEO}
        <StageSkeleton
          header={header}
          note="Recalculating your picks from your library."
        />
      </>
    );

  // A failed library load is not an empty library
  if (userGamesError && !userGamesResponse)
    return (
      <>
        {SEO}
        <Message
          title="Your library didn't load"
          action={
            <button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ["user_games", user_id],
                })
              }
              className="btn-primary"
            >
              Try again
            </button>
          }
        >
          Game data didn't come back in time, so your picks can't be built yet.
          Your library is fine; try again in a moment.
        </Message>
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
          header={header}
          title="No picks this time"
          action={
            <button onClick={refresh} className="btn-primary">
              Refresh picks
            </button>
          }
        >
          {platforms.selected.length
            ? "Nothing new on your platforms fit your library well enough. Turn on another platform, log or rate a few more games, or refresh to recalculate."
            : "Nothing new fit your library well enough. Log or rate a few more games, or refresh to recalculate."}
        </Message>
      </>
    );

  return (
    <>
      {SEO}
      <PicksStage
        picks={recommendations}
        index={index}
        setFocusIndex={setFocusIndex}
        onDismiss={onDismiss}
        onLogged={onLogged}
        reasonsPending={reasonsPending}
        header={header}
      />
      <TasteStrip tags={tasteTags} libraryCount={libraryCount} />
    </>
  );
}

export default ForYouPage;
