import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { PreviewErrorOverlay } from "@/components/PreviewErrorOverlay";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer";




function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "The Claudelande Collection",
  description:
    "Brooklyn's premier hair extension studio offering sew ins, wigs, color, clip ins, pixie cuts and more.",
  image: "/hero-og.jpg",
  telephone: "+1-347-792-7790",
  email: "claudelandestyles@gmail.com",
  url: "/",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Studio 11, 977 East New York Avenue",
    addressLocality: "Brooklyn",
    addressRegion: "NY",
    postalCode: "11212",
    addressCountry: "US",
  },
  areaServed: "Brooklyn, New York",
  priceRange: "$$",
  sameAs: ["https://www.instagram.com/claudelande_/"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "19:00",
    },
  ],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Claudelande Collection — Brooklyn Hair Extensions Installs & Color" },
      {
        name: "description",
        content:
          "Brooklyn's premier hair extension studio. Sew ins, wigs, color, clip ins, pixie cuts, and more. Studio 11, Brooklyn NY. Book your appointment online.",
      },
      { name: "author", content: "The Claudelande Collection" },
      { property: "og:title", content: "The Claudelande Collection — Brooklyn Hair Extensions Installs & Color" },
      {
        property: "og:description",
        content:
          "Brooklyn's premier hair extension studio. Sew ins, wigs, color, clip ins, pixie cuts, and more.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "The Claudelande Collection" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The Claudelande Collection — Brooklyn Hair Extensions Installs & Color" },
      { name: "description", content: "Style Sanctuary is a high-end website for a hair extension and styling brand, featuring a custom booking system." },
      { property: "og:description", content: "Style Sanctuary is a high-end website for a hair extension and styling brand, featuring a custom booking system." },
      { name: "twitter:description", content: "Style Sanctuary is a high-end website for a hair extension and styling brand, featuring a custom booking system." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1e574da4-210c-4a1d-8ca8-5b27cf796d1a/id-preview-e2059224--e2acd7b3-37f5-4eb9-a676-2f03f79352a0.lovable.app-1780026748778.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1e574da4-210c-4a1d-8ca8-5b27cf796d1a/id-preview-e2059224--e2acd7b3-37f5-4eb9-a676-2f03f79352a0.lovable.app-1780026748778.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(orgSchema),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});


function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (

    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
          </main>
          <Footer />
        </div>
        <CartDrawer />
        <Toaster position="top-center" />
        <PreviewErrorOverlay />
      </CartProvider>
    </QueryClientProvider>
  );
}

