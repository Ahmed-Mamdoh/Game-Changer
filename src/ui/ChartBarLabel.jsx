"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
};

export function ChartBarLabel({ chartData, title }) {
  const limit = 5;
  const total = chartData.reduce((acc, cur) => acc + cur.number, 0);

  // Limit bars based on screen size, combine the rest into "Other"
  let updatedChartData;
  if (chartData.length > limit) {
    const topData = chartData.slice(0, limit); // Take first 'limit' items
    const otherSum = chartData
      .slice(limit)
      .reduce((acc, cur) => acc + cur.number, 0); // Sum the rest
    updatedChartData = [...topData, { game: "Other", number: otherSum }];
  } else {
    updatedChartData = chartData; // Use all data if within limit
  }

  // Convert to percentages
  const finalChartData = updatedChartData.map((item) => ({
    ...item,
    number: ((item.number / total) * 100).toFixed(0),
  }));

  return (
    <Card className="bg-bg-surface border-stroke-subtle gap-0 rounded-lg border py-4 shadow-none">
      <CardHeader>
        <CardTitle className="text-text-main text-sm font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pr-1 pl-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-48 min-h-0 w-full min-w-0"
        >
          <BarChart
            layout="vertical"
            accessibilityLayer
            data={finalChartData}
            margin={{
              top: 0,
              right: 30,
            }}
          >
            <YAxis
              dataKey="game"
              type="category"
              tickLine={false}
              tick={{ fill: "var(--color-text-dim)" }} // Add this line
              tickMargin={2}
              axisLine={false}
              tickFormatter={(value) =>
                value.split("/")[0].split("(")[0].trim().replaceAll(" ", "-")
              } // Shorten long labels
              width={100}
            />
            <XAxis
              type="number"
              domain={[0, Number(finalChartData[0]?.number || 0)]}
              hide={true}
            />
            <Bar
              dataKey="number"
              fill="var(--color-pulse-primary)"
              radius={4}
              barSize={20}
            >
              <LabelList
                position="right"
                offset={5}
                className="fill-text-dim"
                fontSize={12}
                formatter={(value) => `${value}%`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
