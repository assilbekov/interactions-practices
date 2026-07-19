"use client";

import { useState } from "react";
import { CheckIcon, CreditCardIcon, Loader2Icon } from "lucide-react";

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

const AMOUNT = 49.0;

const luhnValid = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
};

const cardBrand = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  return null;
};

const formatCard = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const expiryValid = (value: string) => {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  return month >= 1 && month <= 12;
};

export function PaymentsModule() {
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "paid">("idle");
  const [touched, setTouched] = useState(false);

  const brand = cardBrand(card);
  const cardOk = luhnValid(card);
  const expiryOk = expiryValid(expiry);
  const cvcOk = /^\d{3,4}$/.test(cvc);
  const nameOk = name.trim().length >= 2;
  const valid = cardOk && expiryOk && cvcOk && nameOk;

  const pay = () => {
    setTouched(true);
    if (!valid) return;
    setStatus("processing");
    setTimeout(() => setStatus("paid"), 1400);
  };

  if (status === "paid") {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="space-y-3 py-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary">
            <CheckIcon className="size-6 text-secondary-foreground" />
          </div>
          <p className="text-lg font-semibold">Payment confirmed</p>
          <p className="font-mono text-2xl font-semibold tabular-nums">
            ${AMOUNT.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            {brand ?? "Card"} ····{card.replace(/\D/g, "").slice(-4)} ·
            receipt sent to your email
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setStatus("idle");
              setCard("");
              setExpiry("");
              setCvc("");
              setName("");
              setTouched(false);
            }}
          >
            New payment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Pay Acme Pro</CardTitle>
        <CardDescription>
          Real card validation: Luhn check, brand detection, input masking.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
          <span className="text-sm text-muted-foreground">Acme Pro · annual</span>
          <span className="font-mono font-semibold tabular-nums">
            ${AMOUNT.toFixed(2)}
          </span>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pay-card">Card number</Label>
          <div className="relative">
            <CreditCardIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="pay-card"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              value={card}
              onChange={(event) => setCard(formatCard(event.target.value))}
              aria-invalid={touched && !cardOk}
              className="pl-9 font-mono tabular-nums"
            />
            {brand && (
              <Badge
                variant="secondary"
                className="absolute top-1/2 right-2 -translate-y-1/2"
              >
                {brand}
              </Badge>
            )}
          </div>
          {touched && !cardOk && (
            <p className="text-xs text-destructive">
              That card number doesn&apos;t pass the checksum.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="pay-expiry">Expiry</Label>
            <Input
              id="pay-expiry"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              value={expiry}
              onChange={(event) => setExpiry(formatExpiry(event.target.value))}
              aria-invalid={touched && !expiryOk}
              className="font-mono tabular-nums"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pay-cvc">CVC</Label>
            <Input
              id="pay-cvc"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              value={cvc}
              onChange={(event) =>
                setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))
              }
              aria-invalid={touched && !cvcOk}
              className="font-mono tabular-nums"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pay-name">Name on card</Label>
          <Input
            id="pay-name"
            autoComplete="cc-name"
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={touched && !nameOk}
          />
        </div>

        <Separator />

        <Button
          size="lg"
          className="w-full"
          disabled={status === "processing"}
          onClick={pay}
        >
          {status === "processing" && (
            <Loader2Icon className="size-4 animate-spin" />
          )}
          {status === "processing" ? "Processing…" : `Pay $${AMOUNT.toFixed(2)}`}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Test with 4242 4242 4242 4242 · any future MM/YY · any CVC
        </p>
      </CardContent>
    </Card>
  );
}
