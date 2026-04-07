"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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

export const description = "A bar chart with a label";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
};

export function ChartBarLabel({ chartData, title }) {
  const total = chartData.reduce((acc, cur) => acc + cur.number, 0);
  const updatedChartData = chartData.map((item) => ({
    ...item,
    number: ((item.number / total) * 100).toFixed(0),
  }));
  return (
    <Card className="bg-obsidian-deep/60 border-obsidian-border hover:border-pulse-extra/50 gap-1 rounded-2xl border-2 backdrop-blur-xs transition-all">
      <CardHeader>
        <CardTitle className=" text-text-primary/80 text-lg font-normal">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className=" h-40 w-full">
          <BarChart
            accessibilityLayer
            data={updatedChartData}
            margin={{
              top: 30,
            }}
            barSize={50}
          >
            <XAxis
              dataKey="game"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.split("/")[0]}
            />
            <YAxis
              domain={[0, Number(updatedChartData[0].number)]}
              hide={true}
            />
            <Bar dataKey="number" fill="var(--color-pulse-extra)" radius={4}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
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
