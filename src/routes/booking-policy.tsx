import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, CtaLink } from "@/components/ui-bits";
import { SITE } from "@/lib/site";

interface PolicySection {
  id: string;
  heading: string;
  items: string[];
}

const SECTIONS: PolicySection[] = [
  {
    id: "deposits-payments",
    heading: "Deposits & Payments",
    items: [
      "A $25 NON-REFUNDABLE deposit is required to book all services. Your deposit is applied toward the cost of your service.",
      "Deposits can be paid through PayPal or Cash App ($Claudelande).",
      "All deposits and payments for appointments and wigs are NON-REFUNDABLE and NON-TRANSFERABLE.",
      "Please bring your remaining balance in CASH ONLY.",
    ],
  },
  {
    id: "preparing-for-your-appointment",
    heading: "Preparing for Your Appointment",
    items: [
      "Come with your hair freshly washed and blow dried, free of any product. A $20 fee applies if hair is not clean, or your appointment may be canceled.",
      "If hair is being reused, remove all thread from the wefts, wash and fully dry the hair so there is no residue or oils, and separate all cut wefts beforehand.",
      "I do not work over other people's work.",
      "I can provide hair if needed. To purchase hair with your appointment, visit Claudelandeco.com or contact me as soon as possible to place an order (allow 5–7 days).",
    ],
  },
  {
    id: "frontals-closures-wigs",
    heading: "Frontals, Closures & Custom Units",
    items: [
      "All frontals, closures and wigs must be dropped off 3–5 days before the day of your service.",
      "For a custom unit, you must come in for measurements and drop off the hair 1–2 weeks in advance.",
      "Rushed wigs are an additional $50.",
    ],
  },
  {
    id: "punctuality-grace-period",
    heading: "Punctuality & Grace Period",
    items: [
      "My time is valuable, but I understand delays happen, so I offer a 15 minute grace period.",
      "After the first 15 minutes there is a $20 late fee.",
      "After 30 minutes I reserve the right to cancel your appointment.",
    ],
  },
  {
    id: "rescheduling-cancellations",
    heading: "Rescheduling & Cancellations",
    items: [
      "If you cannot make your appointment, contact me as soon as possible. Appointments must be rescheduled at least 48 hours prior to the original time.",
      "No call / no shows will be blocked and unable to book in the future.",
    ],
  },
  {
    id: "additional-fees",
    heading: "Additional Fees",
    items: [
      "I am unavailable Sunday and Monday. Appointments on these days are subject to a $50 fee.",
      "Appointments before 10am and after 7pm are subject to a $40 fee.",
      "Squeeze-in fee is an additional $50.",
    ],
  },
  {
    id: "salon-guidelines",
    heading: "Salon Guidelines",
    items: [
      "No extra people or children are permitted during services.",
      "Welcome to my new location: Studio 11 — The Pamper Room.",
    ],
  },
];

const FAQ = SECTIONS.flatMap((s) =>
  s.items.map((item, i) => ({
    question: `${s.heading}${s.items.length > 1 ? ` (${i + 1})` : ""}`,
    answer: item,
  })),
);

export const Route = createFileRoute("/booking-policy")({
  head: () => ({
    meta: [
      { title: "Booking Policy — The Claudelande Collection | Brooklyn Hair Studio" },
      {
        name: "description",
        content:
          "Read the booking policy for The Claudelande Collection in Brooklyn, NY before your appointment: $25 non-refundable deposit, hair prep, drop-off times, grace period, cancellations and fees.",
      },
      {
        name: "keywords",
        content:
          "Claudelande booking policy, Brooklyn hair salon deposit policy, sew in appointment policy, wig drop off, hair appointment cancellation policy",
      },
      { property: "og:title", content: "Booking Policy — The Claudelande Collection" },
      {
        property: "og:description",
        content:
          "Everything to know before booking with The Claudelande Collection: deposit, hair prep, drop-off, grace period, rescheduling and fees.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/booking-policy" },
    ],
    links: [{ rel: "canonical", href: "/booking-policy" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
    ],
  }),
  component: BookingPolicy,
});

function BookingPolicy() {
  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Please Read Before Booking"
        title="Booking Policy"
        subtitle="I'm Claudelande (pronounced Claude-Lyn), a hairstylist based in Brooklyn, NY. Please review the policies below before booking your appointment."
      />

      <article className="mx-auto max-w-3xl px-5">
        <div className="space-y-12">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
              <h2
                id={`${section.id}-heading`}
                className="mb-5 font-serif text-2xl"
              >
                {section.heading}
              </h2>
              <ul className="space-y-4">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-border pb-4 text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section id="contact" aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="mb-5 font-serif text-2xl">
              Questions or Concerns
            </h2>
            <p className="mb-4 text-muted-foreground">
              If you have any questions or concerns, please reach out. Kindly allow at least 24–48
              hours for a response.
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                Text / Call:{" "}
                <a className="text-foreground underline" href={SITE.phoneHref}>
                  {SITE.phone}
                </a>
              </li>
              <li>
                Instagram:{" "}
                <a
                  className="text-foreground underline"
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE.instagram}
                </a>
              </li>
              <li>
                Email:{" "}
                <a className="text-foreground underline" href={SITE.emailHref}>
                  {SITE.email}
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-16 text-center">
          <CtaLink to="/booking">Book Your Appointment</CtaLink>
        </div>
      </article>
    </div>
  );
}
