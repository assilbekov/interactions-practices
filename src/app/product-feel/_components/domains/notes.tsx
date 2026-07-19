"use client";

import { useState } from "react";
import { PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Note = { id: number; title: string; body: string };

const INITIAL_NOTES: Note[] = [
  {
    id: 1,
    title: "Post ideas",
    body: "Slider hitboxes are smaller than you think.\nRadius grows with component size.\nSkeletons vs blur for fast APIs.",
  },
  {
    id: 2,
    title: "Groceries",
    body: "Oat milk, coffee beans, apples, bread.",
  },
  {
    id: 3,
    title: "Book quotes",
    body: "“Perception of speed matters more than speed.”",
  },
];

export function NotesModule() {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [activeId, setActiveId] = useState(1);
  const [query, setQuery] = useState("");
  const [nextId, setNextId] = useState(4);

  const visible = notes.filter(
    (note) =>
      !query.trim() ||
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.body.toLowerCase().includes(query.toLowerCase()),
  );
  const active = notes.find((note) => note.id === activeId);

  const update = (patch: Partial<Note>) =>
    setNotes((prev) =>
      prev.map((note) =>
        note.id === activeId ? { ...note, ...patch } : note,
      ),
    );

  const create = () => {
    const note = { id: nextId, title: "Untitled", body: "" };
    setNotes((prev) => [note, ...prev]);
    setActiveId(nextId);
    setNextId((id) => id + 1);
  };

  const remove = (id: number) => {
    setNotes((prev) => {
      const next = prev.filter((note) => note.id !== id);
      if (id === activeId && next.length > 0) setActiveId(next[0].id);
      return next;
    });
  };

  return (
    <Card>
      <CardContent className="grid gap-4 lg:grid-cols-5">
        <div className="space-y-2 lg:col-span-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search notes"
                className="pl-8"
              />
            </div>
            <Button size="icon" aria-label="New note" onClick={create}>
              <PlusIcon />
            </Button>
          </div>
          <div className="space-y-1">
            {visible.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => setActiveId(note.id)}
                className={cn(
                  "group flex w-full items-start justify-between gap-2 rounded-lg px-3 py-2 text-left transition-colors",
                  note.id === activeId ? "bg-muted" : "hover:bg-muted/50",
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">
                    {note.title || "Untitled"}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {note.body.split("\n")[0] || "Empty note"}
                  </span>
                </span>
                <Trash2Icon
                  role="button"
                  aria-label={`Delete ${note.title}`}
                  className="mt-0.5 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    remove(note.id);
                  }}
                />
              </button>
            ))}
            {visible.length === 0 && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                No notes match.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 lg:col-span-3">
          {active ? (
            <>
              <Input
                value={active.title}
                onChange={(event) => update({ title: event.target.value })}
                placeholder="Title"
                className="border-none bg-transparent px-0 text-lg font-semibold shadow-none focus-visible:ring-0 dark:bg-transparent"
              />
              <textarea
                value={active.body}
                onChange={(event) => update({ body: event.target.value })}
                placeholder="Start writing…"
                rows={10}
                className="w-full resize-none bg-transparent text-sm leading-relaxed outline-none"
                aria-label="Note body"
              />
              <p className="text-xs text-muted-foreground">
                Saved automatically ·{" "}
                <span className="font-mono tabular-nums">
                  {active.body.length}
                </span>{" "}
                characters
              </p>
            </>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Create a note to start writing.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
