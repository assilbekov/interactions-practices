"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const STEPS = ["Your details", "Address", "Check and submit"];

type Application = {
  fullName: string;
  birthYear: string;
  service: string;
  street: string;
  city: string;
  postcode: string;
};

const EMPTY: Application = {
  fullName: "",
  birthYear: "",
  service: "renewal",
  street: "",
  city: "",
  postcode: "",
};

export function GovernmentModule() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Application>(EMPTY);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const set = (patch: Partial<Application>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const validateStep = (): string[] => {
    if (step === 0) {
      const errs: string[] = [];
      if (form.fullName.trim().length < 2) errs.push("Enter your full name.");
      const year = Number(form.birthYear);
      if (!(year >= 1900 && year <= 2010))
        errs.push("Enter a valid year of birth (1900–2010).");
      return errs;
    }
    if (step === 1) {
      const errs: string[] = [];
      if (!form.street.trim()) errs.push("Enter your street address.");
      if (!form.city.trim()) errs.push("Enter your town or city.");
      if (!/^\d{5,6}$/.test(form.postcode))
        errs.push("Enter a 5–6 digit postcode.");
      return errs;
    }
    return [];
  };

  const next = () => {
    const errs = validateStep();
    setErrors(errs);
    if (errs.length === 0) setStep((s) => Math.min(s + 1, 2));
  };

  if (submitted) {
    const reference = `APP-${(form.fullName.length * 7919 + Number(form.postcode || 0)) % 100000}`;
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="space-y-3 py-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center bg-secondary">
            <CheckIcon className="size-6 text-secondary-foreground" />
          </div>
          <p className="text-lg font-semibold">Application submitted</p>
          <p className="text-sm text-muted-foreground">
            Your reference number is{" "}
            <span className="font-mono font-medium text-foreground">
              {reference}
            </span>
            . A confirmation letter will arrive within 5 working days.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setStep(0);
              setForm(EMPTY);
            }}
          >
            Start a new application
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Apply for an ID card</CardTitle>
        <CardDescription>
          Three steps, validated one at a time — no surprises at the end.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <ol className="flex items-center gap-2">
          {STEPS.map((label, index) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  index < step
                    ? "bg-primary text-primary-foreground"
                    : index === step
                      ? "border-2 border-primary text-foreground"
                      : "border text-muted-foreground",
                )}
              >
                {index < step ? <CheckIcon className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  "text-xs",
                  index === step
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </li>
          ))}
        </ol>

        <Separator />

        {errors.length > 0 && (
          <div className="border-l-4 border-destructive bg-destructive/5 px-3 py-2">
            <p className="text-sm font-medium">There is a problem</p>
            <ul className="mt-1 list-inside list-disc text-sm text-destructive">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {step === 0 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="gov-name">Full name</Label>
              <Input
                id="gov-name"
                value={form.fullName}
                onChange={(event) => set({ fullName: event.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gov-year">Year of birth</Label>
              <Input
                id="gov-year"
                inputMode="numeric"
                className="w-32 font-mono tabular-nums"
                value={form.birthYear}
                onChange={(event) =>
                  set({ birthYear: event.target.value.replace(/\D/g, "").slice(0, 4) })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>What do you need?</Label>
              <RadioGroup
                value={form.service}
                onValueChange={(service) => set({ service })}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="renewal" id="gov-renewal" />
                  <Label htmlFor="gov-renewal" className="font-normal">
                    Renew an existing card
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="first" id="gov-first" />
                  <Label htmlFor="gov-first" className="font-normal">
                    Apply for the first time
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="gov-street">Street address</Label>
              <Input
                id="gov-street"
                value={form.street}
                onChange={(event) => set({ street: event.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="gov-city">Town or city</Label>
                <Input
                  id="gov-city"
                  value={form.city}
                  onChange={(event) => set({ city: event.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gov-postcode">Postcode</Label>
                <Input
                  id="gov-postcode"
                  inputMode="numeric"
                  className="font-mono tabular-nums"
                  value={form.postcode}
                  onChange={(event) =>
                    set({ postcode: event.target.value.replace(/\D/g, "").slice(0, 6) })
                  }
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <dl className="space-y-2 text-sm">
            {[
              ["Full name", form.fullName],
              ["Year of birth", form.birthYear],
              ["Service", form.service === "renewal" ? "Renewal" : "First application"],
              ["Address", `${form.street}, ${form.city}, ${form.postcode}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <Separator />

        <div className="flex justify-between">
          <Button
            variant="outline"
            disabled={step === 0}
            onClick={() => {
              setErrors([]);
              setStep((s) => Math.max(0, s - 1));
            }}
          >
            Back
          </Button>
          {step < 2 ? (
            <Button onClick={next}>Continue</Button>
          ) : (
            <Button onClick={() => setSubmitted(true)}>
              Accept and submit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
