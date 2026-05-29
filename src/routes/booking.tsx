import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { SERVICE_GROUPS, type Service } from "@/lib/services";
import { createAppointment } from "@/lib/booking.functions";
import { PageHeader } from "@/components/ui-bits";
import { cn } from "@/lib/utils";


export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book Your Appointment — The Claudelande Collection" },
      {
        name: "description",
        content:
          "Book your hair appointment at The Claudelande Collection. Choose your service, date and time. Studio 11, Brooklyn NY.",
      },
      { property: "og:title", content: "Book Your Appointment — The Claudelande Collection" },
      { property: "og:description", content: "Select your service and choose a time that works for you." },
    ],
    links: [{ rel: "canonical", href: "/booking" }],
  }),
  component: Booking,
});

const STEPS = ["Category", "Service", "Date & Time", "Your Details", "Confirmed"];

// Time slots: 10am–7pm in 30-min increments (last start 6:30pm)
const TIME_SLOTS = (() => {
  const slots: string[] = [];
  for (let h = 10; h < 19; h++) {
    for (const m of [0, 30]) {
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      const period = h < 12 ? "AM" : "PM";
      slots.push(`${hour12}:${m === 0 ? "00" : "30"} ${period}`);
    }
  }
  return slots;
})();

interface ClientInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes: string;
}

const EMPTY_CLIENT: ClientInfo = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  notes: "",
};

function Stepper({ step }: { step: number }) {
  return (
    <ol className="mx-auto mb-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5">
      {STEPS.map((label, i) => (
        <li key={label} className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full border text-[0.65rem]",
              i <= step ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground",
            )}
          >
            {i + 1}
          </span>
          <span
            className={cn(
              "text-[0.65rem] uppercase tracking-[0.2em]",
              i <= step ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}

// ---------- Calendar ----------
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function isBookableDay(d: Date) {
  const day = d.getDay(); // 0 Sun ... 6 Sat
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return day >= 2 && day <= 6 && d >= today; // Tue–Sat, not in the past
}

function MiniCalendar({
  selected,
  onSelect,
}: {
  selected: Date | null;
  onSelect: (d: Date) => void;
}) {
  const [view, setView] = useState(() => startOfMonth(new Date()));
  const first = startOfMonth(view);
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const leading = first.getDay();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));

  const monthLabel = view.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="border border-border p-5">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
          className="px-2 text-lg leading-none text-muted-foreground hover:text-foreground"
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="text-xs uppercase tracking-[0.25em]">{monthLabel}</span>
        <button
          type="button"
          onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
          className="px-2 text-lg leading-none text-muted-foreground hover:text-foreground"
          aria-label="Next month"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1 text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground">
            {w}
          </span>
        ))}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />;
          const bookable = isBookableDay(d);
          const isSel = selected && d.toDateString() === selected.toDateString();
          return (
            <button
              key={d.toISOString()}
              type="button"
              disabled={!bookable}
              onClick={() => onSelect(d)}
              className={cn(
                "aspect-square text-sm transition-colors",
                isSel
                  ? "bg-foreground text-background"
                  : bookable
                    ? "hover:bg-secondary"
                    : "cursor-not-allowed text-muted-foreground/30",
              )}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
        Available Tuesday–Saturday
      </p>
    </div>
  );
}

function Booking() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<string | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [client, setClient] = useState<ClientInfo>(EMPTY_CLIENT);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const submitBooking = useServerFn(createAppointment);

  const group = useMemo(
    () => SERVICE_GROUPS.find((g) => g.title === category) ?? null,
    [category],
  );

  const dateLabel = date
    ? date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    : "";

  const canSubmit =
    client.firstName.trim() &&
    client.lastName.trim() &&
    client.phone.trim() &&
    /\S+@\S+\.\S+/.test(client.email);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !service || !category || !date || !time) {
      toast.error("Please complete all required fields with a valid email.");
      return;
    }
    const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    setSubmitting(true);
    try {
      const res = await submitBooking({
        data: {
          category,
          serviceName: service.name,
          date: localDate,
          time,
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone,
          email: client.email,
          notes: client.notes,
        },
      });
      setConfirmation(res.confirmationNumber);
      setStep(4);
    } catch (err) {
      toast.error("Something went wrong saving your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  const reset = () => {
    setCategory(null);
    setService(null);
    setDate(null);
    setTime(null);
    setClient(EMPTY_CLIENT);
    setConfirmation(null);
    setStep(0);
  };


  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Studio 11 · Brooklyn"
        title="Book Your Appointment"
        subtitle="Reserve your spot in The Pamper Room. Choose your service, pick a time, and we'll confirm your request."
      />

      <Stepper step={step} />

      <div key={step} className="mx-auto max-w-4xl px-5 animate-in fade-in slide-in-from-bottom-2 duration-500">

        {/* Step 1 — Category */}
        {step === 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_GROUPS.map((g) => (
              <button
                key={g.title}
                type="button"
                onClick={() => {
                  setCategory(g.title);
                  setService(null);
                  setStep(1);
                }}
                className="group flex flex-col justify-between border border-border p-6 text-left transition-colors hover:bg-foreground hover:text-background"
              >
                <h2 className="font-serif text-2xl">{g.title}</h2>
                <span className="mt-6 text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground group-hover:text-background/70">
                  {g.services.length} {g.services.length === 1 ? "service" : "services"}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2 — Service */}
        {step === 1 && group && (
          <div>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="mb-6 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
            >
              ← Back to categories
            </button>
            <h2 className="mb-6 font-serif text-3xl">{group.title}</h2>
            <ul className="space-y-3">
              {group.services.map((s) => (
                <li key={s.name}>
                  <button
                    type="button"
                    onClick={() => {
                      setService(s);
                      setStep(2);
                    }}
                    className="group flex w-full items-start justify-between gap-6 border border-border p-5 text-left transition-colors hover:bg-foreground hover:text-background"
                  >
                    <div>
                      <h3 className="font-medium">{s.name}</h3>
                      {s.description && (
                        <p className="mt-1 text-sm text-muted-foreground group-hover:text-background/70">
                          {s.description}
                        </p>
                      )}
                      <p className="mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-background/70">
                        Duration confirmed at booking
                      </p>
                    </div>
                    <span className="shrink-0 font-serif text-xl">{s.price}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Step 3 — Date & Time */}
        {step === 2 && service && (
          <div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="mb-6 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
            >
              ← Back to services
            </button>
            <div className="grid gap-8 lg:grid-cols-2">
              <MiniCalendar
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setTime(null);
                }}
              />
              <div>
                <h3 className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  {date ? dateLabel : "Select a date"}
                </h3>
                {date && (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {TIME_SLOTS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTime(t)}
                        className={cn(
                          "border px-2 py-2 text-xs transition-colors",
                          time === t
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:bg-secondary",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-10 flex justify-end">
              <button
                type="button"
                disabled={!date || !time}
                onClick={() => setStep(3)}
                className={cn(
                  "px-8 py-3 text-xs uppercase tracking-[0.25em] transition-colors",
                  date && time
                    ? "bg-foreground text-background hover:bg-foreground/85"
                    : "cursor-not-allowed bg-secondary text-muted-foreground",
                )}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Client Info */}
        {step === 3 && service && (
          <div>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mb-6 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
            >
              ← Back to date & time
            </button>
            <div className="mb-8 border border-border p-5 text-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your selection</p>
              <p className="mt-2 font-medium">
                {service.name} — <span className="font-serif">{service.price}</span>
              </p>
              <p className="mt-1 text-muted-foreground">
                {dateLabel} at {time}
              </p>
            </div>
            <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
              <Field
                label="First Name *"
                value={client.firstName}
                onChange={(v) => setClient({ ...client, firstName: v })}
              />
              <Field
                label="Last Name *"
                value={client.lastName}
                onChange={(v) => setClient({ ...client, lastName: v })}
              />
              <Field
                label="Phone Number *"
                type="tel"
                value={client.phone}
                onChange={(v) => setClient({ ...client, phone: v })}
              />
              <Field
                label="Email *"
                type="email"
                value={client.email}
                onChange={(v) => setClient({ ...client, email: v })}
              />
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Notes
                </label>
                <textarea
                  rows={4}
                  value={client.notes}
                  onChange={(e) => setClient({ ...client, notes: e.target.value })}
                  className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
                  placeholder="Anything we should know before your appointment?"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-foreground px-8 py-3 text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-foreground/85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit Request"}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Step 5 — Confirmation */}
        {step === 4 && service && (
          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-foreground text-2xl">
              ✓
            </div>
            <h2 className="mt-6 font-serif text-4xl">Appointment Request Submitted</h2>
            <p className="mt-4 text-muted-foreground">
              Thank you, {client.firstName}. We've received your request and will confirm shortly.
            </p>
            {confirmation && (
              <p className="mt-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Confirmation No. <span className="text-foreground">{confirmation}</span>
              </p>
            )}


            <div className="mt-10 border border-border p-6 text-left text-sm">
              <Row label="Service" value={`${service.name} (${service.price})`} />
              <Row label="Category" value={category ?? ""} />
              <Row label="Date" value={dateLabel} />
              <Row label="Time" value={time ?? ""} />
              <Row label="Name" value={`${client.firstName} ${client.lastName}`} />
              <Row label="Phone" value={client.phone} />
              <Row label="Email" value={client.email} />
              {client.notes && <Row label="Notes" value={client.notes} />}
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-8 border border-foreground px-8 py-3 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-foreground hover:text-background"
            >
              Book Another Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
