import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { patterns } from "@/lib/patterns";

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

      <section className="grid gap-4 sm:grid-cols-2">
        {patterns.map((pattern) =>
          pattern.status === "live" ? (
            <Link
              key={pattern.slug}
              href={`/${pattern.slug}`}
              className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
          ) : (
            <Card key={pattern.slug} className="h-full opacity-60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {pattern.title}
                  <Badge variant="outline">Soon</Badge>
                </CardTitle>
                <CardDescription>{pattern.description}</CardDescription>
              </CardHeader>
            </Card>
          ),
        )}
      </section>
    </div>
  );
}
