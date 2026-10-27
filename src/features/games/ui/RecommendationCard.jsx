import { coverUrlOf } from "@/utils/igdbImage";
import { Link } from "react-router-dom";

// One pick: cover, why it fits, match score. The whole card opens the game.
function RecommendationCard({ game }) {
  const imageUrl = coverUrlOf(game);
  const matchScore = Math.min(Math.round(game.matchScore || 0), 100);

  return (
    <article className="game-card group relative flex gap-4 p-3">
      <div className="bg-bg-raised relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-md sm:w-28">
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 py-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base leading-snug">
            <Link
              to={`/game/${game.id}`}
              className="group-hover:underline group-hover:underline-offset-2 after:absolute after:inset-0 after:content-['']"
            >
              {game.name}
            </Link>
          </h3>
          {matchScore > 0 && (
            <span className="text-text-brand tabular shrink-0 text-sm font-semibold">
              {matchScore}% match
            </span>
          )}
        </div>

        {game.recommendationReason && (
          <p className="line-clamp-3 text-sm">{game.recommendationReason}</p>
        )}

        {game.genres?.length > 0 && (
          <p className="text-text-muted mt-auto text-xs">
            {game.genres
              .slice(0, 3)
              .map((genre) => genre.name)
              .join(" · ")}
          </p>
        )}
      </div>
    </article>
  );
}

export default RecommendationCard;
