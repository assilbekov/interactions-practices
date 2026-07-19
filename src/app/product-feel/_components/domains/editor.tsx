"use client";

import { useState } from "react";
import { CircleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type File = { name: string; content: string };

const INITIAL_FILES: File[] = [
  {
    name: "utils.ts",
    content: `export function debounce<T extends (...args: never[]) => void>(\n  fn: T,\n  ms: number,\n) {\n  let timer: ReturnType<typeof setTimeout>;\n  return (...args: Parameters<T>) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n}`,
  },
  {
    name: "config.json",
    content: `{\n  "theme": "dark",\n  "tabSize": 2,\n  "formatOnSave": true\n}`,
  },
  {
    name: "README.md",
    content: `# interactions-practices\n\nA pattern-comparison lab for UX micro-interactions.`,
  },
];

export function EditorModule() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [saved, setSaved] = useState(INITIAL_FILES);
  const [active, setActive] = useState(0);

  const file = files[active];
  const dirty = file.content !== saved[active].content;
  const lines = file.content.split("\n");

  const update = (content: string) =>
    setFiles((prev) =>
      prev.map((f, i) => (i === active ? { ...f, content } : f)),
    );

  const save = () =>
    setSaved((prev) => prev.map((f, i) => (i === active ? files[i] : f)));

  const format = () =>
    update(
      file.content
        .split("\n")
        .map((line) => line.replace(/\s+$/, ""))
        .join("\n"),
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editor</CardTitle>
        <CardDescription>
          Working buffer state: dirty indicators, save, trailing-whitespace
          format.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-1 border-b pb-2">
          {files.map((f, i) => (
            <button
              key={f.name}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs transition-colors",
                i === active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.name}
              {files[i].content !== saved[i].content && (
                <CircleIcon className="size-1.5 fill-current" />
              )}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={format}>
              Format
            </Button>
            <Button size="sm" disabled={!dirty} onClick={save}>
              Save
            </Button>
          </div>
        </div>

        <div className="flex overflow-hidden rounded-md border bg-muted/30">
          <div className="select-none border-r bg-muted/40 px-2 py-3 text-right font-mono text-xs leading-5 text-muted-foreground">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={file.content}
            onChange={(event) => update(event.target.value)}
            spellCheck={false}
            rows={Math.max(lines.length, 6)}
            className="w-full resize-none bg-transparent px-3 py-3 font-mono text-xs leading-5 outline-none"
            aria-label={`Edit ${file.name}`}
          />
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={dirty ? "outline" : "secondary"}>
            {dirty ? "Unsaved changes" : "Saved"}
          </Badge>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {lines.length} lines · {file.content.length} chars
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
