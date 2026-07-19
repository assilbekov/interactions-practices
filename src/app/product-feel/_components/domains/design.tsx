"use client";

import { useRef, useState } from "react";
import {
  CircleIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  SquareIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { NumericInput } from "@/components/numeric-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

type ShapeKind = "rect" | "circle";

type Shape = {
  id: number;
  kind: ShapeKind;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  opacity: number;
  visible: boolean;
};

const CANVAS_W = 560;
const CANVAS_H = 320;

const FILLS = [
  "var(--primary)",
  "var(--secondary)",
  "var(--accent)",
  "var(--destructive)",
  "var(--muted-foreground)",
];

const INITIAL_SHAPES: Shape[] = [
  { id: 1, kind: "rect", name: "Hero card", x: 60, y: 60, w: 200, h: 120, fill: FILLS[1], opacity: 1, visible: true },
  { id: 2, kind: "circle", name: "Avatar", x: 320, y: 80, w: 90, h: 90, fill: FILLS[0], opacity: 1, visible: true },
  { id: 3, kind: "rect", name: "CTA button", x: 90, y: 210, w: 140, h: 44, fill: FILLS[0], opacity: 1, visible: true },
];

export function DesignModule() {
  const [shapes, setShapes] = useState(INITIAL_SHAPES);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [nextId, setNextId] = useState(4);
  const dragRef = useRef<{
    id: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const selected = shapes.find((shape) => shape.id === selectedId) ?? null;

  const update = (id: number, patch: Partial<Shape>) =>
    setShapes((prev) =>
      prev.map((shape) => (shape.id === id ? { ...shape, ...patch } : shape)),
    );

  const addShape = (kind: ShapeKind) => {
    const shape: Shape = {
      id: nextId,
      kind,
      name: `${kind === "rect" ? "Rectangle" : "Ellipse"} ${nextId}`,
      x: 40 + ((nextId * 24) % 120),
      y: 40 + ((nextId * 16) % 80),
      w: kind === "circle" ? 80 : 140,
      h: 80,
      fill: FILLS[nextId % FILLS.length],
      opacity: 1,
      visible: true,
    };
    setShapes((prev) => [...prev, shape]);
    setSelectedId(shape.id);
    setNextId((id) => id + 1);
  };

  const duplicate = () => {
    if (!selected) return;
    const copy = {
      ...selected,
      id: nextId,
      name: `${selected.name} copy`,
      x: selected.x + 16,
      y: selected.y + 16,
    };
    setShapes((prev) => [...prev, copy]);
    setSelectedId(nextId);
    setNextId((id) => id + 1);
    toast(`Duplicated ${selected.name}`);
  };

  const remove = () => {
    if (!selected) return;
    setShapes((prev) => prev.filter((shape) => shape.id !== selected.id));
    setSelectedId(null);
    toast(`Deleted ${selected.name}`);
  };

  // Pointer coords → SVG user units (the canvas scales responsively).
  const toCanvas = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: ((clientX - rect.left) / rect.width) * CANVAS_W,
      y: ((clientY - rect.top) / rect.height) * CANVAS_H,
    };
  };

  const startDrag = (event: React.PointerEvent, shape: Shape) => {
    event.preventDefault();
    setSelectedId(shape.id);
    const point = toCanvas(event.clientX, event.clientY);
    dragRef.current = {
      id: shape.id,
      startX: point.x,
      startY: point.y,
      originX: shape.x,
      originY: shape.y,
    };
    (event.target as Element).setPointerCapture(event.pointerId);
  };

  const onDrag = (event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const point = toCanvas(event.clientX, event.clientY);
    const shape = shapes.find((s) => s.id === drag.id);
    if (!shape) return;
    update(drag.id, {
      x: Math.round(
        Math.min(CANVAS_W - shape.w, Math.max(0, drag.originX + point.x - drag.startX)),
      ),
      y: Math.round(
        Math.min(CANVAS_H - shape.h, Math.max(0, drag.originY + point.y - drag.startY)),
      ),
    });
  };

  return (
    <Card>
      <CardContent className="grid gap-4 lg:grid-cols-6">
        {/* Layers */}
        <div className="space-y-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Layers</p>
            <div className="flex gap-0.5">
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Add rectangle"
                onClick={() => addShape("rect")}
              >
                <SquareIcon />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Add ellipse"
                onClick={() => addShape("circle")}
              >
                <CircleIcon />
              </Button>
            </div>
          </div>
          <div className="space-y-0.5">
            {[...shapes].reverse().map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => setSelectedId(shape.id)}
                className={cn(
                  "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                  shape.id === selectedId ? "bg-muted" : "hover:bg-muted/50",
                  !shape.visible && "opacity-50",
                )}
              >
                {shape.kind === "rect" ? (
                  <SquareIcon className="size-3 shrink-0" />
                ) : (
                  <CircleIcon className="size-3 shrink-0" />
                )}
                <span className="truncate">{shape.name}</span>
                <span
                  role="button"
                  aria-label={`Toggle visibility of ${shape.name}`}
                  className="ml-auto opacity-60 hover:opacity-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    update(shape.id, { visible: !shape.visible });
                  }}
                >
                  {shape.visible ? (
                    <EyeIcon className="size-3" />
                  ) : (
                    <EyeOffIcon className="size-3" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            className="w-full rounded-lg border bg-muted/30 touch-none"
            onPointerMove={onDrag}
            onPointerUp={() => (dragRef.current = null)}
            onPointerDown={(event) => {
              if (event.target === svgRef.current) setSelectedId(null);
            }}
          >
            {shapes
              .filter((shape) => shape.visible)
              .map((shape) => {
                const common = {
                  fill: shape.fill,
                  opacity: shape.opacity,
                  onPointerDown: (event: React.PointerEvent) =>
                    startDrag(event, shape),
                  className: "cursor-move",
                };
                return shape.kind === "rect" ? (
                  <rect
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    width={shape.w}
                    height={shape.h}
                    rx={8}
                    {...common}
                  />
                ) : (
                  <ellipse
                    key={shape.id}
                    cx={shape.x + shape.w / 2}
                    cy={shape.y + shape.h / 2}
                    rx={shape.w / 2}
                    ry={shape.h / 2}
                    {...common}
                  />
                );
              })}
            {selected && selected.visible && (
              <rect
                x={selected.x - 2}
                y={selected.y - 2}
                width={selected.w + 4}
                height={selected.h + 4}
                fill="none"
                stroke="var(--ring)"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                vectorEffect="non-scaling-stroke"
                pointerEvents="none"
              />
            )}
          </svg>
          <p className="mt-1 text-xs text-muted-foreground">
            Drag shapes to move them · click empty canvas to deselect
          </p>
        </div>

        {/* Inspector */}
        <div className="space-y-3 lg:col-span-2">
          <p className="text-xs font-medium text-muted-foreground">Inspector</p>
          {selected ? (
            <>
              <Input
                value={selected.name}
                onChange={(event) =>
                  update(selected.id, { name: event.target.value })
                }
                className="h-8 text-sm"
                aria-label="Layer name"
              />
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    ["X", "x"],
                    ["Y", "y"],
                    ["W", "w"],
                    ["H", "h"],
                  ] as const
                ).map(([label, key]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <Label className="w-4 text-xs text-muted-foreground">
                      {label}
                    </Label>
                    <NumericInput
                      aria-label={label}
                      value={selected[key]}
                      min={key === "w" || key === "h" ? 10 : 0}
                      onChange={(next) => update(selected.id, { [key]: next })}
                      className="h-8 text-xs"
                    />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">
                  Tip: drag vertically on a value to scrub it
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Fill</Label>
                <div className="flex gap-1.5">
                  {FILLS.map((fill) => (
                    <button
                      key={fill}
                      type="button"
                      aria-label={`Fill ${fill}`}
                      onClick={() => update(selected.id, { fill })}
                      className={cn(
                        "size-6 rounded-md border transition-transform hover:scale-110",
                        selected.fill === fill &&
                          "ring-2 ring-ring ring-offset-1 ring-offset-background",
                      )}
                      style={{ background: fill }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <Label className="text-xs text-muted-foreground">
                    Opacity
                  </Label>
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {Math.round(selected.opacity * 100)}%
                  </span>
                </div>
                <Slider
                  value={[selected.opacity * 100]}
                  onValueChange={([value]) =>
                    update(selected.id, { opacity: value / 100 })
                  }
                  min={10}
                  max={100}
                  step={5}
                  aria-label="Opacity"
                />
              </div>
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" onClick={duplicate}>
                  <CopyIcon />
                  Duplicate
                </Button>
                <Button variant="ghost" size="sm" onClick={remove}>
                  <Trash2Icon />
                  Delete
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a shape to edit its properties.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
