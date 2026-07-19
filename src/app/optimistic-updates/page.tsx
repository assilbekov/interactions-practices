import type { Metadata } from "next";

import { OptimisticLab } from "./_components/optimistic-lab";

export const metadata: Metadata = {
  title: "Optimistic updates",
};

export default function OptimisticUpdatesPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Optimistic updates
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          When a user likes a post, do you update the UI instantly and
          apologize later, or make them wait for the server? Turn failures on
          and watch each strategy cope.
        </p>
      </section>

      <OptimisticLab />

      <section className="max-w-2xl space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold tracking-tight">The verdict</h2>
        <p>
          <strong>Optimistic + rollback</strong> — the default for cheap,
          likely-to-succeed actions (likes, toggles, reorders). Instant feel;
          on failure, revert and tell the user. The UI count and server count
          always reconcile.
        </p>
        <p>
          <strong>Wait for server</strong> — right for expensive or dangerous
          actions (payments, deletes) where showing an unconfirmed success is
          worse than a spinner. Honest but sluggish for trivial actions.
        </p>
        <p>
          <strong>Optimistic without rollback</strong> — the silent bug. Under
          failures the UI count drifts from the server count and the
          user&apos;s like quietly never happened. If you can&apos;t roll back, don&apos;t
          be optimistic.
        </p>
      </section>
    </div>
  );
}
