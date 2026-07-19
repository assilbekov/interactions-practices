"use client";

import { useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type NumericInputProps = {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  /** Pixels of vertical drag per step. */
  pxPerStep?: number;
  className?: string;
  "aria-label"?: string;
};

// Figma-style scrubbing input: click-and-drag vertically on the value to
// step it (up = increase); a plain click still focuses for typing. Arrow
// keys step too.
export function NumericInput({
  value,
  onChange,
  step = 1,
  min = -Infinity,
  max = Infinity,
  pxPerStep = 4,
  className,
  "aria-label": ariaLabel,
}: NumericInputProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const drag = useRef<{
    pointerId: number;
    startY: number;
    startValue: number;
    scrubbing: boolean;
  } | null>(null);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const commitDraft = (text: string) => {
    const n = Number(text);
    if (Number.isFinite(n)) onChange(clamp(n));
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      aria-label={ariaLabel}
      value={editing ? draft : String(value)}
      className={cn(
        "cursor-ns-resize font-mono tabular-nums select-none focus:cursor-text",
        className,
      )}
      onFocus={() => {
        setEditing(true);
        setDraft(String(value));
      }}
      onBlur={() => setEditing(false)}
      onChange={(event) => {
        setDraft(event.target.value);
        commitDraft(event.target.value);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          event.preventDefault();
          const next = clamp(
            value + (event.key === "ArrowUp" ? step : -step),
          );
          onChange(next);
          setDraft(String(next));
        }
        if (event.key === "Enter") (event.target as HTMLInputElement).blur();
      }}
      onPointerDown={(event) => {
        // Primary button only; let touch keyboards behave normally.
        if (event.button !== 0) return;
        drag.current = {
          pointerId: event.pointerId,
          startY: event.clientY,
          startValue: value,
          scrubbing: false,
        };
      }}
      onPointerMove={(event) => {
        const state = drag.current;
        if (!state || event.pointerId !== state.pointerId) return;
        const dy = state.startY - event.clientY;
        if (!state.scrubbing && Math.abs(dy) > 3) {
          state.scrubbing = true;
          (event.target as Element).setPointerCapture(event.pointerId);
          (event.target as HTMLInputElement).blur();
        }
        if (state.scrubbing) {
          event.preventDefault();
          onChange(clamp(state.startValue + Math.round(dy / pxPerStep) * step));
        }
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
    />
  );
}
