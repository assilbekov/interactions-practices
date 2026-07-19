"use client";

import { useEffect, useState } from "react";
import NumberFlow, { type Format } from "@number-flow/react";

import { cn } from "@/lib/utils";

type AnimatedNumberProps = {
  value: number;
  format?: Format;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Simulated initial load: value stays blurred this long, then reveals. */
  loadingMs?: number;
};

// Loading pattern for data numbers: blurred while loading, a plain unblur on
// reveal (no digit roll), and only changes AFTER the reveal animate through
// NumberFlow — `animated` stays false until the number is "loaded".
export function AnimatedNumber({
  value,
  format,
  prefix,
  suffix,
  className,
  loadingMs = 600,
}: AnimatedNumberProps) {
  const [loaded, setLoaded] = useState(loadingMs === 0);

  useEffect(() => {
    if (loadingMs === 0) return;
    const timer = setTimeout(() => setLoaded(true), loadingMs);
    return () => clearTimeout(timer);
  }, [loadingMs]);

  return (
    <span
      className={cn(
        "inline-block transition-[filter,opacity] duration-300",
        !loaded && "opacity-60 blur-[5px] select-none",
        className,
      )}
    >
      <NumberFlow
        value={value}
        format={format}
        prefix={prefix}
        suffix={suffix}
        animated={loaded}
      />
    </span>
  );
}
