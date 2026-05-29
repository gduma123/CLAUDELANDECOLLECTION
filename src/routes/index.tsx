import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import storyImg from "@/assets/story.jpg";
import claudelandeImg from "@/assets/claudelande.jpg";

import { SITE } from "@/lib/site";
import { SHOP_CATEGORIES } from "@/lib/shop";
import { CtaLink } from "@/components/ui-bits";
import { InstagramReels } from "@/components/InstagramReels";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Claudelande Collection — Brooklyn Hair Extensions Installs & Color" },
      {
        name: "description",
        content:
          "Brooklyn's premier hair extension studio. Sew ins, wigs, color, clip ins, pixie cuts, and more. Studio 11, Brooklyn NY. Book now.",
      },
      { property: "og:title", content: "The Claudelande Collection — Brooklyn Hair Extensions" },
      {
        property: "og:description",
        content: "Brooklyn's premier hair extension studio. Now booking at Studio 11, Brooklyn NY.",
      },
      { property: "og:image", content: heroImg },
      { property: "twitter:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="grid items-stretch lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-6 py-14 sm:px-12 lg:order-1 lg:py-24">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Studio 11 · Brooklyn, NY · Now Booking
            </p>
            <p className="mt-3 text-[0.7rem] uppercase tracking-[0.5em] text-muted-foreground">
              The Pamper Room
            </p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
              The Art of Hair
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Brooklyn's Premier Hair Extension Studio.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <CtaLink to="/booking" variant="solid">
                Book Your Appointment
              </CtaLink>
              <CtaLink to="/services" variant="outline">
                View Services
              </CtaLink>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <img
              src={heroImg}
              alt="Editorial portrait of a woman with long, glossy hair extensions"
              width={1600}
              height={1200}
              fetchPriority="high"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Shop categories */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">The Collection</p>
          <h2 className="mt-3 font-serif text-4xl">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
          {SHOP_CATEGORIES.map((cat) => {
            const inner = (
              <>
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.alt}
                    loading="lazy"
                    width={800}
                    height={1000}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-center text-xs uppercase tracking-[0.2em]">{cat.name}</p>
              </>
            );
            return cat.to ? (
              <Link key={cat.slug} to={cat.to} className="group block">
                {inner}
              </Link>
            ) : (
              <Link key={cat.slug} to="/shop" className="group block">
                {inner}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Instagram feed */}
      <section className="bg-secondary py-20" aria-labelledby="instagram-heading">
        <div className="mx-auto max-w-4xl px-5">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Brooklyn Hair Studio · {SITE.instagram}
            </p>
            <h2 id="instagram-heading" className="mt-3 font-serif text-4xl">
              Latest Hair Transformations on Instagram
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Follow {SITE.instagram} for the newest sew ins, custom wigs, color, and pixie cuts
              from The Claudelande Collection — fresh looks from the studio, posted daily.
            </p>
          </div>
          <InstagramReels />
          <div className="mt-10 text-center">
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-foreground/20 bg-background px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              Follow {SITE.instagram} on Instagram
            </a>
            <p className="mt-4 text-xs text-muted-foreground">
              New looks drop automatically every time {SITE.instagram} posts.
            </p>
          </div>
        </div>
      </section>


      {/* Meet Your Stylist */}
      <section className="bg-foreground py-24 text-background">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-[auto_1fr]">
          <div className="flex justify-center">
            <div className="aspect-[4/5] w-56 overflow-hidden sm:w-72">
              <img
                src={claudelandeImg}
                alt="Portrait of Claudelande, Brooklyn-based hairstylist"
                loading="lazy"
                width={800}
                height={1000}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-background/60">Meet Your Stylist</p>
            <h2 className="mt-4 font-serif text-5xl leading-[1.05] sm:text-6xl">Claudelande</h2>
            <p className="mt-6 max-w-xl leading-relaxed text-background/80">
              A 24-year-old New York based hairstylist. Growing up, styling hair was a hobby she
              never imagined would one day become her career. "I started off doing hair for family
              and friends, just for fun. The reaction of anyone who sat in my chair after I was done
              was fulfilling and made every minute worthwhile. I did hair for free trying to master
              my craft — people would always advise me to start turning my skill into revenue. I
              started charging $25 for sew-ins, which wasn't much, but I still didn't think about it
              from a business aspect just yet."
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-background/80">
              Growing up in Brooklyn to Haitian-born parents, Claudelande started styling hair at the
              young age of 11. She was a natural — self-taught, learning new techniques, trends and
              styles. "Women would always stop me to inquire about my hair, which is what helped me
              slowly gain clientele. I would gain most of my clients through word of mouth or people
              seeing my work." She began taking pictures, creating videos and displaying her work on
              social media, networking and becoming known as "Claudelande the hairstylist." As things
              picked up, she decided cosmetology school was the best path to becoming a full-time
              licensed cosmetologist. From styling hair and making wigs in her bedroom to now owning
              her own salon based in NYC. "I want to inspire young women to believe in themselves and
              master their craft."
            </p>
            <p className="mt-4 max-w-xl leading-relaxed text-background/80">
              Claudelande continues to expand her business and services. Known for her signature
              ponytails, beautiful wigs, natural hair care, wedding parties and much more, The
              Claudelande Collection is always striving to provide luxury quality hair, maintenance
              and overall service.
            </p>
          </div>

        </div>
      </section>
      {/* Brand story */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
        <div className="overflow-hidden">
          <img
            src={storyImg}
            alt="Claudelande styling a client in her Brooklyn studio"
            loading="lazy"
            width={1200}
            height={1000}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Our Story</p>
          <h2 className="mt-3 font-serif text-4xl">Editorial Hair, Crafted in Brooklyn</h2>
          <p className="mt-6 text-muted-foreground">
            The Claudelande Collection is a Brooklyn-based hair extension and styling studio built on
            precision, luxury, and timeless beauty. From flawless sew ins and custom wig units to
            seamless clip ins and rich, dimensional color, every service is tailored to enhance your
            natural beauty.
          </p>
          <p className="mt-4 text-muted-foreground">
            Working out of Studio 11, each appointment is an intimate, detail-driven experience —
            because your hair deserves to be a statement.
          </p>
          <div className="mt-8">
            <CtaLink to="/booking" variant="solid">
              Book Now
            </CtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
