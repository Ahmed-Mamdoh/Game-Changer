import GameItem from "./../ui/GameItem";
import RowScrollButtons from "@/ui/RowScrollButtons";
import { useRowScroll } from "@/hooks/useRowScroll";

// A horizontal shelf of covers, the same row used on the home page
function GameDetailsCarousel({ sectionName, data, as: Heading = "h2" }) {
  const games = (data || []).filter((g) => g?.id);
  const row = useRowScroll(games.length);
  if (!games.length) return null;

  return (
    <section
      aria-label={sectionName}
      className="mx-auto w-full max-w-[1440px] px-4 pt-12 md:px-8"
    >
      <div
        className={`flex items-center justify-between gap-4 ${
          Heading === "h3" ? "mb-3" : "mb-4"
        }`}
      >
        <Heading>{sectionName}</Heading>
        <RowScrollButtons label={sectionName} {...row} />
      </div>
      <div
        ref={row.ref}
        className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:scroll-px-8 md:px-8"
      >
        {games.map((item) => (
          <GameItem
            key={item.id}
            game={item}
            className="w-[var(--game-card-w-mobile)] shrink-0 snap-start md:w-[var(--game-card-w-desktop)]"
          />
        ))}
      </div>
    </section>
  );
}

export default GameDetailsCarousel;
