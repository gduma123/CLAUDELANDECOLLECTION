import { SERVICE_GROUPS } from "@/lib/services";

// Approximate appointment durations by category (used for display only).
const DURATION_BY_CATEGORY: Record<string, string> = {
  "Sew Ins": "2–3 hrs",
  Wigs: "1.5–2.5 hrs",
  "Pixie Cut": "2 hrs",
  "Quick Weave": "1.5–2 hrs",
  "Clip Ins Services": "1.5–2 hrs",
  Ponytails: "1–1.5 hrs",
  "Natural Hair": "1.5–2 hrs",
  "Color Services for Bundles / Wigs": "1.5–2.5 hrs",
  "Color Services for Natural Hair": "3–4 hrs",
  Consultation: "20 min",
};

export interface BookableService {
  category: string;
  name: string;
  priceLabel: string;
  priceCents: number;
  depositCents: number;
  durationLabel: string;
  description?: string;
}

// Parse the first dollar amount from a price string like "$260" or "$150+".
function parsePriceCents(price: string): number {
  const match = price.match(/\$\s*([\d,]+)/);
  if (!match) return 0;
  return Math.round(parseFloat(match[1].replace(/,/g, "")) * 100);
}

// Deposit policy: 30% of the service price, minimum $20, never more than the price.
function depositCents(priceCents: number): number {
  if (priceCents <= 0) return 0;
  const thirty = Math.round((priceCents * 0.3) / 100) * 100;
  return Math.min(priceCents, Math.max(2000, thirty));
}

export const BOOKABLE_SERVICES: BookableService[] = SERVICE_GROUPS.flatMap((g) =>
  g.services.map((s) => {
    const priceCents = parsePriceCents(s.price);
    return {
      category: g.title,
      name: s.name,
      priceLabel: s.price,
      priceCents,
      depositCents: depositCents(priceCents),
      durationLabel: DURATION_BY_CATEGORY[g.title] ?? "Varies",
      description: s.description,
    };
  }),
);

export const BOOKING_CATEGORIES = SERVICE_GROUPS.map((g) => g.title);

export function findService(category: string, name: string): BookableService | undefined {
  return BOOKABLE_SERVICES.find((s) => s.category === category && s.name === name);
}

// Time slots: 10am–7pm in 30-min increments (last start 6:30pm).
export const BOOKING_TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 10; h < 19; h++) {
    for (const m of [0, 30]) {
      slots.push(`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`);
    }
  }
  return slots;
})();

export function formatSlot(slot: string): string {
  const [hStr, mStr] = slot.split(":");
  const h = parseInt(hStr, 10);
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const period = h < 12 ? "AM" : "PM";
  return `${hour12}:${mStr} ${period}`;
}

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2).replace(/\.00$/, "")}`;
}
