import { useEffect, useState } from "react";

interface CapturedError {
  message: string;
  source?: string;
  kind: "runtime" | "iframe";
}

const IFRAME_TROUBLESHOOTING = [
  "Make sure you're logged in to Lovable in this browser, then reopen the preview.",
  "If it still fails inside the editor, open the preview in a new browser tab once to complete the sign-in handshake, then return.",
  "Disable browser extensions that block third-party frames (privacy/ad blockers).",
  "The published URL has no preview gate — publishing gives you a link that always loads.",
];

/**
 * Listens for uncaught runtime errors, unhandled promise rejections, and
 * iframe "refused to connect" load failures, then shows a full-screen
 * overlay with recovery actions and clear next steps.
 */
export function PreviewErrorOverlay() {
  const [error, setError] = useState<CapturedError | null>(null);

  useEffect(() => {
    function handleError(event: ErrorEvent) {
      setError({
        kind: "runtime",
        message: event.message || "An unexpected error occurred.",
        source: event.filename
          ? `${event.filename}${event.lineno ? `:${event.lineno}` : ""}`
          : undefined,
      });
    }

    function handleRejection(event: PromiseRejectionEvent) {
      const reason = event.reason;
      setError({
        kind: "runtime",
        message:
          reason instanceof Error
            ? reason.message
            : typeof reason === "string"
              ? reason
              : "An unhandled promise rejection occurred.",
      });
    }

    // Resource-level errors (e.g. an iframe that refused to connect) do not
    // bubble, so they must be captured in the capture phase on window.
    function handleResourceError(event: Event) {
      const target = event.target as HTMLElement | null;
      if (target && target.tagName === "IFRAME") {
        const src = target.getAttribute("src") || undefined;
        setError({
          kind: "iframe",
          message:
            "An embedded frame refused to connect, so part of the page couldn't load.",
          source: src,
        });
      }
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("error", handleResourceError, true);
    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("error", handleResourceError, true);
    };
  }, []);

  if (!error) return null;

  const isIframe = error.kind === "iframe";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-destructive/30 bg-card p-6 text-center shadow-lg">
        <h2 className="text-lg font-semibold text-foreground">
          {isIframe ? "A frame refused to connect" : "The preview hit an error"}
        </h2>
        <p className="mt-2 break-words text-sm text-muted-foreground">
          {error.message}
        </p>
        {error.source && (
          <p className="mt-1 break-all text-xs text-muted-foreground/70">
            {error.source}
          </p>
        )}

        {isIframe && (
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-left text-sm text-muted-foreground">
            {IFRAME_TROUBLESHOOTING.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Reload preview
          </button>
          <button
            onClick={() => setError(null)}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
