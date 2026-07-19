import type { Metadata } from "next";

import { ValidationLab } from "./_components/validation-lab";

export const metadata: Metadata = {
  title: "Form validation timing",
};

export default function FormValidationTimingPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Form validation timing
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          The same validation rule feels helpful or hostile depending on
          <em> when</em> it fires. Type your email into each form below —
          slowly — and feel the difference.
        </p>
      </section>

      <ValidationLab />

      <section className="max-w-2xl space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold tracking-tight">The verdict</h2>
        <p>
          <strong>Reward early, punish late.</strong> Show success the moment
          input becomes valid (the field turns good as you type), but only
          show errors after the user leaves the field. They get credit
          instantly and criticism only when they&apos;re actually done.
        </p>
        <p>
          <strong>Errors while typing scold the innocent.</strong>{" "}
          &quot;a&quot; is not an invalid email — it&apos;s an unfinished one.
          Flagging keystroke one treats every user like they&apos;ve already
          failed.
        </p>
        <p>
          <strong>Submit-only validation ambushes.</strong> Fine for tiny
          forms; on long ones the user scrolls back through a wall of red
          they could have fixed along the way.
        </p>
      </section>
    </div>
  );
}
