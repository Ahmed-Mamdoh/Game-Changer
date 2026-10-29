import { stageOf } from "@/utils/gameStage";
import { coverUrlOf } from "@/utils/igdbImage";
import { formatDate, intervalToDuration, formatDistanceToNow } from "date-fns";
import { Clock, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSteam } from "react-icons/fa";
import { SiEpicgames, SiGogdotcom } from "react-icons/si";
import { Link } from "react-router-dom";
import {
  STATUS_ICONS,
  STATUS_LABELS,
  useQuickStatus,
} from "@/features/games/hooks/useQuickStatus";
import FavoriteButton from "@/features/games/components/FavoriteButton";
import LogGameDialog from "@/features/games/components/LogGameDialog";
import { useRemoveGame } from "@/features/games/hooks/useRemoveGame";

const STORE_ICONS = {
  Steam: FaSteam,
  "Epic Games": SiEpicgames,
  GOG: SiGogdotcom,
};

function formatReleaseDate(timestamp) {
  const releaseDate = new Date(timestamp * 1000);
  const diffInDays = Math.abs(releaseDate - new Date()) / (1000 * 60 * 60 * 24);
  return diffInDays <= 90
    ? formatDistanceToNow(releaseDate, { addSuffix: true })
    : formatDate(releaseDate, "d MMM yyyy");
}

function formatCountdown(d) {
  if (d.days) return `${d.days}d ${d.hours || 0}h`;
  if (d.hours) return `${d.hours}h ${d.minutes || 0}m`;
  if (d.minutes) return `${d.minutes}m`;
  return "under a minute";
}

function hasValidEnd(endDate) {
  const time = new Date(endDate).getTime();
  return Number.isFinite(time) && time > Date.now();
}

function GameItem({ game, className = "" }) {
  const imageUrl = coverUrlOf(game);
  const { statusOf, logOf, setStatus, ratePrompt, closeRatePrompt } =
    useQuickStatus();
  const { removeGame } = useRemoveGame(game);
  const [isRemoving, setIsRemoving] = useState(false);
  const libraryStatus = isRemoving ? null : game.status || statusOf(game.id);
  const isUnreleased =
    game?.first_release_date &&
    game.first_release_date > Math.floor(Date.now() / 1000);

  const [countDown, setCountDown] = useState(() =>
    hasValidEnd(game?.endDate)
      ? intervalToDuration({ start: new Date(), end: new Date(game.endDate) })
      : null,
  );

  useEffect(() => {
    if (!hasValidEnd(game?.endDate)) return;
    const targetDate = new Date(game.endDate);
    const id = setInterval(() => {
      setCountDown(intervalToDuration({ start: new Date(), end: targetDate }));
    }, 30_000);
    return () => clearInterval(id);
  }, [game.endDate]);

  const quickOptions = isUnreleased
    ? ["to play"]
    : ["to play", "playing", "finished"];
  // A dropped game shows its own button too, so it can be removed from here
  if (libraryStatus && !quickOptions.includes(libraryStatus)) {
    quickOptions.push(libraryStatus);
  }

  // Pressing the active status again takes the game out; the toast has Undo
  async function removeFromLibrary() {
    setIsRemoving(true);
    await removeGame(libraryStatus === "to play" ? "wishlist" : "library");
    setIsRemoving(false);
  }

  const StoreIcon = STORE_ICONS[game?.freeOn];
  const StatusIcon = STATUS_ICONS[libraryStatus]?.icon;
  const stage = stageOf(game);
  const StageIcon = stage?.icon;

  return (
    <article className={`group relative flex flex-col gap-2 ${className}`}>
      <div className="bg-bg-surface relative aspect-[3/4] w-full overflow-hidden rounded-md">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            fetchPriority="low"
            className="h-full w-full object-cover transition-[filter] duration-150 group-hover:brightness-110"
          />
        ) : (
          <div className="text-text-muted flex h-full w-full items-center justify-center p-3 text-center text-sm">
            {game.name}
          </div>
        )}
        <div className="border-stroke-subtle pointer-events-none absolute inset-0 rounded-md border" />

        {stage && (
          <span className="text-text-main pointer-events-none absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-sm border border-white/15 bg-black/65 px-1.5 py-0.5 text-[11px] font-semibold backdrop-blur-md">
            <StageIcon className="text-pulse-warning h-3 w-3" />
            {stage.name}
          </span>
        )}

        {/* Quick status: above the stretched link so it presses on its own */}
        <div className="absolute top-1.5 right-1.5 z-20 hidden gap-1 opacity-0 transition-opacity duration-100 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:hover)]:flex">
          {quickOptions.map((status) => {
            const Icon = STATUS_ICONS[status].icon;
            const active = libraryStatus === status;
            return (
              <button
                key={status}
                type="button"
                title={
                  active
                    ? `${STATUS_LABELS[status]} · press to remove`
                    : `Mark as ${STATUS_LABELS[status]}`
                }
                aria-label={
                  active
                    ? `Remove ${game.name} from your ${status === "to play" ? "wishlist" : "library"}`
                    : `Mark ${game.name} as ${STATUS_LABELS[status]}`
                }
                aria-pressed={active}
                onClick={() =>
                  active ? removeFromLibrary() : setStatus(game, status)
                }
                className={`group/status flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm backdrop-blur-md transition-colors duration-100 ${
                  active
                    ? "bg-action text-on-action hover:bg-pulse-error"
                    : "text-text-main border border-white/15 bg-black/60 hover:bg-black/80"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${active ? "group-hover/status:hidden" : ""}`}
                />
                {active && (
                  <X className="hidden h-4 w-4 group-hover/status:block" />
                )}
              </button>
            );
          })}
          {!isRemoving && <FavoriteButton game={game} variant="poster" />}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-0.5">
        <h3 className="text-text-main line-clamp-2 text-sm leading-snug font-semibold tracking-normal">
          <Link
            to={`/game/${game.id}`}
            className="group-hover:underline group-hover:underline-offset-2 after:absolute after:inset-0 after:z-10 after:content-['']"
          >
            {game.name}
          </Link>
        </h3>

        {game?.giveAwayLink && (
          <div className="text-text-dim flex items-center justify-between gap-2 text-xs">
            <a
              href={game.giveAwayLink}
              target="_blank"
              rel="noreferrer"
              className="hover:text-text-main relative z-20 flex items-center gap-1.5 font-semibold"
            >
              {StoreIcon && <StoreIcon className="h-3.5 w-3.5" />}
              {game.freeOn}
            </a>
            {countDown ? (
              <span className="text-pulse-warning tabular flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatCountdown(countDown)}
              </span>
            ) : (
              <span className="text-text-muted">While keys last</span>
            )}
          </div>
        )}

        {!game?.giveAwayLink && isUnreleased && (
          <p className="tabular text-xs">
            {formatReleaseDate(game.first_release_date)}
          </p>
        )}

        {game?.status && StatusIcon && (
          <p className="text-text-dim tabular flex items-center gap-1.5 text-xs">
            <StatusIcon
              className={`h-3.5 w-3.5 ${STATUS_ICONS[game.status].color}`}
            />
            {STATUS_LABELS[game.status]}
            {game.status !== "to play" && game.hoursPlayed != null && (
              <span className="text-text-muted">· {game.hoursPlayed} h</span>
            )}
          </p>
        )}
      </div>

      {ratePrompt && (
        <LogGameDialog
          defaultOpen
          game={game}
          {...logOf(game.id)}
          defaultStatus={ratePrompt}
          onClose={closeRatePrompt}
        />
      )}
    </article>
  );
}

export default GameItem;
