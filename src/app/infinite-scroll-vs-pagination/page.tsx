import type { Metadata } from "next";

import { ScrollLab } from "./_components/scroll-lab";

export const metadata: Metadata = {
  title: "Infinite scroll vs. pagination",
};

export default function InfiniteScrollPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Infinite scroll vs. pagination
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Ten thousand rows, three ways to browse them. Watch the DOM counter
          under each list — it&apos;s the part of this decision users
          don&apos;t see but definitely feel.
        </p>
      </section>

      <ScrollLab />

      <section className="max-w-2xl space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold tracking-tight">The verdict</h2>
        <p>
          <strong>Pagination</strong> — right for tables and anything users
          return to: page 7 is a landmark you can bookmark, cite, and come
          back to. The footer stays reachable. Slower to browse casually.
        </p>
        <p>
          <strong>Naive infinite scroll</strong> — feels effortless at first,
          but every loaded batch stays in the DOM forever. The counter climbs,
          scrolling degrades on long sessions, and position is unrecoverable
          after a refresh.
        </p>
        <p>
          <strong>Virtualized infinite scroll</strong> — the flow of infinite
          with a constant DOM: only the ~12 visible rows exist at any moment,
          whether you&apos;ve scrolled past 100 rows or 10,000. This is what
          feeds actually ship.
        </p>
        <p>
          <strong>And fetch in batches, ahead of the scroll.</strong> Real
          lists never have all the data up front — you start with one batch
          (say 40 rows) and request the next one when the user scrolls within
          the last N rows of what&apos;s loaded, not when they hit the bottom.
          That prefetch threshold is the difference between a seamless feed
          and one that shows a spinner at every batch boundary. Two separate
          budgets, two separate techniques: virtualization bounds the{" "}
          <em>DOM</em>, batched fetching bounds the <em>network and memory</em>{" "}
          — production lists need both.
        </p>
      </section>
    </div>
  );
}
