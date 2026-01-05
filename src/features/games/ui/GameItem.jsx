import { formatDate, intervalToDuration } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBell,
  FaHeart,
  FaHourglass,
  FaRegClock,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function GameItem({ game }) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  //check if the screen size changed and set isSmall screen if the size < 1024
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // get 720p image instead of low quality
  let imageUrl = game.cover?.url
    ? game.cover?.url?.replace("jpg", "webp")
    : null;
  imageUrl = isSmallScreen
    ? imageUrl?.replace("t_thumb", "t_720p")
    : imageUrl?.replace("t_thumb", "t_cover_big");
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
        className="peer relative w-3/4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl md:h-64 md:w-48"
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
        {game?.giveAwayLink && (
          <a
            onClick={(e) => e.stopPropagation()}
            href={game.giveAwayLink}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-2 left-2 cursor-pointer"
          >
            <button className="bg-primary text-primary-content flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm font-bold">
              Get It From Here <FaArrowLeft />
            </button>
          </a>
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
        {game?.dateFinished && (
          <div className="bg-base-300 absolute right-2 bottom-2 flex items-center justify-center gap-x-2 rounded-full px-2">
            <p className="text-sm">
              {formatDate(new Date(game.dateFinished), "dd/MM/yyyy")}
            </p>
            {/* <FaCalendarCheck /> */}
          </div>
        )}
        {game?.isFavorite && (
          <div className="bg-base-300 absolute top-2 left-2 flex items-center justify-center gap-x-2 rounded-full px-2 py-1">
            <FaHeart className="text-error" />
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
