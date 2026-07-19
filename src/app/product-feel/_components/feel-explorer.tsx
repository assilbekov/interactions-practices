"use client";

import { useState, type CSSProperties } from "react";
import { CheckIcon, ZapIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

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
import { MIXER_APPLY_EVENT } from "@/lib/theme-mixer";

type Archetype = {
  key: string;
  name: string;
  tagline: string;
  reasoning: string;
  radiusPx: number;
  controlRem: number;
  motionMs: number;
  actionLabel: string;
  doneLabel: string;
};

const ARCHETYPES: Archetype[] = [
  {
    key: "trading",
    name: "Trading platform",
    tagline: "Speed reads as control",
    reasoning:
      "Dense information, decisions in seconds. Sharp 4px corners and compact 36px controls pack more data on screen, and motion is cut to almost nothing — every millisecond of animation stands between the trader and confirmation. Softness here reads as latency, and latency reads as risk.",
    radiusPx: 4,
    controlRem: 2.25,
    motionMs: 80,
    actionLabel: "Buy 10 AAPL",
    doneLabel: "Filled",
  },
  {
    key: "payments",
    name: "Checkout / payments",
    tagline: "Deliberate feels trustworthy",
    reasoning:
      "Stripe can afford to be slower: you do two or three actions, and the stakes are high. Generous 48px targets make a mis-tap feel impossible, 10px corners keep it approachable, and unhurried 350ms transitions tell the user the product doesn't rush — it takes the time to move your money correctly.",
    radiusPx: 10,
    controlRem: 3,
    motionMs: 350,
    actionLabel: "Pay $49.00",
    doneLabel: "Payment confirmed",
  },
  {
    key: "editor",
    name: "Code editor",
    tagline: "The tool should disappear",
    reasoning:
      "A product you live in for hours must stay quiet. Modest 6px corners and 40px controls keep the chrome from competing with content, and feedback is near-instant — an animation you replay a thousand times a day stops being delight and becomes friction. The perception target is a precision instrument.",
    radiusPx: 6,
    controlRem: 2.5,
    motionMs: 120,
    actionLabel: "Run tests",
    doneLabel: "12 passed",
  },
  {
    key: "notes",
    name: "Notes app",
    tagline: "Soft invites writing",
    reasoning:
      "Low stakes and personal. Large 16px radii and roomy controls feel forgiving, and gentle 250ms motion keeps the app calm rather than demanding. You're inviting thought, not throughput — a bit of softness tells the user nothing here can really go wrong.",
    radiusPx: 16,
    controlRem: 2.75,
    motionMs: 250,
    actionLabel: "Save note",
    doneLabel: "Saved",
  },
];

function ArchetypeCard({ archetype }: { archetype: Archetype }) {
  const [done, setDone] = useState(false);

  const sampleVars: CSSProperties = {
    "--radius": `${archetype.radiusPx / 16}rem`,
    "--control-h": `${archetype.controlRem}rem`,
  } as CSSProperties;

  const run = () => {
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };

  const apply = () => {
    window.dispatchEvent(
      new CustomEvent(MIXER_APPLY_EVENT, {
        detail: {
          radius: archetype.radiusPx / 16,
          control: archetype.controlRem,
        },
      }),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{archetype.name}</CardTitle>
        <CardDescription>{archetype.tagline}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {archetype.reasoning}
        </p>

        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline" className="font-mono tabular-nums">
            radius {archetype.radiusPx}px
          </Badge>
          <Badge variant="outline" className="font-mono tabular-nums">
            controls {archetype.controlRem * 16}px
          </Badge>
          <Badge variant="outline" className="font-mono tabular-nums">
            motion {archetype.motionMs}ms
          </Badge>
        </div>

        {/* Sample UI rendered with this archetype's own radius/height vars */}
        <div
          style={sampleVars}
          className="space-y-3 rounded-xl border bg-muted/30 p-4"
        >
          <Input placeholder="4242 4242 4242 4242" readOnly />
          <div className="flex items-center gap-2">
            <Button onClick={run}>
              <ZapIcon />
              {archetype.actionLabel}
            </Button>
            <AnimatePresence>
              {done && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: archetype.motionMs / 1000 }}
                  className="flex items-center gap-1 text-sm font-medium text-primary"
                >
                  <CheckIcon className="size-4" />
                  {archetype.doneLabel}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={apply}>
          Apply this feel to the whole app
        </Button>
      </CardContent>
    </Card>
  );
}

export function FeelExplorer() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Four products, four feels
        </h2>
        <p className="text-sm text-muted-foreground">
          Each card renders its sample with its own radius and control height —
          the confirmation animates at that product&apos;s pace. Apply one and
          watch the whole app change character.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {ARCHETYPES.map((archetype) => (
          <ArchetypeCard key={archetype.key} archetype={archetype} />
        ))}
      </div>
    </section>
  );
}
