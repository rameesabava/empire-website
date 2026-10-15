"use client";

/**
 * Services page (Lusion-inspired concave scroll layout) – single file.
 * Requires: next 16 (App Router), react, tailwindcss (v3.4+ or v4), gsap, lenis
 *   npm install gsap lenis
 * Save as app/page.tsx (or any route's page.tsx).
 * If your layout already runs Lenis, delete the "Lenis" effect inside Page()
 * and add `lenis.on("scroll", ScrollTrigger.update)` to your existing setup.
 */

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ================================================================== */
/*  1. DATA                                                            */
/* ================================================================== */
type ServiceMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string };

type Service = {
  slug: string;
  title: string;
  description: string; // short text shown on the card
  tags: string[]; // sub-services / deliverables
  href: string; // change to match your routes
  bg: string; // active card background + media base colour
  fg: string; // active text colour
  accent: string; // placeholder artwork accent
  shadow: number; // 0–1 shadow darkness when active
  media?: ServiceMedia; // optional real image/video
};

/* ------------------------------------------------------------------ */
/*  PAGE CONTENT – replace with the wording from empireae.xyz/services */
/*  The entries below are PLACEHOLDERS, not copied from your site.     */
/* ------------------------------------------------------------------ */
const PAGE_TITLE = "Our Services";
const PAGE_INTRO = "From ideas to breakthrough results, we craft powerful digital experiences that amplify your brand, captivate your audience, and turn clicks into customers.";
const CTA_LABEL = "Start a project";
const CTA_HREF = "/contact";


const SERVICES: Service[] = [
  {
    slug: "web-design",
    title: "Web Design",
    description:
      "We create stunning, responsive websites that captivate visitors and elevate your brand.",
    tags: ["UI/UX Design", "Responsive", "Brand Identity"],
    href: "/services/web-design",
    bg: "#1a1411",
    fg: "#ffedd7",
    accent: "#e8a15a",
    shadow: 0.9,
  },
  {
    slug: "web-development",
    title: "Web Development",
    description:
      "We build secure, scalable websites engineered for performance and growth.",
    tags: ["React / Next.js", "WordPress", "Laravel"],
    href: "/services/web-development",
    bg: "#121414",
    fg: "#ffffff",
    accent: "#3dd6c6",
    shadow: 0.9,
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    description:
      "We develop powerful Android and iOS apps for seamless user experiences.",
    tags: ["Android", "iOS", "Flutter"],
    href: "/services/mobile-app-development",
    bg: "#E3E3F8",
    fg: "#000000",
    accent: "#7b7be8",
    shadow: 0.95,
  },
  {
    slug: "hosting-domain",
    title: "Hosting & Domain",
    description:
      "We keep your website fast, secure, and online with reliable hosting solutions.",
    tags: ["SSL Security", "99.9% Uptime", "Daily Backups"],
    href: "/services/hosting-domain",
    bg: "#EFD5D3",
    fg: "#000000",
    accent: "#d8554f",
    shadow: 0.95,
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    description:
      "We boost visibility and attract customers through result-driven digital strategies.",
    tags: ["SEO", "Social Media", "Content Marketing"],
    href: "/services/digital-marketing",
    bg: "#111a13",
    fg: "#d9f3de",
    accent: "#5fbf7a",
    shadow: 0.9,
  },
  {
    slug: "e-commerce-application",
    title: "E-Commerce Application",
    description:
      "We build seamless online stores that turn visitors into loyal customers.",
    tags: ["WooCommerce", "Payment Gateway", "Inventory Management"],
    href: "/services/e-commerce-application",
    bg: "#BFE3FA",
    fg: "#0a2540",
    accent: "#6cb8ee",
    shadow: 0.95,
  },
  {
    slug: "software-application",
    title: "Software Application",
    description:
      "We create custom software that streamlines workflows and boosts productivity.",
    tags: ["ERP Systems", "CRM", "Custom Software"],
    href: "/services/software-application",
    bg: "#1a1411",
    fg: "#ffedd7",
    accent: "#e8a15a",
    shadow: 0.9,
  },
  {
    slug: "seo",
    title: "SEO",
    description:
      "We improve search rankings, increase organic traffic, and grow your online reach.",
    tags: ["On-Page SEO", "Off-Page SEO", "Keyword Optimization"],
    href: "/services/seo",
    bg: "#121414",
    fg: "#ffffff",
    accent: "#3dd6c6",
    shadow: 0.9,
  },
];


/* ================================================================== */
/*  2. CURVE CONFIG (distances are % of the card's own size)           */
/* ================================================================== */
/**
 * Concave "bowl" curve. Each card is positioned on the inside of a large
 * cylinder (and, on desktop, a second one for the two columns):
 *   d = -1 (card at top edge) … 0 (viewport centre) … +1 (bottom edge)
 * Cards at the centre sit flat and furthest away; cards toward the edges
 * swing forward and tilt so they face the centre of the viewport.
 */
type CurveConfig = {
  tiltX: number; // degrees of rotateX at the viewport edge (faces the centre)
  tiltY: number; // degrees of rotateY toward the centre (two-column layout)
  depth: number; // px the edges come toward the viewer (concave depth)
  pull: number; // % of card height edge cards are pulled toward the centre
  inward: number; // % of card width edge cards slide toward the centre line
  scrub: number; // smoothing, seconds
  perspective: number;
};
type CurveBreakpoints = Record<"desktop" | "tablet" | "mobile", CurveConfig>;

const DEFAULT_CURVE: CurveBreakpoints = {
  desktop: { tiltX: 16, tiltY: 9, depth: 170, pull: 5, inward: 4, scrub: 0.9, perspective: 1300 },
  tablet: { tiltX: 11, tiltY: 0, depth: 110, pull: 3, inward: 0, scrub: 0.7, perspective: 1100 },
  mobile: { tiltX: 6, tiltY: 0, depth: 45, pull: 1.5, inward: 0, scrub: 0.5, perspective: 900 },
};

const STEPS = 28;
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const WIDTH = "w-[min(100%,520px)] md:w-[min(76%,720px)] lg:w-[min(72vw,1120px)]";

/** side: -1 = left column, +1 = right column, 0 = single column. */
function sample(t: number, side: number, c: CurveConfig) {
  const d = 1 - 2 * t; // +1 below centre … -1 above centre
  const arc = d * (Math.PI / 2);
  return {
    rotationX: d * c.tiltX,
    rotationY: -side * Math.abs(d) * c.tiltY * 0.6 - side * c.tiltY * 0.4,
    z: c.depth * (1 - Math.cos(arc)),
    yPercent: -Math.sin(arc) * c.pull,
    xPercent: -side * (1 - Math.cos(arc)) * c.inward,
  };
}

function buildCurve(el: HTMLElement, side: number, c: CurveConfig) {
  // Trigger on the <li> so the animated transform never feeds back into
  // ScrollTrigger's start/end measurements.
  const trigger = el.closest("li") ?? el;
  gsap.set(el, { ...sample(0, side, c), transformPerspective: c.perspective, force3D: true });
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: c.scrub },
  });
  for (let k = 1; k <= STEPS; k++) tl.to(el, { ...sample(k / STEPS, side, c), duration: 1 });
}

/* Active-card state lives in data attributes (no React re-renders):
   the active card expands, the others dim, and the whole section
   takes on the active service's colours. */
function activateCard(root: HTMLElement, cards: HTMLElement[], card: HTMLElement) {
  cards.forEach((c) => {
    c.dataset.active = c === card ? "true" : "false";
    c.dataset.dim = c === card ? "false" : "true";
  });
  root.dataset.hot = "true";
  root.style.setProperty("--fw-sbg", card.style.getPropertyValue("--fw-bg"));
  root.style.setProperty("--fw-sfg", card.style.getPropertyValue("--fw-fg"));
}

function deactivateCard(root: HTMLElement, cards: HTMLElement[], card: HTMLElement) {
  card.dataset.active = "false";
  if (cards.some((c) => c.dataset.active === "true")) return; // another card took over
  cards.forEach((c) => (c.dataset.dim = "false"));
  root.dataset.hot = "false";
  root.style.removeProperty("--fw-sbg");
  root.style.removeProperty("--fw-sfg");
}

/* ================================================================== */
/*  3. ROLLING TITLE                                                   */
/* ================================================================== */
function RollingTitle({ text }: { text: string }) {
  const words = text.split(" ");
  let index = 0;
  return (
    <span className="block">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="block">
        {words.map((word, w) => (
          <span key={w}>
            <span className="inline-flex whitespace-nowrap">
              {Array.from(word).map((ch, c) => {
                const i = index++;
                return (
                  <span key={c} className="inline-block h-[1.25em] overflow-hidden leading-[1.25em]">
                    <span
                      className={`block transition-transform duration-500 ${EASE} group-data-[active=true]:-translate-y-1/2 motion-reduce:transition-none`}
                      style={{ transitionDelay: `${i * 18}ms` }}
                    >
                      <span className="block">{ch}</span>
                      <span className="block">{ch}</span>
                    </span>
                  </span>
                );
              })}
            </span>
            {w < words.length - 1 && <span className="inline-block w-[0.3em]" />}
          </span>
        ))}
      </span>
    </span>
  );
}

/* ================================================================== */
/*  4. MEDIA (real media or CSS artwork)                               */
/* ================================================================== */
function ServiceMediaView({ service, index }: { service: Service; index: number }) {
  const { media, bg, fg, accent, title } = service;

  if (media?.type === "image") {
    return (
      <div
        role="img"
        aria-label={media.alt}
        className="size-full bg-cover bg-center"
        style={{ backgroundColor: bg, backgroundImage: `url(${media.src})` }}
      />
    );
  }
  if (media?.type === "video") {
    return (
      <video
        className="size-full object-cover"
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        aria-label={`${title} preview`}
      />
    );
  }

  const variant = index % 3;
  const fgSoft = `color-mix(in srgb, ${fg} 22%, transparent)`;
  const blob = (x: string, y: string, size: string, color: string): CSSProperties => ({
    left: x,
    top: y,
    width: size,
    height: size,
    background: `radial-gradient(circle at 35% 35%, ${color}, transparent 65%)`,
  });

  return (
    <div className="relative size-full overflow-hidden" style={{ backgroundColor: bg }} aria-hidden="true">
      <div className="fw-drift-a absolute rounded-full blur-2xl" style={blob("-8%", "-20%", "70%", accent)} />
      <div
        className="fw-drift-b absolute rounded-full opacity-70 blur-3xl"
        style={blob("45%", "30%", "65%", `color-mix(in srgb, ${accent} 60%, ${fg})`)}
      />
      {variant === 0 && (
        <div
          className="absolute left-1/2 top-1/2 aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{ borderColor: fgSoft, boxShadow: `0 0 0 clamp(14px,2.4vw,40px) ${fgSoft}` }}
        />
      )}
      {variant === 1 && (
        <div
          className="absolute left-1/2 top-1/2 aspect-square w-[30%] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[28%] border"
          style={{ borderColor: fgSoft, background: `linear-gradient(135deg, ${fgSoft}, transparent)` }}
        />
      )}
      {variant === 2 && (
        <div className="absolute inset-x-[18%] bottom-[14%] flex h-[46%] items-end gap-[3%]">
          {[0.45, 0.8, 0.62, 1, 0.55].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-full border"
              style={{ height: `${h * 100}%`, borderColor: fgSoft, background: `linear-gradient(to top, ${fgSoft}, transparent)` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  5. PROJECT CARD                                                    */
/* ================================================================== */
function ServiceCard({ service, index }: { service: Service; index: number }) {
  const style = {
    "--fw-bg": service.bg,
    "--fw-fg": service.fg,
    "--fw-shadow": service.shadow,
  } as CSSProperties;

  return (
    <li className="min-w-0">
      {/* Layer 1 – GSAP: curved scroll motion */}
      <div data-fw-motion className="will-change-transform">
        {/* Layer 2 – GSAP: pointer tilt (desktop only) */}
        <div data-fw-tilt className="will-change-transform">
          {/* Layer 3 – CSS: active / hover styling */}
          <Link
            href={service.href}
            data-fw-card
            data-active="false"
            data-dim="false"
            style={style}
            className={`group block rounded-[1.1rem] bg-[color-mix(in_srgb,currentColor_7%,transparent)] p-1.5 outline-none ring-1 ring-transparent transition-[background-color,color,transform,box-shadow,opacity] duration-500 ${EASE} focus-visible:ring-2 focus-visible:ring-current data-[active=true]:scale-[1.02] data-[active=true]:bg-[var(--fw-bg)] data-[active=true]:text-[var(--fw-fg)] data-[active=true]:shadow-[0_40px_90px_-30px_rgba(0,0,0,var(--fw-shadow))] data-[active=true]:ring-[color-mix(in_srgb,var(--fw-fg)_22%,transparent)] data-[dim=true]:opacity-40 motion-reduce:transition-none sm:rounded-[1.4rem] sm:p-2`}
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-[0.7rem] sm:aspect-[2/1] sm:rounded-[1.05rem] lg:aspect-[2/1]">
              <div data-fw-media-inner className="size-full will-change-transform">
                <ServiceMediaView service={service} index={index} />
              </div>
              {/* pointer spotlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-500 group-data-[active=true]:opacity-100"
                style={{ background: "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.4), transparent 55%)" }}
              />
            </div>

            <div className="px-2 pb-1 pt-2.5 sm:px-2.5 sm:pb-1.5 sm:pt-3">
              <p className="text-[0.7rem] leading-snug opacity-70 sm:text-[0.8rem]">{service.tags.join(" • ")}</p>

              <div className="relative mt-1.5 text-[clamp(1.1rem,0.95rem+1vw,1.75rem)] font-medium leading-tight tracking-tight">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-[0.6em] size-[0.55em] -translate-x-3 -translate-y-1/2 rounded-full bg-current opacity-0 transition-[transform,opacity] duration-500 ${EASE} group-data-[active=true]:translate-x-0 group-data-[active=true]:opacity-100 motion-reduce:transition-none`}
                />
                <div
                  className={`w-[calc(100%-0.85em)] transition-transform duration-500 ${EASE} group-data-[active=true]:translate-x-[0.85em] motion-reduce:transition-none`}
                >
                  <RollingTitle text={service.title} />
                </div>
                <p className="mt-2 line-clamp-2 text-[0.8rem] font-normal leading-relaxed tracking-normal opacity-70 sm:text-sm">
                  {service.description}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </li>
  );
}

/* ================================================================== */
/*  6. SECTION                                                         */
/* ================================================================== */
function ServicesSection({
  services = SERVICES,
  curve,
  ctaHref = CTA_HREF,
  ctaLabel = CTA_LABEL,
}: {
  services?: Service[];
  curve?: Partial<{ [K in keyof CurveBreakpoints]: Partial<CurveConfig> }>;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cursor = cursorRef.current;

    // gsap.matchMedia is a scoped context: everything created inside is
    // reverted when a query stops matching or on mm.revert().
    const mm = gsap.matchMedia(root);

    mm.add(
      {
        desktop: "(min-width: 1024px)",
        tablet: "(min-width: 768px) and (max-width: 1023.98px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
        canHover: "(hover: hover) and (pointer: fine)",
      },
      (ctx) => {
        const { desktop, tablet, reduceMotion, canHover } = ctx.conditions as Record<string, boolean>;
        const cards = gsap.utils.toArray<HTMLElement>("[data-fw-card]");
        const motions = gsap.utils.toArray<HTMLElement>("[data-fw-motion]");
        const fx = !reduceMotion;

        // 1. Curved scroll motion
        if (fx) {
          const key = desktop ? "desktop" : tablet ? "tablet" : "mobile";
          const cfg = { ...DEFAULT_CURVE[key], ...curve?.[key] };
          motions.forEach((el, i) => {
            // Desktop is two columns: left cards lean right, right cards lean left.
            const side = desktop ? (i % 2 === 0 ? -1 : 1) : 0;
            buildCurve(el, side, cfg);
          });
        }

        const cleanups: Array<() => void> = [];
        const inner = (card: HTMLElement) => card.querySelector<HTMLElement>("[data-fw-media-inner]");

        if (fx) cards.forEach((card) => {
          const m = inner(card);
          if (m) gsap.set(m, { scale: 1.08 });
        });

        if (canHover) {
          // 2a. Mouse: hover state, 3D tilt, media parallax, "View" cursor
          const qx = cursor && fx ? gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" }) : null;
          const qy = cursor && fx ? gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" }) : null;
          if (cursor) gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });

          cards.forEach((card) => {
            const tilt = card.closest<HTMLElement>("[data-fw-tilt]");
            const media = inner(card);
            if (fx && tilt) gsap.set(tilt, { transformPerspective: 900 });

            const rx = fx && tilt ? gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3" }) : null;
            const ry = fx && tilt ? gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3" }) : null;
            const mx = fx && media ? gsap.quickTo(media, "x", { duration: 0.6, ease: "power3" }) : null;
            const my = fx && media ? gsap.quickTo(media, "y", { duration: 0.6, ease: "power3" }) : null;

            const enter = (e: PointerEvent | FocusEvent) => {
              activateCard(root, cards, card);
              if (!fx) return;
              if (media) gsap.to(media, { scale: 1.14, duration: 0.8, ease: "power3.out", overwrite: "auto" });
              if (cursor && e instanceof PointerEvent) {
                cursor.style.background = card.style.getPropertyValue("--fw-fg");
                cursor.style.color = card.style.getPropertyValue("--fw-bg");
                if (gsap.getProperty(cursor, "autoAlpha") === 0) gsap.set(cursor, { x: e.clientX, y: e.clientY });
                gsap.to(cursor, { scale: 1, autoAlpha: 1, duration: 0.4, ease: "power3.out", overwrite: "auto" });
                card.style.cursor = "none";
              }
            };

            const move = (e: PointerEvent) => {
              const r = card.getBoundingClientRect();
              const nx = (e.clientX - r.left) / r.width - 0.5;
              const ny = (e.clientY - r.top) / r.height - 0.5;
              card.style.setProperty("--mx", `${(nx + 0.5) * 100}%`);
              card.style.setProperty("--my", `${(ny + 0.5) * 100}%`);
              ry?.(nx * 7);
              rx?.(-ny * 7);
              mx?.(-nx * 12);
              my?.(-ny * 12);
              qx?.(e.clientX);
              qy?.(e.clientY);
            };

            const leave = () => {
              deactivateCard(root, cards, card);
              card.style.cursor = "";
              if (!fx) return;
              rx?.(0);
              ry?.(0);
              mx?.(0);
              my?.(0);
              if (media) gsap.to(media, { scale: 1.08, duration: 0.8, ease: "power3.out", overwrite: "auto" });
              if (cursor) gsap.to(cursor, { scale: 0, autoAlpha: 0, duration: 0.3, ease: "power3.in", overwrite: "auto" });
            };

            const focusOn = () => activateCard(root, cards, card);
            const focusOff = () => deactivateCard(root, cards, card);

            card.addEventListener("pointerenter", enter);
            card.addEventListener("pointermove", move);
            card.addEventListener("pointerleave", leave);
            card.addEventListener("focus", focusOn);
            card.addEventListener("blur", focusOff);
            cleanups.push(() => {
              card.removeEventListener("pointerenter", enter);
              card.removeEventListener("pointermove", move);
              card.removeEventListener("pointerleave", leave);
              card.removeEventListener("focus", focusOn);
              card.removeEventListener("blur", focusOff);
              card.style.cursor = "";
              deactivateCard(root, cards, card);
            });
          });
        } else {
          // 2b. Touch: the card nearest the middle of the screen becomes active
          cards.forEach((card) => {
            const media = inner(card);
            ScrollTrigger.create({
              trigger: card,
              start: "center 65%",
              end: "center 35%",
              onToggle: (self) => {
                if (self.isActive) activateCard(root, cards, card);
                else deactivateCard(root, cards, card);
                if (fx && media) gsap.to(media, { scale: self.isActive ? 1.14 : 1.08, duration: 0.8, ease: "power3.out", overwrite: "auto" });
              },
            });
            cleanups.push(() => deactivateCard(root, cards, card));
          });
        }

        return () => cleanups.forEach((fn) => fn());
      }
    );

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, [curve, services]);

  return (
    <section
      ref={rootRef}
      id="services"
      data-hot="false"
      className="relative overflow-x-clip bg-[color:var(--fw-sbg,#ffffff)] px-4 py-[clamp(4rem,9vw,8rem)] text-[color:var(--fw-sfg,#0a0a0a)] transition-colors duration-700 ease-out motion-reduce:transition-none sm:px-6 lg:px-10"
    >
      <header className={`mx-auto mb-[clamp(2rem,5vw,4.5rem)] flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${WIDTH}`}>
        <h2 className="text-[clamp(2.25rem,1rem+4.5vw,5rem)] font-semibold leading-[0.95] tracking-tight">{PAGE_TITLE}</h2>
        <p className="max-w-sm text-[0.95rem] leading-relaxed opacity-65 md:text-base">
          {PAGE_INTRO}
        </p>
      </header>

      <ul className={`mx-auto grid grid-cols-1 items-start gap-x-[clamp(1.25rem,2.5vw,2.5rem)] gap-y-[clamp(1.5rem,5vw,4.5rem)] lg:grid-cols-2 lg:[&>li:nth-child(even)]:mt-[clamp(2.5rem,7vw,7rem)] ${WIDTH}`}>
        {services.map((service, i) => (
          <ServiceCard key={service.slug} service={service} index={i} />
        ))}
      </ul>

      <div className={`mx-auto mt-[clamp(2.5rem,6vw,5rem)] ${WIDTH}`}>
        <Link
          href={ctaHref}
          className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-current px-6 py-3 text-base font-medium outline-none transition-opacity duration-300 hover:opacity-85 focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-4"
        >
          <span className="inline-flex items-center gap-3 text-[color:var(--fw-sbg,#ffffff)]">
            <span aria-hidden="true" className="size-2 rounded-full bg-current" />
            <span>{ctaLabel}</span>
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            >
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984" />
            </svg>
          </span>
        </Link>
      </div>

      {/* "View" cursor bubble (mouse devices only, positioned by GSAP) */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 flex size-[84px] items-center justify-center rounded-full text-sm font-medium opacity-0 invisible"
      >
        View
      </div>
    </section>
  );
}

/* ================================================================== */
/*  7. PAGE (default export) – Lenis + section + styles                */
/* ================================================================== */
const CSS = `
@keyframes fw-drift-a { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(4%,-5%,0) scale(1.06); } }
@keyframes fw-drift-b { 0%,100% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(-5%,4%,0) rotate(8deg); } }
.fw-drift-a { animation: fw-drift-a 14s ease-in-out infinite; }
.fw-drift-b { animation: fw-drift-b 18s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .fw-drift-a, .fw-drift-b { animation: none; } }
`;

export default function Page() {
  // Single global Lenis instance driven by GSAP's ticker.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: false, anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      <style>{CSS}</style>
      <ServicesSection />
    </main>
  );
}