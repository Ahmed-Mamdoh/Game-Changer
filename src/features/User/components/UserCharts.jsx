import { ChartBarLabel } from "@/ui/ChartBarLabel";
import { ChartPieDonutActive } from "@/ui/ChartPieDonutActive";
import { memo } from "react";

function prepareChartData({ user_games, field }) {
  const data = user_games?.map((game) => game[field]).flat();
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

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      {!isLoading && (
        <div className="w-full">
          <ChartBarLabel chartData={genresData} title="Genres Played " />
        </div>
      )}
      {!isLoading && (
        <div className="w-full">
          <ChartBarLabel chartData={themesData} title="Themes Played " />
        </div>
      )}
    </div>
  );
}

export default memo(UserCharts);
