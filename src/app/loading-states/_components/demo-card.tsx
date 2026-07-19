"use client";

import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export type LoadingVariant = "skeleton" | "spinner" | "blur";

type DemoCardProps = {
  variant: LoadingVariant;
  latency: number;
  runId: number;
};

function useSimulatedLoad(latency: number, runId: number) {
  const run = `${latency}-${runId}`;
  const [loadedRun, setLoadedRun] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoadedRun(run), latency);
    return () => clearTimeout(timer);
  }, [run, latency]);

  return loadedRun !== run;
}

function LoadedContent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-2"
    >
      <p className="text-sm text-muted-foreground">Total balance</p>
      <p className="text-2xl font-semibold tabular-nums">$12,480.00</p>
      <Badge variant="secondary">+4.2% this week</Badge>
    </motion.div>
  );
}

export function DemoCard({ variant, latency, runId }: DemoCardProps) {
  const loading = useSimulatedLoad(latency, runId);

  return (
    <Card>
      <CardContent className="flex min-h-32 flex-col justify-center">
        {variant === "skeleton" &&
          (loading ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-5.5 w-28" />
            </div>
          ) : (
            <LoadedContent />
          ))}

        {variant === "spinner" &&
          (loading ? (
            <div className="flex justify-center">
              <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <LoadedContent />
          ))}

        {variant === "blur" && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total balance</p>
            <motion.p
              animate={{ filter: loading ? "blur(6px)" : "blur(0px)" }}
              transition={{ duration: 0.25 }}
              className="text-2xl font-semibold tabular-nums select-none"
            >
              $12,480.00
            </motion.p>
            <Badge variant="secondary">
              <motion.span
                animate={{ filter: loading ? "blur(4px)" : "blur(0px)" }}
                transition={{ duration: 0.25 }}
                className="select-none"
              >
                +4.2%
              </motion.span>
              this week
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
