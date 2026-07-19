"use client";

import { useState } from "react";
import { RotateCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { DemoCard, type LoadingVariant } from "./demo-card";

const VARIANTS: { key: LoadingVariant; label: string }[] = [
  { key: "skeleton", label: "Skeleton" },
  { key: "spinner", label: "Spinner" },
  { key: "blur", label: "Blur + light skeletons" },
];

export function ComparisonLab() {
  const [latency, setLatency] = useState(800);
  const [runId, setRunId] = useState(0);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-6 rounded-xl border bg-muted/40 p-4">
        <div className="flex min-w-56 flex-1 items-center gap-3">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            API latency
          </span>
          <Slider
            value={[latency]}
            onValueChange={([value]) => setLatency(value)}
            min={200}
            max={3000}
            step={100}
            aria-label="Simulated API latency"
          />
          <span className="w-14 text-right text-sm font-medium tabular-nums">
            {(latency / 1000).toFixed(1)}s
          </span>
        </div>
        <Button onClick={() => setRunId((id) => id + 1)}>
          <RotateCwIcon />
          Replay
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {VARIANTS.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <p className="text-sm font-medium">{label}</p>
            <DemoCard variant={key} latency={latency} runId={runId} />
          </div>
        ))}
      </div>
    </section>
  );
}
