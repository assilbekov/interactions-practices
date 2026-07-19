import type { Metadata } from "next";

import { FeelExplorer } from "./_components/feel-explorer";

export const metadata: Metadata = {
  title: "Product feel",
};

export default function ProductFeelPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Product feel</h1>
        <p className="max-w-2xl text-muted-foreground">
          Before a user reads a single word, three quiet decisions have already
          told them what kind of product they&apos;re in: how round the corners
          are, how big the controls are, and how fast things move.
        </p>
      </section>

      <section className="max-w-2xl space-y-4 text-sm leading-relaxed">
        <p>
          <strong>Radius</strong> sets the tone. Sharp corners (0–4px) read as
          technical, precise, professional — an instrument. Large radii
          (12–24px) read as friendly, personal, forgiving. Neither is better;
          a bank with playful pills feels unserious, a journaling app with
          razor corners feels cold.
        </p>
        <p>
          <strong>Control size</strong> sets the stakes. A 32px button says
          &quot;power user, you won&apos;t miss.&quot; A 48px button says
          &quot;this action matters — we made it impossible to miss&quot;
          (Fitts&apos;s law: bigger and closer targets are faster and safer to
          hit). Most consumer products live at 40–48px; dense pro tools go
          smaller because screen space earns its keep.
        </p>
        <p>
          <strong>Motion pace</strong> sets the personality. Stripe can afford
          300–400ms transitions: you perform two or three actions, the stakes
          are high, and unhurried motion signals &quot;we take our time to get
          your money right.&quot; A trading platform must do the opposite —
          every animation stands between the trader and confirmation, so
          motion drops to near-zero because speed <em>is</em> the trust
          signal. Same physics, opposite conclusions — driven by how often the
          user acts and what it costs to wait.
        </p>
      </section>

      <FeelExplorer />
    </div>
  );
}
