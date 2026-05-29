import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NAV } from "@/lib/site";
import { useCart } from "@/lib/cart";

export function Header() {
  const [open, setOpen] = useState(false);
  const { count, open: openCart } = useCart();

  const CartButton = (
    <button
      type="button"
      onClick={openCart}
      aria-label="Open cart"
      className="relative"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[0.6rem] font-medium text-background">
          {count}
        </span>
      )}
    </button>
  );


  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div className="flex-1">
          <button
            type="button"
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex flex-1 justify-center">
          <Logo />
        </div>

        <nav className="hidden flex-1 items-center justify-end gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-xs uppercase tracking-[0.2em] text-foreground/80 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {item.label}
            </Link>
          ))}
          {CartButton}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-4 md:hidden">
          <Link
            to="/booking"
            className="text-xs uppercase tracking-[0.2em]"
          >
            Book
          </Link>
          {CartButton}
        </div>
      </div>


      {open && (
        <nav className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-5 py-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-3 text-sm uppercase tracking-[0.2em] last:border-0"
                activeProps={{ className: "font-medium" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
