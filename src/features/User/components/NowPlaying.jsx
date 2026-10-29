import { coverUrlOf } from "@/utils/igdbImage";
import { Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

// Games marked Playing, most played first. The most personal thing on the page.
function NowPlaying({ userGames = [] }) {
  const playing = userGames
    .filter((g) => g.status === "playing")
    .sort((a, b) => (b.hours_played || 0) - (a.hours_played || 0));

  return (
    <section
      aria-labelledby="now-playing-title"
      className="border-stroke-subtle bg-bg-surface flex flex-col gap-3 rounded-lg border p-4"
    >
      <h2
        id="now-playing-title"
        className="text-text-main flex items-center gap-2 text-lg font-semibold"
      >
        <Gamepad2 className="text-pulse-primary h-4 w-4" aria-hidden="true" />
        Now playing
      </h2>

      {playing.length ? (
        <ul className="flex flex-col gap-3">
          {playing.slice(0, 3).map(({ game_id, game, hours_played }) => (
            <li key={game_id}>
              <Link
                to={`/game/${game_id}`}
                className="group flex items-center gap-4"
              >
                <img
                  src={coverUrlOf(game)}
                  alt=""
                  loading="lazy"
                  className="bg-bg-raised aspect-[3/4] w-16 shrink-0 rounded-md object-cover outline-1 -outline-offset-1 outline-white/15 transition-[filter] duration-150 group-hover:brightness-110"
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-text-main line-clamp-2 font-semibold group-hover:underline group-hover:underline-offset-2">
                    {game?.name}
                  </span>
                  <span className="text-text-dim tabular text-sm">
                    {hours_played ? `${hours_played} h played` : "Just started"}
                    {game?.genres?.[0] &&
                      ` · ${game.genres[0].split("(")[0].trim()}`}
                  </span>
                </div>
              </Link>
            </li>
          ))}
          {playing.length > 3 && (
            <li className="text-text-dim text-sm">
              +{playing.length - 3} more in the Playing tab
            </li>
          )}
        </ul>
      ) : (
        <p className="text-text-dim text-sm">
          Nothing on the go. Mark a game Playing and it shows up here.{" "}
          <Link
            to="/games/allGames"
            className="text-text-main underline underline-offset-2"
          >
            Browse games
          </Link>
        </p>
      )}
    </section>
  );
}

export default NowPlaying;
