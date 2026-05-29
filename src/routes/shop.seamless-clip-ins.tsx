import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import clipImg from "@/assets/cat-clipins.jpg";
import { CLIP_IN_VARIANTS } from "@/lib/shop";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";


export const Route = createFileRoute("/shop/seamless-clip-ins")({
  head: () => ({
    meta: [
      { title: "Seamless Clip Ins — The Claudelande Collection" },
      {
        name: "description",
        content:
          "100% virgin hair seamless clip-in extensions. Lightweight, lay flat, 7 pieces per set, 130 grams. Body Wave or Straight, Natural Black. From $140.",
      },
      { property: "og:title", content: "Seamless Clip Ins — The Claudelande Collection" },
      { property: "og:description", content: "100% virgin hair seamless clip-in extensions from $140." },
      { property: "og:image", content: clipImg },
      { property: "og:type", content: "product" },
      { property: "twitter:image", content: clipImg },
    ],
    links: [{ rel: "canonical", href: "/shop/seamless-clip-ins" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Seamless Clip Ins",
          description:
            "100% Virgin hair clip-in extensions, lightweight, lay flat, 7 pieces per set, 130 grams. Body Wave or Straight, Natural Black.",
          image: clipImg,
          brand: { "@type": "Brand", name: "The Claudelande Collection" },
          offers: CLIP_IN_VARIANTS.map((v) => ({
            "@type": "Offer",
            name: `Seamless Clip Ins — ${v.length}`,
            price: v.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          })),
        }),
      },
    ],
  }),
  component: ClipInsProduct,
});

function ClipInsProduct() {
  const { addItem } = useCart();
  const [variantIdx, setVariantIdx] = useState(1);
  const [texture, setTexture] = useState("Body Wave");
  const [qty, setQty] = useState(1);
  const variant = CLIP_IN_VARIANTS[variantIdx];


  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-2 lg:py-20">
      <div className="overflow-hidden">
        <img
          src={clipImg}
          alt="Seamless virgin hair clip-in extensions, Natural Black"
          width={800}
          height={1000}
          className="h-full w-full object-cover"
        />
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Seamless Clip Ins</p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Seamless Clip Ins</h1>
        <p className="mt-4 text-2xl">${variant.price}.00</p>

        <p className="mt-6 text-muted-foreground">
          100% Virgin hair clip-in extensions — lightweight, lay flat, with 7 pieces per set (130
          grams). Can be colored, styled straight or curly, or worn naturally. Blends seamlessly with
          your natural hair. 1–2 sets recommended for a full look.
        </p>

        {/* Length */}
        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Length</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {CLIP_IN_VARIANTS.map((v, i) => (
              <button
                key={v.length}
                onClick={() => setVariantIdx(i)}
                className={`border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
                  i === variantIdx
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                }`}
              >
                {v.length}
              </button>
            ))}
          </div>
        </div>

        {/* Texture */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Texture</p>
          <div className="mt-3 flex gap-2">
            {["Body Wave", "Straight"].map((t) => (
              <button
                key={t}
                onClick={() => setTexture(t)}
                className={`border px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
                  t === texture
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Color</p>
          <p className="mt-3 inline-block border border-foreground bg-foreground px-4 py-2 text-xs uppercase tracking-[0.15em] text-background">
            Natural Black
          </p>
        </div>

        {/* Quantity */}
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Quantity</p>
          <div className="mt-3 inline-flex items-center border border-border">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-3" aria-label="Decrease quantity">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center text-sm">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="px-4 py-3" aria-label="Increase quantity">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            addItem(
              {
                id: `clip-ins-${variant.length}-${texture}`,
                name: "Seamless Clip Ins",
                variant: `${variant.length} · ${texture} · Natural Black`,
                price: variant.price,
                image: clipImg,
              },
              qty,
            );
            toast.success("Added to cart", {
              description: `Seamless Clip Ins · ${variant.length} · ${texture} · Qty ${qty}`,
            });
          }}
          className="mt-10 w-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-foreground/85"
        >
          Add to Cart — ${variant.price * qty}.00
        </button>

      </div>
    </div>
  );
}
