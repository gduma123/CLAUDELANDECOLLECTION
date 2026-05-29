import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { NAV, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl">The Claudelande Collection</p>
          <p className="mt-3 text-sm text-background/70">{SITE.tagline} — Brooklyn's premier hair extension studio.</p>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] text-background/60">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-background/80 transition-colors hover:text-background">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/policies" className="text-background/80 transition-colors hover:text-background">
                Store Policies
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] text-background/60">Visit</h3>
          <address className="mt-4 space-y-2 text-sm not-italic text-background/80">
            <p>{SITE.address.street}</p>
            <p>{SITE.address.city}, {SITE.address.region} {SITE.address.postal}</p>
            <p className="pt-2">{SITE.hours}</p>
          </address>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-[0.3em] text-background/60">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-background/80">
            <li><a href={SITE.phoneHref} className="hover:text-background">{SITE.phone}</a></li>
            <li><a href={SITE.emailHref} className="hover:text-background">{SITE.email}</a></li>
            <li>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-background"
              >
                <Instagram className="h-4 w-4" /> {SITE.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/15">
        <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-background/50">
          © {new Date().getFullYear()} The Claudelande Collection. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
