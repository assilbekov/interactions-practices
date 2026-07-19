"use client";

import { useMemo, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TOTAL = 10000;
const ROW_H = 40;
const VIEWPORT_H = 320;
const PAGE_SIZE = 8;
const BATCH = 30;

type Row = { id: number; name: string; amount: number };

// Deterministic mock rows — same on server and client.
const row = (i: number): Row => ({
  id: i + 1,
  name: `Transaction #${String(i + 1).padStart(5, "0")}`,
  amount: ((i * 7919) % 90000) / 100 + 5,
});

function RowView({ data }: { data: Row }) {
  return (
    <div
      className="flex items-center justify-between border-b px-3 text-sm"
      style={{ height: ROW_H }}
    >
      <span className="truncate">{data.name}</span>
      <span className="font-mono text-xs tabular-nums text-muted-foreground">
        ${data.amount.toFixed(2)}
      </span>
    </div>
  );
}

function DomCounter({ count }: { count: number }) {
  const heavy = count > 300;
  return (
    <p
      className={cn(
        "font-mono text-xs tabular-nums",
        heavy ? "font-medium text-destructive" : "text-muted-foreground",
      )}
    >
      DOM rows: <NumberFlow value={count} /> of {TOTAL.toLocaleString("en-US")}
      {heavy && " — growing forever"}
    </p>
  );
}

/** Pagination: landmarks, reachable footer, constant DOM. */
function PaginationDemo() {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(TOTAL / PAGE_SIZE);
  const rows = useMemo(
    () =>
      Array.from({ length: PAGE_SIZE }, (_, i) => row(page * PAGE_SIZE + i)),
    [page],
  );

  return (
    <div className="space-y-2">
      <div className="rounded-md border" style={{ height: VIEWPORT_H }}>
        {rows.map((data) => (
          <RowView key={data.id} data={data} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <DomCounter count={PAGE_SIZE} />
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            page <NumberFlow value={page + 1} /> /{" "}
            {pageCount.toLocaleString("en-US")}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={page >= pageCount - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Naive infinite scroll: every loaded row stays in the DOM. */
function NaiveInfiniteDemo() {
  const [loaded, setLoaded] = useState(BATCH);
  const [loading, setLoading] = useState(false);

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    if (
      !loading &&
      loaded < TOTAL &&
      el.scrollTop + el.clientHeight > el.scrollHeight - ROW_H * 3
    ) {
      setLoading(true);
      setTimeout(() => {
        setLoaded((n) => Math.min(TOTAL, n + BATCH));
        setLoading(false);
      }, 500);
    }
  };

  const rows = useMemo(
    () => Array.from({ length: loaded }, (_, i) => row(i)),
    [loaded],
  );

  return (
    <div className="space-y-2">
      <div
        className="overflow-y-auto rounded-md border"
        style={{ height: VIEWPORT_H }}
        onScroll={onScroll}
      >
        {rows.map((data) => (
          <RowView key={data.id} data={data} />
        ))}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
            <Loader2Icon className="size-3.5 animate-spin" /> Loading more…
          </div>
        )}
      </div>
      <DomCounter count={loaded} />
    </div>
  );
}

/** Virtualized: only the visible window exists in the DOM. */
function VirtualizedDemo() {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const overscan = 3;
  const start = Math.max(0, Math.floor(scrollTop / ROW_H) - overscan);
  const visibleCount = Math.ceil(VIEWPORT_H / ROW_H) + overscan * 2;
  const end = Math.min(TOTAL, start + visibleCount);
  const rows = useMemo(
    () => Array.from({ length: end - start }, (_, i) => row(start + i)),
    [start, end],
  );

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="overflow-y-auto rounded-md border"
        style={{ height: VIEWPORT_H }}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        <div style={{ height: TOTAL * ROW_H, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: start * ROW_H,
              left: 0,
              right: 0,
            }}
          >
            {rows.map((data) => (
              <RowView key={data.id} data={data} />
            ))}
          </div>
        </div>
      </div>
      <DomCounter count={rows.length} />
    </div>
  );
}

const DEMOS = [
  {
    key: "pagination",
    title: "Pagination",
    good: true,
    note: "Page 512 of 1,250 is a place — bookmarkable, citable, returnable. Eight rows in the DOM no matter where you are.",
    Demo: PaginationDemo,
  },
  {
    key: "naive",
    title: "Infinite scroll, naive",
    good: false,
    note: "Keep scrolling and watch the counter climb — every batch stays in the DOM forever. This is why long feed sessions get janky.",
    Demo: NaiveInfiniteDemo,
  },
  {
    key: "virtual",
    title: "Infinite scroll, virtualized",
    good: true,
    note: "Fling the scrollbar anywhere in 10,000 rows — the DOM never holds more than the window you can see, plus a little overscan.",
    Demo: VirtualizedDemo,
  },
];

export function ScrollLab() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
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
              <Demo />
            </CardContent>
          </Card>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {note}
          </p>
        </div>
      ))}
    </section>
  );
}
