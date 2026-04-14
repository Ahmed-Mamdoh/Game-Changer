import {
  findBestMatchingGame,
  normalizeGameName,
} from "@/utils/gameNameMatching";
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
    (game) => game.title.split(" (")[0],
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

  const dataToShow =
    freeGamesIgdbData?.length > 0
      ? freeGamesIgdbData
          ?.map((searchResult, i) => {
            // Use the new robust matching function
            const intendedGame = findBestMatchingGame(
              searchResult,
              gamesCleanNames[i],
            );

            // Fallback logic if no match found
            if (!intendedGame && searchResult.length > 0) {
              // Try to find any game that contains the target name
              const containsMatch = searchResult.find((game) =>
                normalizeGameName(game.name).includes(
                  normalizeGameName(gamesCleanNames[i]),
                ),
              );

              if (containsMatch) {
                return {
                  ...containsMatch,
                  freeOn: freeOnPlatform[i],
                  endDate: freeGamesNames[i].end_date,
                  giveAwayLink: freeGamesNames[i].open_giveaway,
                };
              }

              // As last resort, use the first result with a warning
              console.warn(
                `No good match found for "${gamesCleanNames[i]}", using first result`,
              );
              return {
                ...searchResult[0],
                freeOn: freeOnPlatform[i],
                endDate: freeGamesNames[i].end_date,
                giveAwayLink: freeGamesNames[i].open_giveaway,
              };
            }

            // Return matched game with additional data
            if (intendedGame) {
              return {
                ...intendedGame,
                freeOn: freeOnPlatform[i],
                endDate: freeGamesNames[i].end_date,
                giveAwayLink: freeGamesNames[i].open_giveaway,
              };
            }

            // If still no match, return null for this entry
            return null;
          })
          .filter(Boolean) // Remove null entries
      : [];

  return { dataToShow, isLoadingFreeGamesIgdbData, isLoadingFreeGamesNames };
}
