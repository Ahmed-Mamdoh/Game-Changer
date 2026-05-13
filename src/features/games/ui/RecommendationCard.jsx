import { formatIGDBImage } from "@/utils/igdbImage";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import useScreenWidth from "@/hooks/useScreenWidth";

function RecommendationCard({ game }) {
  const screenWidth = useScreenWidth();
  const { cover, artworks } = game;

  const coverImage =
    screenWidth > 480
      ? cover
      : artworks?.find((a) => a.artwork_type === 1) ||
        artworks?.find((a) => a.artwork_type === 2) ||
        artworks?.find((a) => a.artwork_type === 3) ||
        artworks?.find((a) => a.artwork_type === 4) ||
        artworks?.[0] ||
        cover;
  const imageUrl = formatIGDBImage(coverImage?.url, "t_1080p");
  const matchScore = Math.min(game.matchScore || 0, 100);

  return (
    <div className="game-card group xs:flex-row relative flex h-full flex-col overflow-hidden p-4">
      {/* Background Glow Effect */}
      <div className="bg-pulse-primary/10 absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Game Image */}
      <div className="xs:w-36 relative z-10 w-full flex-shrink-0 overflow-hidden rounded-lg shadow-lg">
        <Link to={`/game/${game.id}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={game.name}
              className=" xs:aspect-[3/4] aspect-[16/9] h-full w-full object-cover transition-transform duration-700 "
            />
          ) : (
            <div className="bg-bg-surface flex aspect-[3/4] h-full w-full items-center justify-center text-xs">
              No Image
            </div>
          )}
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 ml-4 flex flex-1 flex-col justify-between py-1 md:ml-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="text-pulse-accent h-4 w-4" />
              <span className="text-pulse-accent text-xs font-bold tracking-wider uppercase">
                Recommendation
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-pulse-accent text-2xl font-black md:text-3xl">
                {matchScore}%
              </span>
              <span className="text-text-muted -mt-1 text-[10px] font-bold uppercase">
                Match
              </span>
            </div>
          </div>

          <Link to={`/game/${game.id}`}>
            <h3 className="hover:text-pulse-accent text-lg  text-wrap transition-colors md:text-xl">
              {game.name}
            </h3>
          </Link>

          {game.recommendationReason && (
            <p className="xs:text-base mt-2 text-sm leading-relaxed text-wrap italic">
              "{game.recommendationReason}"
            </p>
          )}
        </div>

        <div className="xs:flex-row xs:items-center mt-4 flex flex-col justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {game.genres?.slice(0, 2).map((genre) => (
              <span key={genre.id} className="glass-badge">
                {genre.name}
              </span>
            ))}
          </div>

          <Link
            to={`/game/${game.id}`}
            className="text-pulse-accent flex items-center gap-1 text-xs font-bold text-nowrap transition-all hover:gap-2"
          >
            VIEW DETAILS <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecommendationCard;
