import type { Metadata } from "next";

import { ButtonLab } from "./_components/button-lab";

export const metadata: Metadata = {
  title: "Button feedback",
};

export default function ButtonFeedbackPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Button feedback
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          A user clicks Save and the API takes two seconds. What the button
          does in those two seconds decides whether they wait, rage-click, or
          submit twice. The request counter under each button tells the truth.
        </p>
      </section>

      <ButtonLab />

      <section className="max-w-2xl space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold tracking-tight">The verdict</h2>
        <p>
          <strong>Spinner in the button + disabled</strong> — the default.
          The click is acknowledged where the user is already looking, and
          double-submits are structurally impossible.
        </p>
        <p>
          <strong>Disabled only</strong> — prevents double-submits but looks
          dead: nothing says &quot;working&quot;, so users blame the app.
        </p>
        <p>
          <strong>No feedback</strong> — the button stays live, users click
          again, and the counter shows the duplicate requests your backend
          will receive.
        </p>
        <p>
          <strong>Instant + toast</strong> — great for background saves where
          blocking would interrupt flow; wrong when the user must not act
          until the operation confirms.
        </p>
      </section>
    </div>
  );
}
