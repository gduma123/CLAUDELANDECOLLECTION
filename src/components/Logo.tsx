import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex flex-col items-center leading-none ${className}`}>
      <span className="font-serif text-2xl tracking-[0.15em] sm:text-3xl">CC</span>
      <span className="mt-1 text-[0.55rem] font-light uppercase tracking-[0.4em] text-muted-foreground">
        Claudelande
      </span>
    </Link>
  );
}
