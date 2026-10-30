import { getUserGamesData } from "@/api/igdbApi";
import { MOODS } from "@/features/games/moods";
import { pickBackdrop } from "@/utils/igdbImage";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const ART_IDS = MOODS.map((mood) => mood.artId);

// One tile per mood, each over the art of a game from that mood. A tile opens
// Browse on that mood, most popular first, so the first games you see are
// ones you've heard of.
function MoodRow() {
  const { data, isLoading } = useQuery({
    queryKey: ["games", "moodArt", ART_IDS],
    queryFn: () => getUserGamesData(ART_IDS),
    staleTime: 24 * 60 * 60 * 1000,
  });
  const artOf = new Map(
    (Array.isArray(data) ? data : []).map((game) => [game.id, game]),
  );

  return (
    <section aria-labelledby="moods-heading" className="px-4 md:px-8">
      <h2 id="moods-heading" className="mb-3">
        Pick a mood
      </h2>
      <ul className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pt-1 pb-2 md:-mx-8 md:px-8 xl:mx-0 xl:grid xl:grid-cols-5 xl:overflow-visible xl:px-0">
        {MOODS.map((mood) => {
          const game = artOf.get(mood.artId);
          const src = game && pickBackdrop(game, "t_screenshot_med");
          return (
            <li key={mood.key} className="w-[15rem] shrink-0 xl:w-auto">
              <Link
                to={`/games/allGames?mood=${mood.key}&sortBy=total_rating_count`}
                className="group bg-bg-raised focus-visible:outline-pulse-accent relative block aspect-video overflow-hidden rounded-lg outline-2 outline-offset-[3px] outline-transparent transition-[outline-color] duration-150 ease-out hover:outline-white/25"
              >
                {src ? (
                  <img
                    src={src}
                    srcSet={`${src} 569w, ${pickBackdrop(game, "t_screenshot_big")} 889w`}
                    sizes="(min-width: 1280px) 20vw, 15rem"
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover brightness-90"
                  />
                ) : (
                  isLoading && (
                    <span className="bg-bg-surface absolute inset-0 animate-pulse motion-reduce:animate-none" />
                  )
                )}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3.5 text-base font-semibold text-white">
                  <mood.icon
                    className="text-pulse-accent h-[18px] w-[18px] shrink-0"
                    aria-hidden="true"
                  />
                  {mood.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default MoodRow;
