"use client";

import { useState } from "react";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  CheckIcon,
  Loader2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { AnimatedNumber } from "@/components/animated-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATS = [
  { label: "Total balance", value: 24562.0, change: "+4.2%", up: true },
  { label: "Income", value: 8210.5, change: "+12.1%", up: true },
  { label: "Spending", value: 3845.2, change: "-2.4%", up: false },
];

const WEEKLY_ACTIVITY = [42, 65, 38, 80, 55, 92, 70];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TRANSACTIONS = [
  { name: "Figma", category: "Design tools", amount: -15.0 },
  { name: "Salary", category: "Acme Corp", amount: 4200.0 },
  { name: "Vercel", category: "Infrastructure", amount: -20.0 },
  { name: "Refund", category: "Aeropress store", amount: 34.9 },
  { name: "Spotify", category: "Subscriptions", amount: -10.99 },
];

const currency = (amount: number) =>
  `${amount < 0 ? "−" : "+"}$${Math.abs(amount).toFixed(2)}`;

function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {STATS.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="space-y-1.5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <AnimatedNumber
              value={stat.value}
              format={{ style: "currency", currency: "USD" }}
              className="font-mono text-2xl font-semibold tabular-nums"
            />
            <Badge variant={stat.up ? "secondary" : "outline"}>
              {stat.up ? (
                <ArrowUpRightIcon className="size-3" />
              ) : (
                <ArrowDownLeftIcon className="size-3" />
              )}
              {stat.change} this month
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ActivityChart() {
  const [active, setActive] = useState(5);

  return (
    <div className="space-y-3">
      <div className="flex h-36 items-end gap-2">
        {WEEKLY_ACTIVITY.map((value, index) => (
          <button
            key={DAYS[index]}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`${DAYS[index]}: ${value} points`}
            className="flex-1 rounded-t-md transition-all hover:opacity-90"
            style={{
              height: `${value}%`,
              background:
                index === active ? "var(--primary)" : "var(--accent)",
            }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {DAYS.map((day, index) => (
          <span
            key={day}
            className={
              "flex-1 text-center text-xs " +
              (index === active
                ? "font-medium text-foreground"
                : "text-muted-foreground")
            }
          >
            {day}
          </span>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        <span className="font-mono font-medium tabular-nums text-foreground">
          {WEEKLY_ACTIVITY[active]}
        </span>{" "}
        activity points on {DAYS[active]}
      </p>
    </div>
  );
}

function TransactionList() {
  return (
    <div>
      {TRANSACTIONS.map((tx, index) => (
        <div key={tx.name + index}>
          {index > 0 && <Separator />}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium">{tx.name}</p>
              <p className="text-xs text-muted-foreground">{tx.category}</p>
            </div>
            <span
              className={
                "font-mono text-sm font-medium tabular-nums " +
                (tx.amount < 0 ? "text-foreground" : "text-primary")
              }
            >
              {currency(tx.amount)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TransferForm() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [instant, setInstant] = useState(true);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const valid = recipient.trim() && Number(amount) > 0;

  const send = () => {
    if (!valid) return;
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      toast.success(`Sent $${Number(amount).toFixed(2)} to ${recipient}`, {
        description: instant ? "Instant transfer" : "Arrives in 1–2 days",
      });
      setTimeout(() => {
        setStatus("idle");
        setRecipient("");
        setAmount("");
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="recipient">Recipient</Label>
        <Input
          id="recipient"
          placeholder="name@example.com"
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          placeholder="0.00"
          className="font-mono tabular-nums"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="instant" className="font-normal">
          Instant transfer
          <Badge className="bg-brand text-brand-foreground">Brand</Badge>
        </Label>
        <Switch
          id="instant"
          checked={instant}
          onCheckedChange={setInstant}
        />
      </div>
      <div className="flex gap-2">
        <Button
          className="flex-1"
          disabled={!valid || status !== "idle"}
          onClick={send}
        >
          {status === "sending" && (
            <Loader2Icon className="size-4 animate-spin" />
          )}
          {status === "sent" && <CheckIcon className="size-4" />}
          {status === "idle"
            ? instant
              ? "Send instantly"
              : "Send"
            : status === "sending"
              ? "Sending…"
              : "Sent"}
        </Button>
        <Button
          variant="secondary"
          disabled={status !== "idle"}
          onClick={() => {
            setRecipient("");
            setAmount("");
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

export function PreviewDashboard() {
  return (
    <div className="space-y-4">
      <StatCards />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>
              Primary highlights the selected bar, tertiary fills the rest.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="pt-4">
                <ActivityChart />
              </TabsContent>
              <TabsContent value="transactions" className="pt-2">
                <TransactionList />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>New transfer</CardTitle>
            <CardDescription>
              Inputs, labels, switch, and button states.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransferForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
