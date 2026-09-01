"use client";

import { Bar, BarChart, Cell, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { domainBreadth } from "@/data/stack";

const config: ChartConfig = {
  count: { label: "Technologies", color: "var(--accent)" },
};

/**
 * One series, one hue — magnitude, not identity, so there is no categorical
 * palette to cycle. Bars start at zero, ends are rounded, every bar carries its
 * own value label, and the domain names sit on the axis: nothing here is
 * readable by colour alone.
 */
export function BreadthChart() {
  const data = domainBreadth().sort((a, b) => b.count - a.count);
  const max = Math.max(...data.map((d) => d.count));

  return (
    <ChartContainer config={config} className="h-[236px]">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 28, bottom: 0, left: 0 }}
        barCategoryGap={6}
      >
        <XAxis type="number" domain={[0, max]} hide />
        <YAxis
          type="category"
          dataKey="domain"
          width={92}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
        />
        <Tooltip
          cursor={{ fill: "var(--surface-3)", opacity: 0.5 }}
          content={<ChartTooltipContent labelKey="domain" unit="technologies" />}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14} isAnimationActive={false}>
          {data.map((entry) => (
            <Cell key={entry.domain} fill="var(--color-count)" />
          ))}
          <LabelList
            dataKey="count"
            position="right"
            offset={8}
            className="fill-[var(--fg-muted)]"
            style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
