import Link from "next/link";
import { SparklesIcon } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <SparklesIcon className="size-4.5" />
          Interactions Practices
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
