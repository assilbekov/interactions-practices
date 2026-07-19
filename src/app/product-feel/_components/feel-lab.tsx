"use client";

import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowUpDownIcon,
  MoreHorizontalIcon,
  SearchIcon,
  Settings2Icon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
];

const DEFAULT_CONFIG = ARCHETYPES[2].config;

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
  config,
  setConfig,
}: {
  config: FeelConfig;
  setConfig: (config: FeelConfig) => void;
}) {
  const activePreset = ARCHETYPES.find(
    (a) => JSON.stringify(a.config) === JSON.stringify(config),
  );

  return (
    <div className="sticky top-14 z-40 flex flex-wrap items-center gap-2 rounded-xl border bg-background/90 p-3 backdrop-blur">
      <Select
        value={activePreset?.key ?? "custom"}
        onValueChange={(key) => {
          const archetype = ARCHETYPES.find((a) => a.key === key);
          if (archetype) setConfig(archetype.config);
        }}
      >
        <SelectTrigger className="w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ARCHETYPES.map((archetype) => (
            <SelectItem key={archetype.key} value={archetype.key}>
              {archetype.name}
            </SelectItem>
          ))}
          {!activePreset && (
            <SelectItem value="custom" disabled>
              Custom
            </SelectItem>
          )}
        </SelectContent>
      </Select>

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

function OrdersTable() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

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
            {visible.map((order) => (
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

function ArchetypeNotes({
  setConfig,
}: {
  setConfig: (config: FeelConfig) => void;
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
                onClick={() => setConfig(archetype.config)}
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
  const [config, setConfig] = useState<FeelConfig>(DEFAULT_CONFIG);

  const demoVars = {
    "--radius": `${config.radiusPx / 16}rem`,
    "--control-h": `${config.controlRem}rem`,
    "--spacing": `${config.spacingRem}rem`,
    "--app-font-sans": `var(${config.fontVar})`,
  } as CSSProperties;

  return (
    <div className="space-y-6">
      <ConfigBar config={config} setConfig={setConfig} />

      {/* Everything inside re-reads the scoped vars: radius, control height,
          spacing scale (all gap/padding utilities), and typeface. */}
      <div style={demoVars} className="space-y-4 font-sans">
        <StatsRow />
        <OrdersTable />
        <SettingsForms />
      </div>

      <ArchetypeNotes setConfig={setConfig} />
    </div>
  );
}
