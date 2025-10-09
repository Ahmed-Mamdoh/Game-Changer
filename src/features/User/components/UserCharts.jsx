import { ChartPieDonutActive } from "@/ui/ChartPieDonutActive";
import { useGetUserGames } from "../hooks/useGetUserGames";
import { memo } from "react";

function prepareChartData({ user_games, field }) {
  const data = user_games?.map((game) => game[field]).flat();
  const dataCount = data.reduce((acc, item) => {
    return { ...acc, [item]: (acc[item] || 0) + 1 };
  }, {});
  const chartData = Object.entries(dataCount).map(([item, count]) => ({
    label: item,
    number: count,
    fill: `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`,
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
    <div className="bg-base-300 mb-12 hidden flex-col gap-2 rounded-xl border lg:flex">
      {!isLoading && (
        <ChartPieDonutActive chartData={genresData} field="Genre" />
      )}
      {!isLoading && (
        <ChartPieDonutActive chartData={themesData} field="Theme" />
      )}
    </div>
  );
}

export default memo(UserCharts);
