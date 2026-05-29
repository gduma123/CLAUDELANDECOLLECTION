import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center px-8 py-3 text-xs uppercase tracking-[0.25em] transition-colors";

const styles = {
  solid: "bg-foreground text-background hover:bg-foreground/85",
  outline: "border border-foreground text-foreground hover:bg-foreground hover:text-background",
};

export function CtaLink({
  to,
  href,
  variant = "solid",
  external,
  className,
  children,
}: {
  to?: string;
  href?: string;
  variant?: "solid" | "outline";
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const cls = cn(base, styles[variant], className);
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={to!} className={cls}>
      {children}
    </Link>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-20">
      {eyebrow && (
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-muted-foreground">{eyebrow}</p>
      )}
      <h1 className="font-serif text-4xl sm:text-5xl">{title}</h1>
      {subtitle && <p className="mx-auto mt-5 max-w-xl text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
