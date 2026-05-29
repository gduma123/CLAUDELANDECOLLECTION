import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  onClick?: () => void;
}

export function LazyImage({ src, alt, className, imgClassName, onClick }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden bg-muted",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      style={{ minHeight: 180 }}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={cn(
            "w-full h-auto object-cover transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName
          )}
        />
      )}
    </div>
  );
}
