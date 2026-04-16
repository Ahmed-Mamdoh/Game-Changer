import { formatDate, intervalToDuration, formatDistanceToNow } from "date-fns";
import { CalendarCheck, Check, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { CiPlay1, CiStop1 } from "react-icons/ci";
import { FaRegClock, FaSteam } from "react-icons/fa";
import { SiEpicgames, SiGogdotcom } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";

function GameItem({ game, className }) {
  let imageUrl = game.cover?.url
    ? game.cover?.url?.replace("jpg", "webp")
    : null;
  imageUrl = imageUrl?.replace("t_thumb", "t_cover_big");
  const navigate = useNavigate();

  const formatReleaseDate = (timestamp) => {
    const releaseDate = new Date(timestamp * 1000);
    const now = new Date();
    const diffInDays = Math.abs(releaseDate - now) / (1000 * 60 * 60 * 24);

    // If within 3 months (90 days), show relative format
    if (diffInDays <= 90) {
      return formatDistanceToNow(releaseDate, { addSuffix: true });
    }
    // Otherwise show absolute format
    else {
      return formatDate(releaseDate, "dd/MM/yyyy");
    }
  };

  const [countDown, setCountDown] = useState(() =>
    intervalToDuration({
      start: new Date(),
      end: new Date(game.endDate),
    }),
  );

  useEffect(() => {
    if (game?.endDate) {
      const targetDate = new Date(game.endDate);

      const id = setInterval(() => {
        setCountDown(
          intervalToDuration({
            start: new Date(),
            end: targetDate,
          }),
        );
      }, 1000);
      return () => clearInterval(id);
    }
  }, [game.endDate]);

  return (
    <div
      className={`bg-obsidian-card border-obsidian-border hover:border-pulse-primary/50 group
        hover:shadow-pulse-primary/5 relative flex w-fit cursor-pointer flex-col items-center
        justify-center gap-y-3 rounded-2xl border-1 p-3 backdrop-blur-md transition-all duration-500
        hover:-translate-y-2 hover:shadow-lg ${className}`}
    >
      <div
        className="relative w-36 overflow-hidden rounded-xl md:w-48"
        onClick={() => navigate(`/game/${game.id}`)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={game.name}
            className="aspect-[3/4] h-full w-full object-cover transition-transform duration-700"
            fetchPriority="low"
          />
        ) : (
          <div className="bg-obsidian-muted font-body text-text-muted flex aspect-[3/4] h-full w-full items-center justify-center rounded-xl text-xs">
            No Image
          </div>
        )}
        <div className="from-obsidian-base/40 absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="h-12 w-36 cursor-default text-center transition-colors duration-300 md:w-48">
        <Link to={`/game/${game.id}`} className="cursor-pointer">
          <p className="font-heading text-text-primary group-hover:text-pulse-accent text-sm leading-tight font-semibold md:text-base">
            {game.name?.substring(0, 40)}
            {game.name?.length > 40 ? "..." : ""}
          </p>
        </Link>
      </div>
      {game?.giveAwayLink && (
        <div className="text-pulse-accent flex w-full items-center justify-between">
          <a
            onClick={(e) => e.stopPropagation()}
            href={game.giveAwayLink}
            target="_blank"
            rel="noreferrer"
            className="font-body flex cursor-pointer items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase md:text-sm"
          >
            {game.freeOn === "Steam" ? <FaSteam className="h-4 w-4" /> : null}
            {game.freeOn === "Epic Games" ? (
              <SiEpicgames className="h-4 w-4" />
            ) : null}
            {game.freeOn === "GOG" ? <SiGogdotcom className="h-4 w-4" /> : null}
            {game.freeOn}
          </a>

          <div className="font-body flex items-center justify-center gap-1 text-xs font-bold md:text-sm">
            <Clock className="h-3.5 w-3.5" />
            <p>
              {countDown.days
                ? `${countDown.days}D`
                : countDown?.hours
                  ? `${countDown.hours}h`
                  : countDown?.minutes
                    ? `${countDown.minutes}m`
                    : countDown?.seconds
                      ? `${countDown.seconds}s`
                      : null}
            </p>
          </div>
        </div>
      )}
      {game?.first_release_date &&
        game?.first_release_date > Math.floor(Date.now() / 1000) && (
          <div className="text-pulse-accent flex items-center justify-center gap-x-2">
            <p className="font-body text-xs font-bold md:text-sm">
              {formatReleaseDate(game.first_release_date)}
            </p>
            <CalendarCheck className="h-4 w-4" />
          </div>
        )}
      {game?.hoursPlayed && (
        <div className="border-obsidian-border flex w-full items-center justify-between border-t pt-2">
          <div className="text-text-secondary flex items-center gap-1.5">
            {game.status === "playing" ? (
              <CiPlay1 className="text-pulse-primary h-3.5 w-3.5" />
            ) : game.status === "finished" ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <CiStop1 className="h-3.5 w-3.5 text-red-500" />
            )}
            <p className="font-body text-[10px] font-bold tracking-widest uppercase sm:text-xs">
              {game.status}
            </p>
          </div>
          <div className="text-text-secondary flex items-center gap-1">
            <FaRegClock className="h-3 w-3" />
            <p className="font-body text-xs font-bold">{game.hoursPlayed}h</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameItem;
