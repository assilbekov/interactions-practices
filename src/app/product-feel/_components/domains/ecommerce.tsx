"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon, ShoppingCartIcon, XIcon } from "lucide-react";

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
import { Separator } from "@/components/ui/separator";

type Product = { id: string; name: string; detail: string; price: number; tag?: string };

const PRODUCTS: Product[] = [
  { id: "tee", name: "Box Logo Tee", detail: "Heavyweight cotton", price: 32, tag: "New" },
  { id: "cap", name: "Corduroy Cap", detail: "Adjustable strap", price: 28 },
  { id: "tote", name: "Canvas Tote", detail: "18L, inner pocket", price: 24, tag: "Bestseller" },
  { id: "mug", name: "Enamel Mug", detail: "350ml, matte", price: 18 },
];

const PROMO = "SAVE10";

export function EcommerceModule() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const items = Object.entries(cart)
    .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id)!, qty }))
    .filter((item) => item.qty > 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0,
  );
  const discount = applied ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const add = (id: string) => {
    setOrdered(false);
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const change = (id: string, delta: number) =>
    setCart((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }));

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
        {PRODUCTS.map((product) => (
          <Card key={product.id}>
            <CardContent className="space-y-3">
              <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-muted text-3xl">
                {product.id === "tee" && "👕"}
                {product.id === "cap" && "🧢"}
                {product.id === "tote" && "👜"}
                {product.id === "mug" && "☕"}
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">
                    {product.name}{" "}
                    {product.tag && (
                      <Badge variant="secondary" className="ml-1">
                        {product.tag}
                      </Badge>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {product.detail}
                  </p>
                </div>
                <p className="font-mono text-sm font-semibold tabular-nums">
                  ${product.price}
                </p>
              </div>
              <Button className="w-full" onClick={() => add(product.id)}>
                <ShoppingCartIcon />
                Add to cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="h-fit lg:col-span-2">
        <CardHeader>
          <CardTitle>Cart</CardTitle>
          <CardDescription>
            Quantities, promo code ({PROMO} works), running total.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {product.name}
                    </p>
                    <p className="font-mono text-xs tabular-nums text-muted-foreground">
                      ${product.price} × {qty}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon-xs"
                      aria-label={`Decrease ${product.name}`}
                      onClick={() => change(product.id, -1)}
                    >
                      <MinusIcon />
                    </Button>
                    <span className="w-6 text-center font-mono text-sm tabular-nums">
                      {qty}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      aria-label={`Increase ${product.name}`}
                      onClick={() => change(product.id, 1)}
                    >
                      <PlusIcon />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Remove ${product.name}`}
                      onClick={() => change(product.id, -qty)}
                    >
                      <XIcon />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={promo}
              onChange={(event) => {
                setPromo(event.target.value.toUpperCase());
                setApplied(false);
              }}
              placeholder="Promo code"
              className="font-mono uppercase"
            />
            <Button
              variant="outline"
              disabled={applied || !promo.trim()}
              onClick={() => setApplied(promo.trim() === PROMO)}
            >
              Apply
            </Button>
          </div>
          {promo && !applied && promo !== PROMO && (
            <p className="text-xs text-destructive">
              Code not recognized — try {PROMO}.
            </p>
          )}
          {applied && (
            <p className="text-xs text-primary">10% discount applied.</p>
          )}

          <Separator />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-mono tabular-nums">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            {applied && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-mono tabular-nums">
                  −${discount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span className="font-mono tabular-nums">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={items.length === 0}
            onClick={() => {
              setOrdered(true);
              setCart({});
              setApplied(false);
              setPromo("");
            }}
          >
            Checkout
          </Button>
          {ordered && (
            <p className="text-center text-xs text-primary">
              Order placed — confirmation sent.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
