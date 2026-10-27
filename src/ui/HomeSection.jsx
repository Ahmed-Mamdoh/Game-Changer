import GameItem from "@/features/games/ui/GameItem";
import RowScrollButtons from "@/ui/RowScrollButtons";
import { useRowScroll } from "@/hooks/useRowScroll";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// One horizontal shelf of covers, like a console home row
function HomeSection({ sectionName, data, isLoading, route, id }) {
  const games = Array.isArray(data) ? data.filter((g) => g?.id) : [];
  const row = useRowScroll(isLoading ? 0 : games.length);
  if (!isLoading && games.length === 0) return null;

  return (
    <section id={id} aria-label={sectionName} className="px-4 md:px-8">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2>{sectionName}</h2>
        <div className="flex items-center gap-5">
          <Link to={`/${route}`} className="link-quiet">
            See all
            <ArrowRight className="h-4 w-4" />
          </Link>
          <RowScrollButtons label={sectionName} {...row} />
        </div>
      </div>
      <div
        ref={row.ref}
        className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pt-1 pb-2 md:-mx-8 md:px-8"
      >
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="bg-bg-surface aspect-[3/4] w-[var(--game-card-w-mobile)] shrink-0 animate-pulse rounded-md md:w-[var(--game-card-w-desktop)]"
              />
            ))
          : games.map((game) => (
              <GameItem
                key={game.id}
                game={game}
                className="w-[var(--game-card-w-mobile)] shrink-0 md:w-[var(--game-card-w-desktop)]"
              />
            ))}
      </div>
    </section>
  );
}

export default HomeSection;
