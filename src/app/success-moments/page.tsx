import type { Metadata } from "next";

import { SuccessLab } from "./_components/success-lab";

export const metadata: Metadata = {
  title: "Success moments",
};

export default function SuccessMomentsPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Success moments
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          How much celebration does a completed action deserve? Match the
          intensity to the rarity — and click each button a few times to feel
          when delight turns into noise.
        </p>
      </section>

      <SuccessLab />

      <section className="max-w-2xl space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold tracking-tight">The verdict</h2>
        <p>
          <strong>Scale celebration to rarity.</strong> A daily action gets a
          checkmark. A weekly milestone gets a toast. Confetti is reserved
          for moments that happen a handful of times in a user&apos;s life —
          first sale, launch day, debt paid off.
        </p>
        <p>
          <strong>Silence reads as failure.</strong> If nothing visibly
          changes at the moment of success, users repeat the action —
          the quietest option still needs a state change at the point of
          click.
        </p>
        <p>
          <strong>Repeated confetti trains blindness.</strong> Celebrate
          everything and you celebrate nothing — by the third burst it&apos;s
          not delight, it&apos;s weather.
        </p>
      </section>
    </div>
  );
}
