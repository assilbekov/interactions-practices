import type { Metadata } from "next";

import { NumberLab } from "./_components/number-lab";

export const metadata: Metadata = {
  title: "Number transitions",
};

export default function NumberTransitionsPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Number transitions
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          A number has two moments: when it loads, and when it changes. Each
          needs a different treatment — and most apps get at least one wrong.
        </p>
      </section>

      <NumberLab />

      <section className="max-w-2xl space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold tracking-tight">The verdict</h2>
        <p>
          <strong>On load, don&apos;t animate.</strong> Blur a placeholder
          value while loading, then simply un-blur. The number was always that
          value — rolling from zero animates a change that never happened and
          teaches users to distrust the motion.
        </p>
        <p>
          <strong>On change, always animate.</strong> Once loaded, a value
          that changes should roll (NumberFlow) — the motion is the
          notification that something happened and what direction it went.
        </p>
        <p>
          <strong>Never let numbers move the layout.</strong> The blurred
          placeholder reserves exact space; popping a number into empty space
          shifts everything below it.
        </p>
      </section>
    </div>
  );
}
