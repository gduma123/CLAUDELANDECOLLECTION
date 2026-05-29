import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Security headers applied to every server response.
const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();
  const res = (result as { response?: Response }).response;
  if (res && res.headers && typeof res.headers.set === "function") {
    const csp = [
      "default-src 'self'",
      // Stripe.js + Instagram embed require their script origins.
      "script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.instagram.com https://platform.instagram.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://api.stripe.com https://www.instagram.com https://graph.instagram.com",
      "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://www.instagram.com https://checkout.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; ");
    res.headers.set("Content-Security-Policy", csp);
    res.headers.set("X-Frame-Options", "SAMEORIGIN");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
    res.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()",
    );
  }
  return result;
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, securityHeadersMiddleware],
  functionMiddleware: [attachSupabaseAuth],
}));
