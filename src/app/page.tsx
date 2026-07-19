"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { patterns } from "@/lib/patterns";

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Pattern comparison lab
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          One UX decision per page. Competing options run side by side under
          the same simulated conditions, so you can see — and feel — the
          tradeoff.
        </p>
      </section>

      <motion.section
        variants={grid}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2"
      >
        {patterns.map((pattern) =>
          pattern.status === "live" ? (
            <motion.div key={pattern.slug} variants={item} whileHover={{ y: -3 }}>
              <Link
                href={`/${pattern.slug}`}
                className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="h-full transition-colors group-hover:border-foreground/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {pattern.title}
                      <Badge variant="secondary">Live</Badge>
                    </CardTitle>
                    <CardDescription>{pattern.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ) : (
            <motion.div key={pattern.slug} variants={item}>
              <Card className="h-full opacity-60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {pattern.title}
                    <Badge variant="outline">Soon</Badge>
                  </CardTitle>
                  <CardDescription>{pattern.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ),
        )}
      </motion.section>
    </div>
  );
}
