import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/ui-bits";

const POLICIES = [
  "No refunds on all orders.",
  "Orders process in 3–5 business days.",
  "Sale and wig orders process 10–14 business days after order placement.",
];

export const Route = createFileRoute("/policies")({
  head: () => ({
    meta: [
      { title: "Store Policies — The Claudelande Collection" },
      {
        name: "description",
        content:
          "Store policies for The Claudelande Collection: order processing times, sale and wig orders, and refund policy.",
      },
      { property: "og:title", content: "Store Policies — The Claudelande Collection" },
      { property: "og:description", content: "Order processing, sale and wig timelines, and refund policy." },
    ],
    links: [{ rel: "canonical", href: "/policies" }],
  }),
  component: Policies,
});

function Policies() {
  return (
    <div className="pb-20">
      <PageHeader eyebrow="Information" title="Store Policies" />
      <div className="mx-auto max-w-2xl px-5">
        <ul className="space-y-5">
          {POLICIES.map((p) => (
            <li key={p} className="border-b border-border pb-5 text-muted-foreground">
              {p}
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center font-serif text-xl">Thank you for shopping with us.</p>
      </div>
    </div>
  );
}
