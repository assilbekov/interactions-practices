"use client";

import { useState } from "react";
import NumberFlow from "@number-flow/react";
import {
  HeartIcon,
  Loader2Icon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const START_LIKES = 128;

type NetworkMode = "reliable" | "flaky" | "down";

const NETWORK_LABEL: Record<NetworkMode, string> = {
  reliable: "Reliable",
  flaky: "Flaky — 30% fail",
  down: "Down — all fail",
};

function useNetwork() {
  const [latency, setLatency] = useState(1200);
  const [mode, setMode] = useState<NetworkMode>("flaky");
  const shouldFail = () =>
    mode === "down" || (mode === "flaky" && Math.random() < 0.3);
  return { latency, setLatency, mode, setMode, shouldFail };
}

type Network = ReturnType<typeof useNetwork>;

/* ---------------------------------- likes --------------------------------- */

type LikeState = {
  ui: number;
  server: number;
  liked: boolean;
  pending: boolean;
};

const initialLikes = (): LikeState => ({
  ui: START_LIKES,
  server: START_LIKES,
  liked: false,
  pending: false,
});

function LikeCard({
  title,
  good,
  note,
  state,
  onClick,
}: {
  title: string;
  good: boolean;
  note: string;
  state: LikeState;
  onClick: () => void;
}) {
  const diverged = state.ui !== state.server && !state.pending;

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
          <Button
            variant="outline"
            onClick={onClick}
            disabled={state.pending}
            aria-pressed={state.liked}
            className={cn(state.liked && "text-destructive")}
          >
            {state.pending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <HeartIcon className={cn("size-4", state.liked && "fill-current")} />
            )}
            <NumberFlow value={state.ui} />
          </Button>
          <p
            className={cn(
              "font-mono text-xs tabular-nums",
              diverged ? "font-medium text-destructive" : "text-muted-foreground",
            )}
          >
            server: {state.server}
            {diverged && " — out of sync!"}
          </p>
        </CardContent>
      </Card>
      <p className="text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

function LikesSection({ network }: { network: Network }) {
  const [noRollback, setNoRollback] = useState<LikeState>(initialLikes);
  const [waiting, setWaiting] = useState<LikeState>(initialLikes);
  const [rollback, setRollback] = useState<LikeState>(initialLikes);

  const clickNoRollback = () => {
    const wasLiked = noRollback.liked;
    const delta = wasLiked ? -1 : 1;
    setNoRollback((s) => ({ ...s, ui: s.ui + delta, liked: !wasLiked }));
    const fail = network.shouldFail();
    setTimeout(() => {
      if (!fail) setNoRollback((s) => ({ ...s, server: s.server + delta }));
    }, network.latency);
  };

  const clickWaiting = () => {
    const wasLiked = waiting.liked;
    const delta = wasLiked ? -1 : 1;
    setWaiting((s) => ({ ...s, pending: true }));
    const fail = network.shouldFail();
    setTimeout(() => {
      if (fail) {
        setWaiting((s) => ({ ...s, pending: false }));
        toast.error("Like failed", { description: "Please try again." });
      } else {
        setWaiting((s) => ({
          ...s,
          pending: false,
          ui: s.ui + delta,
          server: s.server + delta,
          liked: !wasLiked,
        }));
      }
    }, network.latency);
  };

  const clickRollback = () => {
    const wasLiked = rollback.liked;
    const delta = wasLiked ? -1 : 1;
    setRollback((s) => ({ ...s, ui: s.ui + delta, liked: !wasLiked }));
    const fail = network.shouldFail();
    setTimeout(() => {
      if (fail) {
        setRollback((s) => ({ ...s, ui: s.ui - delta, liked: wasLiked }));
        toast.error("Couldn't save your like — reverted");
      } else {
        setRollback((s) => ({ ...s, server: s.server + delta }));
      }
    }, network.latency);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <LikeCard
        title="Optimistic, no rollback"
        good={false}
        note="Feels great — until a request fails. The UI count silently drifts from the server and the user's like never existed."
        state={noRollback}
        onClick={clickNoRollback}
      />
      <LikeCard
        title="Wait for server"
        good
        note="Honest but slow — at high latency a trivial action feels broken. Right for payments, wrong for likes."
        state={waiting}
        onClick={clickWaiting}
      />
      <LikeCard
        title="Optimistic + rollback"
        good
        note="Instant response; failures revert with an apology toast. UI and server always reconcile — the default for cheap actions."
        state={rollback}
        onClick={clickRollback}
      />
    </div>
  );
}

/* ------------------------------- quantity --------------------------------- */

function QuantitySection({ network }: { network: Network }) {
  const [ui, setUi] = useState(4);
  const [server, setServer] = useState(4);
  const [pending, setPending] = useState(0);

  const change = (delta: number) => {
    if (ui + delta < 0) return;
    setUi((v) => v + delta);
    setPending((p) => p + 1);
    const fail = network.shouldFail();
    setTimeout(() => {
      setPending((p) => p - 1);
      if (fail) {
        setUi((v) => v - delta);
        toast.error(
          `Seat ${delta > 0 ? "reservation" : "release"} rejected — reverted`,
        );
      } else {
        setServer((v) => v + delta);
      }
    }, network.latency);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reserve seats</CardTitle>
        <CardDescription>
          Every +/- is a backend approval. Optimistic with rollback: the count
          moves instantly, rejected changes bounce back.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            aria-label="Release one seat"
            onClick={() => change(-1)}
            disabled={ui === 0}
          >
            <MinusIcon />
          </Button>
          <span className="w-16 text-center font-mono text-3xl font-semibold tabular-nums">
            <NumberFlow value={ui} />
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Reserve one seat"
            onClick={() => change(1)}
          >
            <PlusIcon />
          </Button>
          {pending > 0 && (
            <Badge variant="outline" className="gap-1">
              <Loader2Icon className="size-3 animate-spin" />
              syncing {pending}
            </Badge>
          )}
        </div>
        <p className="font-mono text-xs tabular-nums text-muted-foreground">
          server: {server}
          {pending === 0 && server !== ui && " — out of sync!"}
        </p>
      </CardContent>
    </Card>
  );
}

/* -------------------------------- basket ---------------------------------- */

const CLOTHES = [
  { id: "tee", name: "Box Logo Tee", emoji: "👕", price: 32 },
  { id: "hoodie", name: "Heavy Hoodie", emoji: "🧥", price: 78 },
  { id: "sneakers", name: "Court Sneakers", emoji: "👟", price: 120 },
  { id: "cap", name: "Corduroy Cap", emoji: "🧢", price: 28 },
];

type BasketEntry = {
  uid: number;
  itemId: string;
  status: "syncing" | "confirmed";
};

function BasketSection({ network }: { network: Network }) {
  const [entries, setEntries] = useState<BasketEntry[]>([]);
  const [nextUid, setNextUid] = useState(1);

  const add = (itemId: string) => {
    const uid = nextUid;
    setNextUid((id) => id + 1);
    setEntries((prev) => [...prev, { uid, itemId, status: "syncing" }]);
    const fail = network.shouldFail();
    const item = CLOTHES.find((c) => c.id === itemId)!;
    setTimeout(() => {
      if (fail) {
        setEntries((prev) => prev.filter((entry) => entry.uid !== uid));
        toast.error(`${item.name} is out of stock`, {
          description: "Removed from your basket.",
        });
      } else {
        setEntries((prev) =>
          prev.map((entry) =>
            entry.uid === uid ? { ...entry, status: "confirmed" } : entry,
          ),
        );
      }
    }, network.latency);
  };

  const total = entries
    .filter((entry) => entry.status === "confirmed")
    .reduce(
      (sum, entry) => sum + CLOTHES.find((c) => c.id === entry.itemId)!.price,
      0,
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add to basket</CardTitle>
        <CardDescription>
          Items land in the basket instantly in a syncing state; stock checks
          confirm some and bounce others.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {CLOTHES.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              className="justify-start"
              onClick={() => add(item.id)}
            >
              <span>{item.emoji}</span>
              <span className="truncate">{item.name}</span>
              <span className="ml-auto font-mono text-xs tabular-nums text-muted-foreground">
                ${item.price}
              </span>
            </Button>
          ))}
        </div>

        <div className="space-y-1.5 rounded-lg border bg-muted/30 p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ShoppingBagIcon className="size-3.5" />
            Basket
          </p>
          {entries.length === 0 && (
            <p className="text-sm text-muted-foreground">Empty — add something.</p>
          )}
          {entries.map((entry) => {
            const item = CLOTHES.find((c) => c.id === entry.itemId)!;
            return (
              <div
                key={entry.uid}
                className={cn(
                  "flex items-center gap-2 text-sm transition-opacity",
                  entry.status === "syncing" && "opacity-50",
                )}
              >
                <span>{item.emoji}</span>
                <span>{item.name}</span>
                {entry.status === "syncing" && (
                  <Loader2Icon className="size-3 animate-spin text-muted-foreground" />
                )}
                <span className="ml-auto font-mono text-xs tabular-nums">
                  ${item.price}
                </span>
              </div>
            );
          })}
          <div className="flex justify-between border-t pt-1.5 text-sm font-medium">
            <span>Confirmed total</span>
            <span className="font-mono tabular-nums">
              <NumberFlow
                value={total}
                format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
              />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* --------------------------------- lab ------------------------------------ */

export function OptimisticLab() {
  const network = useNetwork();

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-6 rounded-xl border bg-muted/40 p-4">
        <div className="flex min-w-56 flex-1 items-center gap-3">
          <span className="text-sm whitespace-nowrap text-muted-foreground">
            API latency
          </span>
          <Slider
            value={[network.latency]}
            onValueChange={([value]) => network.setLatency(value)}
            min={200}
            max={3000}
            step={100}
            aria-label="Simulated API latency"
          />
          <span className="w-14 text-right text-sm font-medium tabular-nums">
            <NumberFlow
              value={network.latency / 1000}
              format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
              suffix="s"
            />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Network</span>
          <Select
            value={network.mode}
            onValueChange={(mode) => network.setMode(mode as NetworkMode)}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(NETWORK_LABEL) as NetworkMode[]).map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {NETWORK_LABEL[mode]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <LikesSection network={network} />

      <div className="grid gap-4 lg:grid-cols-2">
        <QuantitySection network={network} />
        <BasketSection network={network} />
      </div>
    </section>
  );
}
