import { useGetFreeGameData } from "./useGetFreeGameData";
import { useGetFreePcGames } from "./useGetFreePcGames";

export function useGetFreeGamesToShow() {
  // get the names of the free games from gamerPower api
  const { data: freeGamesNames, isLoading: isLoadingFreeGamesNames } =
    useGetFreePcGames();

  // clean the title to get only the name of the game
  // ex. inscryption (steam) xxxxxxx
  // gets only inscryption
  let gamesCleanNames = freeGamesNames?.map(
    (game) => game.title.split(" (")[0].split(":")[0],
  );

  // gets the data (id,cover,name) of each game name in the gamesCleanNames array from the IGDb api
  const { data: freeGamesIgdbData, isLoading: isLoadingFreeGamesIgdbData } =
    useGetFreeGameData(gamesCleanNames || []);

  // for each free get the name of the platform that has it
  // ex. inscryption (steam) giveaway
  // gets only steam
  const freeOnPlatform = freeGamesNames?.map(
    (game) => game.title.match(/\(([^)]+)\)/)[1],
  );

  const dataToShow = freeGamesIgdbData?.map((searchResult, i) => {
    const intendedGame = searchResult.filter((game) => {
      return (
        game.name.toLowerCase().trim().replace(/['’]/g, "") ===
        gamesCleanNames[i].toLowerCase().trim().replace(/['’]/g, "")
      );
    });

    return {
      ...intendedGame[0],
      freeOn: freeOnPlatform[i],
      endDate: freeGamesNames[i].end_date,
    };
  });

  return { dataToShow, isLoadingFreeGamesIgdbData, isLoadingFreeGamesNames };
}
