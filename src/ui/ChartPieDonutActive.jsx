"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Pie, PieChart, Sector } from "recharts";

import {
  Card,
  CardContent,
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

const chartConfig = {};

export function ChartPieDonutActive({ chartData, field }) {
  return (
    <Card className="bg-base-300 flex min-w-[300px] flex-col gap-y-0 border-0">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-center">{field}s You Played</CardTitle>
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
          <p className="text-base-content/80">
            Top Played:{" "}
            <span className="font-extrabold">{chartData[0]?.label}</span> (
            {chartData[0]?.number}){" "}
            <TrendingUp className="text-success inline h-4 w-4" />
          </p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <p className="text-base-content/80">
            Least Played:{" "}
            <span className="font-extrabold">
              {chartData[chartData.length - 1]?.label}
            </span>{" "}
            ({chartData[chartData.length - 1]?.number}){" "}
            <TrendingDown className="text-error inline h-4 w-4" />
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
