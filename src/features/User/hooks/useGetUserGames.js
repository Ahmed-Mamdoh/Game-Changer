import { getUserGamesData } from "@/api/igdbApi";
import { getUserGames } from "@/api/supabase";
import { useQuery } from "@tanstack/react-query";

export function useGetUserGames(user_id) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user_games", user_id],
    queryFn: async () => {
      const userGames = await getUserGames(user_id);
      if (!userGames?.user_games?.length) return userGames;

      const ids = userGames.user_games?.map((game) => game.game.game_id) || [];

      const userGamesData = await getUserGamesData(ids);

      const mergedUserGames = userGames.user_games?.map((userGame) => {
        const igdbGame = userGamesData.find(
          (game) => game.id === userGame.game.game_id,
        );
        return {
          ...userGame,
          game: {
            ...igdbGame,
            ...userGame.game,
            cover: igdbGame.cover.url,
            genres: igdbGame.genres?.map((genre) => genre.name) || [],
            themes: igdbGame.themes?.map((theme) => theme.name) || [],
          },
        };
      });
      console.log(mergedUserGames);
      return { user_games: mergedUserGames };
    },
  });
  return { data, isLoading, error };
}
