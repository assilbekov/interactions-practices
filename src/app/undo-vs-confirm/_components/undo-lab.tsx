"use client";

import { useState } from "react";
import { FileIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type File = { id: number; name: string; size: string };

const FILES: File[] = [
  { id: 1, name: "landing-hero.fig", size: "2.4 MB" },
  { id: 2, name: "q3-report.pdf", size: "812 KB" },
  { id: 3, name: "team-photo.jpg", size: "5.1 MB" },
  { id: 4, name: "notes.md", size: "3 KB" },
];

function FileList({
  files,
  onDelete,
}: {
  files: File[];
  onDelete: (file: File) => void;
}) {
  return (
    <div className="space-y-1">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-2 rounded-lg border px-3 py-2"
        >
          <FileIcon className="size-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm">{file.name}</span>
          <span className="ml-auto font-mono text-xs tabular-nums text-muted-foreground">
            {file.size}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${file.name}`}
            onClick={() => onDelete(file)}
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      ))}
      {files.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          All files deleted.
        </p>
      )}
    </div>
  );
}

function StrategyCard({
  title,
  good,
  note,
  files,
  onDelete,
  onReset,
}: {
  title: string;
  good: boolean;
  note: string;
  files: File[];
  onDelete: (file: File) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2 text-sm font-medium">
        {title}
        <Badge variant={good ? "secondary" : "destructive"}>
          {good ? "Do" : "Don't"}
        </Badge>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="Restore all files"
          className="ml-auto"
          onClick={onReset}
        >
          <RotateCcwIcon className="size-3.5" />
        </Button>
      </p>
      <Card>
        <CardContent>
          <FileList files={files} onDelete={onDelete} />
        </CardContent>
      </Card>
      <p className="text-xs leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}

export function UndoLab() {
  const [instantFiles, setInstantFiles] = useState(FILES);
  const [undoFiles, setUndoFiles] = useState(FILES);
  const [confirmFiles, setConfirmFiles] = useState(FILES);
  const [confirmTarget, setConfirmTarget] = useState<File | null>(null);

  const deleteWithUndo = (file: File) => {
    setUndoFiles((prev) => prev.filter((f) => f.id !== file.id));
    toast(`Deleted ${file.name}`, {
      action: {
        label: "Undo",
        onClick: () =>
          setUndoFiles((prev) =>
            [...prev, file].sort((a, b) => a.id - b.id),
          ),
      },
    });
  };

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <StrategyCard
        title="Instant, no recourse"
        good={false}
        note="One slip and the file is gone. Users learn to fear every click — hesitation is the tax the whole interface pays."
        files={instantFiles}
        onDelete={(file) =>
          setInstantFiles((prev) => prev.filter((f) => f.id !== file.id))
        }
        onReset={() => setInstantFiles(FILES)}
      />

      <StrategyCard
        title="Confirm dialog"
        good
        note="Right for the irreversible — but feel the friction of answering a question for every single delete. Overuse trains reflexive 'yes'."
        files={confirmFiles}
        onDelete={setConfirmTarget}
        onReset={() => setConfirmFiles(FILES)}
      />

      <StrategyCard
        title="Undo toast"
        good
        note="Deletes feel instant and the mistake costs one click to fix. Try it: delete, then hit Undo in the toast."
        files={undoFiles}
        onDelete={deleteWithUndo}
        onReset={() => setUndoFiles(FILES)}
      />

      <Dialog
        open={confirmTarget !== null}
        onOpenChange={(open) => !open && setConfirmTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {confirmTarget?.name}?</DialogTitle>
            <DialogDescription>
              This file will be permanently removed. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirmTarget) {
                  setConfirmFiles((prev) =>
                    prev.filter((f) => f.id !== confirmTarget.id),
                  );
                }
                setConfirmTarget(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
