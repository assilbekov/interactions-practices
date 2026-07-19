export type Pattern = {
  slug: string;
  title: string;
  description: string;
  status: "live" | "soon";
};

export const patterns: Pattern[] = [
  {
    slug: "theme-preview",
    title: "Theme preview",
    description:
      "A working mock dashboard that exercises every theme token — mix colors and fonts live.",
    status: "live",
  },
  {
    slug: "product-feel",
    title: "Product feel",
    description:
      "How radius, control size, and motion pace change what a product feels like — trading vs. checkout vs. editor.",
    status: "live",
  },
  {
    slug: "loading-states",
    title: "Loading states",
    description:
      "Skeleton vs. spinner vs. blur — the right choice depends on your API latency.",
    status: "live",
  },
  {
    slug: "number-transitions",
    title: "Number transitions",
    description:
      "The right way to load and change a number — blur, reveal, then roll — and the ways to get it wrong.",
    status: "live",
  },
  {
    slug: "optimistic-updates",
    title: "Optimistic updates",
    description:
      "Update instantly and roll back on error, or wait for the server? Flip failures on and watch each strategy cope.",
    status: "live",
  },
  {
    slug: "button-feedback",
    title: "Button feedback",
    description:
      "Four submit buttons, one slow API — the request counter exposes which ones invite double-submits.",
    status: "live",
  },
  {
    slug: "skeleton-transitions",
    title: "Skeleton → content handoff",
    description:
      "The moment content replaces its skeleton: hard swap, fade-through, or blur-up — which one hides the seam?",
    status: "soon",
  },
  {
    slug: "form-validation-timing",
    title: "Form validation timing",
    description:
      "As-you-type, on-blur, or on-submit — when should a form call you wrong? Punish early and users feel scolded.",
    status: "soon",
  },
  {
    slug: "undo-vs-confirm",
    title: "Undo vs. confirm",
    description:
      "Delete instantly with an undo toast, or block with an 'Are you sure?' dialog — trust versus friction.",
    status: "soon",
  },
  {
    slug: "empty-states",
    title: "Empty states",
    description:
      "Blank void, helpful guidance, or pre-filled demo data — what a new user sees before there's anything to see.",
    status: "soon",
  },
  {
    slug: "search-feedback",
    title: "Search feedback",
    description:
      "Debounced spinner, instant stale-while-loading results, or search-on-enter — keeping fast typists oriented.",
    status: "soon",
  },
  {
    slug: "drag-reorder",
    title: "Drag to reorder",
    description:
      "Drop indicators, ghost previews, and spring-settle physics — what makes dragging feel grabbable.",
    status: "soon",
  },
  {
    slug: "infinite-scroll-vs-pagination",
    title: "Infinite scroll vs. pagination",
    description:
      "Feeds want flow, tables want landmarks — plus the footer that infinite scroll makes unreachable.",
    status: "soon",
  },
  {
    slug: "error-recovery",
    title: "Error recovery",
    description:
      "Full-page error, inline retry, or auto-retry with backoff — failing without losing the user's work or trust.",
    status: "soon",
  },
  {
    slug: "progress-indication",
    title: "Progress indication",
    description:
      "Determinate bar, indeterminate shimmer, or step list — matching the indicator to what you actually know.",
    status: "soon",
  },
  {
    slug: "success-moments",
    title: "Success moments",
    description:
      "Checkmark, subtle toast, or confetti — how much celebration an action deserves before it gets annoying.",
    status: "soon",
  },
];
