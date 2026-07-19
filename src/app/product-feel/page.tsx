import type { Metadata } from "next";

import { FeelLab } from "./_components/feel-lab";

export const metadata: Metadata = {
  title: "Product feel",
};

export default function ProductFeelPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Product feel</h1>
        <p className="max-w-2xl text-muted-foreground">
          Before a user reads a single word, a few quiet decisions have already
          told them what kind of product they&apos;re in: how round the corners
          are, how big the controls are, how much air sits between elements,
          and what typeface carries the text.
        </p>
      </section>

      <section className="max-w-2xl space-y-4 text-sm leading-relaxed">
        <p>
          <strong>Radius</strong> sets the tone. Sharp corners (0–4px) read as
          technical, precise, professional — an instrument. Large radii
          (12–24px) read as friendly, personal, forgiving. Neither is better:
          a bank with playful pills feels unserious, a journaling app with
          razor corners feels cold.
        </p>
        <p>
          <strong>Control size</strong> sets the stakes. A 36px button says
          &quot;power user, you won&apos;t miss.&quot; A 48px button says
          &quot;this action matters — we made it impossible to miss&quot;
          (Fitts&apos;s law). Consumer products live at 40–48px; dense pro
          tools go smaller because screen space earns its keep.
        </p>
        <p>
          <strong>Whitespace</strong> sets the pace of reading. Compact gaps
          let a trader scan forty rows without scrolling; airy gaps let a
          checkout show one decision at a time. Density signals how much the
          product expects you to process per glance.
        </p>
        <p>
          <strong>Typeface</strong> sets the voice. A mono face says terminal,
          data, precision. A humanist sans says approachable and safe. The
          same table feels like a trading desk in JetBrains Mono and like a
          banking app in Inter.
        </p>
      </section>

      <FeelLab />
    </div>
  );
}
