"use client";

import { useEffect, useState } from "react";
import { PaletteIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  BUILT_IN_PRESETS,
  DEFAULT_HUES,
  MIXER_STORAGE_KEY,
  PRESETS_STORAGE_KEY,
  VARS_STORAGE_KEY,
  buildCssVars,
  grayPreview,
  rolePreview,
  type ColorRole,
  type MixerHues,
  type Preset,
} from "@/lib/theme-mixer";
import { cn } from "@/lib/utils";

const ROLES: { role: ColorRole; label: string }[] = [
  { role: "primary", label: "Primary color" },
  { role: "secondary", label: "Secondary color" },
  { role: "tertiary", label: "Tertiary color" },
  { role: "brand", label: "Brand color" },
];

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function loadPresets(): Preset[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PRESETS_STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function HueRow({
  label,
  hue,
  preview,
  onChange,
}: {
  label: string;
  hue: number;
  preview: string;
  onChange: (hue: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">{label}</span>
        <div
          className="h-5 w-9 rounded-md border"
          style={{ background: preview }}
        />
      </div>
      <Slider
        value={[hue]}
        onValueChange={([value]) => onChange(value)}
        min={0}
        max={360}
        step={1}
        aria-label={`${label} hue`}
      />
      <p className="text-xs text-muted-foreground">
        Hue: <span className="font-mono tabular-nums">{hue}</span>
      </p>
    </div>
  );
}

export function ThemeMixer() {
  const [hues, setHues] = useState<MixerHues>(() =>
    load(MIXER_STORAGE_KEY, DEFAULT_HUES),
  );
  const [presets, setPresets] = useState<Preset[]>(loadPresets);
  const [presetName, setPresetName] = useState("");

  useEffect(() => {
    localStorage.setItem(MIXER_STORAGE_KEY, JSON.stringify(hues));

    const style = document.documentElement.style;
    const vars = buildCssVars(hues);
    localStorage.setItem(VARS_STORAGE_KEY, JSON.stringify(vars));
    for (const [name, value] of Object.entries(vars)) {
      style.setProperty(name, value);
    }
    return () => {
      for (const name of Object.keys(vars)) style.removeProperty(name);
    };
  }, [hues]);

  useEffect(() => {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
  }, [presets]);

  const setHue = (key: keyof MixerHues, value: number) =>
    setHues((prev) => ({ ...prev, [key]: value }));

  const savePreset = () => {
    const name = presetName.trim();
    if (!name) return;
    setPresets((prev) => [
      ...prev.filter((p) => p.name !== name),
      { name, hues },
    ]);
    setPresetName("");
  };

  const isActive = (preset: Preset) =>
    JSON.stringify(preset.hues) === JSON.stringify(hues);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Theme mixer">
          <PaletteIcon className="size-4.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Theme mixer</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setHues(DEFAULT_HUES)}
          >
            Reset
          </Button>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs text-muted-foreground">Presets</span>
          <div className="flex flex-wrap gap-1.5">
            {BUILT_IN_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setHues(preset.hues)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors hover:bg-muted",
                  isActive(preset) && "border-ring",
                )}
              >
                <span
                  className="size-3 rounded-full"
                  style={{
                    background: rolePreview("primary", preset.hues.primary),
                  }}
                />
                {preset.name}
              </button>
            ))}
            {presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setHues(preset.hues)}
                className={cn(
                  "group flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors hover:bg-muted",
                  isActive(preset) && "border-ring",
                )}
              >
                <span
                  className="size-3 rounded-full"
                  style={{
                    background: rolePreview("primary", preset.hues.primary),
                  }}
                />
                {preset.name}
                <XIcon
                  role="button"
                  aria-label={`Delete preset ${preset.name}`}
                  className="size-3 text-muted-foreground opacity-50 group-hover:opacity-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    setPresets((prev) =>
                      prev.filter((p) => p.name !== preset.name),
                    );
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {ROLES.map(({ role, label }) => (
          <HueRow
            key={role}
            label={label}
            hue={hues[role]}
            preview={rolePreview(role, hues[role])}
            onChange={(value) => setHue(role, value)}
          />
        ))}

        <HueRow
          label="Text gray"
          hue={hues.gray}
          preview={grayPreview(hues.gray)}
          onChange={(value) => setHue("gray", value)}
        />

        <Separator />

        <div className="flex gap-2">
          <Input
            value={presetName}
            onChange={(event) => setPresetName(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && savePreset()}
            placeholder="Preset name"
            className="h-8 text-xs"
          />
          <Button
            size="sm"
            className="h-8"
            disabled={!presetName.trim()}
            onClick={savePreset}
          >
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
