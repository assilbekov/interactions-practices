"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowUpDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleAlertIcon,
  InfoIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  Settings2Icon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MIXER_APPLY_EVENT } from "@/lib/theme-mixer";
import { cn } from "@/lib/utils";

import { DOMAIN_MODULES } from "./domains";

type FeelConfig = {
  radiusPx: number;
  controlRem: number;
  spacingRem: number;
  fontVar: string;
};

const FONTS = [
  { name: "Geist", cssVar: "--font-geist" },
  { name: "Inter", cssVar: "--font-inter" },
  { name: "IBM Plex Sans", cssVar: "--font-ibm-plex-sans" },
  { name: "JetBrains Mono", cssVar: "--font-jetbrains-mono" },
  { name: "Fira Code", cssVar: "--font-fira-code" },
];

const DENSITIES = [
  { label: "Compact", rem: 0.2 },
  { label: "Default", rem: 0.25 },
  { label: "Airy", rem: 0.3 },
];

type Archetype = {
  key: string;
  name: string;
  reasoning: string;
  config: FeelConfig;
};

const ARCHETYPES: Archetype[] = [
  {
    key: "trading",
    name: "Trading platform",
    reasoning:
      "Dense information, decisions in seconds. Sharp 4px corners, compact 36px controls, and tight gaps pack the maximum data per glance; the mono face turns every number into an instrument reading. Softness here reads as imprecision.",
    config: {
      radiusPx: 4,
      controlRem: 2.25,
      spacingRem: 0.2,
      fontVar: "--font-jetbrains-mono",
    },
  },
  {
    key: "payments",
    name: "Checkout / payments",
    reasoning:
      "Few actions, high stakes. Generous 48px targets make a mis-tap feel impossible, airy gaps present one decision at a time, 10px corners keep it approachable, and a humanist sans reads as safe — the interface of a product that handles your money calmly.",
    config: {
      radiusPx: 10,
      controlRem: 3,
      spacingRem: 0.3,
      fontVar: "--font-inter",
    },
  },
  {
    key: "editor",
    name: "Code editor / dev tool",
    reasoning:
      "Lived-in for hours, so the chrome must stay quiet. Modest 6px corners, 40px controls, and default density keep the tool from competing with the content. The perception target is a precision instrument that disappears.",
    config: {
      radiusPx: 6,
      controlRem: 2.5,
      spacingRem: 0.25,
      fontVar: "--font-geist",
    },
  },
  {
    key: "notes",
    name: "Notes / personal",
    reasoning:
      "Low stakes and personal. Large 16px radii, roomy controls, and airy gaps feel forgiving — nothing here can really go wrong. A warm, plain sans invites writing rather than throughput.",
    config: {
      radiusPx: 16,
      controlRem: 2.75,
      spacingRem: 0.3,
      fontVar: "--font-ibm-plex-sans",
    },
  },
  {
    key: "analytics",
    name: "Analytics / B2B dashboard",
    reasoning:
      "A daily driver for operators: enough density to compare a dozen metrics at a glance, but not trading-desk extreme — people live here eight hours a day, so default whitespace prevents fatigue. Moderate 8px corners and 40px controls read as competent and modern without demanding attention.",
    config: {
      radiusPx: 8,
      controlRem: 2.5,
      spacingRem: 0.25,
      fontVar: "--font-geist",
    },
  },
  {
    key: "government",
    name: "Government services",
    reasoning:
      "GOV.UK's famous answer: zero radius. Institutions signal seriousness by refusing decoration — a rounded corner would read as marketing. But targets are huge (48px) and whitespace is generous, because every citizen of every age and ability must succeed on the first try. Strict shapes, maximum forgiveness.",
    config: {
      radiusPx: 0,
      controlRem: 3,
      spacingRem: 0.3,
      fontVar: "--font-ibm-plex-sans",
    },
  },
  {
    key: "social",
    name: "Social / consumer app",
    reasoning:
      "Thumb-first and feeling-first. Near-pill 20px corners and 48px targets are built for one-handed phone use; airy spacing keeps each post or action emotionally singular. The interface should feel like a friend's space, not a workstation — softness is the entire brand.",
    config: {
      radiusPx: 20,
      controlRem: 3,
      spacingRem: 0.3,
      fontVar: "--font-inter",
    },
  },
  {
    key: "ecommerce",
    name: "E-commerce storefront",
    reasoning:
      "One button pays the rent: Add to cart. It gets a 44px target that can't be missed on mobile, 12px corners that are friendly without turning childish, and default density — product grids need some air but shoppers still compare. Approachable enough to browse, serious enough to enter a card number.",
    config: {
      radiusPx: 12,
      controlRem: 2.75,
      spacingRem: 0.25,
      fontVar: "--font-inter",
    },
  },
  {
    key: "healthcare",
    name: "Healthcare / medical",
    reasoning:
      "The cost of a mis-click is measured in patient safety, so nothing is ambiguous: 48px controls, airy spacing that isolates every decision, and a highly legible humanist face. Corners stay moderate — soft enough to calm anxious users, restrained enough to keep clinical authority.",
    config: {
      radiusPx: 8,
      controlRem: 3,
      spacingRem: 0.3,
      fontVar: "--font-ibm-plex-sans",
    },
  },
  {
    key: "crm",
    name: "Enterprise CRM / ERP",
    reasoning:
      "Forty records per screen, keyboard-driven, used all day by people paid to be fast. Compact gaps and 36px controls maximize rows; 4px corners keep the grid disciplined. Unlike a trading desk it stays in a sans face — this is text-heavy work, and mono would exhaust readers by noon.",
    config: {
      radiusPx: 4,
      controlRem: 2.25,
      spacingRem: 0.2,
      fontVar: "--font-inter",
    },
  },
];

const DEFAULT_CONFIG = ARCHETYPES.find((a) => a.key === "editor")!.config;

// Per-archetype detail for the "Why this config?" dialog.
const WHY: Record<
  string,
  { radius: string; control: string; whitespace: string; typeface: string }
> = {
  trading: {
    radius:
      "4px keeps every surface feeling machined. Rounder corners would eat horizontal space in dense tables and read as consumer software — the wrong signal when real money moves on keypresses.",
    control:
      "36px is the floor for reliable clicking, and traders are power users on desktops with mice — precision is assumed, so screen space goes to data instead of padding.",
    whitespace:
      "Compact gaps put more rows and tickers in one glance. Scanning cost beats reading comfort here: the user's job is comparison, not contemplation.",
    typeface:
      "A mono face aligns every digit into columns, so a price change is visible as a shape change. Proportional digits would make $1,111 narrower than $9,999 and break column scanning.",
  },
  payments: {
    radius:
      "10px is the trust zone: soft enough to feel human, firm enough to feel institutional. Sharp corners read as cold at checkout; full pills read as playful — neither survives a card form.",
    control:
      "48px targets make a mis-tap on 'Pay' nearly impossible, on any device, with shaky hands, in a hurry. When the action moves money, Fitts's law is a safety feature.",
    whitespace:
      "Airy gaps isolate one decision per glance. A cramped checkout feels like fine print; generous space reads as nothing-to-hide.",
    typeface:
      "A humanist sans (Inter) is what banks and wallets trained users to trust. Familiarity lowers perceived risk exactly where risk perception decides conversion.",
  },
  editor: {
    radius:
      "6px is quiet: visible enough to soften panel edges, small enough to disappear during eight-hour sessions. Decoration a user sees ten thousand times must round to zero attention.",
    control:
      "40px balances clickability with chrome economy — toolbars can't crowd the buffer, but a missed click during flow costs more than the pixels saved.",
    whitespace:
      "Default density: code itself is dense, so the chrome around it stays neutral rather than competing or cramping.",
    typeface:
      "The UI wears a plain sans while the buffer wears mono — the contrast is the point: chrome recedes, content is the instrument.",
  },
  notes: {
    radius:
      "16px feels like paper and pill bottles, not machinery. Big radii tell the user nothing here is irreversible — the right emotion for a private writing space.",
    control:
      "44px controls are unhurried and forgiving. Nobody is racing; targets can afford warmth.",
    whitespace:
      "Airy spacing gives thoughts room. Cramped notes feel like a task list; air feels like a notebook.",
    typeface:
      "A warm, plain sans invites writing. Anything technical-looking would make journaling feel like filing a report.",
  },
  analytics: {
    radius:
      "8px is the modern-SaaS default: enough softness to feel current, enough restraint to keep charts and numbers as the loudest thing on screen.",
    control:
      "40px suits a daily-driver: operators click these controls hundreds of times a day, but the dashboard still needs room for a dozen metrics.",
    whitespace:
      "Default density lets KPI tiles and charts coexist without either luxury spacing (wasted comparisons) or trading-desk cramming (fatigue by noon).",
    typeface:
      "A neutral grotesque with tabular figures keeps metric labels quiet and numbers aligned.",
  },
  government: {
    radius:
      "0px, deliberately. GOV.UK's research settled this: rounded corners read as marketing, and a state service must read as procedure. Square corners are the institutional voice.",
    control:
      "48px because the audience is everyone — every age, every ability, every device. The service fails unless the least able citizen succeeds on the first try.",
    whitespace:
      "Maximum air, one question at a time. Density is for experts; a citizen fills this form once a decade.",
    typeface:
      "A highly legible workhorse sans at generous sizes. Nothing expressive: the form is the government speaking, and it should sound plain.",
  },
  social: {
    radius:
      "20px — near-pill. Softness is the brand: avatars are circles, cards are pebbles, and every shape says 'friend space', not 'workstation'.",
    control:
      "48px because this is thumbs on phones, one-handed, in motion. Miss rates that are acceptable on desktop kill mobile engagement.",
    whitespace:
      "Airy gaps make each post emotionally singular — the feed is a stream of moments, not a data table.",
    typeface:
      "Inter-class sans: warm, rounded enough to feel personal, and bulletproof at small mobile sizes.",
  },
  ecommerce: {
    radius:
      "12px keeps product cards friendly while the checkout still feels credible. Softer than a bank, firmer than a toy store.",
    control:
      "44px: 'Add to cart' is the business model, and most of it happens on phones. The buy button gets the biggest reliable thumb target that doesn't look cartoonish.",
    whitespace:
      "Default density — product grids need enough air to photograph well, but shoppers compare items, so cards stay within one eyespan.",
    typeface:
      "A familiar humanist sans keeps attention on product imagery and prices; the typeface should never outstyle the merchandise.",
  },
  crm: {
    radius:
      "4px disciplines a screen full of tables and forms into a grid. Enterprise users read structure, not decoration.",
    control:
      "36px maximizes rows per screen for keyboard-first operators who live here all day and are paid to be fast.",
    whitespace:
      "Compact gaps: forty records per screen is the requirement. Fatigue is managed by rhythm and alignment, not by air.",
    typeface:
      "Unlike trading, this is text-heavy — names, companies, notes — so a sans face carries it; mono is reserved for the money column.",
  },
  healthcare: {
    radius:
      "8px calms without losing clinical authority. Sharp corners raise anxiety in patients; playful pills undermine trust in clinicians.",
    control:
      "48px because a mis-click here is measured in patient safety. Every actionable element is deliberately oversized and isolated.",
    whitespace:
      "Airy spacing separates every decision — medication, slot, patient — so nothing can be confused with its neighbor.",
    typeface:
      "Maximum-legibility humanist sans: users include stressed patients, elderly readers, and staff wearing gloves on tablets.",
  },
};

// Larger surfaces get proportionally larger radii (the app's tokens: cards
// ~1.4×, dialogs ~1.8× the base) so nested corners stay concentric.
function WhyDialog({ archetype }: { archetype: Archetype }) {
  const why = WHY[archetype.key];
  const base = archetype.config.radiusPx;
  const card = Math.round(base * 1.4);
  const dialog = Math.round(base * 1.8);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <InfoIcon />
          Why this config?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Why {archetype.name.toLowerCase()} feels like this</DialogTitle>
          <DialogDescription>{archetype.reasoning}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm leading-relaxed">
          <div className="space-y-1">
            <p className="font-medium">
              Radius —{" "}
              <span className="font-mono tabular-nums">{base}px</span> base
            </p>
            <p className="text-muted-foreground">{why.radius}</p>
            <p className="text-muted-foreground">
              Radius grows with component size: buttons and inputs sit at the{" "}
              <span className="font-mono tabular-nums">{base}px</span> base,
              cards at ~
              <span className="font-mono tabular-nums">{card}px</span>, dialogs
              at ~<span className="font-mono tabular-nums">{dialog}px</span>.
              A larger surface needs a larger curve to look equally round, and
              scaling keeps nested corners concentric instead of pinching at
              the edges.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">
              Controls —{" "}
              <span className="font-mono tabular-nums">
                {archetype.config.controlRem * 16}px
              </span>
            </p>
            <p className="text-muted-foreground">{why.control}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">
              Whitespace —{" "}
              {DENSITIES.find((d) => d.rem === archetype.config.spacingRem)
                ?.label ?? "Custom"}
            </p>
            <p className="text-muted-foreground">{why.whitespace}</p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">
              Typeface —{" "}
              {FONTS.find((f) => f.cssVar === archetype.config.fontVar)?.name}
            </p>
            <p className="text-muted-foreground">{why.typeface}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type Order = {
  id: string;
  customer: string;
  email: string;
  status: "completed" | "pending" | "failed";
  amount: number;
  date: string;
};

const INITIAL_ORDERS: Order[] = [
  { id: "ORD-1042", customer: "Aliya Bekova", email: "aliya@acme.io", status: "completed", amount: 1250.0, date: "Jul 18" },
  { id: "ORD-1041", customer: "Marat Osken", email: "marat@nord.dev", status: "pending", amount: 89.99, date: "Jul 18" },
  { id: "ORD-1040", customer: "Jan Kowalski", email: "jan@studio.pl", status: "completed", amount: 432.5, date: "Jul 17" },
  { id: "ORD-1039", customer: "Sara Lindt", email: "sara@lindt.se", status: "failed", amount: 76.0, date: "Jul 17" },
  { id: "ORD-1038", customer: "Tomas Ruiz", email: "tomas@ruiz.es", status: "completed", amount: 2210.0, date: "Jul 16" },
  { id: "ORD-1037", customer: "Aigerim Sat", email: "aigerim@sat.kz", status: "pending", amount: 149.0, date: "Jul 16" },
  { id: "ORD-1036", customer: "Leo Fischer", email: "leo@fischer.de", status: "completed", amount: 560.25, date: "Jul 15" },
  { id: "ORD-1035", customer: "Mia Chen", email: "mia@chen.dev", status: "completed", amount: 1890.0, date: "Jul 15" },
  { id: "ORD-1034", customer: "Ivan Petrov", email: "ivan@petrov.io", status: "failed", amount: 32.0, date: "Jul 14" },
  { id: "ORD-1033", customer: "Nina Rossi", email: "nina@rossi.it", status: "pending", amount: 720.4, date: "Jul 14" },
];

const STATUS_BADGE: Record<Order["status"], "secondary" | "outline" | "destructive"> = {
  completed: "secondary",
  pending: "outline",
  failed: "destructive",
};

function ConfigBar({
  archetypeKey,
  onArchetype,
  config,
  setConfig,
}: {
  archetypeKey: string;
  onArchetype: (key: string) => void;
  config: FeelConfig;
  setConfig: (config: FeelConfig) => void;
}) {
  const archetype = ARCHETYPES.find((a) => a.key === archetypeKey)!;

  return (
    <div className="sticky top-14 z-40 flex flex-wrap items-center gap-2 rounded-xl border bg-background/90 p-3 backdrop-blur">
      <Select value={archetypeKey} onValueChange={onArchetype}>
        <SelectTrigger className="w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ARCHETYPES.map((a) => (
            <SelectItem key={a.key} value={a.key}>
              {a.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <WhyDialog archetype={archetype} />

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Settings2Icon />
            Customize
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Radius</span>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {config.radiusPx}px
              </span>
            </div>
            <Slider
              value={[config.radiusPx]}
              onValueChange={([value]) =>
                setConfig({ ...config, radiusPx: value })
              }
              min={0}
              max={24}
              step={2}
              aria-label="Corner radius"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium">Control height</span>
            <div className="flex gap-1.5">
              {[2.25, 2.5, 2.75, 3].map((rem) => (
                <button
                  key={rem}
                  type="button"
                  onClick={() => setConfig({ ...config, controlRem: rem })}
                  className={cn(
                    "flex-1 rounded-md border px-1 py-1.5 font-mono text-xs tabular-nums transition-colors hover:bg-muted",
                    config.controlRem === rem && "border-ring bg-muted",
                  )}
                >
                  {rem * 16}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium">Whitespace</span>
            <div className="flex gap-1.5">
              {DENSITIES.map((density) => (
                <button
                  key={density.label}
                  type="button"
                  onClick={() =>
                    setConfig({ ...config, spacingRem: density.rem })
                  }
                  className={cn(
                    "flex-1 rounded-md border px-1 py-1.5 text-xs transition-colors hover:bg-muted",
                    config.spacingRem === density.rem && "border-ring bg-muted",
                  )}
                >
                  {density.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium">Typeface</span>
            <Select
              value={config.fontVar}
              onValueChange={(fontVar) => setConfig({ ...config, fontVar })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FONTS.map((font) => (
                  <SelectItem
                    key={font.cssVar}
                    value={font.cssVar}
                    style={{ fontFamily: `var(${font.cssVar})` }}
                  >
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        className="ml-auto"
        onClick={() =>
          window.dispatchEvent(
            new CustomEvent(MIXER_APPLY_EVENT, {
              detail: {
                radius: config.radiusPx / 16,
                control: config.controlRem,
              },
            }),
          )
        }
      >
        Apply to whole app
      </Button>
    </div>
  );
}

function StatsRow() {
  const stats = [
    { label: "Revenue", value: "$48,210", change: "+8.1%" },
    { label: "Orders", value: "1,326", change: "+2.4%" },
    { label: "Refunds", value: "$1,240", change: "-0.8%" },
    { label: "Conversion", value: "3.9%", change: "+0.3%" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="font-mono text-2xl font-semibold tabular-nums">
              {stat.value}
            </p>
            <Badge variant="secondary">{stat.change}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const PAGE_SIZE = 5;

function NewOrderDialog({
  onCreate,
}: {
  onCreate: (customer: string, email: string, amount: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [customer, setCustomer] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  const valid = customer.trim() && email.includes("@") && Number(amount) > 0;

  const submit = () => {
    if (!valid) return;
    onCreate(customer.trim(), email.trim(), Number(amount));
    setCustomer("");
    setEmail("");
    setAmount("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          New order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create order</DialogTitle>
          <DialogDescription>
            The dialog inherits radius, control size, and density too.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-customer">Customer</Label>
            <Input
              id="new-customer"
              value={customer}
              onChange={(event) => setCustomer(event.target.value)}
              placeholder="Full name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-email">Email</Label>
            <Input
              id="new-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-amount">Amount</Label>
            <Input
              id="new-amount"
              type="number"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="font-mono tabular-nums"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={!valid} onClick={submit}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OrdersTable() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter(
        (order) =>
          (statusFilter === "all" || order.status === statusFilter) &&
          (!q ||
            order.customer.toLowerCase().includes(q) ||
            order.id.toLowerCase().includes(q)),
      )
      .sort((a, b) => (sortDesc ? b.amount - a.amount : a.amount - b.amount));
  }, [orders, query, statusFilter, sortDesc]);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const paged = visible.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );

  const createOrder = (customer: string, email: string, amount: number) => {
    const nextNumber =
      Math.max(...orders.map((o) => Number(o.id.split("-")[1]) || 0), 1000) + 1;
    setOrders((prev) => [
      {
        id: `ORD-${nextNumber}`,
        customer,
        email,
        status: "pending" as const,
        amount,
        date: "Jul 19",
      },
      ...prev,
    ]);
    setPage(0);
  };

  const allVisibleSelected =
    visible.length > 0 && visible.every((order) => selected.has(order.id));

  const toggleAll = () =>
    setSelected(
      allVisibleSelected
        ? new Set()
        : new Set(visible.map((order) => order.id)),
    );

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const archiveSelected = () => {
    setOrders((prev) => prev.filter((order) => !selected.has(order.id)));
    setSelected(new Set());
  };

  const setStatus = (id: string, status: Order["status"]) =>
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order)),
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>
          Search, filter, sort, select — density and typeface change how this
          table reads.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-48 flex-1">
            <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search orders"
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          {selected.size > 0 && (
            <Button variant="destructive" onClick={archiveSelected}>
              Archive {selected.size}
            </Button>
          )}
          <NewOrderDialog onCreate={createOrder} />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allVisibleSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                <button
                  type="button"
                  onClick={() => setSortDesc((prev) => !prev)}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  Amount
                  <ArrowUpDownIcon className="size-3.5" />
                </button>
              </TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((order) => (
              <TableRow
                key={order.id}
                data-state={selected.has(order.id) ? "selected" : undefined}
              >
                <TableCell>
                  <Checkbox
                    checked={selected.has(order.id)}
                    onCheckedChange={() => toggleOne(order.id)}
                    aria-label={`Select ${order.id}`}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs">{order.id}</TableCell>
                <TableCell>
                  <p className="font-medium">{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.email}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE[order.status]}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  ${order.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {order.date}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Actions for ${order.id}`}
                      >
                        <MoreHorizontalIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setStatus(order.id, "completed")}
                      >
                        Mark completed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatus(order.id, "pending")}
                      >
                        Mark pending
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() =>
                          setOrders((prev) =>
                            prev.filter((o) => o.id !== order.id),
                          )
                        }
                      >
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  No orders match.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {visible.length} order{visible.length === 1 ? "" : "s"}
            {selected.size > 0 && ` · ${selected.size} selected`}
          </p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {safePage + 1} / {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Previous page"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Next page"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SettingsForms() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Payout account</CardTitle>
          <CardDescription>
            Form density follows the whitespace setting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="feel-iban">IBAN</Label>
            <Input
              id="feel-iban"
              placeholder="DE89 3704 0044 0532 0130 00"
              className="font-mono"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="feel-name">Account holder</Label>
              <Input id="feel-name" placeholder="Full name" />
            </div>
            <div className="space-y-1.5">
              <Label>Payout schedule</Label>
              <Select defaultValue="weekly">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button>Save changes</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Switches and toggles at any density.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { id: "feel-2fa", label: "Two-factor authentication", on: true },
            { id: "feel-alerts", label: "Large transaction alerts", on: true },
            { id: "feel-digest", label: "Weekly digest", on: false },
            { id: "feel-beta", label: "Beta features", on: false },
          ].map((pref) => (
            <div key={pref.id} className="flex items-center justify-between">
              <Label htmlFor={pref.id} className="font-normal">
                {pref.label}
              </Label>
              <Switch id={pref.id} defaultChecked={pref.on} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    cta: "Start free",
    highlighted: false,
    features: ["1 project", "Community support", "1GB storage"],
  },
  {
    name: "Growth",
    price: "$29",
    period: "/mo",
    cta: "Start trial",
    highlighted: true,
    features: [
      "Unlimited projects",
      "Priority support",
      "100GB storage",
      "Team roles",
    ],
  },
  {
    name: "Scale",
    price: "$99",
    period: "/mo",
    cta: "Contact sales",
    highlighted: false,
    features: [
      "Everything in Growth",
      "SSO / SAML",
      "Audit log",
      "99.9% SLA",
    ],
  },
];

function PricingBlock() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {TIERS.map((tier) => (
        <Card
          key={tier.name}
          className={cn(tier.highlighted && "border-primary")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {tier.name}
              {tier.highlighted && <Badge>Popular</Badge>}
            </CardTitle>
            <CardDescription>
              <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">
                {tier.price}
              </span>
              {tier.period}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <ul className="space-y-2 text-sm">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <CheckIcon className="size-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={tier.highlighted ? "default" : "outline"}
              className="mt-auto w-full"
            >
              {tier.cta}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const ACTIVITY = [
  { text: "Payout of $4,120.00 sent to DE89···0130", time: "09:41", kind: "ok" },
  { text: "New order ORD-1042 from Aliya Bekova", time: "09:12", kind: "ok" },
  { text: "Card verification required for account #82", time: "08:55", kind: "warn" },
  { text: "Refund of $76.00 issued for ORD-1039", time: "08:20", kind: "ok" },
  { text: "3 failed login attempts blocked", time: "07:03", kind: "warn" },
];

function ActivityBlock() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>
          Timeline density follows the whitespace setting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {ACTIVITY.map((event) => (
            <li key={event.text} className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  event.kind === "ok" ? "bg-primary" : "bg-destructive",
                )}
              />
              <p className="flex-1 text-sm leading-snug">{event.text}</p>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {event.time}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

const PERMISSION_MEMBERS = [
  { name: "Aigerim Sat", email: "aigerim@sat.kz", initials: "AS", role: "owner" },
  { name: "Leo Fischer", email: "leo@fischer.de", initials: "LF", role: "admin" },
  { name: "Mia Chen", email: "mia@chen.dev", initials: "MC", role: "editor" },
  { name: "Ivan Petrov", email: "ivan@petrov.io", initials: "IP", role: "viewer" },
];

function PermissionsBlock() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissions</CardTitle>
        <CardDescription>Role selects sized by control height.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {PERMISSION_MEMBERS.map((member) => (
          <div key={member.email} className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-secondary text-xs text-secondary-foreground">
                {member.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{member.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {member.email}
              </p>
            </div>
            <Select defaultValue={member.role}>
              <SelectTrigger className="w-28" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
        <Button variant="outline" className="w-full">
          <PlusIcon />
          Invite member
        </Button>
      </CardContent>
    </Card>
  );
}

function AlertsBlock() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Alert>
        <InfoIcon />
        <AlertTitle>Scheduled maintenance</AlertTitle>
        <AlertDescription>
          Payouts pause on Sunday 02:00–04:00 UTC. Queued transfers resume
          automatically.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>Verification overdue</AlertTitle>
        <AlertDescription>
          Transfer limits drop to $1,000 until the business documents are
          re-verified.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function ArchetypeNotes({
  onArchetype,
}: {
  onArchetype: (key: string) => void;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Why these presets
        </h2>
        <p className="text-sm text-muted-foreground">
          The reasoning behind each domain&apos;s defaults.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {ARCHETYPES.map((archetype) => (
          <Card key={archetype.key}>
            <CardHeader>
              <CardTitle>{archetype.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {archetype.reasoning}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="font-mono tabular-nums">
                  radius {archetype.config.radiusPx}px
                </Badge>
                <Badge variant="outline" className="font-mono tabular-nums">
                  controls {archetype.config.controlRem * 16}px
                </Badge>
                <Badge variant="outline">
                  {
                    DENSITIES.find(
                      (d) => d.rem === archetype.config.spacingRem,
                    )?.label
                  }{" "}
                  whitespace
                </Badge>
                <Badge variant="outline">
                  {FONTS.find((f) => f.cssVar === archetype.config.fontVar)?.name}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onArchetype(archetype.key)}
              >
                Preview this feel
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function FeelLab() {
  const [archetypeKey, setArchetypeKey] = useState("editor");
  const [config, setConfig] = useState<FeelConfig>(DEFAULT_CONFIG);

  const selectArchetype = (key: string) => {
    const archetype = ARCHETYPES.find((a) => a.key === key);
    if (!archetype) return;
    setArchetypeKey(key);
    setConfig(archetype.config);
  };

  const domain = DOMAIN_MODULES[archetypeKey];

  const demoVars = {
    "--radius": `${config.radiusPx / 16}rem`,
    "--control-h": `${config.controlRem}rem`,
    "--spacing": `${config.spacingRem}rem`,
    "--app-font-sans": `var(${config.fontVar})`,
  } as CSSProperties;

  return (
    <div className="space-y-6">
      <ConfigBar
        archetypeKey={archetypeKey}
        onArchetype={selectArchetype}
        config={config}
        setConfig={setConfig}
      />

      {/* Everything inside re-reads the scoped vars: radius, control height,
          spacing scale (all gap/padding utilities), and typeface. */}
      <div style={demoVars} className="space-y-4 font-sans">
        {domain && (
          <section className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {domain.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {domain.description}
              </p>
            </div>
            {/* Key resets module state when switching domains. */}
            <domain.Component key={archetypeKey} />
          </section>
        )}

        <AlertsBlock />
        <StatsRow />
        <OrdersTable />
        <div className="grid gap-4 lg:grid-cols-2">
          <ActivityBlock />
          <PermissionsBlock />
        </div>
        <PricingBlock />
        <SettingsForms />
      </div>

      <ArchetypeNotes onArchetype={selectArchetype} />
    </div>
  );
}
