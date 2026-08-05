import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import { ContactIcon } from "@/components/contact-icon";
import {
  BUSINESS_ADDRESS,
  CALL_PHONE_DISPLAY,
  CALL_PHONE_E164,
  FACEBOOK_URL,
  GOOGLE_MAPS_URL,
  INSTAGRAM_URL,
  SITE_LOGO,
  WHATSAPP_PHONE,
} from "@/lib/seo";

const quickLinks = [
  ["/", "Home"],
  ["/shop", "Shop All Products"],
  ["/about-us", "About Al Nakiya"],
  ["/contact-us", "Contact Us"],
  ["/blog", "Industry Blog"],
];

const categoryLinks = [
  ["/category/cutting-tools", "Cutting Tools"],
  ["/category/power-tool", "Power Tools"],
  ["/category/electrical-accessories", "Electrical Product"],
  ["/category/safety-products", "Safety Products"],
  ["/category/hardware-tool-accessories", "Hardware Accessories"],
];

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between border-b border-white/10 py-2.5 text-sm text-zinc-300 hover:border-[#ffb128]/50 hover:text-white"
    >
      <span>{label}</span>
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto overflow-hidden bg-black text-zinc-200">
      <div className="border-b border-white/10 bg-zinc-950">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-4 py-7 sm:px-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffb128]">
              Need help finding the right product?
            </p>
            <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
              Speak with our tools and hardware team.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${CALL_PHONE_E164}`}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:border-[#800517] hover:bg-[#800517]"
            >
              <ContactIcon name="phone" className="h-4 w-4" />
              Call {CALL_PHONE_DISPLAY}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-[#800517]/30 bg-white px-5 py-3 text-sm font-bold text-[#800517] hover:bg-[#800517]/5"
            >
              <ContactIcon name="whatsapp" className="h-4 w-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      <div className="bg-black">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.25fr_0.8fr_1fr_1.15fr] lg:py-16">
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              <SiteImage
                src={SITE_LOGO}
                alt="Al Nakiya Trading"
                width={72}
                height={72}
                optimizeWidth={160}
                className="h-16 w-16 rounded-full object-cover shadow-lg ring-2 ring-[#800517]/60"
              />
              <span>
                <strong className="block text-lg text-white">
                  Al Nakiya Trading
                </strong>
                <span className="text-xs uppercase tracking-wider text-[#ffb128]">
                  Tools | Hardware | Supplies
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-300">
              Your trusted UAE partner for industrial tools, hardware,
              electrical accessories, plumbing supplies, and safety products.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Al Nakiya Trading on Facebook"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white hover:border-[#ffb128] hover:bg-[#ffb128] hover:text-black"
              >
                <ContactIcon name="facebook" className="h-5 w-5" />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Al Nakiya Trading on Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white hover:border-[#ffb128] hover:bg-[#ffb128] hover:text-black"
              >
                <ContactIcon name="instagram" className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-white">Quick Links</h2>
            <div className="mt-4">
              {quickLinks.map(([href, label]) => (
                <FooterLink key={href} href={href} label={label} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-white">
              Popular Categories
            </h2>
            <div className="mt-4">
              {categoryLinks.map(([href, label]) => (
                <FooterLink key={href} href={href} label={label} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-white">Contact Details</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <a
                href={`tel:${CALL_PHONE_E164}`}
                className="border-b border-white/15 py-3 hover:border-[#ffb128]/60"
              >
                <span className="flex items-center gap-2 text-xs uppercase text-[#ffb128]">
                  <ContactIcon name="phone" className="h-4 w-4" />
                  Phone
                </span>
                <strong className="mt-1 block text-white">
                  {CALL_PHONE_DISPLAY}
                </strong>
              </a>
              <a
                href="mailto:info@alnakiyatrading.com"
                className="min-w-0 border-b border-white/15 py-3 hover:border-[#ffb128]/60"
              >
                <span className="flex items-center gap-2 text-xs uppercase text-[#ffb128]">
                  <ContactIcon name="email" className="h-4 w-4" />
                  Email
                </span>
                <strong className="mt-1 block break-all text-white">
                  info@alnakiyatrading.com
                </strong>
              </a>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noreferrer"
                className="py-3 hover:text-[#ffb128]"
              >
                <span className="flex items-center gap-2 text-xs uppercase text-[#ffb128]">
                  <ContactIcon name="location" className="h-4 w-4" />
                  Location
                </span>
                <strong className="mt-1 block text-white">
                  {BUSINESS_ADDRESS}
                </strong>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#a70722] bg-[#800517]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-center text-xs text-white/90 sm:px-6 md:flex-row md:justify-between md:text-left">
          <span>
            © 2000 Al Nakiya Trading LLC. All rights reserved.
          </span>
          <span className="text-white/80">
            Industrial tools and hardware supplier in the UAE
          </span>
        </div>
      </div>
    </footer>
  );
}
