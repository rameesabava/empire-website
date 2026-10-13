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
  const head = "mb-6 text-[15px] font-semibold uppercase tracking-[0.1em] text-[#EEEEEE]";
  const link = "text-[16px] text-[#B3B8BD] transition-colors duration-300 hover:text-[#76ABAE]";
  const contactLink =
    "flex items-center gap-3 text-[16px] text-[#EEEEEE]/85 transition-colors duration-300 hover:text-[#76ABAE]";

  return (
    <footer className="bg-[#222831]">
      <div className="h-[3px] w-full bg-[linear-gradient(135deg,#76ABAE_0%,#9CC5C8_100%)]" />

      <div className={`${WRAP} grid gap-12 pb-12 pt-16 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr] lg:pt-[88px]`}>
        <div>
          <img
            src="https://empireae.xyz/images/logo.png"
            alt="Empire AE"
            className="mb-6 h-[56px] w-auto brightness-0 invert"
          />
          <p className="max-w-[300px] text-[16px] leading-[1.7] text-[#B3B8BD]">
            A full-service digital solutions company dedicated to helping businesses build, grow, and strengthen their digital presence.
          </p>
          <div className="mt-7 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEEEEE]/[0.07] text-[#EEEEEE]/85 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#76ABAE] hover:text-[#222831]"
              >
                <Icon size={17} stroke={2}>{s.icon}</Icon>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h5 className={head}>Quick Links</h5>
          <ul className="space-y-[11px]">
            {[
              ["Home", "/"],
              ["About Us", "/about"],
              ["Services", "/services"],
              ["Portfolio", "/portfolio"],
              ["Contact", "/contact"],
            ].map(([l, h]) => (
              <li key={l}>
                <Link href={h} className={link}>{l}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className={head}>Services</h5>
          <ul className="space-y-[11px]">
            {FOOTER_SERVICES.map((s) => (
              <li key={s}>
                <Link href="/services" className={link}>{s}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className={head}>Contact Us</h5>
          <ul className="space-y-4">
            <li>
              <a href="tel:+919847980605" className={contactLink}>
                <span className="text-[#76ABAE]">
                  <Icon size={17} stroke={1.8}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </Icon>
                </span>
                +91 9847980605
              </a>
            </li>
            <li>
              <a href="mailto:info@empireae.xyz" className={contactLink}>
                <span className="text-[#76ABAE]">
                  <Icon size={17} stroke={1.8}>
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </Icon>
                </span>
                info@empireae.xyz
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={WRAP}>
        <div className="flex flex-col items-center justify-between gap-2 border-t border-[#EEEEEE]/10 py-7 text-center text-[15px] text-[#B3B8BD] md:flex-row">
          <span>© 2026 Empire AE. All Rights Reserved.</span>
          <span>Designed with precision by Empire AE</span>
        </div>
      </div>
    </footer>
  );
}