import { formatDate, intervalToDuration } from "date-fns";
import { CalendarCheck, Check, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { CiPlay1, CiStop1 } from "react-icons/ci";
import { FaRegClock, FaSteam } from "react-icons/fa";
import { SiEpicgames, SiGogdotcom } from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";

function GameItem({ game }) {
  let imageUrl = game.cover?.url
    ? game.cover?.url?.replace("jpg", "webp")
    : null;
  imageUrl = imageUrl?.replace("t_thumb", "t_cover_big");
  const navigate = useNavigate();

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
      className="border-obsidian-border flex w-fit
    cursor-pointer flex-col items-center justify-center gap-y-2 rounded-2xl border-1
    bg-gradient-to-tl from-[#25212950] from-80% to-gray-200/30 to-100% p-2
    backdrop-blur-xs transition-all duration-300 hover:scale-105 hover:rotate-z-1
    hover:from-70% hover:shadow-xl"
    >
      <div
        className="peer relative w-36 md:w-48"
        onClick={() => navigate(`/game/${game.id}`)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="border-base-300 h-full w-full rounded-xl border object-cover"
          />
        ) : (
          <div className="bg-base-300 flex h-full w-full items-center justify-center rounded-lg font-medium">
            ❌ image not found
          </div>
        )}
      </div>
      <div
        className="h-12 w-36 cursor-default text-center text-sm font-medium text-wrap
      transition-colors duration-300 md:h-12 md:w-48 md:text-base"
      >
        <Link to={`/game/${game.id}`} className="cursor-pointer">
          <div>
            <p>
              {game.name?.substring(0, 40)}
              {game.name?.length > 40 ? "..." : ""}
            </p>
          </div>
        </Link>
      </div>
      {game?.giveAwayLink && (
        <div className="text-pulse-accent flex w-full items-center justify-between">
          <a
            onClick={(e) => e.stopPropagation()}
            href={game.giveAwayLink}
            target="_blank"
            rel="noreferrer"
            className="flex cursor-pointer items-center justify-center gap-2 text-sm md:text-base"
          >
            {game.freeOn === "Steam" ? <FaSteam className="h-4 w-4" /> : null}
            {game.freeOn === "Epic Games" ? (
              <SiEpicgames className="h-4 w-4" />
            ) : null}
            {game.freeOn === "GOG" ? <SiGogdotcom className="h-4 w-4" /> : null}
            {game.freeOn}
          </a>

          <div className="flex items-center justify-center gap-1 text-sm md:text-base">
            <Clock className="h-4 w-4" />
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
          <div className="text-pulse-accent flex items-center justify-center gap-x-1 text-sm md:text-base">
            <p>
              {formatDate(
                new Date(game.first_release_date * 1000),
                "dd/MM/yyyy",
              )}
            </p>
            <CalendarCheck className="h-4 w-4" />
          </div>
        )}
      {game?.hoursPlayed && (
        <div className="text-text-secondary flex w-full items-center justify-between text-sm md:text-base">
          <div className="flex items-center gap-1">
            {game.status === "playing" ? (
              <CiPlay1 className="h-4 w-4" />
            ) : game.status === "finished" ? (
              <Check className="h-4 w-4" />
            ) : (
              <CiStop1 className="h-4 w-4" />
            )}
            <p className="text-sm">{game.status.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-1 text-sm md:text-base">
            <FaRegClock className="h-4 w-4" />
            <p>{game.hoursPlayed}h</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameItem;
