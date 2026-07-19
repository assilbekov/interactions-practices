"use client";

import { useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

type Phase = "idle" | "busy" | "done";

function useSubmit(latency: number) {
  const [requests, setRequests] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const send = (onSettle?: () => void) => {
    setRequests((count) => count + 1);
    setPhase("busy");
    setTimeout(() => {
      setPhase("done");
      onSettle?.();
      if (doneTimer.current) clearTimeout(doneTimer.current);
      doneTimer.current = setTimeout(() => setPhase("idle"), 1200);
    }, latency);
  };

  return { requests, phase, send };
}

function DemoCard({
  title,
  good,
  note,
  requests,
  children,
}: {
  title: string;
  good: boolean;
  note: string;
  requests: number;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2 text-sm font-medium">
        {title}
        <Badge variant={good ? "secondary" : "destructive"}>
          {good ? "Do" : "Don't"}
        </Badge>
      </p>
      <Card>
        <CardContent className="space-y-3">
          {children}
          <p className="font-mono text-xs tabular-nums text-muted-foreground">
            requests sent: <NumberFlow value={requests} />
          </p>
        </CardContent>
      </Card>
      <p className="text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

export function ButtonLab() {
  const [latency, setLatency] = useState(1500);

  const spinner = useSubmit(latency);
  const disabledOnly = useSubmit(latency);
  const noFeedback = useSubmit(latency);
  const instant = useSubmit(latency);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-6 rounded-xl border bg-muted/40 p-4">
        <div className="flex min-w-56 flex-1 items-center gap-3">
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            API latency
          </span>
          <Slider
            value={[latency]}
            onValueChange={([value]) => setLatency(value)}
            min={300}
            max={3000}
            step={100}
            aria-label="Simulated API latency"
          />
          <span className="w-14 text-right text-sm font-medium tabular-nums">
            <NumberFlow
              value={latency / 1000}
              format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
              suffix="s"
            />
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Click each button twice, fast — then read the counters.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DemoCard
          title="Spinner + disabled"
          good
          note="The click is acknowledged in place and a second click is impossible. One intent, one request."
          requests={spinner.requests}
        >
          <Button
            className="w-full"
            disabled={spinner.phase === "busy"}
            onClick={() => spinner.send()}
          >
            {spinner.phase === "busy" && (
              <Loader2Icon className="size-4 animate-spin" />
            )}
            {spinner.phase === "done" && <CheckIcon className="size-4" />}
            {spinner.phase === "busy"
              ? "Saving…"
              : spinner.phase === "done"
                ? "Saved"
                : "Save changes"}
          </Button>
        </DemoCard>

        <DemoCard
          title="Disabled only"
          good={false}
          note="Safe from double-submits, but nothing says 'working' — for two seconds the app just looks broken."
          requests={disabledOnly.requests}
        >
          <Button
            className="w-full"
            disabled={disabledOnly.phase === "busy"}
            onClick={() => disabledOnly.send()}
          >
            Save changes
          </Button>
        </DemoCard>

        <DemoCard
          title="No feedback"
          good={false}
          note="The button stays live and silent, so users click again. Every extra request here is a duplicate write on your backend."
          requests={noFeedback.requests}
        >
          <Button className="w-full" onClick={() => noFeedback.send()}>
            Save changes
          </Button>
        </DemoCard>

        <DemoCard
          title="Instant + toast"
          good
          note="Returns immediately and confirms via toast — right for background saves; wrong when the next step depends on this one confirming."
          requests={instant.requests}
        >
          <Button
            className="w-full"
            onClick={() =>
              instant.send(() => toast.success("Changes saved"))
            }
          >
            Save changes
          </Button>
        </DemoCard>
      </div>
    </section>
  );
}
