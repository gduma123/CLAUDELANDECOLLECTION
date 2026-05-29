import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { PageHeader } from "@/components/ui-bits";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — The Claudelande Collection" },
      { name: "description", content: "Complete your order from The Claudelande Collection." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  if (items.length === 0) {
    return (
      <div className="pb-20">
        <PageHeader eyebrow="Checkout" title="Your cart is empty" subtitle="Add a few pieces before checking out." />
        <div className="mx-auto max-w-md px-5 text-center">
          <Link to="/shop" className="inline-block bg-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] text-background">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    // Payment integration coming later — record the order intent for now.
    setTimeout(() => {
      clear();
      toast.success("Order received!", {
        description: "We'll reach out to confirm your order and payment.",
      });
      navigate({ to: "/shop" });
    }, 600);
  };

  return (
    <div className="pb-20">
      <PageHeader eyebrow="Checkout" title="Your Details" subtitle="Tell us where to send your order." />
      <div className="mx-auto grid max-w-5xl gap-10 px-5 lg:grid-cols-[1.3fr_1fr]">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First name" name="firstName" />
            <Field label="Last name" name="lastName" />
          </div>
          <Field label="Email" name="email" type="email" />
          <Field label="Phone" name="phone" type="tel" />
          <Field label="Address" name="address" />
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="City" name="city" />
            <Field label="State" name="state" />
            <Field label="ZIP" name="zip" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Notes (optional)</label>
            <textarea
              name="notes"
              rows={3}
              className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
            />
          </div>

          <div className="rounded border border-border bg-secondary/40 px-4 py-3 text-xs text-muted-foreground">
            Secure online payment is coming soon. Place your order now and we'll
            contact you to confirm details and arrange payment.
          </div>

          <button
            type="submit"
            disabled={placing}
            className="w-full bg-foreground py-4 text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-foreground/85 disabled:opacity-60"
          >
            {placing ? "Placing order…" : `Place Order — $${subtotal.toFixed(2)}`}
          </button>
        </form>

        {/* Summary */}
        <div className="h-fit border border-border p-5">
          <h2 className="text-xs uppercase tracking-[0.25em]">Order Summary</h2>
          <div className="mt-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <img src={item.image} alt={item.name} width={56} height={70} className="h-[70px] w-14 flex-shrink-0 object-cover" />
                <div className="flex-1 text-sm">
                  <p className="font-serif">{item.name}</p>
                  {item.variant && <p className="text-xs text-muted-foreground">{item.variant}</p>}
                  <p className="text-xs text-muted-foreground">Qty {item.qty}</p>
                </div>
                <span className="text-sm">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
            <span className="uppercase tracking-[0.2em] text-muted-foreground">Subtotal</span>
            <span className="text-base">${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <input
        required
        name={name}
        type={type}
        className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none"
      />
    </div>
  );
}
