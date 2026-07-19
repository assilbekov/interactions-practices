import type { Metadata } from "next";

import { ComparisonLab } from "./_components/comparison-lab";

export const metadata: Metadata = {
  title: "Loading states",
};

export default function LoadingStatesPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Loading states
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          The industry default is a skeleton. But if your API responds fast, a
          skeleton makes the app feel slower than it is. Drag the latency
          slider and watch each option flip from right to wrong.
        </p>
      </section>

      <ComparisonLab />

      <section className="max-w-2xl space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold tracking-tight">The verdict</h2>
        <p>
          <strong>Skeleton</strong> — good for slow loads (2s+) and unknown
          content. For quick loads it makes the app feel slower than it is.
        </p>
        <p>
          <strong>Spinner</strong> — fast to build, bad UX. Fine for
          prototyping.
        </p>
        <p>
          <strong>Blur + light skeletons</strong> — keep labels visible, blur
          values, light skeletons for badges. Perfect for dashboards and quick
          updates.
        </p>
      </section>
    </div>
  );
}
