"use client";

import { useState } from "react";
import NumberFlow from "@number-flow/react";
import { HeartIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const START_LIKES = 128;

type LikeState = {
  ui: number;
  server: number;
  liked: boolean;
  pending: boolean;
};

const initial = (): LikeState => ({
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

export function OptimisticLab() {
  const [latency, setLatency] = useState(1200);
  const [failing, setFailing] = useState(false);
  const [rollback, setRollback] = useState<LikeState>(initial);
  const [waiting, setWaiting] = useState<LikeState>(initial);
  const [noRollback, setNoRollback] = useState<LikeState>(initial);

  // Optimistic + rollback: instant UI, revert and apologize on failure.
  const clickRollback = () => {
    const wasLiked = rollback.liked;
    const delta = wasLiked ? -1 : 1;
    setRollback((s) => ({ ...s, ui: s.ui + delta, liked: !wasLiked }));
    setTimeout(() => {
      if (failing) {
        setRollback((s) => ({ ...s, ui: s.ui - delta, liked: wasLiked }));
        toast.error("Couldn't save your like — reverted", {
          description: "The server rejected the request.",
        });
      } else {
        setRollback((s) => ({ ...s, server: s.server + delta }));
      }
    }, latency);
  };

  // Wait for server: honest, but the user stares at a spinner.
  const clickWaiting = () => {
    const wasLiked = waiting.liked;
    const delta = wasLiked ? -1 : 1;
    setWaiting((s) => ({ ...s, pending: true }));
    setTimeout(() => {
      if (failing) {
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
    }, latency);
  };

  // Optimistic, no rollback: failures are silently swallowed.
  const clickNoRollback = () => {
    const wasLiked = noRollback.liked;
    const delta = wasLiked ? -1 : 1;
    setNoRollback((s) => ({ ...s, ui: s.ui + delta, liked: !wasLiked }));
    setTimeout(() => {
      if (!failing) {
        setNoRollback((s) => ({ ...s, server: s.server + delta }));
      }
    }, latency);
  };

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
            min={200}
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
        <div className="flex items-center gap-2">
          <Label htmlFor="fail-switch">Fail requests</Label>
          <Switch id="fail-switch" checked={failing} onCheckedChange={setFailing} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <LikeCard
          title="Optimistic + rollback"
          good
          note="Instant response; on failure the like reverts with an apology toast. UI and server always reconcile — try it with failures on."
          state={rollback}
          onClick={clickRollback}
        />
        <LikeCard
          title="Wait for server"
          good
          note="Honest but slow — at high latency the button feels broken for a trivial action. Right for payments, wrong for likes."
          state={waiting}
          onClick={clickWaiting}
        />
        <LikeCard
          title="Optimistic, no rollback"
          good={false}
          note="Feels identical to the first card — until a request fails. Then the UI count silently drifts from the server and the user's like never existed."
          state={noRollback}
          onClick={clickNoRollback}
        />
      </div>
    </section>
  );
}
