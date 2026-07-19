import type { Metadata } from "next";

import { UndoLab } from "./_components/undo-lab";

export const metadata: Metadata = {
  title: "Undo vs. confirm",
};

export default function UndoVsConfirmPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Undo vs. confirm
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Every destructive action needs a safety net — but a confirmation
          dialog taxes every delete to protect the rare mistake, while undo
          taxes only the mistake itself.
        </p>
      </section>

      <UndoLab />

      <section className="max-w-2xl space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold tracking-tight">The verdict</h2>
        <p>
          <strong>Undo toast</strong> — the default for anything reversible.
          Deletes feel instant, and the safety net only costs attention when
          the user actually erred. Gmail made this the standard.
        </p>
        <p>
          <strong>Confirm dialog</strong> — reserve it for the truly
          irreversible: closing accounts, deleting servers, anything you
          cannot restore. If everything asks &quot;are you sure?&quot;, users
          learn to click yes without reading — and the dialog protects
          nothing.
        </p>
        <p>
          <strong>Instant with no recourse</strong> — one slip and the work is
          gone. The absence of a net changes how users move: they hesitate on
          every action because any click might be fatal.
        </p>
      </section>

      <section className="max-w-2xl space-y-4 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold tracking-tight">
          Building undo against a real API
        </h2>
        <p>
          The toast is the easy part — the question is what happens to the
          DELETE request. Three strategies, in order of robustness:
        </p>

        <div className="space-y-2">
          <p>
            <strong>1. Delayed commit.</strong> Remove the item from the UI
            immediately, but don&apos;t call the API until the undo window
            closes. Undo simply cancels the timer — the server never hears
            about it.
          </p>
          <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-3 font-mono text-xs leading-relaxed">
{`function deleteWithUndo(file) {
  removeFromUi(file);                    // optimistic
  const timer = setTimeout(() => {
    api.delete(\`/files/\${file.id}\`);    // commit after the grace period
  }, 5000);

  toast(\`Deleted \${file.name}\`, {
    action: {
      label: "Undo",
      onClick: () => {
        clearTimeout(timer);             // nothing ever hit the API
        restoreInUi(file);
      },
    },
  });
}`}
          </pre>
          <p className="text-muted-foreground">
            Caveat: if the tab closes during the grace period, the delete is
            lost. Flush pending deletes on <code>pagehide</code> with{" "}
            <code>navigator.sendBeacon</code>, or accept that a closed tab
            means &quot;undone&quot;.
          </p>
        </div>

        <div className="space-y-2">
          <p>
            <strong>2. Soft delete on the server</strong> — the robust
            standard. DELETE marks <code>deleted_at</code> instead of
            destroying the row; a restore endpoint clears it; a background job
            purges records older than the retention window. Undo works across
            tabs, refreshes, and even devices (&quot;recently deleted&quot;
            folders are this pattern with a UI).
          </p>
          <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-3 font-mono text-xs leading-relaxed">
{`// DELETE /files/:id          -> sets deleted_at, returns 200
// POST   /files/:id/restore  -> clears deleted_at (30-day window)

async function deleteWithUndo(file) {
  removeFromUi(file);
  await api.delete(\`/files/\${file.id}\`);   // committed, but reversible

  toast(\`Deleted \${file.name}\`, {
    action: {
      label: "Undo",
      onClick: async () => {
        await api.post(\`/files/\${file.id}/restore\`);
        restoreInUi(file);
      },
    },
  });
}`}
          </pre>
        </div>

        <div className="space-y-2">
          <p>
            <strong>3. Inverse operation.</strong> When the API is truly
            destructive, undo means re-creating: keep the full resource
            payload client-side and POST it back on undo. It needs an
            idempotency key (so a double-undo doesn&apos;t duplicate) and the
            restored item usually gets a new id — acceptable for simple
            resources, painful for anything with relations. If you find
            yourself here, ask the backend for soft delete instead.
          </p>
        </div>
      </section>
    </div>
  );
}
