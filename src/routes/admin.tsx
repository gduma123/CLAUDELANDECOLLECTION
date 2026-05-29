import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { listAppointments, updateAppointmentStatus } from "@/lib/admin.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — The Claudelande Collection" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Appointment = {
  id: string;
  service_category: string;
  service_name: string;
  service_price_cents: number;
  deposit_cents: number;
  appointment_date: string;
  appointment_time: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  notes: string | null;
  status: string;
  payment_status: string;
  confirmation_number: string;
  created_at: string;
};

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

function money(cents: number) {
  return `$${(cents / 100).toFixed(2).replace(/\.00$/, "")}`;
}

function AdminPage() {
  const [session, setSession] = useState<unknown>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
        Loading…
      </div>
    );
  }

  return session ? <Dashboard /> : <Login />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5">
      <p className="mb-2 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
        The Claudelande Collection
      </p>
      <h1 className="mb-8 text-center font-serif text-4xl">Admin Login</h1>
      <form onSubmit={signIn} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-foreground px-8 py-3 text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-foreground/85 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

function Dashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  const fetchList = useServerFn(listAppointments);
  const setStatus = useServerFn(updateAppointmentStatus);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchList();
      setAppointments(res.appointments as Appointment[]);
    } catch {
      setError("You do not have access to this dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? appointments : appointments.filter((a) => a.status === filter)),
    [appointments, filter],
  );

  const changeStatus = async (id: string, status: string) => {
    try {
      await setStatus({ data: { id, status: status as (typeof STATUSES)[number] } });
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      toast.success("Updated.");
    } catch {
      toast.error("Could not update.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Studio 11 · Brooklyn</p>
          <h1 className="font-serif text-4xl">Appointments</h1>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="border border-foreground px-6 py-2 text-xs uppercase tracking-[0.25em] transition-colors hover:bg-foreground hover:text-background"
        >
          Sign Out
        </button>
      </div>

      {error ? (
        <p className="border border-border p-6 text-sm text-muted-foreground">{error}</p>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {["all", ...STATUSES].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "border px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] transition-colors",
                  filter === s
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-secondary",
                )}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading appointments…</p>
          ) : filtered.length === 0 ? (
            <p className="border border-border p-6 text-sm text-muted-foreground">No appointments.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((a) => (
                <div key={a.id} className="border border-border p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">
                        {a.first_name} {a.last_name}{" "}
                        <span className="text-xs text-muted-foreground">· {a.confirmation_number}</span>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {a.service_name} — {money(a.service_price_cents)} (deposit {money(a.deposit_cents)})
                      </p>
                      <p className="mt-1 text-sm">
                        {new Date(a.appointment_date + "T00:00:00").toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at {a.appointment_time}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {a.phone} · {a.email}
                      </p>
                      {a.notes && <p className="mt-2 text-sm italic text-muted-foreground">“{a.notes}”</p>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                        {a.payment_status}
                      </span>
                      <select
                        value={a.status}
                        onChange={(e) => changeStatus(a.id, e.target.value)}
                        className="border border-border bg-background px-3 py-2 text-xs uppercase tracking-[0.15em] outline-none focus:border-foreground"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
