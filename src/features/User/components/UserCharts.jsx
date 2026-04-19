import { ChartBarLabel } from "@/ui/ChartBarLabel";
import { ChartPieDonutActive } from "@/ui/ChartPieDonutActive";
import { memo } from "react";
import StatsCard from "@/ui/StatsCard";
import { IoGameControllerOutline } from "react-icons/io5";
import { PiSwordLight } from "react-icons/pi";
import { GoClock } from "react-icons/go";

function prepareChartData({ user_games, field }) {
  const data = user_games
    ?.map((userGame) => userGame?.game?.[field] || [])
    .flat();
  const dataCount = data.reduce((acc, item) => {
    return { ...acc, [item]: (acc[item] || 0) + 1 };
  }, {});
  const chartData = Object.entries(dataCount).map(([item, count]) => ({
    game: item,
    number: count,
  }));
  chartData.sort((a, b) => b.number - a.number);
  return chartData;
}

function UserCharts({ user_games, isLoading }) {
  let genresData;
  let themesData;
  if (!isLoading) {
    genresData = prepareChartData({ user_games, field: "genres" });
    themesData = prepareChartData({ user_games, field: "themes" });
  }
  const totalHours = user_games?.length
    ? user_games.reduce((acc, game) => acc + (game.hours_played || 0), 0)
    : 0;

  return (
    <div className="hidden h-full flex-col items-center justify-between gap-2 py-3   sm:gap-3 md:flex md:flex-row">
      {/* Full charts (hidden on mobile, shown on md and up) */}
      <div className="flex h-full w-full gap-3 ">
        <div className="flex  flex-col gap-2">
          <StatsCard
            data={user_games?.length || 0}
            title="Total Games"
            className="hidden md:flex"
            icon={
              <IoGameControllerOutline className="text-text-brand mb-1 h-8 w-8" />
            }
          />
          <StatsCard
            data={totalHours}
            title="Total Hours"
            className="hidden md:flex"
            icon={<GoClock className="text-text-brand mb-2 h-7 w-7" />}
          />
        </div>
        {!isLoading && (
          <div className="w-full">
            <ChartBarLabel chartData={genresData} title="Genres" />
          </div>
        )}
        {!isLoading && (
          <div className="w-full">
            <ChartBarLabel chartData={themesData} title="Themes" />
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(UserCharts);
