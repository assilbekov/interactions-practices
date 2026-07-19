export type Pattern = {
  slug: string;
  title: string;
  description: string;
  status: "live" | "soon";
};

export const patterns: Pattern[] = [
  {
    slug: "loading-states",
    title: "Loading states",
    description:
      "Skeleton vs. spinner vs. blur — the right choice depends on your API latency.",
    status: "live",
  },
  {
    slug: "optimistic-updates",
    title: "Optimistic updates",
    description:
      "Update instantly and roll back on error, or wait for the server?",
    status: "soon",
  },
  {
    slug: "button-feedback",
    title: "Button feedback",
    description:
      "Spinner-in-button, disabled state, or instant response with a toast.",
    status: "soon",
  },
  {
    slug: "number-transitions",
    title: "Number transitions",
    description:
      "Jump, count-up, or slot-roll — how should a balance change feel?",
    status: "soon",
  },
];
