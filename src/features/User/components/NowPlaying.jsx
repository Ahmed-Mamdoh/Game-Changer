import { scrollToLibrary } from "@/features/User/scrollToLibrary";
import { coverUrlOf } from "@/utils/igdbImage";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const SHOWN = 2;

// Games marked Playing, most played first. The most personal thing on the page.
function NowPlaying({ userGames = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const playing = userGames
    .filter((g) => g.status === "playing")
    .sort((a, b) => (b.hours_played || 0) - (a.hours_played || 0));

  function showAll() {
    const next = new URLSearchParams(searchParams);
    next.delete("isFavorite");
    next.set("status", "playing");
    setSearchParams(next, { state: { keepScroll: true } });
    scrollToLibrary();
  }

  return (
    <section
      aria-labelledby="now-playing-title"
      className="panel flex flex-col gap-3 p-4"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2
          id="now-playing-title"
          className="text-text-main flex items-center gap-2 text-lg font-semibold"
        >
          <Gamepad2 className="text-pulse-primary h-4 w-4" aria-hidden="true" />
          Now playing
        </h2>
        {playing.length > SHOWN && (
          <button type="button" onClick={showAll} className="link-quiet">
            All {playing.length}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {playing.length ? (
        <ul className="-mx-2 flex flex-col gap-1">
          {playing.slice(0, SHOWN).map(({ game_id, game, hours_played }) => (
            <li key={game_id}>
              <Link
                to={`/game/${game_id}`}
                className="group flex items-center gap-4 rounded-lg p-2 transition-colors duration-100 hover:bg-white/[0.04]"
              >
                <img
                  src={coverUrlOf(game)}
                  alt=""
                  loading="lazy"
                  className="bg-bg-raised aspect-[3/4] w-14 shrink-0 rounded-md object-cover outline-1 -outline-offset-1 outline-white/15"
                />
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="text-text-main line-clamp-2 font-semibold">
                    {game?.name}
                  </span>
                  <span className="text-text-dim text-sm">
                    <span className="tabular text-text-main">
                      {hours_played ? `${hours_played} h` : "Just started"}
                    </span>
                    {game?.genres?.[0] &&
                      ` · ${game.genres[0].split("(")[0].trim()}`}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-text-dim text-sm">
          Nothing on the go. Mark a game Playing and it shows up here.{" "}
          <Link to="/games/allGames" className="link-quiet">
            Browse games
          </Link>
        </p>
      )}
    </section>
  );
}

export default NowPlaying;
