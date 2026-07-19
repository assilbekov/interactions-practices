import type { Metadata } from "next";

import { RecoveryLab } from "./_components/recovery-lab";

export const metadata: Metadata = {
  title: "Error recovery",
};

export default function ErrorRecoveryPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Error recovery
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Requests fail. The design question is how much of the user&apos;s
          world fails with them — and who does the work of recovering.
        </p>
      </section>

      <RecoveryLab />

      <section className="max-w-2xl space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold tracking-tight">The verdict</h2>
        <p>
          <strong>Scope the failure to the widget.</strong> One failed request
          should never take down a whole page of working content. Error
          boundaries exist to keep the blast radius small.
        </p>
        <p>
          <strong>Auto-retry transient failures with backoff</strong> — most
          network errors heal themselves in seconds. Retry quietly (1s, 2s,
          4s), show that you&apos;re retrying, and only surface a manual
          Retry button when you give up.
        </p>
        <p>
          <strong>Manual retry is a last resort, not a first response.</strong>{" "}
          Every Retry button is the app delegating its job to the user.
        </p>
      </section>
    </div>
  );
}
