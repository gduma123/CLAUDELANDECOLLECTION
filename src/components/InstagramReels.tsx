import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/site";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

/**
 * Embeds the live Instagram profile. Instagram's profile embed automatically
 * shows her latest posts/reels and updates every time she posts something new —
 * no manual updating required.
 *
 * If Instagram's iframe refuses to connect (blocked by the browser, an
 * extension, or a network issue) we detect the failure and show a clear
 * fallback with next steps instead of a blank space.
 */
export function InstagramReels() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const SCRIPT_ID = "instagram-embed-script";
    const process = () => window.instgrm?.Embeds.process();

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!existing) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = "https://www.instagram.com/embed.js";
      script.onload = process;
      script.onerror = () => setFailed(true);
      document.body.appendChild(script);
    } else {
      process();
    }
    const t = setTimeout(process, 600);

    // If, after a reasonable wait, no embed iframe rendered, treat it as a
    // "refused to connect" failure and show the fallback.
    const check = setTimeout(() => {
      const iframe = containerRef.current?.querySelector("iframe");
      if (!iframe) setFailed(true);
    }, 5000);

    return () => {
      clearTimeout(t);
      clearTimeout(check);
    };
  }, []);

  if (failed) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-[540px] rounded-md border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            The Instagram feed couldn't load here. This usually happens when a
            browser extension or privacy setting blocks embedded content.
          </p>
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            View {SITE.instagram} on Instagram
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex justify-center"
      aria-label={`Recent Instagram posts from ${SITE.instagram}`}
    >
      <blockquote
        className="instagram-media w-full"
        data-instgrm-permalink={`${SITE.instagramUrl}?utm_source=ig_embed&utm_campaign=loading`}
        data-instgrm-version="14"
        style={{
          background: "#fff",
          border: 0,
          borderRadius: 8,
          boxShadow: "0 12px 40px -12px rgba(0,0,0,0.18)",
          margin: 0,
          padding: 0,
          maxWidth: "100%",
          width: "100%",
        }}
      >
        <a href={SITE.instagramUrl}>View {SITE.instagram} on Instagram</a>
      </blockquote>
    </div>
  );
}
