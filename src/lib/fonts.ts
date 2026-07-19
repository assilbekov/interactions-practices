import {
  Geist,
  IBM_Plex_Sans,
  Inter,
  JetBrains_Mono,
  Manrope,
} from "next/font/google";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export type FontOption = { name: string; cssVar: string };

export const FONT_OPTIONS: FontOption[] = [
  { name: "Geist", cssVar: "--font-geist" },
  { name: "Inter", cssVar: "--font-inter" },
  { name: "IBM Plex Sans", cssVar: "--font-ibm-plex-sans" },
  { name: "Manrope", cssVar: "--font-manrope" },
];

export const DEFAULT_FONT = "Geist";
export const FONT_STORAGE_KEY = "app-font-sans";

export const fontVariableClasses = [
  geist,
  inter,
  ibmPlexSans,
  manrope,
  jetbrainsMono,
]
  .map((font) => font.variable)
  .join(" ");
