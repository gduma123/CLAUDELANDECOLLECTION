import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { SITE } from "@/lib/site";
import { PageHeader } from "@/components/ui-bits";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — The Claudelande Collection | Studio 11, Brooklyn NY" },
      {
        name: "description",
        content:
          "Contact The Claudelande Collection. Call 347-792-7790, email claudelandestyles@gmail.com, or visit Studio 11, 977 East New York Avenue, Brooklyn NY 11212.",
      },
      { property: "og:title", content: "Contact — The Claudelande Collection" },
      { property: "og:description", content: "Studio 11, Brooklyn NY. Tuesday–Saturday 10am–7pm." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    toast.success("Message sent", { description: "Thank you — we'll be in touch shortly." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const inputCls =
    "w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground";

  return (
    <div className="pb-20">
      <PageHeader eyebrow="Get in Touch" title="Contact" />
      <div className="mx-auto grid max-w-5xl gap-12 px-5 lg:grid-cols-2">
        <div className="space-y-6">
          <a href={SITE.phoneHref} className="flex items-start gap-4">
            <Phone className="mt-1 h-5 w-5 shrink-0" />
            <span><span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone</span>{SITE.phone}</span>
          </a>
          <a href={SITE.emailHref} className="flex items-start gap-4">
            <Mail className="mt-1 h-5 w-5 shrink-0" />
            <span><span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</span>{SITE.email}</span>
          </a>
          <div className="flex items-start gap-4">
            <MapPin className="mt-1 h-5 w-5 shrink-0" />
            <span><span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Studio</span>{SITE.address.full}</span>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="mt-1 h-5 w-5 shrink-0" />
            <span><span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Hours</span>{SITE.hours}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className={inputCls}
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <textarea
            className={`${inputCls} min-h-36 resize-y`}
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-foreground px-8 py-4 text-xs uppercase tracking-[0.25em] text-background transition-colors hover:bg-foreground/85"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
