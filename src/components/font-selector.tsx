"use client";

import { useEffect, useState } from "react";
import { CheckIcon, TypeIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DEFAULT_FONT,
  FONT_GROUPS,
  FONT_OPTIONS,
  FONT_STORAGE_KEY,
} from "@/lib/fonts";

function loadFont(): string {
  if (typeof window === "undefined") return DEFAULT_FONT;
  return localStorage.getItem(FONT_STORAGE_KEY) ?? DEFAULT_FONT;
}

export function FontSelector() {
  const [font, setFont] = useState<string>(loadFont);

  useEffect(() => {
    localStorage.setItem(FONT_STORAGE_KEY, font);

    const option = FONT_OPTIONS.find((o) => o.name === font);
    const style = document.documentElement.style;
    if (option && option.name !== DEFAULT_FONT) {
      style.setProperty("--app-font-sans", `var(${option.cssVar})`);
      return () => {
        style.removeProperty("--app-font-sans");
      };
    }
  }, [font]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Choose font">
          <TypeIcon className="size-4.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {FONT_GROUPS.map((group, index) => (
          <div key={group.label}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {group.label}
            </DropdownMenuLabel>
            {group.options.map((option) => (
              <DropdownMenuItem
                key={option.name}
                onClick={() => setFont(option.name)}
                style={{ fontFamily: `var(${option.cssVar})` }}
              >
                {option.name}
                {font === option.name && (
                  <CheckIcon className="ml-auto size-4" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
