import type { ComponentType } from "react";

import { AnalyticsModule } from "./analytics";
import { CrmModule } from "./crm";
import { DesignModule } from "./design";
import { EcommerceModule } from "./ecommerce";
import { EditorModule } from "./editor";
import { GovernmentModule } from "./government";
import { HealthcareModule } from "./healthcare";
import { NotesModule } from "./notes";
import { PaymentsModule } from "./payments";
import { SocialModule } from "./social";
import { TradingModule } from "./trading";

export type DomainModule = {
  title: string;
  description: string;
  Component: ComponentType;
};

export const DOMAIN_MODULES: Record<string, DomainModule> = {
  trading: {
    title: "Trading desk",
    description:
      "Live simulated price feed, market orders with a slippage bound, resting limit orders that fill when price crosses, cash/position/equity accounting.",
    Component: TradingModule,
  },
  payments: {
    title: "Checkout",
    description:
      "Real card validation — Luhn checksum, brand detection, input masking — with processing and receipt states.",
    Component: PaymentsModule,
  },
  editor: {
    title: "Code editor",
    description:
      "Multi-file buffer with dirty indicators, save state, line numbers, and a trailing-whitespace formatter.",
    Component: EditorModule,
  },
  notes: {
    title: "Notes",
    description:
      "Create, edit, search, and delete notes with instant autosave.",
    Component: NotesModule,
  },
  analytics: {
    title: "Analytics",
    description:
      "Metric and range selectors recompute the chart, totals, and period-over-period delta.",
    Component: AnalyticsModule,
  },
  government: {
    title: "ID card application",
    description:
      "Three-step form with per-step validation, GOV.UK-style error summary, review step, and a reference number on submit.",
    Component: GovernmentModule,
  },
  social: {
    title: "Feed",
    description:
      "Composer with a 280-character budget and a feed with working likes.",
    Component: SocialModule,
  },
  ecommerce: {
    title: "Storefront",
    description:
      "Product grid, cart with quantities, promo code (SAVE10), and checkout.",
    Component: EcommerceModule,
  },
  healthcare: {
    title: "Appointments",
    description:
      "Slot booking where booked times leave the pool — double-booking is impossible by construction.",
    Component: HealthcareModule,
  },
  crm: {
    title: "Lead pipeline",
    description:
      "Stage transitions per lead recompute pipeline and won totals; filter and add leads inline.",
    Component: CrmModule,
  },
  design: {
    title: "Canvas editor",
    description:
      "Layers panel with visibility toggles, draggable shapes on an SVG canvas, and a live inspector: position, size, fill, opacity, duplicate, delete.",
    Component: DesignModule,
  },
};
