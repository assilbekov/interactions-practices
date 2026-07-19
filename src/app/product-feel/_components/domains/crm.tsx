"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { AnimatedNumber } from "@/components/animated-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STAGES = ["new", "contacted", "qualified", "won", "lost"] as const;
type Stage = (typeof STAGES)[number];

const STAGE_LABEL: Record<Stage, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
};

type Lead = {
  id: number;
  name: string;
  company: string;
  value: number;
  stage: Stage;
};

const INITIAL_LEADS: Lead[] = [
  { id: 1, name: "Sara Lindt", company: "Nordwind AB", value: 24000, stage: "qualified" },
  { id: 2, name: "Jan Kowalski", company: "Studio Krk", value: 8500, stage: "contacted" },
  { id: 3, name: "Leo Fischer", company: "Fischer GmbH", value: 56000, stage: "new" },
  { id: 4, name: "Mia Chen", company: "Chen Dev Co", value: 12000, stage: "won" },
  { id: 5, name: "Ivan Petrov", company: "Petrov.io", value: 4300, stage: "new" },
  { id: 6, name: "Nina Rossi", company: "Rossi SRL", value: 18700, stage: "contacted" },
];

export function CrmModule() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [value, setValue] = useState("");
  const [nextId, setNextId] = useState(7);

  const visible = leads.filter(
    (lead) => stageFilter === "all" || lead.stage === stageFilter,
  );
  const pipeline = leads
    .filter((lead) => !["won", "lost"].includes(lead.stage))
    .reduce((sum, lead) => sum + lead.value, 0);
  const won = leads
    .filter((lead) => lead.stage === "won")
    .reduce((sum, lead) => sum + lead.value, 0);

  const setStage = (id: number, stage: Stage) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, stage } : lead)),
    );
    const lead = leads.find((l) => l.id === id);
    if (lead && stage === "won") {
      toast.success(
        `Deal won — $${lead.value.toLocaleString("en-US")} from ${lead.company}`,
      );
    }
  };

  const addLead = () => {
    if (!name.trim() || !company.trim() || Number(value) <= 0) return;
    setLeads((prev) => [
      ...prev,
      {
        id: nextId,
        name: name.trim(),
        company: company.trim(),
        value: Number(value),
        stage: "new",
      },
    ]);
    setNextId((id) => id + 1);
    toast(`Lead added: ${name.trim()} (${company.trim()})`);
    setName("");
    setCompany("");
    setValue("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead pipeline</CardTitle>
        <CardDescription>
          Stage changes recompute pipeline and won totals live.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Open pipeline</p>
            <AnimatedNumber
              value={pipeline}
              format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
              loadingMs={700}
              className="font-mono text-lg font-semibold tabular-nums"
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Won</p>
            <AnimatedNumber
              value={won}
              format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
              loadingMs={700}
              className="font-mono text-lg font-semibold tabular-nums"
            />
          </div>
          <div className="flex flex-1 flex-wrap justify-end gap-1.5">
            {STAGES.map((stage) => {
              const count = leads.filter((l) => l.stage === stage).length;
              return (
                <Badge key={stage} variant="outline">
                  {STAGE_LABEL[stage]}{" "}
                  <span className="font-mono tabular-nums">{count}</span>
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All stages</SelectItem>
              {STAGES.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {STAGE_LABEL[stage]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="ml-auto flex flex-wrap gap-2">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Contact"
              className="w-32"
            />
            <Input
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Company"
              className="w-32"
            />
            <Input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              type="number"
              min="0"
              placeholder="Value"
              className="w-24 font-mono tabular-nums"
            />
            <Button onClick={addLead}>
              <PlusIcon />
              Add lead
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Stage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {lead.company}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  ${lead.value.toLocaleString("en-US")}
                </TableCell>
                <TableCell>
                  <Select
                    value={lead.stage}
                    onValueChange={(stage) => setStage(lead.id, stage as Stage)}
                  >
                    <SelectTrigger size="sm" className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {STAGE_LABEL[stage]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  No leads in this stage.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
