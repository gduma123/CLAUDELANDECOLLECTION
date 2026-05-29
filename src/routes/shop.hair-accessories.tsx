import { createFileRoute } from "@tanstack/react-router";
import accImg from "@/assets/cat-accessories.jpg";
import { ACCESSORIES } from "@/lib/shop";
import { PageHeader } from "@/components/ui-bits";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";


export const Route = createFileRoute("/shop/hair-accessories")({
  head: () => ({
    meta: [
      { title: "Hair Accessories — The Claudelande Collection" },
      {
        name: "description",
        content:
          "Shop CC hair accessories on sale: bonnets, edge brush, silky wrap, and adjustable elastic band from The Claudelande Collection.",
      },
      { property: "og:title", content: "Hair Accessories — The Claudelande Collection" },
      { property: "og:description", content: "CC bonnets, edge brush, silky wrap and more — on sale." },
      { property: "og:image", content: accImg },
      { property: "twitter:image", content: accImg },
    ],
    links: [{ rel: "canonical", href: "/shop/hair-accessories" }],
  }),
  component: AccessoriesPage,
});

function AccessoriesPage() {
  const { addItem } = useCart();
  return (
    <div className="pb-20">
      <PageHeader eyebrow="The Collection" title="Hair Accessories" subtitle="Everyday essentials to protect and maintain your style." />
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-5 px-5 sm:gap-8 lg:grid-cols-4">
        {ACCESSORIES.map((item) => (
          <div key={item.name} className="group">
            <div className="relative aspect-square overflow-hidden bg-secondary">
              <span className="absolute left-3 top-3 z-10 bg-foreground px-2 py-1 text-[0.6rem] uppercase tracking-[0.15em] text-background">
                Sale
              </span>
              <img
                src={accImg}
                alt={item.name}
                loading="lazy"
                width={800}
                height={800}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <h2 className="mt-4 font-serif text-lg">{item.name}</h2>
            <p className="mt-1 text-sm">
              <span className="font-medium">{item.sale}</span>{" "}
              <span className="text-muted-foreground line-through">{item.original}</span>
            </p>
            <button
              onClick={() => {
                addItem({
                  id: `acc-${item.name}`,
                  name: item.name,
                  price: item.price,
                  image: accImg,
                });
                toast.success("Added to cart", { description: item.name });
              }}
              className="mt-3 w-full border border-foreground py-2 text-[0.65rem] uppercase tracking-[0.2em] transition-colors hover:bg-foreground hover:text-background"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

