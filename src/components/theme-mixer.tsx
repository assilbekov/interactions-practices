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
  CONTROL_SIZES,
  DEFAULT_SETTINGS,
  MIXER_APPLY_EVENT,
  MIXER_STORAGE_KEY,
  PRESETS_STORAGE_KEY,
  VARS_STORAGE_KEY,
  buildCssVars,
  buildShapeVars,
  grayPreview,
  rolePreview,
  type ColorRole,
  type MixerHues,
  type MixerSettings,
} from "@/lib/theme-mixer";
import { cn } from "@/lib/utils";

const ROLES: { role: ColorRole; label: string }[] = [
  { role: "primary", label: "Primary color" },
  { role: "secondary", label: "Secondary color" },
  { role: "tertiary", label: "Tertiary color" },
  { role: "brand", label: "Brand color" },
];

type SavedPreset = { name: string; settings: MixerSettings };

function loadSettings(): MixerSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = JSON.parse(localStorage.getItem(MIXER_STORAGE_KEY) ?? "null");
    if (!raw) return DEFAULT_SETTINGS;
    // Migrate the old hues-only shape ({ primary: 293, ... }).
    if (typeof raw.primary === "number") {
      return { ...DEFAULT_SETTINGS, hues: { ...DEFAULT_SETTINGS.hues, ...raw } };
    }
    return {
      ...DEFAULT_SETTINGS,
      ...raw,
      hues: { ...DEFAULT_SETTINGS.hues, ...raw.hues },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function loadPresets(): SavedPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw: unknown[] = JSON.parse(
      localStorage.getItem(PRESETS_STORAGE_KEY) ?? "[]",
    );
    return raw.map((p) => {
      const preset = p as { name: string; hues?: MixerHues; settings?: MixerSettings };
      // Migrate old hues-only presets.
      if (preset.hues) {
        return {
          name: preset.name,
          settings: { ...DEFAULT_SETTINGS, hues: preset.hues },
        };
      }
      return preset as SavedPreset;
    });
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
  const [settings, setSettings] = useState<MixerSettings>(loadSettings);
  const [presets, setPresets] = useState<SavedPreset[]>(loadPresets);
  const [presetName, setPresetName] = useState("");

  useEffect(() => {
    localStorage.setItem(MIXER_STORAGE_KEY, JSON.stringify(settings));

    const style = document.documentElement.style;
    const vars = {
      ...buildCssVars(settings.hues),
      ...buildShapeVars(settings),
    };
    localStorage.setItem(VARS_STORAGE_KEY, JSON.stringify(vars));
    for (const [name, value] of Object.entries(vars)) {
      style.setProperty(name, value);
    }
    return () => {
      for (const name of Object.keys(vars)) style.removeProperty(name);
    };
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
  }, [presets]);

  useEffect(() => {
    const onApply = (event: Event) => {
      const detail = (event as CustomEvent<Partial<MixerSettings>>).detail;
      if (!detail) return;
      setSettings((prev) => ({
        ...prev,
        ...detail,
        hues: { ...prev.hues, ...(detail.hues ?? {}) },
      }));
    };
    window.addEventListener(MIXER_APPLY_EVENT, onApply);
    return () => window.removeEventListener(MIXER_APPLY_EVENT, onApply);
  }, []);

  const setHue = (key: keyof MixerHues, value: number) =>
    setSettings((prev) => ({
      ...prev,
      hues: { ...prev.hues, [key]: value },
    }));

  const savePreset = () => {
    const name = presetName.trim();
    if (!name) return;
    setPresets((prev) => [
      ...prev.filter((p) => p.name !== name),
      { name, settings },
    ]);
    setPresetName("");
  };

  const radiusPx = Math.round(settings.radius * 16);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Theme mixer">
          <PaletteIcon className="size-4.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="max-h-[80vh] w-80 space-y-4 overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Theme mixer</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setSettings(DEFAULT_SETTINGS)}
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
                onClick={() =>
                  setSettings((prev) => ({ ...prev, hues: preset.hues }))
                }
                className={cn(
                  "flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors hover:bg-muted",
                  JSON.stringify(preset.hues) ===
                    JSON.stringify(settings.hues) && "border-ring",
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
                onClick={() => setSettings(preset.settings)}
                className={cn(
                  "group flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs transition-colors hover:bg-muted",
                  JSON.stringify(preset.settings) ===
                    JSON.stringify(settings) && "border-ring",
                )}
              >
                <span
                  className="size-3 rounded-full"
                  style={{
                    background: rolePreview(
                      "primary",
                      preset.settings.hues.primary,
                    ),
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
            hue={settings.hues[role]}
            preview={rolePreview(role, settings.hues[role])}
            onChange={(value) => setHue(role, value)}
          />
        ))}

        <HueRow
          label="Text gray"
          hue={settings.hues.gray}
          preview={grayPreview(settings.hues.gray)}
          onChange={(value) => setHue("gray", value)}
        />

        <Separator />

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Radius</span>
            <div
              className="size-5 border-t-2 border-l-2 border-foreground/60"
              style={{ borderTopLeftRadius: `${radiusPx}px` }}
            />
          </div>
          <Slider
            value={[radiusPx]}
            onValueChange={([value]) =>
              setSettings((prev) => ({ ...prev, radius: value / 16 }))
            }
            min={0}
            max={24}
            step={2}
            aria-label="Corner radius"
          />
          <p className="text-xs text-muted-foreground">
            Radius: <span className="font-mono tabular-nums">{radiusPx}px</span>
          </p>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-medium">Control height</span>
          <div className="flex gap-1.5">
            {CONTROL_SIZES.map((size) => (
              <button
                key={size.label}
                type="button"
                onClick={() =>
                  setSettings((prev) => ({ ...prev, control: size.rem }))
                }
                className={cn(
                  "flex-1 rounded-md border px-2 py-1.5 font-mono text-xs tabular-nums transition-colors hover:bg-muted",
                  settings.control === size.rem && "border-ring bg-muted",
                )}
              >
                {size.label}px
              </button>
            ))}
          </div>
        </div>

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
