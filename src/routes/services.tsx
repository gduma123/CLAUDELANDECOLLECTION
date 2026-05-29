import { createFileRoute } from "@tanstack/react-router";
import { SERVICE_GROUPS } from "@/lib/services";
import { SITE } from "@/lib/site";
import { PageHeader, CtaLink } from "@/components/ui-bits";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — The Claudelande Collection | Brooklyn" },
      {
        name: "description",
        content:
          "Full hair service menu: sew ins, wigs, pixie cuts, quick weaves, ponytails, silk press, and color services. Studio 11, Brooklyn NY.",
      },
      { property: "og:title", content: "Services & Pricing — The Claudelande Collection" },
      { property: "og:description", content: "Sew ins, wigs, color, silk press and more in Brooklyn." },
    ],
    links: [{ rel: "canonical", href: "/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Hair extensions, wigs, and styling",
          provider: { "@type": "HairSalon", name: "The Claudelande Collection" },
          areaServed: "Brooklyn, New York",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Hair Services",
            itemListElement: SERVICE_GROUPS.flatMap((g) =>
              g.services.map((s) => ({
                "@type": "Offer",
                name: s.name,
                price: s.price.replace(/[^0-9]/g, ""),
                priceCurrency: "USD",
              })),
            ),
          },
        }),
      },
    ],
  }),
  component: Services,
});

function Services() {
  return (
    <div className="pb-20">
      <PageHeader
        eyebrow="Studio 11 · Brooklyn"
        title="Services & Pricing"
        subtitle="Every service is tailored to enhance your natural beauty. A consultation is available for custom looks."
      />

      <div className="mx-auto max-w-3xl px-5">
        {SERVICE_GROUPS.map((group) => (
          <section key={group.title} className="mb-14">
            <div className="mb-6 border-b border-foreground pb-3">
              <h2 className="font-serif text-2xl uppercase tracking-[0.1em]">{group.title}</h2>
              {group.note && <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{group.note}</p>}
            </div>
            <ul className="space-y-6">
              {group.services.map((s) => (
                <li key={s.name} className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-medium">{s.name}</h3>
                      <span className="shrink-0 font-serif text-lg">{s.price}</span>
                    </div>
                    {s.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="flex justify-center">
          <CtaLink to="/booking" variant="solid">
            Book Your Appointment
          </CtaLink>
        </div>
      </div>
    </div>
  );
}
