import { useState, useCallback, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import img1 from "@/assets/lookbook/look-01.webp";
import img2 from "@/assets/lookbook/look-02.webp";
import img3 from "@/assets/lookbook/look-03.jpg";
import img4 from "@/assets/lookbook/look-04.webp";
import img5 from "@/assets/lookbook/look-05.webp";
import img6 from "@/assets/lookbook/look-06.jpg";
import img7 from "@/assets/lookbook/look-07.webp";
import img8 from "@/assets/lookbook/look-08.webp";
import img9 from "@/assets/lookbook/look-09.jpg";
import img10 from "@/assets/lookbook/look-10.webp";
import img11 from "@/assets/lookbook/look-11.webp";
import img12 from "@/assets/lookbook/look-12.webp";
import img13 from "@/assets/lookbook/look-13.webp";
import img14 from "@/assets/lookbook/look-14.jpg";
import img15 from "@/assets/lookbook/look-15.webp";
import img16 from "@/assets/lookbook/look-16.webp";
import img17 from "@/assets/lookbook/look-17.jpg";
import img18 from "@/assets/lookbook/look-18.jpg";
import img19 from "@/assets/lookbook/look-19.webp";
import img20 from "@/assets/lookbook/look-20.jpg";
import img21 from "@/assets/lookbook/look-21.webp";
import img22 from "@/assets/lookbook/look-22.webp";
import img23 from "@/assets/lookbook/look-23.webp";
import img24 from "@/assets/lookbook/look-24.webp";
import img25 from "@/assets/lookbook/look-25.webp";
import img26 from "@/assets/lookbook/look-26.webp";
import img27 from "@/assets/lookbook/look-27.webp";
import img28 from "@/assets/lookbook/look-28.webp";
import img29 from "@/assets/lookbook/look-29.webp";
import img30 from "@/assets/lookbook/look-30.jpg";
import img31 from "@/assets/lookbook/look-31.jpg";
import img32 from "@/assets/lookbook/look-32.webp";
import img33 from "@/assets/lookbook/look-33.jpg";
import img34 from "@/assets/lookbook/look-34.webp";
import img35 from "@/assets/lookbook/look-35.webp";

const PHOTOS = [
  img1, img2, img3, img4, img5, img6, img7, img8, img9, img10,
  img11, img12, img13, img14, img15, img16, img17, img18, img19, img20,
  img21, img22, img23, img24, img25, img26, img27, img28, img29, img30,
  img31, img32, img33, img34, img35,
];

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "Lookbook — The Claudelande Collection | Brooklyn Hair Studio" },
      {
        name: "description",
        content:
          "Browse the Claudelande Collection lookbook — sew ins, custom wigs, ponytails, color, and natural hair styled at Studio 11, Brooklyn NY.",
      },
      { property: "og:title", content: "Lookbook — The Claudelande Collection" },
      {
        property: "og:description",
        content: "A gallery of signature hairstyles by Claudelande, Brooklyn NY.",
      },
      { property: "og:image", content: img1 },
      { property: "twitter:image", content: img1 },
    ],
    links: [{ rel: "canonical", href: "/lookbook" }],
  }),
  component: Lookbook,
});

function Lookbook() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i + PHOTOS.length - 1) % PHOTOS.length)),
    [],
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % PHOTOS.length)),
    [],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, prev, next]);

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-10 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">The Gallery</p>
        <h1 className="mt-3 font-serif text-5xl sm:text-6xl">Lookbook</h1>
        <p className="mx-auto mt-5 max-w-md text-muted-foreground">
          A curated collection of signature styles — sew ins, custom wigs, ponytails, color and
          natural hair, crafted at Studio 11 in Brooklyn.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
          {PHOTOS.map((src, i) => (
            <div
              key={i}
              className="group mb-3 break-inside-avoid sm:mb-4 overflow-hidden rounded-sm"
            >
              <LazyImage
                src={src}
                alt={`Claudelande Collection hairstyle ${i + 1}`}
                onClick={() => setActive(i)}
                imgClassName="transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {active !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/95 p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 text-background/80 transition-colors hover:text-background"
            aria-label="Close"
          >
            <X className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-2 sm:left-6 text-background/80 transition-colors hover:text-background"
            aria-label="Previous"
          >
            <ChevronLeft className="h-9 w-9" />
          </button>
          <img
            src={PHOTOS[active]}
            alt={`Claudelande Collection hairstyle ${active + 1}`}
            className="max-h-[88vh] max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-2 sm:right-6 text-background/80 transition-colors hover:text-background"
            aria-label="Next"
          >
            <ChevronRight className="h-9 w-9" />
          </button>
        </div>
      )}
    </>
  );
}
