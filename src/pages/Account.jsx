import UserCharts from "@/features/User/components/UserCharts";
import UserHeader from "@/features/User/components/UserHeader";
import Filters from "./../features/games/ui/Filters";
import { useGetUserGames } from "@/features/User/hooks/useGetUserGames";
import GamesGallary from "@/features/games/ui/GamesGallary";

function Account() {
  const supabaseToken = localStorage.getItem(
    "sb-kapovyqqncfsoangqppi-auth-token",
  );
  const userData = JSON.parse(supabaseToken || "{}");
  const user_id = userData?.user?.id;
  const { data, isLoading } = useGetUserGames(user_id);
  const user_games = data?.user_games || [];
  function prepareGallaryData() {
    return user_games.map((game) => {
      return {
        id: game.game_id,
        name: game.game_name,
        cover: { url: game.game_cover },
      };
    });
  }
  console.log(user_games);
  return (
    <div className="container mx-auto">
      <UserHeader />
      <div className="mx-auto mt-6 flex w-11/12 items-start justify-between">
        <div>
          <Filters showGameModes={false} className="bg-base-300 mt-0 w-full" />
          <GamesGallary data={prepareGallaryData()} isLoading={isLoading} />
        </div>
        <UserCharts user_games={user_games} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default Account;
