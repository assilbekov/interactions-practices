"use client";

import { useEffect, useState } from "react";
import { PaletteIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  GRAY_SCALES,
  MIXER_STORAGE_KEY,
  ROLE_CSS_VARS,
  ROLE_SWATCHES,
  type ColorRole,
  type MixerSelection,
} from "@/lib/theme-mixer";
import { cn } from "@/lib/utils";

const ROLES: { role: ColorRole; label: string }[] = [
  { role: "primary", label: "Primary" },
  { role: "secondary", label: "Secondary" },
  { role: "tertiary", label: "Tertiary" },
  { role: "brand", label: "Brand" },
];

function loadSelection(): MixerSelection {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(MIXER_STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function ThemeMixer() {
  const [selection, setSelection] = useState<MixerSelection>(loadSelection);

  useEffect(() => {
    localStorage.setItem(MIXER_STORAGE_KEY, JSON.stringify(selection));

    const style = document.documentElement.style;
    const applied: string[] = [];

    for (const { role } of ROLES) {
      const swatch = ROLE_SWATCHES[role].find(
        (s) => s.name === selection[role],
      );
      if (!swatch) continue;
      const vars = ROLE_CSS_VARS[role];
      for (const bg of vars.bg) {
        style.setProperty(bg, `light-dark(${swatch.light}, ${swatch.dark})`);
        applied.push(bg);
      }
      for (const fg of vars.fg) {
        style.setProperty(
          fg,
          `light-dark(${swatch.lightForeground}, ${swatch.darkForeground})`,
        );
        applied.push(fg);
      }
    }

    const grayScale = GRAY_SCALES.find((g) => g.name === selection.gray);
    if (grayScale) {
      style.setProperty(
        "--foreground",
        `light-dark(${grayScale.foreground.light}, ${grayScale.foreground.dark})`,
      );
      style.setProperty(
        "--muted-foreground",
        `light-dark(${grayScale.mutedForeground.light}, ${grayScale.mutedForeground.dark})`,
      );
      applied.push("--foreground", "--muted-foreground");
    }

    return () => {
      for (const name of applied) style.removeProperty(name);
    };
  }, [selection]);

  const toggle = (key: keyof MixerSelection, name: string) =>
    setSelection((prev) => ({
      ...prev,
      [key]: prev[key] === name ? undefined : name,
    }));

  const hasSelection = Object.values(selection).some(Boolean);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Theme mixer">
          <PaletteIcon className="size-4.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Theme mixer</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={!hasSelection}
            onClick={() => setSelection({})}
          >
            Reset
          </Button>
        </div>

        {ROLES.map(({ role, label }) => (
          <div key={role} className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">{label}</span>
            <div className="flex gap-1.5">
              {ROLE_SWATCHES[role].map((swatch) => (
                <button
                  key={swatch.name}
                  type="button"
                  title={`${label}: ${swatch.name}`}
                  aria-label={`${label}: ${swatch.name}`}
                  aria-pressed={selection[role] === swatch.name}
                  onClick={() => toggle(role, swatch.name)}
                  className={cn(
                    "size-5.5 rounded-full border transition-transform hover:scale-110",
                    selection[role] === swatch.name &&
                      "ring-2 ring-ring ring-offset-2 ring-offset-popover",
                  )}
                  style={{
                    background: `light-dark(${swatch.light}, ${swatch.dark})`,
                  }}
                />
              ))}
            </div>
          </div>
        ))}

        <Separator />

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Text</span>
          <div className="flex gap-1.5">
            {GRAY_SCALES.map((scale) => (
              <button
                key={scale.name}
                type="button"
                title={`Text: ${scale.name}`}
                aria-label={`Text: ${scale.name}`}
                aria-pressed={selection.gray === scale.name}
                onClick={() => toggle("gray", scale.name)}
                className={cn(
                  "size-5.5 rounded-full border transition-transform hover:scale-110",
                  selection.gray === scale.name &&
                    "ring-2 ring-ring ring-offset-2 ring-offset-popover",
                )}
                style={{
                  background: `light-dark(${scale.mutedForeground.light}, ${scale.mutedForeground.dark})`,
                }}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
