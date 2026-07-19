import type { Metadata } from "next";

import { PreviewDashboard } from "./_components/preview-dashboard";

export const metadata: Metadata = {
  title: "Theme preview",
};

export default function ThemePreviewPage() {
  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Theme preview
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          A working mock dashboard that exercises every theme token. Open the
          mixer and drag the hue sliders — primary, secondary, tertiary, brand
          and text update live. Switch fonts to compare faces on real UI.
        </p>
      </section>

      <PreviewDashboard />
    </div>
  );
}
