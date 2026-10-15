"use client";
/**
 * Navbar.tsx – Empire AE
 * Next.js 16 (App Router) · React 19 · Tailwind CSS v3.4+ / v4. No extra dependencies.
 * Matches the Services page: same palette, easing, radii, rolling titles and active-dot pattern.
 *
 * COLOUR FOLLOWING
 *  - The header reads the real background + text colour of whatever sits behind it and copies them
 *    into --nav-bg / --nav-fg. Logo, links, icons, hamburger and the Services dropdown all use
 *    those two variables, so when the Services section changes colour on card hover, the whole
 *    navbar follows it frame by frame.
 *  - Optional overrides: data-nav-theme="dark" | "light" on a section (use it on image/video heroes),
 *    and data-nav-skip on an element (e.g. each service <li>) so it is ignored when it scrolls
 *    under the header and the section colour behind it is used instead.
 *
 * Ideal: move SERVICES to a shared file (e.g. data/services.ts) and import it here and on the page.
 */
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";

/* ================================================================== */
/*  1. DATA  (same palette as the Services page)                       */
/* ================================================================== */
type Service = { slug: string; title: string; description: string; tags: string[]; href: string; bg: string; fg: string; accent: string };

const SERVICES: Service[] = [
  { slug: "web-design", title: "Web Design", description: "We create stunning, responsive websites that captivate visitors and elevate your brand.", tags: ["UI/UX Design", "Responsive", "Brand Identity"], href: "/services/web-design", bg: "#1a1411", fg: "#ffedd7", accent: "#e8a15a" },
  { slug: "web-development", title: "Web Development", description: "We build secure, scalable websites engineered for performance and growth.", tags: ["React / Next.js", "WordPress", "Laravel"], href: "/services/web-development", bg: "#121414", fg: "#ffffff", accent: "#3dd6c6" },
  { slug: "mobile-app-development", title: "Mobile App Development", description: "We develop powerful Android and iOS apps for seamless user experiences.", tags: ["Android", "iOS", "Flutter"], href: "/services/mobile-app-development", bg: "#E3E3F8", fg: "#000000", accent: "#7b7be8" },
  { slug: "hosting-domain", title: "Hosting & Domain", description: "We keep your website fast, secure, and online with reliable hosting solutions.", tags: ["SSL Security", "99.9% Uptime", "Daily Backups"], href: "/services/hosting-domain", bg: "#EFD5D3", fg: "#000000", accent: "#d8554f" },
  { slug: "digital-marketing", title: "Digital Marketing", description: "We boost visibility and attract customers through result-driven digital strategies.", tags: ["SEO", "Social Media", "Content Marketing"], href: "/services/digital-marketing", bg: "#111a13", fg: "#d9f3de", accent: "#5fbf7a" },
  { slug: "e-commerce-application", title: "E-Commerce Application", description: "We build seamless online stores that turn visitors into loyal customers.", tags: ["WooCommerce", "Payment Gateway", "Inventory"], href: "/services/e-commerce-application", bg: "#BFE3FA", fg: "#0a2540", accent: "#6cb8ee" },
  { slug: "software-application", title: "Software Application", description: "We create custom software that streamlines workflows and boosts productivity.", tags: ["ERP Systems", "CRM", "Custom Software"], href: "/services/software-application", bg: "#1a1411", fg: "#ffedd7", accent: "#e8a15a" },
  { slug: "seo", title: "SEO", description: "We improve search rankings, increase organic traffic, and grow your online reach.", tags: ["On-Page SEO", "Off-Page SEO", "Keywords"], href: "/services/seo", bg: "#121414", fg: "#ffffff", accent: "#3dd6c6" },
];

const LINKS = [
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  { label: "Works", href: "/works" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

type MenuItem = { key: string; text: string; cta: string; href: string; bg: string; fg: string; accent: string; stats?: [string, string][] };
const MENU: MenuItem[] = [
  {
    key: "Impact", cta: "Our Impact", href: "/impact", bg: "#1a1411", fg: "#ffedd7", accent: "#e8a15a",
    text: "Every innovation that happens here is out of a quest to get better at what we are already doing. We deliver ideas that make a difference and build ecosystems that foster progress.",
    stats: [["700+", "Projects launched successfully across the globe"], ["10M", "Daily customer engagement through our projects"], ["100+", "Digital transformation stories that made a difference"]],
  },
  { key: "Testimonials", cta: "Read testimonials", href: "/testimonials", bg: "#E3E3F8", fg: "#000000", accent: "#7b7be8", text: "Hear from the teams we've built with, in their own words." },
  { key: "Clients", cta: "Meet our clients", href: "/clients", bg: "#121414", fg: "#ffffff", accent: "#3dd6c6", text: "From ambitious start-ups to established enterprises, the brands that trust us with their next chapter." },
  { key: "Partnership", cta: "Partner with us", href: "/partnership", bg: "#EFD5D3", fg: "#000000", accent: "#d8554f", text: "Technology and strategic alliances that let us deliver more, together." },
  { key: "Insights", cta: "Read insights", href: "/insights", bg: "#111a13", fg: "#d9f3de", accent: "#5fbf7a", text: "Ideas, research and perspectives on design, technology and growth." },
  { key: "Contact", cta: "Start a conversation", href: "/contact", bg: "#BFE3FA", fg: "#0a2540", accent: "#6cb8ee", text: "Have a project in mind? Tell us what you're building and we'll get back within one working day." },
];

/* ================================================================== */
/*  2. COLOUR DETECTION                                                */
/* ================================================================== */
type RGB = [number, number, number];
type Tone = { bg: string; fg: string };
const DARK: Tone = { bg: "rgb(5 6 11)", fg: "rgb(255 255 255)" };
const LIGHT: Tone = { bg: "rgb(255 255 255)", fg: "rgb(10 10 10)" };

function parseColor(v: string): [number, number, number, number] | null {
  const isColorFn = v.startsWith("color(");
  const n = (isColorFn ? v.replace(/^color\(\s*[\w-]+/, "") : v).match(/-?\d*\.?\d+(?:e-?\d+)?/g)?.map(Number);
  if (!n || n.length < 3) return null;
  const k = isColorFn ? 255 : 1;
  return [n[0] * k, n[1] * k, n[2] * k, n[3] ?? 1];
}
const lin = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const lum = (c: RGB) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const contrast = (a: RGB, b: RGB) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
const css = (c: RGB) => `rgb(${Math.round(c[0])} ${Math.round(c[1])} ${Math.round(c[2])})`;

/** Reads the real background + text colour behind the header (centre of the screen, header midline). */
function detectTone(header: HTMLElement | null): Tone | null {
  if (!header) return null;
  const prev = header.style.pointerEvents;
  header.style.pointerEvents = "none";
  const hit = document.elementFromPoint(window.innerWidth / 2, 42);
  header.style.pointerEvents = prev;
  if (!hit || hit.closest("[data-nav-ignore]")) return null; // dropdown / menu open: keep current colours

  const tagged = hit.closest<HTMLElement>("[data-nav-theme]");
  if (tagged) return tagged.dataset.navTheme === "light" ? LIGHT : DARK;
  if (["IMG", "VIDEO", "CANVAS", "IFRAME"].includes(hit.tagName)) return DARK;

  const skip = hit.closest("[data-nav-skip]");
  let bg: RGB | null = null;
  let src: Element | null = null;
  const start: Element | null = skip ? skip.parentElement : hit;
  for (let n: Element | null = start; n; n = n.parentElement) {
    const cs = getComputedStyle(n);
    if (cs.backgroundImage.includes("url(")) return DARK;
    const c = parseColor(cs.backgroundColor);
    if (c && c[3] >= 0.5) {
      bg = [c[0], c[1], c[2]];
      src = n;
      break;
    }
  }
  if (!bg) {
    bg = [255, 255, 255];
    src = start;
  }
  let fg: RGB | null = null;
  if (src) {
    const c = parseColor(getComputedStyle(src).color);
    if (c) fg = [c[0], c[1], c[2]];
  }
  if (!fg || contrast(fg, bg) < 3) fg = lum(bg) > 0.4 ? [10, 10, 10] : [255, 255, 255];
  return { bg: css(bg), fg: css(fg) };
}

/* ================================================================== */
/*  3. SMALL PIECES                                                    */
/* ================================================================== */
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const INK = "text-[color:var(--nav-fg)]";
const SOFT = "text-[color:color-mix(in_srgb,var(--nav-fg)_62%,transparent)] hover:text-[color:var(--nav-fg)]";

const Icon = ({ d, className = "size-5", sw = 1.8 }: { d: string; className?: string; sw?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d={d} />
  </svg>
);

/** Letter-by-letter roll, same effect as the Services cards. */
const ROLL_HOVER = "group-hover:-translate-y-1/2 group-focus-visible:-translate-y-1/2";
const ROLL_ACTIVE = "group-data-[active=true]:-translate-y-1/2";
function RollingTitle({ text, on }: { text: string; on: "hover" | "active" }) {
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
                      className={`block transition-transform duration-500 ${EASE} ${on === "hover" ? ROLL_HOVER : ROLL_ACTIVE} motion-reduce:transition-none`}
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

function Art({ s }: { s: Service }) {
  const soft = `color-mix(in srgb, ${s.fg} 22%, transparent)`;
  return (
    <div className="relative size-full overflow-hidden" style={{ backgroundColor: s.bg }} aria-hidden="true">
      <div className="absolute -left-[8%] -top-[30%] size-[70%] rounded-full blur-xl" style={{ background: `radial-gradient(circle at 35% 35%, ${s.accent}, transparent 65%)` }} />
      <div className="absolute left-[45%] top-[20%] size-[65%] rounded-full opacity-70 blur-2xl" style={{ background: `radial-gradient(circle at 35% 35%, color-mix(in srgb, ${s.accent} 60%, ${s.fg}), transparent 65%)` }} />
      <div className="absolute left-1/2 top-1/2 aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full border" style={{ borderColor: soft, boxShadow: `0 0 0 12px ${soft}` }} />
    </div>
  );
}

function CountUp({ value, run }: { value: string; run: boolean }) {
  const [text, setText] = useState(value);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setText(value);
    const num = parseFloat(value);
    const suffix = value.replace(/[\d.]/g, "");
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      setText(Math.round(num * (1 - Math.pow(1 - p, 3))) + suffix);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, value]);
  return <>{text}</>;
}

const Arrow = ({ className = "size-4" }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className={className}>
    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984" />
  </svg>
);

/* ================================================================== */
/*  4. NAVBAR                                                          */
/* ================================================================== */
export default function Navbar() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const headerRef = useRef<HTMLElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const servicesBtn = useRef<HTMLButtonElement>(null);

  const later = (fn: () => void, ms: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  };
  const keepOpen = () => clearTimeout(timer.current);

  /* ---- sticky header: follow the colour behind it, live ---- */
  useEffect(() => {
    const header = headerRef.current;
    let raf = 0;
    let loop = 0;
    let until = 0;

    const apply = () => {
      const t = detectTone(header);
      if (t && header) {
        header.style.setProperty("--nav-bg", t.bg);
        header.style.setProperty("--nav-fg", t.fg);
      }
    };
    const schedule = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          apply();
        });
    };
    const frame = (now: number) => {
      apply();
      loop = now < until ? requestAnimationFrame(frame) : 0;
    };
    // When a section's colour transitions (e.g. hovering a service card), sample every frame.
    const follow = (e: Event) => {
      const t = e.target as Element | null;
      if (!(e as TransitionEvent).propertyName?.includes("color")) return;
      if (t?.closest?.("header, [data-nav-ignore]")) return;
      until = performance.now() + 900;
      if (!loop) loop = requestAnimationFrame(frame);
    };
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      schedule();
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("load", schedule);
    document.addEventListener("transitionrun", follow, true);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(loop);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      document.removeEventListener("transitionrun", follow, true);
    };
  }, []);

  /* ---- esc, scroll lock, focus ---- */
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    burger.current?.focus();
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (menuOpen) closeMenu();
      else if (megaOpen) {
        setMegaOpen(false);
        servicesBtn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, megaOpen, closeMenu]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (!menuOpen) return;
    const id = setTimeout(() => closeBtn.current?.focus(), 350);
    return () => clearTimeout(id);
  }, [menuOpen]);

  const openMenu = () => {
    setMegaOpen(false);
    setActive(0);
    setMenuOpen(true);
  };
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ prev: false, next: true });
  const updateArrows = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ prev: el.scrollLeft > 4, next: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  }, []);
  const slide = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.6, behavior: "smooth" });
  useEffect(() => {
    if (megaOpen) updateArrows();
  }, [megaOpen, updateArrows]);

  const cur = MENU[active];

  const navLink = `flex items-center gap-1.5 rounded-full px-4 py-2.5 text-base font-medium tracking-tight transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-current ${SOFT}`;
  const iconBtn = `grid size-11 place-items-center rounded-full transition-colors duration-300 hover:bg-[color-mix(in_srgb,currentColor_12%,transparent)] ${INK}`;

  return (
    <>
      {/* ============ Header (sticky, colour-following) ============ */}
      <header
        ref={headerRef}
        className={[
          "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] [--nav-bg:#ffffff] [--nav-fg:#0a0a0a]",
          "transition-[background-color,border-color] duration-300 ease-out",
          scrolled
            ? "border-b border-[color-mix(in_srgb,var(--nav-fg)_12%,transparent)] bg-[color-mix(in_srgb,var(--nav-bg)_78%,transparent)] backdrop-blur-xl"
            : "border-b border-transparent",
        ].join(" ")}
      >
        <div className={`mx-auto flex h-[72px] max-w-[1440px] items-center gap-8 px-5 transition-colors duration-200 sm:px-8 lg:h-[84px] lg:px-14 ${INK}`}>
          <Link href="/" aria-label="Empire AE home" className={`flex items-center gap-2.5 text-[1.7rem] font-semibold tracking-tight ${INK}`}>
            empire
          </Link>

          <nav aria-label="Primary" className="mx-auto hidden lg:block">
            <ul className="flex items-center gap-0.5" onMouseLeave={() => later(() => setMegaOpen(false), 160)} onMouseEnter={keepOpen}>
              <li>
                <button
                  ref={servicesBtn}
                  type="button"
                  aria-expanded={megaOpen}
                  aria-controls="services-mega"
                  onClick={() => setMegaOpen((o) => !o)}
                  onMouseEnter={() => later(() => setMegaOpen(true), 90)}
                  className={`${navLink} ${megaOpen ? "!text-[color:var(--nav-fg)]" : ""}`}
                >
                  Services
                  <Icon d="m6 9 6 6 6-6" className={`size-3.5 transition-transform duration-500 ${megaOpen ? "rotate-180" : ""}`} sw={2} />
                </button>
              </li>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={navLink} onMouseEnter={() => later(() => setMegaOpen(false), 120)}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            <a href="tel:+0000000000" aria-label="Call us" className={`${iconBtn} hidden xl:grid`}>
              <Icon d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" className="size-[22px]" sw={1.6} />
            </a>
            <button type="button" aria-label="Search" className={iconBtn}>
              <Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4" className="size-[22px]" />
            </button>
            <button type="button" aria-label="Saved" className={`${iconBtn} hidden xl:grid`}>
              <Icon d="M6 3h12v18l-6-4-6 4Z" className="size-[22px]" />
            </button>


            <button ref={burger} type="button" onClick={openMenu} aria-label="Open menu" aria-haspopup="dialog" className={`group ml-1.5 grid size-12 place-content-center rounded-full ${INK}`}>
              <span className="block h-0.5 w-[30px] rounded bg-current" />
              <span className="ml-auto mt-[7px] block h-0.5 w-[22px] rounded bg-current transition-all duration-500 group-hover:w-[30px]" />
            </button>
          </div>
        </div>

        {/* ============ Services dropdown (follows screen colour; cards take their service colour on hover) ============ */}
        <div
          id="services-mega"
          onMouseEnter={keepOpen}
          onMouseLeave={() => later(() => setMegaOpen(false), 160)}
          className={`absolute inset-x-0 top-full hidden px-5 sm:px-8 lg:block lg:px-14 ${megaOpen ? "visible" : "pointer-events-none invisible"}`}
        >
          <div
            className={[
              "mx-auto max-h-[calc(100vh-110px)] max-w-[1328px] overflow-y-auto rounded-[1.4rem] border p-2.5 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.45)]",
              "border-[color-mix(in_srgb,var(--nav-fg)_14%,transparent)] bg-[var(--nav-bg)] text-[color:var(--nav-fg)]",
              `transition-[clip-path,opacity,transform,background-color,color] duration-[550ms] ${EASE}`,
              megaOpen ? "translate-y-0 opacity-100 [clip-path:inset(0_0_0_0_round_1.4rem)]" : "-translate-y-2 opacity-0 [clip-path:inset(0_0_100%_0_round_1.4rem)]",
            ].join(" ")}
          >
            <ul ref={track} data-lenis-prevent onScroll={updateArrows} className="-my-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-0.5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&:has(a:hover)_a:not(:hover)]:opacity-50">
              {SERVICES.map((s, i) => (
                <li
                  key={s.slug}
                  className={`w-[29%] shrink-0 snap-start transition-[opacity,transform] duration-500 ${EASE} ${megaOpen ? "translate-y-0 opacity-100" : "translate-y-3.5 opacity-0"}`}
                  style={{ transitionDelay: megaOpen ? `${100 + i * 45}ms` : "0ms" }}
                >
                  <Link
                    href={s.href}
                    style={{ "--c-bg": s.bg, "--c-fg": s.fg } as CSSProperties}
                    className={`group block rounded-[1.1rem] bg-[color-mix(in_srgb,currentColor_7%,transparent)] p-1.5 ring-1 ring-transparent outline-none transition-[background-color,color,transform,box-shadow,opacity] duration-500 ${EASE} hover:scale-[1.02] hover:bg-[var(--c-bg)] hover:text-[color:var(--c-fg)] hover:shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55)] hover:ring-[color-mix(in_srgb,var(--c-fg)_22%,transparent)] focus-visible:bg-[var(--c-bg)] focus-visible:text-[color:var(--c-fg)] focus-visible:ring-[color-mix(in_srgb,var(--c-fg)_40%,transparent)]`}
                  >
                    <div className="aspect-[5/2] overflow-hidden rounded-[0.7rem]">
                      <Art s={s} />
                    </div>
                    <div className="px-2 pb-1 pt-2.5">
                      <p className="text-[0.7rem] leading-snug opacity-70">{s.tags.join(" • ")}</p>
                      <div className="relative mt-1 text-[1.05rem] font-medium leading-tight tracking-tight">
                        <span aria-hidden="true" className={`absolute left-0 top-[0.6em] size-[0.5em] -translate-x-3 -translate-y-1/2 rounded-full bg-current opacity-0 transition-[transform,opacity] duration-500 ${EASE} group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100`} />
                        <div className={`w-[calc(100%-0.85em)] transition-transform duration-500 ${EASE} group-hover:translate-x-[0.85em] group-focus-visible:translate-x-[0.85em]`}>
                          <RollingTitle text={s.title} on="hover" />
                        </div>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[0.78rem] leading-relaxed opacity-70">{s.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between px-3 pb-1.5 pt-3">
              <Link href="/services" className="group inline-flex items-center gap-2 text-sm font-medium opacity-80 outline-none transition-opacity hover:opacity-100 focus-visible:opacity-100">
                View all services <Arrow className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <div className="flex gap-2">
                <button type="button" onClick={() => slide(-1)} disabled={!edge.prev} aria-label="Previous services" className="grid size-10 place-items-center rounded-full border border-[color-mix(in_srgb,currentColor_25%,transparent)] transition-[opacity,background-color] duration-300 hover:bg-[color-mix(in_srgb,currentColor_12%,transparent)] disabled:pointer-events-none disabled:opacity-30">
                  <Icon d="m15 6-6 6 6 6" className="size-[18px]" />
                </button>
                <button type="button" onClick={() => slide(1)} disabled={!edge.next} aria-label="Next services" className="grid size-10 place-items-center rounded-full border border-[color-mix(in_srgb,currentColor_25%,transparent)] transition-[opacity,background-color] duration-300 hover:bg-[color-mix(in_srgb,currentColor_12%,transparent)] disabled:pointer-events-none disabled:opacity-30">
                  <Icon d="m9 6 6 6-6 6" className="size-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* click-away scrim */}
      <div data-nav-ignore onClick={() => setMegaOpen(false)} className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${megaOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} />

      {/* ============ Right-side half-page menu (palette changes per item, like the Services section) ============ */}
      {/* dim + blur backdrop, click to close */}
      <div
        data-nav-ignore
        onClick={closeMenu}
        aria-hidden="true"
        className={`fixed inset-0 z-[99] bg-black/45 backdrop-blur-[3px] transition-opacity duration-500 ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      {/* panel: full width on phones, 75% small tablets, 60% tablets, half the screen on desktop */}
      <aside
        data-nav-ignore
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        style={{ "--m-bg": cur.bg, "--m-fg": cur.fg } as CSSProperties}
        className={[
          "fixed inset-y-0 right-0 z-[100] flex w-full max-w-[960px] flex-col overflow-hidden bg-[var(--m-bg)] text-[color:var(--m-fg)] shadow-[-40px_0_90px_-30px_rgba(0,0,0,0.5)] sm:w-[75vw] md:w-[60vw] lg:w-1/2 sm:rounded-l-[1.4rem]",
          menuOpen
            ? "visible translate-x-0 [transition:transform_700ms_cubic-bezier(.22,1,.36,1),background-color_700ms_ease-out,color_700ms_ease-out,visibility_0s]"
            : "invisible translate-x-full [transition:transform_600ms_cubic-bezier(.22,1,.36,1),background-color_700ms_ease-out,color_700ms_ease-out,visibility_0s_linear_600ms]",
        ].join(" ")}
      >
        {/* soft shade that cross-fades with each item */}
        {MENU.map((m, i) => (
          <div
            key={m.key}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${active === i ? "opacity-100" : "opacity-0"}`}
            style={{ background: `radial-gradient(120% 70% at 90% 100%, color-mix(in srgb, ${m.accent} 28%, transparent), transparent 62%)` }}
          />
        ))}

        {/* top row */}
        <div className="relative z-10 shrink-0 pt-[env(safe-area-inset-top)]">
          <div className="flex h-[72px] items-center justify-between px-6 sm:px-10 lg:h-[84px]">
            <Link href="/" onClick={closeMenu} className="text-[1.7rem] font-semibold tracking-tight">
              empire
            </Link>
            <button
              ref={closeBtn}
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="grid size-12 place-items-center rounded-full bg-[color-mix(in_srgb,currentColor_14%,transparent)] outline-none transition-[transform,background-color] duration-500 hover:rotate-90 hover:bg-[color-mix(in_srgb,currentColor_24%,transparent)] focus-visible:ring-2 focus-visible:ring-current"
            >
              <Icon d="M5 5l14 14M19 5 5 19" className="size-[22px]" />
            </button>
          </div>
        </div>

        {/* link list – fixed in place, never scrolls away */}
        <ul className="relative z-10 flex shrink-0 flex-col gap-px px-6 pt-2 sm:px-10">
          {MENU.map((m, i) => (
            <li
              key={m.key}
              className={`transition-[opacity,transform] duration-700 ${EASE} ${menuOpen ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
              style={{ transitionDelay: menuOpen ? `${250 + i * 60}ms` : "0ms" }}
            >
              <button
                type="button"
                aria-current={active === i}
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                className={`block w-full py-1 text-left text-[clamp(1.15rem,0.9rem+0.8vw,1.55rem)] font-medium leading-[1.2] tracking-tight outline-none transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
              >
                {m.key}
              </button>
            </li>
          ))}
        </ul>

        {/* details for the selected item – own scroll area, shown in full */}
        <div data-lenis-prevent className="relative mt-5 min-h-0 flex-1 overflow-y-auto border-t border-[color-mix(in_srgb,currentColor_16%,transparent)] px-6 pb-10 pt-6 sm:px-10">
          <div className="grid">
            {MENU.map((m, i) => (
              <section key={m.key} aria-hidden={active !== i} className={`col-start-1 row-start-1 transition-[opacity,transform] duration-[600ms] ${EASE} ${active === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}>
                <h2 className="mb-3 text-[clamp(1.5rem,1rem+1.4vw,2.2rem)] font-semibold leading-tight tracking-tight">{m.key === "Impact" ? "Our Impact" : m.key}</h2>
                <p className="mb-6 max-w-[46ch] text-[clamp(0.95rem,0.88rem+0.3vw,1.1rem)] leading-relaxed opacity-75">{m.text}</p>
                {m.stats && (
                  <div className="mb-6 grid grid-cols-3 gap-4 sm:gap-6">
                    {m.stats.map(([n, label]) => (
                      <div key={n}>
                        <b className="mb-2 block text-[clamp(1.5rem,1rem+1.5vw,2.25rem)] font-light leading-none tracking-tight">
                          <CountUp value={n} run={menuOpen && active === i} />
                        </b>
                        <span className="block text-[0.8rem] leading-snug opacity-70 sm:text-sm">{label}</span>
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  href={m.href}
                  onClick={closeMenu}
                  tabIndex={active === i ? 0 : -1}
                  className="group inline-flex min-h-11 items-center gap-3 rounded-full bg-[var(--m-fg)] px-5 py-2.5 text-[0.95rem] font-medium outline-none transition-opacity duration-300 hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[var(--m-fg)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--m-bg)]"
                >
                  <span className="inline-flex items-center gap-3 text-[color:var(--m-bg)]">
                    <span aria-hidden="true" className="size-2 rounded-full bg-current" />
                    {m.cta}
                    <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </section>
            ))}
          </div>

          {/* primary pages, for screens where the top links are hidden */}
          <div className="mt-8 flex flex-wrap gap-2 lg:hidden">
            {[{ label: "Services", href: "/services" }, ...LINKS].map((l) => (
              <Link key={l.href} href={l.href} onClick={closeMenu} className="rounded-full border border-[color-mix(in_srgb,currentColor_28%,transparent)] px-4 py-2 text-sm font-medium">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
