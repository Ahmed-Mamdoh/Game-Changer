import { ChartBarLabel } from "@/ui/ChartBarLabel";
import { ChartPieDonutActive } from "@/ui/ChartPieDonutActive";
import { memo } from "react";

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
  if (isLoading || !user_games?.length) return null;

  return (
    <div className="hidden grid-cols-2 gap-3 md:grid">
      <ChartBarLabel chartData={genresData} title="Genres you play" />
      <ChartBarLabel chartData={themesData} title="Themes you play" />
    </div>
  );
}

export default memo(UserCharts);
