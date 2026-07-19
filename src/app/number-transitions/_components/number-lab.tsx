"use client";

import { useEffect, useState } from "react";
import NumberFlow, { type Format } from "@number-flow/react";
import { RotateCwIcon, ShuffleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LOAD_MS = 900;
const BASE_VALUE = 24562;

const CURRENCY: Format = {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
};

function useLoaded() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), LOAD_MS);
    return () => clearTimeout(timer);
  }, []);
  return loaded;
}

/** ✅ Blur while loading, plain reveal, animate only real changes. */
function BestDemo({ value }: { value: number }) {
  const loaded = useLoaded();
  return (
    <span
      className={cn(
        "inline-block font-mono text-3xl font-semibold tabular-nums transition-[filter,opacity] duration-300",
        !loaded && "opacity-60 blur-[6px] select-none",
      )}
    >
      <NumberFlow value={value} format={CURRENCY} animated={loaded} />
    </span>
  );
}

/** ❌ Rolls from zero on every load — animates a change that never happened. */
function RollFromZeroDemo({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setDisplay(value), 250);
    return () => clearTimeout(timer);
  }, [value]);
  return (
    <span className="inline-block font-mono text-3xl font-semibold tabular-nums">
      <NumberFlow value={display} format={CURRENCY} />
    </span>
  );
}

/** ❌ Nothing while loading, then the number pops in and shifts the layout. */
function PopInDemo({ value }: { value: number }) {
  const loaded = useLoaded();
  if (!loaded) return null;
  return (
    <span className="inline-block font-mono text-3xl font-semibold tabular-nums">
      {value.toLocaleString("en-US", CURRENCY)}
    </span>
  );
}

/** ❌ No load treatment, and changes jump-cut — easy to miss entirely. */
function JumpCutDemo({ value }: { value: number }) {
  return (
    <span className="inline-block font-mono text-3xl font-semibold tabular-nums">
      {value.toLocaleString("en-US", CURRENCY)}
    </span>
  );
}

const DEMOS = [
  {
    key: "best",
    title: "Blur → reveal → roll",
    good: true,
    note: "Loading is a blur that reserves exact space; the reveal is a plain un-blur (the value didn't change, so nothing rolls); every later change animates.",
    Demo: BestDemo,
  },
  {
    key: "zero",
    title: "Roll from zero",
    good: false,
    note: "Looks impressive once, lies every time: your balance was never $0. Users learn the motion is decorative and stop trusting it when a real change rolls.",
    Demo: RollFromZeroDemo,
  },
  {
    key: "popin",
    title: "Pop-in, no placeholder",
    good: false,
    note: "Nothing reserves the space, so the caption below jumps when the number lands. Watch this card's footer shift on every reload.",
    Demo: PopInDemo,
  },
  {
    key: "jump",
    title: "Jump cut",
    good: false,
    note: "No loading treatment and silent changes. Press “Change value” and try to notice what happened — that's your user missing a balance update.",
    Demo: JumpCutDemo,
  },
];

export function NumberLab() {
  const [runId, setRunId] = useState(0);
  const [value, setValue] = useState(BASE_VALUE);

  const reload = () => {
    setRunId((id) => id + 1);
    setValue(BASE_VALUE);
  };

  const change = () =>
    setValue(
      (v) =>
        v +
        (Math.random() > 0.4 ? 1 : -1) * (100 + Math.round(Math.random() * 800)),
    );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-muted/40 p-4">
        <Button onClick={reload}>
          <RotateCwIcon />
          Reload
        </Button>
        <Button variant="secondary" onClick={change}>
          <ShuffleIcon />
          Change value
        </Button>
        <p className="ml-auto text-sm text-muted-foreground">
          Reload replays the loading moment · Change simulates live data
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DEMOS.map(({ key, title, good, note, Demo }) => (
          <div key={key} className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium">
              {title}
              <Badge variant={good ? "secondary" : "destructive"}>
                {good ? "Do" : "Don't"}
              </Badge>
            </p>
            <Card>
              <CardContent className="space-y-1">
                <p className="text-sm text-muted-foreground">Total balance</p>
                {/* key remount replays each demo's load behavior */}
                <div key={runId}>
                  <Demo value={value} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Updated a moment ago
                </p>
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
