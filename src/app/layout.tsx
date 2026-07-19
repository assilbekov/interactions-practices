import type { Metadata } from "next";
import "./globals.css";

import { Header } from "@/components/header";
import { ThemeInitScript } from "@/components/theme-init-script";
import { ThemeProvider } from "@/components/theme-provider";
import { fontVariableClasses } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    default: "Interactions Practices",
    template: "%s · Interactions Practices",
  },
  description:
    "A pattern-comparison lab for UX micro-interactions: loading states, optimistic updates, transitions, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontVariableClasses} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeInitScript />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
