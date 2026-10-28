import { useGetUserGame } from "@/features/User/hooks/useGetUserGame";
import { useGetUserGameReview } from "@/features/User/hooks/useGetUserGameReview";
import { UserToken } from "@/hooks/useUserToken";
import Spinner from "@/ui/Spinner";
import { stageOf } from "@/utils/gameStage";
import BackdropImage from "@/ui/BackdropImage";
import { coverUrlOf } from "@/utils/igdbImage";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatDate } from "date-fns";
import { Bookmark, Trash2 } from "lucide-react";
import { useState } from "react";
import { FaPlaystation, FaSteam, FaXbox } from "react-icons/fa";
import { SiEpicgames, SiGogdotcom } from "react-icons/si";
import { Link } from "react-router-dom";
import { useGetTimeToBeat } from "../hooks/useGetTimeToBeat";
import {
  STATUS_ICONS,
  STATUS_LABELS,
  useQuickStatus,
} from "../hooks/useQuickStatus";
import { useRemoveGame } from "../hooks/useRemoveGame";
import LogGameDialog from "./LogGameDialog";

const STORES = [
  { name: "Steam", urlPattern: "steam", icon: FaSteam },
  { name: "GOG", urlPattern: "gog", icon: SiGogdotcom },
  { name: "Epic Games", urlPattern: "epic", icon: SiEpicgames },
  { name: "PlayStation", urlPattern: "playstation", icon: FaPlaystation },
  { name: "Xbox", urlPattern: "xbox", icon: FaXbox },
];

const PLAY_STATUSES = ["playing", "finished", "dropped"];

const hoursOf = (seconds) => (seconds ? Math.round(seconds / 3600) : null);

// ["a", "b", "c"] -> "a, b and c"
const listOf = (items) =>
  items.length > 1
    ? `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`
    : items[0];

function Fact({ label, value }) {
  return (
    <div className="border-stroke-subtle flex flex-col px-4 py-2.5 sm:border-r sm:last:border-r-0">
      <span className="text-text-main tabular text-lg font-semibold">
        {value ?? "—"}
      </span>
      <span className="text-text-dim text-xs">{label}</span>
    </div>
  );
}

function TagLinks({ items, param }) {
  return items?.map((item) => (
    <Link
      key={`${param}-${item.id}`}
      to={`/games/allGames?${param}=${item.id}`}
      className="text-text-dim hover:text-text-main rounded-sm border border-white/12 bg-black/35 px-2.5 py-1 text-xs whitespace-nowrap backdrop-blur-md transition-colors duration-100 hover:bg-black/55"
    >
      {item.name}
    </Link>
  ));
}

function GameDetailsOverview({ data }) {
  const game = data[0];
  const {
    id,
    name,
    first_release_date: releaseDate,
    summary,
    total_rating: rating,
    total_rating_count: ratingCount,
    genres,
    themes,
    game_modes,
    external_games,
  } = game;

  const user_id = UserToken()?.user?.id;
  const { data: timeToBeat } = useGetTimeToBeat();
  const { data: userGame, isLoading: isLoadingUserGame } =
    useGetUserGame(user_id);
  const { data: userGameReview, isLoading: isLoadingUserGameReview } =
    useGetUserGameReview({ user_id });
  const { statusOf, setStatus } = useQuickStatus();
  const { removeGame } = useRemoveGame(game);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  if (isLoadingUserGame || isLoadingUserGameReview) return <Spinner />;

  const isReleased = releaseDate && new Date(releaseDate * 1000) < new Date();
  const savedGame = userGame?.data?.[0];
  const savedReview = userGameReview?.data?.[0];
  const savedStatus = savedGame?.status || null;
  const currentStatus = statusOf(id) ?? savedStatus;
  const isLogged = Boolean(savedStatus) && savedStatus !== "to play";
  // Wishlist is "want to play"; once a game is played it can't go back there
  const isWishlisted = currentStatus === "to play";
  const canWishlist = !currentStatus || isWishlisted;

  // What removal would throw away beyond the status itself
  const loggedParts = [
    savedReview?.rating && `${savedReview.rating}-star rating`,
    savedReview?.review && "review",
    savedGame?.hours_played && `${savedGame.hours_played} h played`,
  ].filter(Boolean);

  // A bare status is one click to restore, so only a log is worth a confirm
  function requestRemove() {
    if (loggedParts.length) setIsRemoveOpen(true);
    else removeGame();
  }

  const stage = stageOf(game);
  const StageIcon = stage?.icon;
  const ttb = timeToBeat?.[0];
  const year = releaseDate ? new Date(releaseDate * 1000).getFullYear() : null;

  const shownStores = new Set();
  const storeLinks = (external_games || [])
    .map((link) => {
      const store = STORES.find(
        (s) => link?.url?.includes(s.urlPattern) && !shownStores.has(s.name),
      );
      if (!store) return null;
      shownStores.add(store.name);
      return { ...store, url: link.url };
    })
    .filter(Boolean);

  return (
    <>
      <section className="relative isolate flex min-h-dvh w-full items-end overflow-hidden">
        <BackdropImage
          game={game}
          loading="eager"
          fetchPriority="high"
          className="art-fade absolute inset-0 -z-10"
          imgClassName="object-top brightness-90"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-end gap-6 px-4 pt-28 pb-10 md:grid-cols-[minmax(0,13rem)_1fr] md:gap-8 md:px-8">
          <img
            src={coverUrlOf(game, "t_cover_big_2x")}
            alt={`${name} cover`}
            className="hidden aspect-[3/4] w-full rounded-lg object-cover outline-1 -outline-offset-1 outline-white/15 md:block"
          />

          <div className="flex min-w-0 flex-col gap-5">
            <div>
              <p className="text-text-dim tabular mb-2 text-sm">
                {[
                  year,
                  genres
                    ?.slice(0, 2)
                    .map((g) => g.name)
                    .join(" · "),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <h1 className="text-balance">{name}</h1>
              {stage && (
                <Link
                  to={`/games/allGames?stage=${stage.id}`}
                  className="text-text-main mt-3 inline-flex items-center gap-1.5 rounded-sm border border-white/15 bg-black/45 px-2.5 py-1 text-xs font-semibold backdrop-blur-md transition-colors duration-100 hover:bg-black/65"
                >
                  <StageIcon className="text-pulse-warning h-3.5 w-3.5" />
                  {stage.name}
                </Link>
              )}
            </div>

            <div className="border-stroke-subtle grid w-full grid-cols-2 rounded-lg border bg-black/45 backdrop-blur-md sm:flex sm:w-fit sm:max-w-full">
              {isReleased ? (
                <>
                  <Fact
                    label={
                      ratingCount
                        ? `rating · ${ratingCount.toLocaleString()} votes`
                        : "rating"
                    }
                    value={rating ? Math.round(rating) : null}
                  />
                  <Fact
                    label="main story"
                    value={hoursOf(ttb?.hastily) && `${hoursOf(ttb.hastily)} h`}
                  />
                  <Fact
                    label="main + extras"
                    value={
                      hoursOf(ttb?.normally) && `${hoursOf(ttb.normally)} h`
                    }
                  />
                  <Fact
                    label="completionist"
                    value={
                      hoursOf(ttb?.completely) && `${hoursOf(ttb.completely)} h`
                    }
                  />
                </>
              ) : (
                <Fact
                  label="release date"
                  value={
                    releaseDate
                      ? formatDate(new Date(releaseDate * 1000), "d MMM yyyy")
                      : "To be announced"
                  }
                />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isReleased && (
                <div
                  role="radiogroup"
                  aria-label="Play status"
                  className="segmented w-full sm:w-fit"
                >
                  {PLAY_STATUSES.map((status) => {
                    const { icon: Icon, color } = STATUS_ICONS[status];
                    return (
                      <button
                        key={status}
                        type="button"
                        role="radio"
                        aria-checked={currentStatus === status}
                        title={
                          currentStatus === status
                            ? "Click again to remove from library"
                            : undefined
                        }
                        // Pressing the current status again clears it
                        onClick={() =>
                          currentStatus === status
                            ? requestRemove()
                            : setStatus(game, status)
                        }
                        className="flex-1 justify-center px-2 sm:flex-none sm:px-3.5"
                      >
                        <Icon
                          className={`hidden h-3.5 w-3.5 sm:block ${color}`}
                        />
                        {STATUS_LABELS[status]}
                      </button>
                    );
                  })}
                </div>
              )}

              {canWishlist && (
                <button
                  type="button"
                  aria-pressed={isWishlisted}
                  onClick={() =>
                    isWishlisted
                      ? removeGame("wishlist")
                      : setStatus(game, "to play")
                  }
                  className="btn-on-art px-4"
                >
                  <Bookmark
                    className={`text-pulse-warning h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                  />
                  {isWishlisted ? "Wishlisted" : "Wishlist"}
                </button>
              )}

              {isReleased && isLogged && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={requestRemove}
                    title="Remove from library"
                    aria-label={`Remove ${name} from library`}
                    className="text-text-main hover:text-text-error flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-black/45 backdrop-blur-md transition-colors duration-100 hover:bg-black/65"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <LogGameDialog
                    key={savedStatus}
                    game={game}
                    userGame={savedGame}
                    userGameReview={savedReview}
                    onRemove={requestRemove}
                  />
                </div>
              )}

              {storeLinks.length > 0 && (
                <div className="flex items-center gap-2 border-white/15 sm:ml-1 sm:border-l sm:pl-4">
                  {storeLinks.map(({ name: store, url, icon }) => {
                    const StoreIcon = icon;
                    return (
                      <a
                        key={store}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${name} on ${store}`}
                        aria-label={`${name} on ${store}`}
                        className="text-text-main flex h-10 w-10 items-center justify-center rounded-md border border-white/15 bg-black/45 backdrop-blur-md transition-colors duration-100 hover:bg-black/65"
                      >
                        <StoreIcon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {(genres?.length || themes?.length || game_modes?.length) > 0 && (
              <div className="no-scrollbar flex gap-2 overflow-x-auto">
                <TagLinks items={genres} param="genre" />
                <TagLinks items={themes} param="theme" />
                <TagLinks items={game_modes} param="gameMode" />
              </div>
            )}
          </div>
        </div>
      </section>

      {summary && (
        <section className="mx-auto w-full max-w-[1440px] px-4 pt-6 md:px-8">
          <p className="text-text-main max-w-[65ch] text-base leading-relaxed md:text-lg">
            {summary}
          </p>
        </section>
      )}

      <ConfirmDialog
        open={isRemoveOpen}
        onOpenChange={setIsRemoveOpen}
        title={`Remove ${name} from your library?`}
        description={`Your ${listOf([`${STATUS_LABELS[savedStatus]} status`, ...loggedParts])} will be deleted. This can't be undone.`}
        confirmLabel="Remove game"
        pendingLabel="Removing…"
        onConfirm={removeGame}
        art={coverUrlOf(game, "t_cover_big")}
      />
    </>
  );
}

export default GameDetailsOverview;
