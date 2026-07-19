import type { Metadata } from "next";

import { HandoffLab } from "./_components/handoff-lab";

export const metadata: Metadata = {
  title: "Skeleton → content handoff",
};

export default function SkeletonTransitionsPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Skeleton → content handoff
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Choosing a skeleton is half the decision. The other half is the
          moment real content replaces it — the handoff can be seamless or a
          visible seam.
        </p>
      </section>

      <HandoffLab />

      <section className="max-w-2xl space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold tracking-tight">The verdict</h2>
        <p>
          <strong>Hard swap</strong> — the skeleton vanishes and content
          slams in on one frame. After a second of calm shimmer, the jolt is
          the loudest thing on the page.
        </p>
        <p>
          <strong>Crossfade</strong> — the default. 200ms of overlapping
          opacity hides the seam; the skeleton feels like it develops into
          the content. Requires the skeleton to match content dimensions, or
          the fade reveals a shift.
        </p>
        <p>
          <strong>Blur-up</strong> — for images and rich media: the content
          arrives soft and sharpens. It reads as focus, not replacement —
          but on plain text it can look like a rendering glitch, so use it
          where the metaphor fits.
        </p>
      </section>
    </div>
  );
}
