import {
  Fira_Code,
  Geist,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Inter,
  JetBrains_Mono,
  Source_Code_Pro,
} from "next/font/google";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});
const firaCode = Fira_Code({ variable: "--font-fira-code", subsets: ["latin"] });
const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
});

export type FontOption = { name: string; cssVar: string };

export const FONT_GROUPS: { label: string; options: FontOption[] }[] = [
  {
    label: "UI",
    options: [
      { name: "Geist", cssVar: "--font-geist" },
      { name: "Inter", cssVar: "--font-inter" },
      { name: "IBM Plex Sans", cssVar: "--font-ibm-plex-sans" },
    ],
  },
  {
    label: "Dev mono",
    options: [
      { name: "JetBrains Mono", cssVar: "--font-jetbrains-mono" },
      { name: "Fira Code", cssVar: "--font-fira-code" },
      { name: "IBM Plex Mono", cssVar: "--font-ibm-plex-mono" },
      { name: "Source Code Pro", cssVar: "--font-source-code-pro" },
    ],
  },
];

export const FONT_OPTIONS: FontOption[] = FONT_GROUPS.flatMap(
  (group) => group.options,
);

export const DEFAULT_FONT = "Geist";
export const FONT_STORAGE_KEY = "app-font-sans";
// Resolved var() value for the pre-paint init script.
export const FONT_VAR_STORAGE_KEY = "app-font-sans-var";

export const fontVariableClasses = [
  geist,
  inter,
  ibmPlexSans,
  jetbrainsMono,
  firaCode,
  ibmPlexMono,
  sourceCodePro,
]
  .map((font) => font.variable)
  .join(" ");
