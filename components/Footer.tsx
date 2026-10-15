/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const WRAP = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";

const FOOTER_SERVICES = [
  "Web Designing",
  "Web Development",
  "Mobile App Dev",
  "Digital Marketing",
  "Hosting & Domain",
  "E-Commerce",
];

const QUICK_LINKS: [string, string][] = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Services", "/services"],
  ["Portfolio", "/portfolio"],
  ["Contact", "/contact"],
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/empire_ae_official/",
    icon: (
      <>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/empireaeitservices/?originalSubdomain=in",
    icon: (
      <>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </>
    ),
  },
];

function Icon({
  children,
  size = 24,
  stroke = 2,
}: {
  children: React.ReactNode;
  size?: number;
  stroke?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function Footer() {
  const head = "mb-6 text-[15px] font-semibold uppercase tracking-[0.1em] text-white";
  const link =
    "text-[16px] text-white/70 transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:underline underline-offset-4";
  const contactLink =
    "flex items-center gap-3 text-[18px] text-white transition-opacity duration-300 hover:opacity-70 sm:text-[22px]";

  return (
    <footer className="bg-black text-white">
      <div className="h-px w-full bg-white/15" />

      {/* Top row: brand on the left, contact + socials on the right */}
      <div
        className={`${WRAP} flex flex-col gap-12 pb-14 pt-16 md:flex-row md:items-start md:justify-between lg:pt-[88px]`}
      >
        <div>
          <img
            src="https://empireae.xyz/images/logo.png"
            alt="Empire AE"
            className="mb-6 h-[56px] w-auto brightness-0 invert"
          />
          <p className="max-w-[420px] text-[16px] leading-[1.7] text-white/80">
            A full-service digital solutions company dedicated to helping businesses build, grow, and strengthen their digital presence.
          </p>
        </div>

        <div className="flex flex-col gap-6 md:items-end">
          <ul className="space-y-4">
            <li>
              <a href="tel:+919847980605" className={contactLink}>
                <Icon size={20} stroke={1.8}>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </Icon>
                +91 9847980605
              </a>
            </li>
            <li>
              <a href="mailto:info@empireae.xyz" className={contactLink}>
                <Icon size={20} stroke={1.8}>
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </Icon>
                info@empireae.xyz
              </a>
            </li>
          </ul>

          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Icon size={17} stroke={2}>{s.icon}</Icon>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className={WRAP}>
        <div className="grid gap-12 border-t border-white/15 py-14 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr]">
          <nav aria-label="Quick links">
            <h5 className={head}>Quick Links</h5>
            <ul className="space-y-[11px]">
              {QUICK_LINKS.map(([l, h]) => (
                <li key={l}>
                  <Link href={h} className={link}>{l}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Services">
            <h5 className={head}>Services</h5>
            <ul className="space-y-[11px]">
              {FOOTER_SERVICES.map((s) => (
                <li key={s}>
                  <Link href="/services" className={link}>{s}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={WRAP}>
        <div className="flex flex-col items-center justify-between gap-2 border-t border-white/15 py-7 text-center text-[15px] text-white/70 md:flex-row">
          <span>© 2026 Empire AE. All Rights Reserved.</span>
          <span>Designed by Empire AE</span>
        </div>
      </div>
    </footer>
  );
}