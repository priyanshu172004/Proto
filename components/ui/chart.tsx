"use client";

import * as React from "react";
import { ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<string, { label: string; color?: string }>;

const ChartContext = React.createContext<ChartConfig>({});

export function useChartConfig() {
  return React.useContext(ChartContext);
}

/**
 * shadcn-style chart shell: exposes each series colour as a CSS variable so the
 * chart inherits the site's tokens instead of carrying its own palette.
 */
export function ChartContainer({
  config,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof ResponsiveContainer>["children"];
}) {
  const style = Object.fromEntries(
    Object.entries(config)
      .filter(([, v]) => v.color)
      .map(([k, v]) => [`--color-${k}`, v.color as string]),
  ) as React.CSSProperties;

  return (
    <ChartContext.Provider value={config}>
      <div
        data-slot="chart"
        style={style}
        className={cn(
          "w-full [&_.recharts-cartesian-axis-tick_text]:fill-[var(--fg-faint)]",
          "[&_.recharts-cartesian-grid_line]:stroke-[var(--border)]",
          "[&_.recharts-polar-angle-axis-tick_text]:fill-[var(--fg-faint)]",
          "[&_.recharts-polar-grid_line]:stroke-[var(--border)]",
          "[&_.recharts-polar-grid-concentric-polygon]:stroke-[var(--border)]",
          "[&_.recharts-surface]:overflow-visible",
          className,
        )}
        {...props}
      >
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export const ChartTooltip = Tooltip;

type TooltipRow = {
  name?: string;
  dataKey?: string | number;
  value?: number;
  color?: string;
  payload?: Record<string, unknown>;
};

/**
 * Tooltip body. Text stays in ink tokens; the swatch alone carries series
 * identity, and every row is labelled so colour is never the only cue.
 */
export function ChartTooltipContent({
  active,
  payload,
  label,
  labelKey,
  unit,
}: {
  active?: boolean;
  payload?: TooltipRow[];
  label?: string | number;
  labelKey?: string;
  unit?: string;
}) {
  const config = useChartConfig();
  if (!active || !payload?.length) return null;

  const heading =
    labelKey && payload[0]?.payload
      ? String(payload[0].payload[labelKey] ?? "")
      : (label ?? payload[0]?.name ?? "");

  return (
    <div className="rounded-sm border border-line bg-surface-2 px-3 py-2 shadow-[var(--shadow-ambient)]">
      {heading ? <p className="doto text-[10px] text-fg-faint">{heading}</p> : null}
      <ul className="mt-1.5 flex flex-col gap-1">
        {payload.map((row, i) => {
          const key = String(row.dataKey ?? row.name ?? i);
          const entry = config[key];
          return (
            <li key={key} className="flex items-center gap-2">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-[2px]"
                style={{ background: entry?.color ?? row.color ?? "var(--accent)" }}
              />
              <span className="font-mono text-[11px] text-fg-muted">
                {entry?.label ?? key}
              </span>
              <span className="ml-auto font-mono text-[12px] text-fg tabular-nums">
                {row.value}
                {unit ? <span className="ml-1 text-fg-muted">{unit}</span> : null}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
