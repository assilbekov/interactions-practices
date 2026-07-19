"use client";

import { useEffect, useRef, useState } from "react";
import {
  CircleAlertIcon,
  CloudSunIcon,
  Loader2Icon,
  RotateCwIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LATENCY = 900;

type FailureMode = "once" | "twice" | "always";

const FAILURE_LABEL: Record<FailureMode, string> = {
  once: "Fails once, then works",
  twice: "Fails twice, then works",
  always: "Always fails",
};

const FAILS: Record<FailureMode, number> = {
  once: 1,
  twice: 2,
  always: Infinity,
};

function WeatherWidget() {
  return (
    <div className="flex items-center gap-3">
      <CloudSunIcon className="size-8 text-primary" />
      <div>
        <p className="font-mono text-xl font-semibold tabular-nums">24°C</p>
        <p className="text-xs text-muted-foreground">
          Almaty · partly cloudy · updated just now
        </p>
      </div>
    </div>
  );
}

function SurroundingContent() {
  return (
    <div className="space-y-1 border-t pt-3">
      <p className="text-sm font-medium">Today&apos;s agenda</p>
      <p className="text-xs text-muted-foreground">09:30 — Design review</p>
      <p className="text-xs text-muted-foreground">14:00 — 1:1 with Dana</p>
    </div>
  );
}

type DemoProps = { mode: FailureMode; runId: number };

/**
 * Result state is keyed by a token; while the stored token doesn't match the
 * current one the demo renders as loading — no setState in effect bodies.
 */
function useFlakyRequest(mode: FailureMode, runId: number) {
  const [retrySeed, setRetrySeed] = useState(0);
  const token = `${runId}:${retrySeed}:${mode}`;
  const [result, setResult] = useState<{ token: string; ok: boolean } | null>(
    null,
  );
  const attempts = useRef(0);

  useEffect(() => {
    attempts.current = 0;
    const timer = setTimeout(() => {
      attempts.current += 1;
      setResult({ token, ok: attempts.current > FAILS[mode] });
    }, LATENCY);
    return () => clearTimeout(timer);
  }, [token, mode]);

  const settled = result?.token === token ? result.ok : null;
  const retry = () => setRetrySeed((seed) => seed + 1);
  // Retry keeps the attempt counter across seeds so "fails twice" can heal.
  const retryKeepingAttempts = () => {
    const kept = attempts.current;
    retry();
    attempts.current = kept;
  };

  return { settled, retry: retryKeepingAttempts, attempts };
}

/** ❌ One failed widget request nukes the whole panel. */
function FullPageDemo({ mode, runId }: DemoProps) {
  const { settled, retry } = useFlakyRequest(mode, runId);

  if (settled === false) {
    return (
      <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
        <CircleAlertIcon className="size-8 text-destructive" />
        <p className="text-sm font-medium">Something went wrong</p>
        <Button variant="outline" size="sm" onClick={retry}>
          Reload page
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-40 space-y-3">
      {settled === null ? (
        <div className="flex h-12 items-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" /> Loading weather…
        </div>
      ) : (
        <WeatherWidget />
      )}
      {settled === true && <SurroundingContent />}
    </div>
  );
}

/** ✅ The failure stays inside the widget; the agenda never blinks. */
function InlineRetryDemo({ mode, runId }: DemoProps) {
  const { settled, retry } = useFlakyRequest(mode, runId);

  return (
    <div className="min-h-40 space-y-3">
      {settled === null && (
        <div className="flex h-12 items-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" /> Loading weather…
        </div>
      )}
      {settled === false && (
        <div className="flex h-12 items-center justify-between rounded-md border border-destructive/30 bg-destructive/5 px-3">
          <span className="flex items-center gap-2 text-xs text-destructive">
            <CircleAlertIcon className="size-3.5" /> Weather unavailable
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={retry}
          >
            <RotateCwIcon className="size-3" />
            Retry
          </Button>
        </div>
      )}
      {settled === true && <WeatherWidget />}
      <SurroundingContent />
    </div>
  );
}

/** ✅✅ Retries itself with backoff; asks for help only after giving up. */
function AutoRetryDemo({ mode, runId }: DemoProps) {
  const [retrySeed, setRetrySeed] = useState(0);
  const token = `${runId}:${retrySeed}:${mode}`;
  const [state, setState] = useState<{
    token: string;
    phase: "loading" | "waiting" | "done" | "error";
    attempt: number;
    nextIn: number;
  } | null>(null);

  useEffect(() => {
    let attempts = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    const attemptLoad = (n: number) => {
      timers.push(
        setTimeout(() => {
          attempts += 1;
          const ok = attempts > FAILS[mode];
          if (ok) {
            setState({ token, phase: "done", attempt: n, nextIn: 0 });
            return;
          }
          if (n >= 3) {
            setState({ token, phase: "error", attempt: n, nextIn: 0 });
            return;
          }
          const backoff = 2 ** (n - 1);
          setState({ token, phase: "waiting", attempt: n, nextIn: backoff });
          let remaining = backoff;
          intervals.push(
            setInterval(() => {
              remaining -= 1;
              setState((s) =>
                s?.token === token
                  ? { ...s, nextIn: Math.max(0, remaining) }
                  : s,
              );
            }, 1000),
          );
          timers.push(
            setTimeout(() => {
              setState({
                token,
                phase: "loading",
                attempt: n + 1,
                nextIn: 0,
              });
              attemptLoad(n + 1);
            }, backoff * 1000),
          );
        }, LATENCY),
      );
    };

    attemptLoad(1);
    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [token, mode]);

  const view =
    state?.token === token
      ? state
      : { phase: "loading" as const, attempt: 1, nextIn: 0 };

  return (
    <div className="min-h-40 space-y-3">
      {view.phase === "loading" && (
        <div className="flex h-12 items-center gap-2 text-sm text-muted-foreground">
          <Loader2Icon className="size-4 animate-spin" />
          Loading weather…{" "}
          <span className="font-mono text-xs tabular-nums">
            attempt {view.attempt}/3
          </span>
        </div>
      )}
      {view.phase === "waiting" && (
        <div className="flex h-12 items-center gap-2 text-sm text-muted-foreground">
          <RotateCwIcon className="size-4" />
          Connection hiccup — retrying in{" "}
          <span className="font-mono tabular-nums">{view.nextIn}s</span>
        </div>
      )}
      {view.phase === "error" && (
        <div className="flex h-12 items-center justify-between rounded-md border border-destructive/30 bg-destructive/5 px-3">
          <span className="flex items-center gap-2 text-xs text-destructive">
            <CircleAlertIcon className="size-3.5" /> Gave up after 3 attempts
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setRetrySeed((seed) => seed + 1)}
          >
            Retry
          </Button>
        </div>
      )}
      {view.phase === "done" && <WeatherWidget />}
      <SurroundingContent />
    </div>
  );
}

const DEMOS = [
  {
    key: "full",
    title: "Full-page error",
    good: false,
    note: "The agenda was never broken, but it's gone anyway — one widget's failure became the whole page's failure.",
    Demo: FullPageDemo,
  },
  {
    key: "inline",
    title: "Inline retry",
    good: true,
    note: "The failure is scoped to the widget that failed. Everything else keeps working, and recovery is one small click.",
    Demo: InlineRetryDemo,
  },
  {
    key: "auto",
    title: "Auto-retry with backoff",
    good: true,
    note: "The app does its own recovering: 1s, then 2s, then asks for help. On 'fails twice', the user never lifts a finger.",
    Demo: AutoRetryDemo,
  },
];

export function RecoveryLab() {
  const [mode, setMode] = useState<FailureMode>("twice");
  const [runId, setRunId] = useState(0);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-muted/40 p-4">
        <Button onClick={() => setRunId((id) => id + 1)}>
          <RotateCwIcon />
          Reload widgets
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Endpoint</span>
          <Select
            value={mode}
            onValueChange={(value) => {
              setMode(value as FailureMode);
              setRunId((id) => id + 1);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(FAILURE_LABEL) as FailureMode[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {FAILURE_LABEL[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {DEMOS.map(({ key, title, good, note, Demo }) => (
          <div key={key} className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium">
              {title}
              <Badge variant={good ? "secondary" : "destructive"}>
                {good ? "Do" : "Don't"}
              </Badge>
            </p>
            <Card>
              <CardContent>
                <Demo mode={mode} runId={runId} />
              </CardContent>
            </Card>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
