import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export function CartDrawer() {
  const { items, isOpen, close, setQty, removeItem, subtotal, count } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden={!isOpen}
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-background shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-xs uppercase tracking-[0.25em]">
            Cart {count > 0 && `(${count})`}
          </h2>
          <button onClick={close} aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            <Link
              to="/shop"
              onClick={close}
              className="bg-foreground px-6 py-3 text-xs uppercase tracking-[0.25em] text-background"
            >
              Shop now
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-border/60 py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={100}
                    className="h-24 w-20 flex-shrink-0 object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-serif text-base leading-tight">{item.name}</p>
                        {item.variant && (
                          <p className="mt-1 text-xs text-muted-foreground">{item.variant}</p>
                        )}
                      </div>
                      <button onClick={() => removeItem(item.id)} aria-label="Remove item">
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center border border-border">
                        <button
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="px-2 py-1"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="px-2 py-1"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-5 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="uppercase tracking-[0.2em] text-muted-foreground">Subtotal</span>
                <span className="text-base">${subtotal.toFixed(2)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Shipping calculated at checkout.
              </p>
              <Link
                to="/checkout"
                onClick={close}
                className="mt-4 block w-full bg-foreground py-4 text-center text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-foreground/85"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
