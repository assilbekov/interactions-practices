"use client";

import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const SYMBOL = "ACME";
const START_PRICE = 182.4;
const POINTS = 64;

// Deterministic seed series so SSR and hydration render identical markup;
// live randomness only starts client-side in the tick interval.
function seedSeries(): number[] {
  let seed = 42;
  let price = START_PRICE;
  const series: number[] = [];
  for (let i = 0; i < POINTS; i++) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    price = +(price + (seed / 4294967296 - 0.5) * 1.4).toFixed(2);
    series.push(price);
  }
  return series;
}

type OpenOrder = {
  id: number;
  side: "buy" | "sell";
  qty: number;
  limit: number;
};

type Fill = {
  id: number;
  side: "buy" | "sell";
  qty: number;
  price: number;
  kind: "market" | "limit";
};

type Book = {
  series: number[];
  cash: number;
  position: number;
  openOrders: OpenOrder[];
  fills: Fill[];
  nextId: number;
};

const INITIAL_BOOK: Book = {
  series: seedSeries(),
  cash: 10000,
  position: 0,
  openOrders: [],
  fills: [],
  nextId: 1,
};

// Fill limit orders that the new price has crossed.
function settle(book: Book, price: number): Book {
  let { cash, position } = book;
  const fills = [...book.fills];
  const remaining: OpenOrder[] = [];
  for (const order of book.openOrders) {
    const crossed =
      order.side === "buy" ? price <= order.limit : price >= order.limit;
    const affordable =
      order.side === "buy"
        ? cash >= order.qty * order.limit
        : position >= order.qty;
    if (crossed && affordable) {
      if (order.side === "buy") {
        cash -= order.qty * order.limit;
        position += order.qty;
      } else {
        cash += order.qty * order.limit;
        position -= order.qty;
      }
      fills.unshift({
        id: order.id,
        side: order.side,
        qty: order.qty,
        price: order.limit,
        kind: "limit",
      });
    } else {
      remaining.push(order);
    }
  }
  return { ...book, cash, position, openOrders: remaining, fills: fills.slice(0, 6) };
}

function PriceChart({ series }: { series: number[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 600;
  const height = 180;
  const pad = 6;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const x = (i: number) => (i / (series.length - 1)) * width;
  const y = (v: number) => pad + (1 - (v - min) / span) * (height - pad * 2);
  const points = series.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const last = series[series.length - 1];
  const up = last >= series[series.length - 2];

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium">{SYMBOL} · last</p>
        <p
          className={cn(
            "font-mono text-lg font-semibold tabular-nums",
            up ? "text-primary" : "text-destructive",
          )}
        >
          ${last.toFixed(2)}
        </p>
      </div>
      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="h-40 w-full"
          onMouseMove={(event) => {
            const rect = svgRef.current?.getBoundingClientRect();
            if (!rect) return;
            const i = Math.round(
              ((event.clientX - rect.left) / rect.width) * (series.length - 1),
            );
            setHover(Math.max(0, Math.min(series.length - 1, i)));
          }}
          onMouseLeave={() => setHover(null)}
        >
          {[0.25, 0.5, 0.75].map((t) => (
            <line
              key={t}
              x1={0}
              x2={width}
              y1={pad + t * (height - pad * 2)}
              y2={pad + t * (height - pad * 2)}
              className="stroke-border"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <polyline
            points={`0,${height} ${points} ${width},${height}`}
            fill="var(--primary)"
            opacity={0.08}
          />
          <polyline
            points={points}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
          {hover !== null && (
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={0}
              y2={height}
              className="stroke-muted-foreground"
              strokeWidth={1}
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
        {hover !== null && (
          <div className="pointer-events-none absolute top-1 left-1 rounded-md border bg-popover px-2 py-1 font-mono text-xs tabular-nums shadow-sm">
            ${series[hover].toFixed(2)}
          </div>
        )}
      </div>
      <div className="flex justify-between font-mono text-[10px] tabular-nums text-muted-foreground">
        <span>low ${min.toFixed(2)}</span>
        <span>high ${max.toFixed(2)}</span>
      </div>
    </div>
  );
}

function OrderTicket({
  book,
  setBook,
}: {
  book: Book;
  setBook: React.Dispatch<React.SetStateAction<Book>>;
}) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [type, setType] = useState<"market" | "limit">("market");
  const [qty, setQty] = useState("10");
  const [limit, setLimit] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [error, setError] = useState<string | null>(null);

  const price = book.series[book.series.length - 1];
  const quantity = Number(qty);
  const limitPrice = Number(limit);
  const slippagePct = Number(slippage);

  // Market orders execute at the worst-case bound of the slippage tolerance.
  const marketFill =
    side === "buy"
      ? price * (1 + slippagePct / 100)
      : price * (1 - slippagePct / 100);
  const estimate =
    type === "market" ? quantity * marketFill : quantity * (limitPrice || 0);

  const submit = () => {
    setError(null);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError("Quantity must be positive.");
      return;
    }
    if (type === "limit" && (!Number.isFinite(limitPrice) || limitPrice <= 0)) {
      setError("Limit price must be positive.");
      return;
    }
    if (side === "sell" && quantity > book.position) {
      setError(`You only hold ${book.position} ${SYMBOL}.`);
      return;
    }
    if (side === "buy" && estimate > book.cash) {
      setError("Insufficient cash for this order.");
      return;
    }

    setBook((prev) => {
      const id = prev.nextId;
      if (type === "market") {
        const fill = +marketFill.toFixed(2);
        return {
          ...prev,
          nextId: id + 1,
          cash: side === "buy" ? prev.cash - quantity * fill : prev.cash + quantity * fill,
          position: side === "buy" ? prev.position + quantity : prev.position - quantity,
          fills: [
            { id, side, qty: quantity, price: fill, kind: "market" as const },
            ...prev.fills,
          ].slice(0, 6),
        };
      }
      return {
        ...prev,
        nextId: id + 1,
        openOrders: [
          ...prev.openOrders,
          { id, side, qty: quantity, limit: +limitPrice.toFixed(2) },
        ],
      };
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-1.5">
        <Button
          variant={side === "buy" ? "default" : "outline"}
          onClick={() => setSide("buy")}
        >
          Buy
        </Button>
        <Button
          variant={side === "sell" ? "destructive" : "outline"}
          onClick={() => setSide("sell")}
        >
          Sell
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select
            value={type}
            onValueChange={(v) => setType(v as "market" | "limit")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market">Market</SelectItem>
              <SelectItem value="limit">Limit</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="trade-qty">Quantity</Label>
          <Input
            id="trade-qty"
            type="number"
            min="1"
            value={qty}
            onChange={(event) => setQty(event.target.value)}
            className="font-mono tabular-nums"
          />
        </div>
      </div>

      {type === "limit" ? (
        <div className="space-y-1.5">
          <Label htmlFor="trade-limit">Limit price</Label>
          <Input
            id="trade-limit"
            type="number"
            min="0"
            step="0.01"
            placeholder={price.toFixed(2)}
            value={limit}
            onChange={(event) => setLimit(event.target.value)}
            className="font-mono tabular-nums"
          />
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label>Slippage tolerance</Label>
          <Select value={slippage} onValueChange={setSlippage}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.1">0.1%</SelectItem>
              <SelectItem value="0.5">0.5%</SelectItem>
              <SelectItem value="1">1.0%</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2 text-sm">
        <span className="text-muted-foreground">
          {type === "market" ? "Est. worst-case" : "Order value"}
        </span>
        <span className="font-mono font-medium tabular-nums">
          ${Number.isFinite(estimate) ? estimate.toFixed(2) : "0.00"}
        </span>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <Button className="w-full" onClick={submit}>
        {side === "buy" ? "Buy" : "Sell"} {SYMBOL}{" "}
        {type === "market" ? "at market" : `limit ${limit || "—"}`}
      </Button>
    </div>
  );
}

export function TradingModule() {
  const [book, setBook] = useState<Book>(INITIAL_BOOK);

  useEffect(() => {
    const timer = setInterval(() => {
      setBook((prev) => {
        const last = prev.series[prev.series.length - 1];
        const next = +(last + (Math.random() - 0.5) * 1.4).toFixed(2);
        const series = [...prev.series.slice(1), next];
        return settle({ ...prev, series }, next);
      });
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const price = book.series[book.series.length - 1];
  const equity = book.cash + book.position * price;

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Market</CardTitle>
          <CardDescription>
            Simulated feed ticking every 1.5s — limit orders fill when price
            crosses them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PriceChart series={book.series} />
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Cash</p>
              <p className="font-mono font-medium tabular-nums">
                ${book.cash.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Position</p>
              <p className="font-mono font-medium tabular-nums">
                {book.position} {SYMBOL}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Equity</p>
              <p className="font-mono font-medium tabular-nums">
                ${equity.toFixed(2)}
              </p>
            </div>
          </div>

          {book.openOrders.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Open order</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Limit</TableHead>
                  <TableHead className="w-16" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {book.openOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Badge
                        variant={order.side === "buy" ? "secondary" : "destructive"}
                      >
                        {order.side}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {order.qty}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      ${order.limit.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setBook((prev) => ({
                            ...prev,
                            openOrders: prev.openOrders.filter(
                              (o) => o.id !== order.id,
                            ),
                          }))
                        }
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {book.fills.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Recent fills
              </p>
              {book.fills.map((fill) => (
                <p
                  key={`${fill.id}-${fill.price}`}
                  className="font-mono text-xs tabular-nums"
                >
                  <span
                    className={
                      fill.side === "buy" ? "text-primary" : "text-destructive"
                    }
                  >
                    {fill.side.toUpperCase()}
                  </span>{" "}
                  {fill.qty} @ ${fill.price.toFixed(2)}{" "}
                  <span className="text-muted-foreground">({fill.kind})</span>
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Order ticket</CardTitle>
          <CardDescription>
            Market with slippage bound, or resting limit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrderTicket book={book} setBook={setBook} />
        </CardContent>
      </Card>
    </div>
  );
}
