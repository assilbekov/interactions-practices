"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Timing = "immediate" | "reward-early" | "on-submit";

const STRATEGIES: {
  timing: Timing;
  title: string;
  good: boolean;
  note: string;
}[] = [
  {
    timing: "immediate",
    title: "Errors as you type",
    good: false,
    note: "Red from the very first keystroke — the form calls 'a' an invalid email when it's just an unfinished one. Typing under criticism.",
  },
  {
    timing: "on-submit",
    title: "Only on submit",
    good: false,
    note: "Silent until the end, then an ambush. Harmless here; on a 12-field form it's a wall of red and a scroll hunt.",
  },
  {
    timing: "reward-early",
    title: "Reward early, punish late",
    good: true,
    note: "The checkmark appears the instant the email becomes valid; the error waits until you leave the field. Credit is instant, criticism is patient.",
  },
];

function ValidationCard({
  timing,
  title,
  good,
  note,
}: {
  timing: Timing;
  title: string;
  good: boolean;
  note: string;
}) {
  const [email, setEmail] = useState("");
  const [blurred, setBlurred] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);

  const valid = EMAIL_RE.test(email);

  const showError = (() => {
    if (valid || email === "") {
      // on-submit shows "required" after an empty submit
      return timing === "on-submit" && submitted && !valid;
    }
    if (timing === "immediate") return true;
    if (timing === "reward-early") return blurred;
    return submitted;
  })();

  const showSuccess = valid && (timing === "reward-early" || blurred || submitted);

  const submit = () => {
    setSubmitted(true);
    if (valid) {
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    }
  };

  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2 text-sm font-medium">
        {title}
        <Badge variant={good ? "secondary" : "destructive"}>
          {good ? "Do" : "Don't"}
        </Badge>
      </p>
      <Card>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor={`email-${timing}`}>Email</Label>
            <div className="relative">
              <Input
                id={`email-${timing}`}
                type="email"
                placeholder="you@example.com"
                value={email}
                aria-invalid={showError}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setBlurred(true)}
                onFocus={() => {
                  // reward-early forgives while the user is editing again
                  if (timing === "reward-early") setBlurred(false);
                }}
              />
              {showSuccess && (
                <CheckIcon className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-primary" />
              )}
            </div>
            <p
              className={cn(
                "min-h-4 text-xs",
                showError ? "text-destructive" : "text-transparent",
              )}
            >
              {showError ? "Enter a valid email address." : "placeholder"}
            </p>
          </div>
          <Button className="w-full" onClick={submit}>
            {done ? <CheckIcon className="size-4" /> : null}
            {done ? "Subscribed" : "Subscribe"}
          </Button>
        </CardContent>
      </Card>
      <p className="text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

export function ValidationLab() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {STRATEGIES.map((strategy) => (
        <ValidationCard key={strategy.timing} {...strategy} />
      ))}
    </section>
  );
}
