"use client";

import { useState } from "react";
import { CalendarIcon, XIcon } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SLOTS = [
  "Mon Jul 21 · 09:30",
  "Mon Jul 21 · 14:00",
  "Tue Jul 22 · 10:15",
  "Wed Jul 23 · 08:45",
  "Wed Jul 23 · 16:30",
];

const REASONS = [
  { value: "checkup", label: "Annual check-up" },
  { value: "followup", label: "Follow-up visit" },
  { value: "vaccination", label: "Vaccination" },
  { value: "consult", label: "Specialist consult" },
];

type Appointment = {
  id: number;
  patient: string;
  reason: string;
  slot: string;
};

export function HealthcareModule() {
  const [patient, setPatient] = useState("");
  const [reason, setReason] = useState("checkup");
  const [slot, setSlot] = useState<string | undefined>();
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, patient: "A. Bekova", reason: "followup", slot: SLOTS[0] },
  ]);
  const [nextId, setNextId] = useState(2);
  const [error, setError] = useState<string | null>(null);

  const takenSlots = new Set(appointments.map((a) => a.slot));
  const freeSlots = SLOTS.filter((s) => !takenSlots.has(s));

  const book = () => {
    if (patient.trim().length < 2) {
      setError("Enter the patient's name.");
      return;
    }
    if (!slot) {
      setError("Choose an available time slot.");
      return;
    }
    setError(null);
    setAppointments((prev) => [
      ...prev,
      { id: nextId, patient: patient.trim(), reason, slot },
    ]);
    setNextId((id) => id + 1);
    setPatient("");
    setSlot(undefined);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Book an appointment</CardTitle>
          <CardDescription>
            Booked slots leave the list — double-booking is impossible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="hc-patient">Patient name</Label>
            <Input
              id="hc-patient"
              value={patient}
              onChange={(event) => setPatient(event.target.value)}
              placeholder="Full name"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Reason for visit</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Available slots</Label>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {freeSlots.map((s) => (
                <Button
                  key={s}
                  variant={slot === s ? "default" : "outline"}
                  className="justify-start font-mono text-xs tabular-nums"
                  onClick={() => setSlot(s)}
                >
                  <CalendarIcon />
                  {s}
                </Button>
              ))}
              {freeSlots.length === 0 && (
                <p className="col-span-full text-sm text-muted-foreground">
                  No free slots this week.
                </p>
              )}
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button size="lg" className="w-full" onClick={book}>
            Book appointment
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming appointments</CardTitle>
          <CardDescription>Cancel to release the slot.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {appointments.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Nothing scheduled.
            </p>
          )}
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {appointment.patient}
                </p>
                <p className="font-mono text-xs tabular-nums text-muted-foreground">
                  {appointment.slot}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {REASONS.find((r) => r.value === appointment.reason)?.label}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Cancel appointment for ${appointment.patient}`}
                  onClick={() =>
                    setAppointments((prev) =>
                      prev.filter((a) => a.id !== appointment.id),
                    )
                  }
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
