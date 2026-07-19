"use client";

import { useState } from "react";

import { AnimatedNumber } from "@/components/animated-number";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const DAYS_LABELS = [
  "Jul 6", "Jul 7", "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12",
  "Jul 13", "Jul 14", "Jul 15", "Jul 16", "Jul 17", "Jul 18", "Jul 19",
];

const METRICS: Record<
  string,
  { label: string; unit: "currency" | "count"; values: number[] }
> = {
  revenue: {
    label: "Revenue",
    unit: "currency",
    values: [3200, 2900, 3400, 3100, 4200, 4800, 4100, 3900, 3600, 4400, 5100, 4700, 5600, 6100],
  },
  orders: {
    label: "Orders",
    unit: "count",
    values: [84, 71, 92, 88, 120, 141, 118, 109, 97, 128, 149, 133, 161, 178],
  },
  signups: {
    label: "Signups",
    unit: "count",
    values: [12, 18, 9, 22, 31, 27, 19, 24, 16, 29, 41, 33, 38, 52],
  },
};

const fmt = (value: number, unit: "currency" | "count") =>
  unit === "currency" ? `$${value.toLocaleString("en-US")}` : String(value);

export function AnalyticsModule() {
  const [metricKey, setMetricKey] = useState("revenue");
  const [range, setRange] = useState("7");
  const [active, setActive] = useState<number | null>(null);

  const metric = METRICS[metricKey];
  const days = Number(range);
  const values = metric.values.slice(-days);
  const labels = DAYS_LABELS.slice(-days);
  const previous = metric.values.slice(-days * 2, -days);

  const total = values.reduce((a, b) => a + b, 0);
  const prevTotal = previous.reduce((a, b) => a + b, 0) || 1;
  const delta = ((total - prevTotal) / prevTotal) * 100;
  const max = Math.max(...values);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic &amp; sales</CardTitle>
        <CardDescription>
          Metric and range recompute the chart, total, and period delta.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={metricKey} onValueChange={setMetricKey}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(METRICS).map(([key, m]) => (
                <SelectItem key={key} value={key}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex items-baseline gap-2">
            <AnimatedNumber
              value={total}
              format={
                metric.unit === "currency"
                  ? { style: "currency", currency: "USD", maximumFractionDigits: 0 }
                  : {}
              }
              loadingMs={700}
              className="font-mono text-xl font-semibold tabular-nums"
            />
            <Badge variant={delta >= 0 ? "secondary" : "destructive"}>
              {delta >= 0 ? "+" : ""}
              {delta.toFixed(1)}% vs prev
            </Badge>
          </div>
        </div>

        <div>
          <div className="flex h-40 items-end gap-1">
            {values.map((value, index) => (
              <button
                key={labels[index]}
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
                aria-label={`${labels[index]}: ${fmt(value, metric.unit)}`}
                className={cn(
                  "flex-1 rounded-t-[4px] transition-opacity",
                  active !== null && active !== index && "opacity-40",
                )}
                style={{
                  height: `${(value / max) * 100}%`,
                  background: "var(--primary)",
                }}
              />
            ))}
          </div>
          <div className="mt-1 flex gap-1">
            {labels.map((label, index) => (
              <span
                key={label}
                className={cn(
                  "flex-1 text-center text-[10px]",
                  index === active
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                  days === 14 && index % 2 === 1 && "max-lg:invisible",
                )}
              >
                {label.replace("Jul ", "")}
              </span>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {active !== null ? (
              <>
                {labels[active]}:{" "}
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {fmt(values[active], metric.unit)}
                </span>
              </>
            ) : (
              "Hover a bar for the daily value."
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
