"use client";

import { useRef, useState } from "react";
import { CheckIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CONFETTI_COLORS = [
  "var(--primary)",
  "var(--secondary)",
  "var(--accent)",
  "var(--destructive)",
];

type Particle = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  color: string;
  size: number;
};

function burst(seed: number): Particle[] {
  return Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2 + (seed % 10) / 10;
    const distance = 50 + ((i * seed) % 40);
    return {
      id: seed * 100 + i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 30,
      rotate: ((i * 137 + seed * 31) % 360) - 180,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 5 + (i % 3) * 2,
    };
  });
}

/** ❌ The state changes somewhere, but the click point stays silent. */
function SilentDemo() {
  const [count, setCount] = useState(0);
  return (
    <div className="space-y-3">
      <Button variant="outline" className="w-full" onClick={() => setCount((c) => c + 1)}>
        Complete workout
      </Button>
      <p className="font-mono text-xs tabular-nums text-muted-foreground">
        completed: {count} — did the click work? You checked this line to find
        out.
      </p>
    </div>
  );
}

/** ✅ In-place acknowledgment: check morph now, toast for the record. */
function SubtleDemo() {
  const [done, setDone] = useState(false);
  const complete = () => {
    if (done) return;
    setDone(true);
    toast.success("Workout completed", { description: "3 this week — nice pace." });
    setTimeout(() => setDone(false), 1600);
  };
  return (
    <div className="space-y-3">
      <Button className="w-full" onClick={complete}>
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.span
              key="check"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="flex items-center gap-1.5"
            >
              <CheckIcon className="size-4" /> Completed
            </motion.span>
          ) : (
            <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Complete workout
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
      <p className="text-xs text-muted-foreground">
        Acknowledged where you clicked, logged in a toast. Calm at any
        frequency.
      </p>
    </div>
  );
}

/** 🎉 Reserved for rare milestones — bursts from the click point itself. */
function ConfettiDemo() {
  const [particles, setParticles] = useState<
    (Particle & { originX: number; originY: number })[]
  >([]);
  const [seed, setSeed] = useState(1);
  const areaRef = useRef<HTMLDivElement>(null);

  const celebrate = (event: React.MouseEvent) => {
    const rect = areaRef.current?.getBoundingClientRect();
    const originX = rect ? event.clientX - rect.left : 0;
    const originY = rect ? event.clientY - rect.top : 0;
    setParticles(burst(seed).map((p) => ({ ...p, originX, originY })));
    setSeed((s) => s + 1);
    setTimeout(() => setParticles([]), 900);
  };

  return (
    <div ref={areaRef} className="relative space-y-3">
      <Button className="w-full" onClick={celebrate}>
        Finish 30-day challenge
      </Button>
      <div className="pointer-events-none absolute inset-0 overflow-visible">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: 0,
                rotate: p.rotate,
                scale: 0.6,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute rounded-[2px]"
              style={{
                left: p.originX,
                top: p.originY,
                width: p.size,
                height: p.size,
                background: p.color,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      <p className="text-xs text-muted-foreground">
        Perfect once. Now click it three times in a row — that&apos;s what
        daily confetti feels like by Thursday.
      </p>
    </div>
  );
}

const DEMOS = [
  {
    key: "silent",
    title: "Silent state change",
    good: false,
    note: "Success that doesn't announce itself gets repeated — users click again just to be sure, and duplicate actions follow.",
    Demo: SilentDemo,
  },
  {
    key: "subtle",
    title: "Check morph + toast",
    good: true,
    note: "The default: instant in-place acknowledgment, a toast for the record, zero fatigue on repetition.",
    Demo: SubtleDemo,
  },
  {
    key: "confetti",
    title: "Confetti burst",
    good: true,
    note: "Do — but only for the rare stuff. Milestones a user hits a few times ever, not actions they take before lunch.",
    Demo: ConfettiDemo,
  },
];

export function SuccessLab() {
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
