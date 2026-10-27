import GameDetailsCarousel from "./GameDetailsCarousel";

function GameDetailsRelatedGames({ data }) {
  const { dlcs, franchises, similar_games } = data[0];

  return (
    <>
      {/* DLCs */}
      {dlcs?.length > 0 && (
        <>
          <span className="" id="DLCs"></span>
          <GameDetailsCarousel sectionName="DLCs" data={dlcs} />
        </>
      )}

      {/* Similar Games */}
      {similar_games?.length > 0 && (
        <>
          <span id="Similar Games"></span>
          <GameDetailsCarousel
            sectionName="Similar Games"
            data={similar_games}
          />
        </>
      )}

      {/* franchises */}
      {franchises?.length > 0 && (
        <>
          <span id="Franchises"></span>
          <div className="mx-auto w-full max-w-[1440px] px-4 pt-12 md:px-8">
            <h2>Franchises</h2>
          </div>
        </>
      )}

      {franchises?.length > 0 &&
        franchises.map((franchise) => {
          franchise.games.sort(
            (a, b) => a.first_release_date - b.first_release_date,
          );
          const filteredGames = franchise.games.filter(
            (game) =>
              (game.game_type === 0 ||
                game.game_type === 8 ||
                game.game_type === 9) &&
              game.version_parent === undefined,
          );

          return (
            <GameDetailsCarousel
              key={franchise.id || franchise.name}
              sectionName={franchise.name}
              data={filteredGames}
              as="h3"
            />
          );
        })}
    </>
  );
}

export default GameDetailsRelatedGames;
