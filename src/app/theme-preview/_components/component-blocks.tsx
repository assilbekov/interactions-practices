"use client";

import { useState } from "react";
import {
  BellIcon,
  InfoIcon,
  MoreHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ButtonsBlock() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buttons</CardTitle>
        <CardDescription>
          Primary, secondary, and brand act on their mixer roles.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90">
            Brand
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="lg">Large</Button>
          <Button size="sm">Small</Button>
          <Button size="icon" aria-label="Add">
            <PlusIcon />
          </Button>
          <Button disabled>Disabled</Button>
          <Button variant="link">Link button</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BadgesBlock() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Badges & alerts</CardTitle>
        <CardDescription>Statuses, counts, and callouts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge className="bg-brand text-brand-foreground">Brand</Badge>
        </div>
        <Alert>
          <InfoIcon />
          <AlertTitle>Card verification needed</AlertTitle>
          <AlertDescription>
            Verify your card to raise the transfer limit above $5,000.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

function FormControlsBlock() {
  const [limit, setLimit] = useState(65);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form controls</CardTitle>
        <CardDescription>
          Select, radio, checkbox, and a slider driving progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Currency</Label>
            <Select defaultValue="usd">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD — US Dollar</SelectItem>
                <SelectItem value="eur">EUR — Euro</SelectItem>
                <SelectItem value="kzt">KZT — Tenge</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Transfer speed</Label>
            <RadioGroup defaultValue="instant" className="pt-1">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="instant" id="speed-instant" />
                <Label htmlFor="speed-instant" className="font-normal">
                  Instant
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="standard" id="speed-standard" />
                <Label htmlFor="speed-standard" className="font-normal">
                  Standard (1–2 days)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Monthly limit</Label>
            <span className="font-mono text-sm tabular-nums text-muted-foreground">
              {limit}%
            </span>
          </div>
          <Slider
            value={[limit]}
            onValueChange={([value]) => setLimit(value)}
            max={100}
            step={1}
            aria-label="Monthly limit"
          />
          <Progress value={limit} />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="terms" defaultChecked />
          <Label htmlFor="terms" className="font-normal">
            Email me monthly statements
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}

const MEMBERS = [
  { name: "Askhat Assilbekov", role: "Owner", initials: "AA" },
  { name: "Dana Serik", role: "Admin", initials: "DS" },
  { name: "Timur Aliyev", role: "Viewer", initials: "TA" },
];

function TeamBlock() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team</CardTitle>
        <CardDescription>Avatars, roles, and row actions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {MEMBERS.map((member) => (
          <div
            key={member.name}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Actions for ${member.name}`}
                >
                  <MoreHorizontalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Change role</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
        <Button variant="outline" className="w-full">
          <PlusIcon />
          Invite member
        </Button>
      </CardContent>
    </Card>
  );
}

const NOTIFICATIONS = [
  { id: "payments", label: "Payment alerts", defaultChecked: true },
  { id: "budget", label: "Budget warnings", defaultChecked: true },
  { id: "product", label: "Product updates", defaultChecked: false },
];

function NotificationsBlock() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="flex items-center gap-2">
            <BellIcon className="size-4" />
            Notifications
          </span>
        </CardTitle>
        <CardDescription>A settings list built on switches.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {NOTIFICATIONS.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <Label htmlFor={item.id} className="font-normal">
              {item.label}
            </Label>
            <Switch id={item.id} defaultChecked={item.defaultChecked} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DangerBlock() {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danger zone</CardTitle>
        <CardDescription>Dialog confirmation and tooltips.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <TrashIcon />
              Close account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Close this account?</DialogTitle>
              <DialogDescription>
                Transfers stop immediately and the remaining balance is paid
                out to your linked card. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setOpen(false)}>
                Close account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>Tooltips follow the theme too.</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

export function ComponentBlocks() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Component blocks
        </h2>
        <p className="text-sm text-muted-foreground">
          The full component set under the current mix.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ButtonsBlock />
        <BadgesBlock />
        <FormControlsBlock />
        <TeamBlock />
        <NotificationsBlock />
        <DangerBlock />
      </div>
    </section>
  );
}
