import type { Metadata } from "next";
import { SiteImage } from "@/components/site-image";
import { ContactIcon } from "@/components/contact-icon";
import {
  BUSINESS_ADDRESS,
  CALL_PHONE_DISPLAY,
  CALL_PHONE_E164,
  createPageMetadata,
  GOOGLE_MAPS_EMBED_URL,
  GOOGLE_MAPS_URL,
  WHATSAPP_PHONE,
} from "@/lib/seo";
import { submitContact } from "./actions";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Us",
  description:
    "Contact Al Nakiya Trading in Ajman for product availability, bulk pricing, delivery and technical support. Call +971 55 341 2355 or WhatsApp us.",
  path: "/contact-us",
  image: "/uploads/2025/10/e1-1.jpg",
});

type ContactPageProps = {
  searchParams: Promise<{ sent?: string; error?: string }>;
};

export default async function ContactPage({
  searchParams,
}: ContactPageProps) {
  const params = await searchParams;

  return (
    <main className="flex-1 bg-white">
      <section className="relative flex min-h-[260px] items-center overflow-hidden px-4 py-10 text-white sm:min-h-[300px] sm:px-6 sm:py-12">
        <SiteImage
          src="/uploads/2025/10/e1-1.jpg"
          alt="Contact Al Nakiya Trading"
          fill
          priority
          optimizeWidth={1600}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#800517]/95 via-[#800517]/85 to-[#0B3954]/65" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-200">
            We are here to help
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Contact Us</h1>
          <p className="mt-3 max-w-xl leading-7 text-white/85">
            Product availability, bulk pricing and technical support from our
            UAE-based team.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#800517]">
            Contact information
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#0B3954]">
            Let&apos;s discuss your requirements
          </h2>
          <p className="mt-4 leading-7 text-zinc-600">
            Contact our team for product availability, bulk pricing, delivery,
            and technical product enquiries.
          </p>
          <div className="mt-8 border-y border-zinc-300">
            <a
              href={`tel:${CALL_PHONE_E164}`}
              className="grid grid-cols-[36px_1fr] gap-3 border-b border-zinc-300 py-5"
            >
              <ContactIcon
                name="phone"
                className="mt-1 h-5 w-5 text-[#800517]"
              />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Phone
                </div>
                <div className="mt-1 text-lg font-bold text-[#0B3954]">
                  {CALL_PHONE_DISPLAY}
                </div>
              </div>
            </a>
            <a
              href="mailto:info@alnakiyatrading.com"
              className="grid grid-cols-[36px_1fr] gap-3 border-b border-zinc-300 py-5"
            >
              <ContactIcon
                name="email"
                className="mt-1 h-5 w-5 text-[#800517]"
              />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Email
                </div>
                <div className="mt-1 break-all text-lg font-bold text-[#0B3954]">
                  info@alnakiyatrading.com
                </div>
              </div>
            </a>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="grid grid-cols-[36px_1fr] gap-3 py-5"
            >
              <ContactIcon
                name="location"
                className="mt-1 h-5 w-5 text-[#800517]"
              />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Location
                </div>
                <div className="mt-1 text-lg font-bold text-[#0B3954]">
                  {BUSINESS_ADDRESS}
                </div>
              </div>
            </a>
          </div>
          <div className="mt-6 grid gap-2 text-sm text-zinc-600">
            <p>
              <strong className="text-zinc-900">Business hours:</strong> Monday
              to Saturday, 8:00 AM to 7:00 PM
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-bold text-[#800517]"
            >
              <ContactIcon name="whatsapp" className="h-4 w-4" />
              Start a WhatsApp conversation
            </a>
          </div>
        </div>

        <div className="border-t border-zinc-300 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="text-sm font-bold uppercase tracking-wider text-[#800517]">
            Send an enquiry
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#0B3954]">
            Tell us what you need
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            Complete the form and our team will contact you regarding your
            requirement.
          </p>
          {params.sent === "1" && (
            <div className="mb-6 rounded-xl bg-emerald-50 p-4 font-semibold text-emerald-800">
              Thank you. Your message has been received.
            </div>
          )}
          {params.error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-800">
              {params.error === "config"
                ? "Online form setup is pending. Please call or WhatsApp us."
                : "We could not submit your message. Check the fields and try again."}
            </div>
          )}
          <form action={submitContact} className="mt-7 grid gap-5">
            <div className="hidden" aria-hidden="true">
              <label>
                Company
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-semibold">
              Name
              <input
                required
                name="name"
                minLength={2}
                maxLength={100}
                placeholder="Your full name"
                className="h-12 rounded-lg border border-zinc-300 bg-zinc-50 px-4 outline-none focus:border-[#800517] focus:bg-white focus:ring-2 focus:ring-[#800517]/10"
              />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                Email
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  className="h-12 rounded-lg border border-zinc-300 bg-zinc-50 px-4 outline-none focus:border-[#800517] focus:bg-white focus:ring-2 focus:ring-[#800517]/10"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Phone
                <input
                  name="phone"
                  type="tel"
                  maxLength={30}
                  placeholder="+971"
                  className="h-12 rounded-lg border border-zinc-300 bg-zinc-50 px-4 outline-none focus:border-[#800517] focus:bg-white focus:ring-2 focus:ring-[#800517]/10"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-semibold">
              Message
              <textarea
                required
                name="message"
                minLength={10}
                maxLength={3000}
                rows={6}
                placeholder="Products, quantity, delivery location, or other requirements"
                className="rounded-lg border border-zinc-300 bg-zinc-50 p-4 outline-none focus:border-[#800517] focus:bg-white focus:ring-2 focus:ring-[#800517]/10"
              />
            </label>
            <button className="w-full rounded-lg bg-[#800517] px-7 py-4 font-bold text-white shadow-md hover:bg-red-900 sm:w-auto sm:justify-self-start">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#800517]">
            Find us
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-bold text-[#0B3954] sm:text-3xl">
              Visit Al Nakiya Trading in Ajman
            </h2>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[#800517] hover:underline"
            >
              Open in Google Maps
            </a>
          </div>
          <p className="mt-1 text-sm text-zinc-500">{BUSINESS_ADDRESS}</p>
          <div className="mt-6 overflow-hidden border border-zinc-300 bg-white">
            <iframe
              title="Al Nakiya Trading location"
              src={GOOGLE_MAPS_EMBED_URL}
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block border-0"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
