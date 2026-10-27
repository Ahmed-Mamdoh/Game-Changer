import GameItem from "./../ui/GameItem";

// A horizontal shelf of covers, the same row used on the home page
function GameDetailsCarousel({ sectionName, data, as: Heading = "h2" }) {
  const games = (data || []).filter((g) => g?.id);
  if (!games.length) return null;

  return (
    <section
      aria-label={sectionName}
      className="mx-auto w-full max-w-[1440px] px-4 pt-12 md:px-8"
    >
      <Heading className={Heading === "h3" ? "mb-3" : "mb-4"}>
        {sectionName}
      </Heading>
      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8">
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
