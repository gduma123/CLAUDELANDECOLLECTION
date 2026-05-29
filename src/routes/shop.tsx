import { createFileRoute, Link } from "@tanstack/react-router";
import { SHOP_CATEGORIES } from "@/lib/shop";
import { PageHeader } from "@/components/ui-bits";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — The Claudelande Collection | Brooklyn Hair Extensions" },
      {
        name: "description",
        content:
          "Shop luxury virgin hair: bundles, frontals & closures, wigs, seamless clip ins, and hair accessories from The Claudelande Collection.",
      },
      { property: "og:title", content: "Shop — The Claudelande Collection" },
      { property: "og:description", content: "Luxury virgin hair, clip ins, wigs and accessories." },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

function Shop() {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="The Collection"
        title="Shop"
        subtitle="Luxury virgin hair and accessories, curated for the Claudelande client."
      />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-5 sm:grid-cols-2 sm:gap-6">
        {SHOP_CATEGORIES.map((cat) => {
          const card = (
            <div className="group relative aspect-[4/3] overflow-hidden">
              <img
                src={cat.image}
                alt={cat.alt}
                loading="lazy"
                width={800}
                height={1000}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-6">
                <span className="font-serif text-2xl text-white">{cat.name}</span>
              </div>
            </div>
          );
          return cat.to ? (
            <Link key={cat.slug} to={cat.to}>
              {card}
            </Link>
          ) : (
            <div key={cat.slug} className="cursor-default" aria-label={`${cat.name} — coming soon`}>
              {card}
            </div>
          );
        })}
      </div>
    </div>
  );
}
