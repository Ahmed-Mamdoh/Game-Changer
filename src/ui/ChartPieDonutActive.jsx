"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Sector } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A donut chart with an active sector";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {};

export function ChartPieDonutActive({ chartData }) {
  console.log(chartData);
  return (
    <Card className="bg-base-300 flex min-w-[300px] flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Stats</CardTitle>
        <CardDescription>Genres you played</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              className="bg-base-300 text-base-content text-base"
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="number"
              nameKey="label"
              isAnimationActive={true}
              innerRadius={75}
              strokeWidth={5}
              inactiveIndex={({ index }) => index !== 0}
              activeShape={({ outerRadius = 0, ...props }) => (
                <Sector {...props} outerRadius={outerRadius + 5} />
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-2 text-sm">
        <div className="flex flex-col items-center gap-1">
          <p className="text-base-content/80">Most played genre is</p>
          <p className="flex items-center gap-1">
            <span className="text-base-content font-extrabold">
              {chartData[0]?.label}
            </span>
            <span className="text-base-content/70">with</span>
            <span className="text-base-content font-extrabold">
              {chartData[0]?.number}
            </span>
            <span className="text-base-content/70">games</span>
            <TrendingUp className="text-success h-4 w-4" />
          </p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-base-content/80">and least played genre is</p>
          <p className="flex items-center gap-1">
            <span className="text-base-content font-extrabold">
              {chartData[chartData.length - 1]?.label}
            </span>
            <span className="text-base-content/70">with</span>
            <span className="text-base-content font-extrabold">
              {chartData[chartData.length - 1]?.number}
            </span>
            <span className="text-base-content/70">games</span>
            <TrendingDown className="text-error h-4 w-4" />
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
