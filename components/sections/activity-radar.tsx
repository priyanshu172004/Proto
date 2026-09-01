"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MonthPoint } from "@/lib/contributions";

/**
 * Overall activity across both sources, last twelve months.
 *
 * Two series on one radar, separated by fill as well as hue: GitHub is a solid
 * emerald area, LeetCode a thin dashed outline. That double encoding keeps the
 * pair readable for colour-vision deficiency and in print, and keeps the chart
 * inside the site's monochrome-plus-emerald discipline instead of importing a
 * second brand colour.
 *
 * Both series are real monthly totals — no smoothing, no sample data.
 */

const config: ChartConfig = {
  github: { label: "GitHub contributions", color: "var(--accent)" },
  leetcode: { label: "LeetCode submissions", color: "var(--fg-muted)" },
} satisfies ChartConfig;

export function ActivityRadar({ data }: { data: MonthPoint[] }) {
  return (
    <ChartContainer config={config} className="mx-auto aspect-square max-h-[300px]">
      <RadarChart data={data} outerRadius="70%">
        <ChartTooltip cursor={false} content={<ChartTooltipContent labelKey="month" />} />
        <PolarAngleAxis dataKey="month" tick={{ fontSize: 9, fontFamily: "var(--font-mono)" }} />
        <PolarGrid radialLines={false} />
        <Radar
          dataKey="github"
          stroke="var(--color-github)"
          strokeWidth={1.6}
          fill="var(--color-github)"
          fillOpacity={0.28}
          dot={{ r: 2.6, fillOpacity: 1, fill: "var(--color-github)", stroke: "none" }}
          isAnimationActive={false}
        />
        <Radar
          dataKey="leetcode"
          stroke="var(--color-leetcode)"
          strokeWidth={1.2}
          strokeDasharray="4 4"
          fill="none"
          dot={{ r: 2.2, fillOpacity: 1, fill: "var(--color-leetcode)", stroke: "none" }}
          isAnimationActive={false}
        />
      </RadarChart>
    </ChartContainer>
  );
}
