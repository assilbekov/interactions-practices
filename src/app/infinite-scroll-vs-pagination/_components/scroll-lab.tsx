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

/**
 * Virtualized + batched: only the visible window exists in the DOM, and only
 * fetched batches exist in memory. Scrolling within PREFETCH_ROWS of the end
 * of loaded data triggers the next fetch — ideally before the user hits it.
 */
const PREFETCH_ROWS = 8;
const INITIAL_BATCH = 40;

function VirtualizedDemo() {
  const [scrollTop, setScrollTop] = useState(0);
  const [loaded, setLoaded] = useState(INITIAL_BATCH);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const overscan = 3;
  const start = Math.max(0, Math.floor(scrollTop / ROW_H) - overscan);
  const visibleCount = Math.ceil(VIEWPORT_H / ROW_H) + overscan * 2;
  const end = Math.min(loaded, start + visibleCount);
  const rows = useMemo(
    () => Array.from({ length: end - start }, (_, i) => row(start + i)),
    [start, end],
  );

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const top = event.currentTarget.scrollTop;
    setScrollTop(top);
    // Prefetch when the viewport enters the last PREFETCH_ROWS of loaded data.
    if (
      !loading &&
      loaded < TOTAL &&
      top + VIEWPORT_H > (loaded - PREFETCH_ROWS) * ROW_H
    ) {
      setLoading(true);
      setTimeout(() => {
        setLoaded((n) => Math.min(TOTAL, n + BATCH));
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="space-y-2">
      <div
        ref={containerRef}
        className="overflow-y-auto rounded-md border"
        style={{ height: VIEWPORT_H }}
        onScroll={onScroll}
      >
        <div
          style={{
            height: loaded * ROW_H + (loading ? ROW_H : 0),
            position: "relative",
          }}
        >
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
          {loading && (
            <div
              className="absolute right-0 left-0 flex items-center justify-center gap-2 text-xs text-muted-foreground"
              style={{ top: loaded * ROW_H, height: ROW_H }}
            >
              <Loader2Icon className="size-3.5 animate-spin" /> Fetching next{" "}
              {BATCH}…
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <DomCounter count={rows.length} />
        <p className="font-mono text-xs tabular-nums text-muted-foreground">
          fetched <NumberFlow value={loaded} /> /{" "}
          {TOTAL.toLocaleString("en-US")}
        </p>
      </div>
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
    title: "Virtualized + batched fetching",
    good: true,
    note: "Starts with just 40 fetched rows. Scroll within ~8 rows of the end and the next 30 are already being fetched — while the DOM never holds more than the visible window. Both counters stay honest.",
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
