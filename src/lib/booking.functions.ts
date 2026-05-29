import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { findService, BOOKING_TIME_SLOTS } from "@/lib/booking-services";

const createAppointmentSchema = z.object({
  category: z.string().min(1).max(120),
  serviceName: z.string().min(1).max(160),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z
    .string()
    .refine((t) => BOOKING_TIME_SLOTS.includes(t), {
      message: "Invalid time slot",
    }),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(255),
  notes: z.string().trim().max(1000).optional().default(""),
});


/**
 * Creates an appointment request. Pricing and deposit are computed
 * server-side from the authoritative service catalog — the client can never
 * dictate the amount that will eventually be charged.
 *
 * NOTE: Stripe is not yet connected. When the owner connects her Stripe
 * account, wire the PaymentIntent here using `deposit.depositCents` as the
 * amount and a server-only secret key. Everything below already validates the
 * amount, so the only addition needed is the Stripe call + payment_ref update.
 */
export const createAppointment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createAppointmentSchema.parse(input))
  .handler(async ({ data }) => {
    // Authoritative server-side price lookup. Reject unknown services.
    const svc = findService(data.category, data.serviceName);
    if (!svc) {
      throw new Error("Selected service is not available.");
    }

    // Authoritative server-side date validation. The salon is open Tue–Sat and
    // never accepts past-dated bookings. Client-side calendar restrictions can
    // be bypassed via direct API calls, so enforce them here too.
    const [yy, mm, dd] = data.date.split("-").map(Number);
    const requested = new Date(yy, mm - 1, dd);
    if (
      requested.getFullYear() !== yy ||
      requested.getMonth() !== mm - 1 ||
      requested.getDate() !== dd
    ) {
      throw new Error("Invalid appointment date.");
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requested < today) {
      throw new Error("Appointments cannot be booked in the past.");
    }
    const dow = requested.getDay(); // 0 Sun ... 6 Sat
    if (dow < 2 || dow > 6) {
      throw new Error("The salon is closed on Sundays and Mondays.");
    }

    // Basic anti-abuse rate limit: cap how many requests a single email or
    // phone can submit within a short window to prevent spam/DoS flooding.
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const [{ count: emailCount }, { count: phoneCount }] = await Promise.all([
      supabaseAdmin
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("email", data.email)
        .gte("created_at", since),
      supabaseAdmin
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("phone", data.phone)
        .gte("created_at", since),
    ]);

    if ((emailCount ?? 0) >= 5 || (phoneCount ?? 0) >= 5) {
      throw new Error("Too many requests. Please try again in a few minutes.");
    }

    const { data: inserted, error } = await supabaseAdmin
      .from("appointments")
      .insert({
        service_category: svc.category,
        service_name: svc.name,
        service_price_cents: svc.priceCents,
        deposit_cents: svc.depositCents,
        appointment_date: data.date,
        appointment_time: data.time,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        email: data.email,
        notes: data.notes || null,
        status: "pending",
        // Deposit collection is pending Stripe connection. Until then the
        // request is logged as unpaid; the owner confirms manually.
        payment_status: "unpaid",
      })
      .select("confirmation_number, deposit_cents")
      .single();

    if (error) {
      throw new Error("Could not save your appointment. Please try again.");
    }

    return {
      confirmationNumber: inserted.confirmation_number as string,
      depositCents: inserted.deposit_cents as number,
      // Placeholder for the future Stripe deposit flow.
      paymentRequired: false as const,
    };
  });
