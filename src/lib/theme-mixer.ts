// All hues within a role share the same OKLCH lightness and chroma, so
// swapping hues never changes the perceived weight of the color — only the hue.

export type ColorRole = "primary" | "secondary" | "tertiary" | "brand";

export type Swatch = {
  name: string;
  light: string;
  dark: string;
  lightForeground: string;
  darkForeground: string;
};

const HUES = [
  { name: "Violet", hue: 293 },
  { name: "Blue", hue: 259 },
  { name: "Cyan", hue: 221 },
  { name: "Emerald", hue: 163 },
  { name: "Amber", hue: 76 },
  { name: "Rose", hue: 16 },
] as const;

// Solid, saturated — buttons, links, focus rings.
const strong = (hue: number): Omit<Swatch, "name"> => ({
  light: `oklch(0.55 0.2 ${hue})`,
  dark: `oklch(0.72 0.15 ${hue})`,
  lightForeground: "oklch(0.985 0 0)",
  darkForeground: "oklch(0.205 0.02 " + hue + ")",
});

// Soft surface tint — secondary buttons, badges, subtle fills.
const soft = (hue: number): Omit<Swatch, "name"> => ({
  light: `oklch(0.95 0.04 ${hue})`,
  dark: `oklch(0.3 0.05 ${hue})`,
  lightForeground: `oklch(0.35 0.1 ${hue})`,
  darkForeground: `oklch(0.9 0.04 ${hue})`,
});

export const ROLE_SWATCHES: Record<ColorRole, Swatch[]> = {
  primary: HUES.map(({ name, hue }) => ({ name, ...strong(hue) })),
  secondary: HUES.map(({ name, hue }) => ({ name, ...soft(hue) })),
  tertiary: HUES.map(({ name, hue }) => ({ name, ...soft(hue) })),
  brand: HUES.map(({ name, hue }) => ({ name, ...strong(hue) })),
};

// Text/gray scales: near-zero chroma with a hue cast, same L per step.
export type GrayScale = {
  name: string;
  foreground: { light: string; dark: string };
  mutedForeground: { light: string; dark: string };
};

const gray = (name: string, chroma: number, hue: number): GrayScale => ({
  name,
  foreground: {
    light: `oklch(0.145 ${chroma} ${hue})`,
    dark: `oklch(0.985 ${Math.min(chroma, 0.01)} ${hue})`,
  },
  mutedForeground: {
    light: `oklch(0.5 ${chroma} ${hue})`,
    dark: `oklch(0.72 ${chroma} ${hue})`,
  },
});

export const GRAY_SCALES: GrayScale[] = [
  gray("Neutral", 0, 0),
  gray("Slate", 0.02, 259),
  gray("Stone", 0.015, 76),
  gray("Sage", 0.015, 163),
];

// Which CSS custom properties each role drives.
export const ROLE_CSS_VARS: Record<ColorRole, { bg: string[]; fg: string[] }> =
  {
    primary: { bg: ["--primary", "--ring"], fg: ["--primary-foreground"] },
    secondary: { bg: ["--secondary"], fg: ["--secondary-foreground"] },
    tertiary: { bg: ["--accent"], fg: ["--accent-foreground"] },
    brand: { bg: ["--brand"], fg: ["--brand-foreground"] },
  };

export type MixerSelection = Partial<Record<ColorRole, string>> & {
  gray?: string;
};

export const MIXER_STORAGE_KEY = "theme-mixer";
