"use client";

import { useEffect, useState } from "react";
import { RotateCwIcon } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LOAD_MS = 1400;

function useLoaded(runId: number) {
  const [loadedRun, setLoadedRun] = useState<number | null>(null);
  useEffect(() => {
    const timer = setTimeout(() => setLoadedRun(runId), LOAD_MS);
    return () => clearTimeout(timer);
  }, [runId]);
  return loadedRun === runId;
}

function ProfileContent() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-lg text-secondary-foreground">
        AB
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">Aliya Bekova</p>
        <p className="truncate text-xs text-muted-foreground">
          Product designer · Almaty
        </p>
        <p className="truncate text-xs text-muted-foreground">
          128 posts · 2.4k followers
        </p>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3.5 w-32" />
      </div>
    </div>
  );
}

/** ❌ One-frame swap: calm shimmer, then a jolt. */
function HardSwapDemo({ runId }: { runId: number }) {
  const loaded = useLoaded(runId);
  return loaded ? <ProfileContent /> : <ProfileSkeleton />;
}

/** ✅ Overlapping 200ms opacity fade hides the seam. */
function CrossfadeDemo({ runId }: { runId: number }) {
  const loaded = useLoaded(runId);
  return (
    <div className="relative">
      <motion.div
        animate={{ opacity: loaded ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none"
      >
        <ProfileSkeleton />
      </motion.div>
      <motion.div
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0"
      >
        <ProfileContent />
      </motion.div>
    </div>
  );
}

/** ✅ For rich media: content arrives soft and sharpens into focus. */
function BlurUpDemo({ runId }: { runId: number }) {
  const loaded = useLoaded(runId);
  return (
    <div className="relative">
      <motion.div
        animate={{ opacity: loaded ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        className="pointer-events-none"
      >
        <ProfileSkeleton />
      </motion.div>
      <motion.div
        animate={{
          opacity: loaded ? 1 : 0,
          filter: loaded ? "blur(0px)" : "blur(8px)",
          scale: loaded ? 1 : 1.02,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <ProfileContent />
      </motion.div>
    </div>
  );
}

const DEMOS = [
  {
    key: "hard",
    title: "Hard swap",
    good: false,
    note: "The replacement happens on a single frame. Watch the corner of your eye flinch — the jolt is louder than the wait was.",
    Demo: HardSwapDemo,
  },
  {
    key: "crossfade",
    title: "Crossfade",
    good: true,
    note: "200ms of overlapping opacity and the skeleton appears to develop into content. The seam disappears — as long as dimensions match.",
    Demo: CrossfadeDemo,
  },
  {
    key: "blurup",
    title: "Blur-up",
    good: true,
    note: "Content arrives soft and snaps into focus, like a camera finding its subject. Best for imagery; on long text it reads as a glitch.",
    Demo: BlurUpDemo,
  },
];

export function HandoffLab() {
  const [runId, setRunId] = useState(0);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-muted/40 p-4">
        <Button onClick={() => setRunId((id) => id + 1)}>
          <RotateCwIcon />
          Replay handoff
        </Button>
        <p className="ml-auto text-sm text-muted-foreground">
          All three load for 1.4s, then hand off differently
        </p>
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
                <Demo runId={runId} />
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
