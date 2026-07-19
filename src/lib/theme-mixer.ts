// OKLCH theme mixing. The hue is freely adjustable per role; lightness and
// chroma (the "weights") are fixed by the role, so any hue keeps the same
// perceived weight and the palette hierarchy never breaks.

export type ColorRole = "primary" | "secondary" | "tertiary" | "brand";

export type MixerHues = {
  primary: number;
  secondary: number;
  tertiary: number;
  brand: number;
  gray: number;
};

export const DEFAULT_HUES: MixerHues = {
  primary: 293,
  secondary: 293,
  tertiary: 221,
  brand: 293,
  gray: 259,
};

type RoleColors = {
  light: string;
  dark: string;
  lightForeground: string;
  darkForeground: string;
};

// Solid, saturated — buttons, links, focus rings.
const strong = (hue: number): RoleColors => ({
  light: `oklch(0.55 0.2 ${hue})`,
  dark: `oklch(0.72 0.15 ${hue})`,
  lightForeground: "oklch(0.985 0 0)",
  darkForeground: `oklch(0.205 0.02 ${hue})`,
});

// Soft surface tint — secondary buttons, badges, subtle fills.
const soft = (hue: number): RoleColors => ({
  light: `oklch(0.95 0.04 ${hue})`,
  dark: `oklch(0.3 0.05 ${hue})`,
  lightForeground: `oklch(0.35 0.1 ${hue})`,
  darkForeground: `oklch(0.9 0.04 ${hue})`,
});

const ROLE_WEIGHTS: Record<ColorRole, (hue: number) => RoleColors> = {
  primary: strong,
  secondary: soft,
  tertiary: soft,
  brand: strong,
};

const lightDark = (light: string, dark: string) =>
  `light-dark(${light}, ${dark})`;

export function rolePreview(role: ColorRole, hue: number): string {
  const colors = ROLE_WEIGHTS[role](hue);
  return lightDark(colors.light, colors.dark);
}

export function grayPreview(hue: number): string {
  return lightDark(`oklch(0.5 0.02 ${hue})`, `oklch(0.72 0.02 ${hue})`);
}

// All CSS custom properties for a mix, as light-dark() values that follow
// the color-scheme set by next-themes.
export function buildCssVars(hues: MixerHues): Record<string, string> {
  const primary = ROLE_WEIGHTS.primary(hues.primary);
  const secondary = ROLE_WEIGHTS.secondary(hues.secondary);
  const tertiary = ROLE_WEIGHTS.tertiary(hues.tertiary);
  const brand = ROLE_WEIGHTS.brand(hues.brand);

  return {
    "--primary": lightDark(primary.light, primary.dark),
    "--primary-foreground": lightDark(
      primary.lightForeground,
      primary.darkForeground,
    ),
    "--ring": lightDark(primary.light, primary.dark),
    "--secondary": lightDark(secondary.light, secondary.dark),
    "--secondary-foreground": lightDark(
      secondary.lightForeground,
      secondary.darkForeground,
    ),
    "--accent": lightDark(tertiary.light, tertiary.dark),
    "--accent-foreground": lightDark(
      tertiary.lightForeground,
      tertiary.darkForeground,
    ),
    "--brand": lightDark(brand.light, brand.dark),
    "--brand-foreground": lightDark(
      brand.lightForeground,
      brand.darkForeground,
    ),
    "--foreground": lightDark(
      `oklch(0.145 0.02 ${hues.gray})`,
      `oklch(0.985 0.01 ${hues.gray})`,
    ),
    "--muted-foreground": lightDark(
      `oklch(0.5 0.02 ${hues.gray})`,
      `oklch(0.72 0.02 ${hues.gray})`,
    ),
  };
}

export type Preset = { name: string; hues: MixerHues };

export const BUILT_IN_PRESETS: Preset[] = [
  { name: "Violet", hues: DEFAULT_HUES },
  {
    name: "Ocean",
    hues: { primary: 259, secondary: 221, tertiary: 163, brand: 259, gray: 259 },
  },
  {
    name: "Forest",
    hues: { primary: 163, secondary: 163, tertiary: 76, brand: 163, gray: 163 },
  },
  {
    name: "Sunset",
    hues: { primary: 16, secondary: 76, tertiary: 16, brand: 16, gray: 76 },
  },
];

export const MIXER_STORAGE_KEY = "theme-mixer-hues";
export const PRESETS_STORAGE_KEY = "theme-mixer-presets";
// Final computed vars, persisted so the pre-paint init script can apply them
// without re-deriving (see ThemeInitScript in layout).
export const VARS_STORAGE_KEY = "theme-mixer-vars";
