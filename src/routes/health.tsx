import { useState, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/health")({
  head: () => ({
    meta: [
      { title: "Route Health Check — The Claudelande Collection" },
      {
        name: "description",
        content: "Internal route health check that pings each page and reports which ones fail to render.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: HealthPage,
});

const ROUTES: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/shop", label: "Shop" },
  { path: "/shop/seamless-clip-ins", label: "Shop — Seamless Clip Ins" },
  { path: "/shop/hair-accessories", label: "Shop — Hair Accessories" },
  { path: "/services", label: "Services" },
  { path: "/lookbook", label: "Lookbook" },
  { path: "/booking", label: "Booking" },
  { path: "/booking-policy", label: "Booking Policy" },
  { path: "/policies", label: "Policies" },
  { path: "/contact", label: "Contact" },
  { path: "/admin", label: "Admin" },
  { path: "/sitemap.xml", label: "Sitemap" },
];

type Status = "pending" | "checking" | "ok" | "fail";

interface Result {
  path: string;
  label: string;
  status: Status;
  code?: number;
  detail?: string;
}

function HealthPage() {
  const [results, setResults] = useState<Result[]>(
    ROUTES.map((r) => ({ ...r, status: "pending" as Status })),
  );
  const [running, setRunning] = useState(false);

  const runChecks = useCallback(async () => {
    setRunning(true);
    setResults(ROUTES.map((r) => ({ ...r, status: "pending" as Status })));

    for (let i = 0; i < ROUTES.length; i++) {
      const route = ROUTES[i];
      setResults((prev) =>
        prev.map((r, idx) => (idx === i ? { ...r, status: "checking" } : r)),
      );
      try {
        const res = await fetch(route.path, {
          method: "GET",
          headers: { Accept: "text/html" },
        });
        const ok = res.ok;
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i
              ? {
                  ...r,
                  status: ok ? "ok" : "fail",
                  code: res.status,
                  detail: ok ? undefined : res.statusText,
                }
              : r,
          ),
        );
      } catch (err) {
        setResults((prev) =>
          prev.map((r, idx) =>
            idx === i
              ? {
                  ...r,
                  status: "fail",
                  detail: err instanceof Error ? err.message : "Request failed",
                }
              : r,
          ),
        );
      }
    }
    setRunning(false);
  }, []);

  useEffect(() => {
    runChecks();
  }, [runChecks]);

  const failing = results.filter((r) => r.status === "fail").length;
  const passing = results.filter((r) => r.status === "ok").length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Route Health Check
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pings each page and reports which ones fail to render.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={runChecks}
          disabled={running}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {running ? "Checking…" : "Re-run checks"}
        </button>
        <span className="text-sm text-muted-foreground">
          {passing} passing · {failing} failing
        </span>
      </div>

      <ul className="mt-8 divide-y divide-border rounded-lg border border-border">
        {results.map((r) => (
          <li
            key={r.path}
            className="flex items-center justify-between gap-4 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {r.label}
              </p>
              <p className="truncate text-xs text-muted-foreground">{r.path}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {r.code != null && (
                <span className="text-xs text-muted-foreground">{r.code}</span>
              )}
              <StatusBadge status={r.status} detail={r.detail} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StatusBadge({ status, detail }: { status: Status; detail?: string }) {
  const map: Record<Status, { label: string; className: string }> = {
    pending: {
      label: "Pending",
      className: "bg-muted text-muted-foreground",
    },
    checking: {
      label: "Checking…",
      className: "bg-muted text-muted-foreground",
    },
    ok: {
      label: "OK",
      className: "bg-primary/10 text-primary",
    },
    fail: {
      label: "Fail",
      className: "bg-destructive/10 text-destructive",
    },
  };
  const { label, className } = map[status];
  return (
    <span
      title={detail}
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
