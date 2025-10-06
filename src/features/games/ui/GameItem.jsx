import { formatDate, intervalToDuration } from "date-fns";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { FaBell, FaClock, FaHourglass, FaRegClock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function GameItem({ game }) {
  // get 720p image instead of low quality
  const imageUrl = game.cover?.url
    ? game.cover.url.replace("t_thumb", "t_720p")
    : null;

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
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className="peer relative w-3/4 cursor-pointer md:h-64 md:w-48"
        onClick={() => navigate(`/game/${game.id}`)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="border-base-300 h-full w-full rounded-xl border object-cover transition-all duration-300 hover:scale-105 hover:shadow-xl"
          />
        ) : (
          <div className="bg-base-300 flex h-full w-full items-center justify-center rounded-lg font-medium">
            ❌ image not found
          </div>
        )}
        {game?.status && (
          <div className="bg-base-300 absolute top-2 right-2 flex items-center justify-center gap-x-2 rounded-full px-2">
            {game.status === "playing" ? (
              <div className="status status-primary animate-bounce"></div>
            ) : game.status === "finished" ? (
              <div className="status status-secondary animate-none"></div>
            ) : (
              <div className="status status-error animate-none"></div>
            )}
            <p className="text-sm">{game.status}</p>
          </div>
        )}
        {game?.hoursPlayed && (
          <div className="bg-base-300 absolute bottom-2 left-2 flex items-center justify-center gap-x-2 rounded-full px-2">
            <FaRegClock />
            <p className="text-sm">{game.hoursPlayed}h</p>
          </div>
        )}
      </div>
      <div className="peer-hover:text-primary w-72 cursor-default text-center text-lg font-medium text-wrap transition-colors duration-300 md:h-12 md:w-48 md:text-base">
        <Link
          to={`/game/${game.id}`}
          className="hover:text-accent-primary cursor-pointer"
        >
          <div>
            <p>{game.name}</p>
            {game.freeOn && <p>({game.freeOn})</p>}
            {game?.endDate && (
              <div className="flex flex-col items-center justify-center gap-x-1 text-red-400">
                <div className="flex items-center justify-center gap-x-1 text-center">
                  <FaBell className="h-4" />
                  <p>Ends in</p>
                </div>
                <div className="flex gap-1">
                  <p>({countDown?.days || 0}d</p>
                  <p>{countDown?.hours || 0}h</p>
                  <p>{countDown?.minutes || 0}m</p>
                  <p>{countDown?.seconds || 0}s)</p>
                </div>
              </div>
            )}
            {game?.first_release_date &&
              game?.first_release_date > Math.floor(Date.now() / 1000) && (
                <div className="text-text-subtle flex items-center justify-center gap-x-1 text-sm">
                  <FaHourglass />
                  <p>
                    {formatDate(
                      new Date(game.first_release_date * 1000),
                      "dd/MM/yyyy",
                    )}
                  </p>
                </div>
              )}
          </div>
        </Link>
      </div>
    </div>
  );
}

export default GameItem;
