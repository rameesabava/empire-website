"use client";
/**
 * Navbar.tsx – Empire AE
 * Next.js 16 (App Router) · React 19 · Tailwind CSS v3.4+ / v4. No extra dependencies.
 * Matches the Services page: same palette, easing, radii, rolling titles.
 *
 * LAYOUT
 *  - Desktop (lg and up): Services, Our Team, Works, About, Careers, Contact sit in the bar,
 *    and Services opens the card panel.
 *  - Phones and tablets (below lg): the links are replaced by a menu icon. Tapping it opens a list
 *    of all headings. "Services" expands to show every service; the other rows are plain links.
 *  - Search: the search button opens a panel that searches services and pages.
 *    Shortcut: Ctrl/Cmd + K. Arrow keys move through results, Enter opens one, Esc closes.
 *
 * LOGO
 *  - Put your logo file in  public/  and change the LOGO object in section 3.
 *
 * WHATSAPP
 *  - The phone icon in the header opens a WhatsApp chat.
 *  - Change the number and the pre-filled message in the WHATSAPP object in section 1 below.
 *    Number = country code + number, digits only (no "+", spaces or dashes). Example: 919999999999
 *
 * SEARCH
 *  - Add or edit searchable pages in the PAGES list in section 1. Services are searched
 *    automatically from SERVICES (title, tags and description).
 *
 * COLOUR FOLLOWING
 *  - The header reads the real background + text colour of whatever sits behind it and copies them
 *    into --nav-bg / --nav-fg. Logo, links, icons, the Services panel and the search panel all use
 *    those two variables.
 *  - Optional overrides: data-nav-theme="dark" | "light" on a section (use it on image/video heroes),
 *    and data-nav-skip on an element (e.g. each service <li>) so it is ignored when it scrolls
 *    under the header and the section colour behind it is used instead.
 *
 * Ideal: move SERVICES to a shared file (e.g. data/services.ts) and import it here and on the page.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
  { label: "Our Team", href: "/team" },
  { label: "Works", href: "/works" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

/** Pages that the search panel can find (services are added automatically). */
const PAGES = [
  { title: "All services", sub: "Everything we offer", href: "/services" },
  { title: "Our Team", sub: "The people behind our work", href: "/team" },
  { title: "Works", sub: "Selected projects and case studies", href: "/works" },
  { title: "About", sub: "Who we are and how we work", href: "/about" },
  { title: "Careers", sub: "Open roles at Empire AE", href: "/careers" },
  { title: "Contact", sub: "Start a project or ask a question", href: "/contact" },
  { title: "Our Impact", sub: "The numbers behind our projects", href: "/impact" },
  { title: "Testimonials", sub: "What clients say about us", href: "/testimonials" },
  { title: "Clients", sub: "Brands we work with", href: "/clients" },
  { title: "Partnership", sub: "Technology and strategic alliances", href: "/partnership" },
  { title: "Insights", sub: "Ideas and research on design and technology", href: "/insights" },
];

/**
 * WHATSAPP – the phone icon in the header opens this chat.
 *  number:  country code + number, digits only (no "+", spaces or dashes)
 *  message: text that is pre-filled in the chat box (the visitor can edit it)
 */
const WHATSAPP = { number: "919999999999", message: "Hi Empire AE, I'd like to discuss a project." };
const WHATSAPP_URL = `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(WHATSAPP.message)}`;

/* ---- search index ---- */
type Hit = { title: string; sub: string; kind: "Service" | "Page"; href: string; hay: string };
const INDEX: Hit[] = [
  ...SERVICES.map<Hit>((s) => ({ title: s.title, sub: s.tags.join(" • "), kind: "Service", href: s.href, hay: `${s.title} ${s.tags.join(" ")} ${s.description}`.toLowerCase() })),
  ...PAGES.map<Hit>((p) => ({ title: p.title, sub: p.sub, kind: "Page", href: p.href, hay: `${p.title} ${p.sub}`.toLowerCase() })),
];
const SUGGESTED = ["Web Design", "Web Development", "Mobile App Development", "SEO", "Works", "Contact"]
  .map((t) => INDEX.find((h) => h.title === t))
  .filter((h): h is Hit => Boolean(h));

function runSearch(q: string): Hit[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return SUGGESTED;
  return INDEX.map((h) => {
    if (!terms.every((t) => h.hay.includes(t))) return { h, score: 0 };
    const title = h.title.toLowerCase();
    return { h, score: terms.reduce((n, t) => n + (title.startsWith(t) ? 3 : title.includes(t) ? 2 : 1), 0) };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((r) => r.h);
}

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
  if (!hit || hit.closest("[data-nav-ignore]")) return null; // dropdown / search open: keep current colours

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
const ON = "!text-[color:var(--nav-fg)]";

/**
 * LOGO – edit these three values to change the logo.
 *  src:     the file inside the /public folder
 *  alt:     text for screen readers
 *  recolor: true  -> the logo takes the navbar's current text colour (white on dark sections,
 *                    black on light ones). Best for one-colour logos.
 *           false -> the logo keeps its own original colours.
 */
const LOGO = { src: "images/logo.png", alt: "Empire AE", recolor: true };

function Logo() {
  // Height of the logo. The width follows automatically from the logo's shape.
  const size = "h-15 w-auto sm:h-16 lg:h-17";
  if (!LOGO.recolor) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={LOGO.src} alt={LOGO.alt} className={`block ${size}`} />;
  }

  return (
    <span className="relative inline-block">
      {/* Invisible copy of the logo: it only gives the box its size (and the alt text). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO.src} alt={LOGO.alt} className={`block opacity-0 ${size}`} />

      {/* Same logo used as a stencil, filled with the current text colour. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-current"
        style={{
          WebkitMaskImage: `url(${LOGO.src})`,
          maskImage: `url(${LOGO.src})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "left center",
          maskPosition: "left center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </span>
  );
}

const Icon = ({ d, className = "size-5", sw = 1.8 }: { d: string; className?: string; sw?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d={d} />
  </svg>
);

/** Letter-by-letter roll on hover, same effect as the Services cards. */
const ROLL_HOVER = "group-hover:-translate-y-1/2 group-focus-visible:-translate-y-1/2";
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
                      className={`block transition-transform duration-500 ${EASE} ${ROLL_HOVER} motion-reduce:transition-none`}
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

const Arrow = ({ className = "size-4" }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className={className}>
    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2.343 8h11.314m0 0L8.673 3.016M13.657 8l-4.984 4.984" />
  </svg>
);

/** Runs `fn` only for a real mouse (so touch taps don't trigger hover behaviour). */
const mouseOnly = (fn: () => void) => (e: PointerEvent) => {
  if (e.pointerType === "mouse") fn();
};

/* ================================================================== */
/*  4. NAVBAR                                                          */
/* ================================================================== */
export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobSvc, setMobSvc] = useState(false);
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const headerRef = useRef<HTMLElement>(null);
  const servicesBtn = useRef<HTMLButtonElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const searchBtn = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const later = (fn: () => void, ms: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  };
  const keepOpen = () => clearTimeout(timer.current);

  const results = useMemo(() => runSearch(query), [query]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

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

  /* ---- open / close helpers ---- */
  const closeSearch = useCallback((refocus = false) => {
    setSearchOpen(false);
    setQuery("");
    setSel(0);
    if (refocus) searchBtn.current?.focus();
  }, []);

  const closeMenu = useCallback((refocus = false) => {
    setMenuOpen(false);
    setMobSvc(false);
    if (refocus) burger.current?.focus();
  }, []);

  const closeAll = useCallback(() => {
    setMegaOpen(false);
    closeSearch();
    closeMenu();
  }, [closeSearch, closeMenu]);

  const toggleMega = () => {
    closeSearch();
    setMegaOpen((o) => !o);
  };
  const openMega = () => {
    closeSearch();
    setMegaOpen(true);
  };
  const toggleMenu = () => {
    setMegaOpen(false);
    closeSearch();
    if (menuOpen) closeMenu();
    else setMenuOpen(true);
  };
  const toggleSearch = () => {
    setMegaOpen(false);
    closeMenu();
    if (searchOpen) closeSearch();
    else setSearchOpen(true);
  };

  // Close everything after navigating to another page
  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  // Close the mobile menu if the window grows into the desktop layout
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => {
      if (mq.matches) closeMenu();
    };
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [closeMenu]);

  // Focus the search box when it opens
  useEffect(() => {
    if (!searchOpen) return;
    const id = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(id);
  }, [searchOpen]);

  // Esc closes; Ctrl/Cmd + K toggles search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMegaOpen(false);
        setMenuOpen(false);
        setMobSvc(false);
        setSearchOpen((o) => {
          if (o) {
            setQuery("");
            setSel(0);
          }
          return !o;
        });
        return;
      }
      if (e.key !== "Escape") return;
      if (menuOpen) closeMenu(true);
      else if (searchOpen) closeSearch(true);
      else if (megaOpen) {
        setMegaOpen(false);
        servicesBtn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, searchOpen, megaOpen, closeMenu, closeSearch]);

  /* ---- search interactions ---- */
  const go = (h: Hit | undefined) => {
    if (!h) return;
    router.push(h.href);
    closeSearch();
  };
  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => (results.length ? (s + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => (results.length ? (s - 1 + results.length) % results.length : 0));
    }
  };

  /* ---- services slider arrows ---- */
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

  const linkBase = `flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium tracking-tight transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-current ${SOFT}`;
  const navLink = `${linkBase} px-4 py-2.5 text-base`;
  const navLinkMobile = `${linkBase} shrink-0 px-3.5 py-2 text-[0.95rem]`;
  const mobRow = "flex w-full min-h-12 items-center justify-between gap-3 rounded-[0.9rem] px-3 py-3 text-left text-[1.15rem] font-medium tracking-tight outline-none transition-colors duration-200 hover:bg-[color-mix(in_srgb,currentColor_8%,transparent)] focus-visible:bg-[color-mix(in_srgb,currentColor_10%,transparent)]";
  const mobSub = "flex min-h-11 items-center gap-3 rounded-[0.8rem] py-2.5 pl-6 pr-3 text-base tracking-tight opacity-80 outline-none transition-[background-color,opacity] duration-200 hover:bg-[color-mix(in_srgb,currentColor_8%,transparent)] hover:opacity-100 focus-visible:bg-[color-mix(in_srgb,currentColor_10%,transparent)] focus-visible:opacity-100";
  const iconBtn = `grid size-11 place-items-center rounded-full transition-colors duration-300 hover:bg-[color-mix(in_srgb,currentColor_12%,transparent)] ${INK}`;

  const panel = [
    "mx-auto overflow-y-auto rounded-[1.4rem] border p-2.5 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.45)]",
    "border-[color-mix(in_srgb,var(--nav-fg)_14%,transparent)] bg-[var(--nav-bg)] text-[color:var(--nav-fg)]",
    `transition-[clip-path,opacity,transform,background-color,color] duration-[550ms] ${EASE}`,
  ].join(" ");
  const panelOpen = "translate-y-0 opacity-100 [clip-path:inset(0_0_0_0_round_1.4rem)]";
  const panelShut = "-translate-y-2 opacity-0 [clip-path:inset(0_0_100%_0_round_1.4rem)]";

  return (
    <>
      {/* ============ Header (sticky, colour-following) ============ */}
      <header
        ref={headerRef}
        className={[
          "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] [--nav-bg:#ffffff] [--nav-fg:#0a0a0a]",
          "transition-[background-color,border-color] duration-300 ease-out",
          scrolled || megaOpen || searchOpen || menuOpen
            ? "border-b border-[color-mix(in_srgb,var(--nav-fg)_12%,transparent)] bg-[color-mix(in_srgb,var(--nav-bg)_78%,transparent)] backdrop-blur-xl"
            : "border-b border-transparent",
        ].join(" ")}
      >
        <div className={`mx-auto flex h-[72px] max-w-[1440px] items-center gap-8 px-5 transition-colors duration-200 sm:px-8 lg:h-[84px] lg:px-14 ${INK}`}>
          {/* Logo */}
          <Link href="/" aria-label="Empire AE home" className={`flex items-center ${INK}`}>
            <Logo />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Primary" className="mx-auto hidden lg:block">
            <ul className="flex items-center gap-0.5" onPointerLeave={mouseOnly(() => later(() => setMegaOpen(false), 160))} onPointerEnter={mouseOnly(keepOpen)}>
              <li>
                <button
                  ref={servicesBtn}
                  type="button"
                  aria-expanded={megaOpen}
                  aria-controls="services-mega"
                  onClick={toggleMega}
                  onPointerEnter={mouseOnly(() => later(openMega, 90))}
                  className={`${navLink} ${megaOpen || isActive("/services") ? ON : ""}`}
                >
                  Services
                  <Icon d="m6 9 6 6 6-6" className={`size-3.5 transition-transform duration-500 ${megaOpen ? "rotate-180" : ""}`} sw={2} />
                </button>
              </li>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`${navLink} ${isActive(l.href) ? ON : ""}`}
                    onPointerEnter={mouseOnly(() => later(() => setMegaOpen(false), 120))}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            {/* Phone icon -> opens a WhatsApp chat in a new tab (number + message set in WHATSAPP above) */}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className={iconBtn}>
              <Icon d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" className="size-[22px]" sw={1.6} />
            </a>
            <button
              ref={searchBtn}
              type="button"
              onClick={toggleSearch}
              aria-label={searchOpen ? "Close search" : "Search"}
              aria-expanded={searchOpen}
              aria-controls="site-search"
              className={iconBtn}
            >
              <Icon d={searchOpen ? "M5 5l14 14M19 5 5 19" : "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4"} className="size-[22px]" />
            </button>

            {/* Menu icon: phones and tablets only */}
            <button
              ref={burger}
              type="button"
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={`${iconBtn} lg:hidden`}
            >
              <span aria-hidden="true" className="relative block h-4 w-[22px]">
                <span className={`absolute left-0 top-0 h-0.5 w-full rounded bg-current transition-transform duration-500 ${EASE} ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-[7px] h-0.5 w-full rounded bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 top-[14px] h-0.5 w-full rounded bg-current transition-transform duration-500 ${EASE} ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>

        {/* ============ Mobile menu (below lg): every heading in a list ============ */}
        <div id="mobile-menu" className={`absolute inset-x-0 top-full block px-3 sm:px-8 lg:hidden ${menuOpen ? "visible" : "pointer-events-none invisible"}`}>
          <nav aria-label="Mobile" className={[panel, "max-h-[calc(100dvh-100px)] max-w-[560px] sm:ml-auto sm:mr-0", menuOpen ? panelOpen : panelShut].join(" ")}>
            <ul data-lenis-prevent>
              <li>
                <button
                  type="button"
                  aria-expanded={mobSvc}
                  aria-controls="mobile-services"
                  onClick={() => setMobSvc((o) => !o)}
                  className={`${mobRow} ${mobSvc || isActive("/services") ? "" : "opacity-90"}`}
                >
                  Services
                  <Icon d="m6 9 6 6 6-6" className={`size-4 transition-transform duration-500 ${mobSvc ? "rotate-180" : ""}`} sw={2} />
                </button>
                <div id="mobile-services" className={`grid transition-[grid-template-rows] duration-500 ${EASE} ${mobSvc ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <ul className="min-h-0 overflow-hidden" inert={!mobSvc}>
                    {SERVICES.map((s) => (
                      <li key={s.slug}>
                        <Link href={s.href} onClick={closeAll} className={mobSub}>
                          <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: s.accent }} />
                          {s.title}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href="/services" onClick={closeAll} className={`${mobSub} font-medium`}>
                        View all services
                        <Arrow className="size-3.5" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={closeAll} aria-current={isActive(l.href) ? "page" : undefined} className={`${mobRow} ${isActive(l.href) ? "bg-[color-mix(in_srgb,currentColor_8%,transparent)]" : "opacity-90"}`}>
                    {l.label}
                    <Arrow className="size-4 opacity-60" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ============ Services dropdown (follows screen colour; cards take their service colour on hover) ============ */}
        <div
          id="services-mega"
          onPointerEnter={mouseOnly(keepOpen)}
          onPointerLeave={mouseOnly(() => later(() => setMegaOpen(false), 160))}
          className={`absolute inset-x-0 top-full hidden px-5 sm:px-8 lg:block lg:px-14 ${megaOpen ? "visible" : "pointer-events-none invisible"}`}
        >
          <div className={[panel, "max-h-[calc(100dvh-140px)] max-w-[1328px]", megaOpen ? panelOpen : panelShut].join(" ")}>
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
                          <RollingTitle text={s.title} />
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

        {/* ============ Search panel ============ */}
        <div id="site-search" className={`absolute inset-x-0 top-full block px-3 sm:px-8 lg:px-14 ${searchOpen ? "visible" : "pointer-events-none invisible"}`}>
          <div role="dialog" aria-label="Search" className={[panel, "max-h-[calc(100dvh-140px)] max-w-[760px]", searchOpen ? panelOpen : panelShut].join(" ")}>
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                go(results[sel]);
              }}
              className="flex items-center gap-3 rounded-[1.1rem] bg-[color-mix(in_srgb,currentColor_7%,transparent)] pl-4 pr-2 focus-within:ring-2 focus-within:ring-[color-mix(in_srgb,currentColor_35%,transparent)]"
            >
              <Icon d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4" className="size-5 shrink-0 opacity-70" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSel(0);
                }}
                onKeyDown={onSearchKey}
                placeholder="Search services and pages"
                aria-label="Search services and pages"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="go"
                className="h-14 w-full bg-transparent text-base outline-none placeholder:text-current placeholder:opacity-50 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    setSel(0);
                    inputRef.current?.focus();
                  }}
                  className="grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300 hover:bg-[color-mix(in_srgb,currentColor_12%,transparent)]"
                >
                  <Icon d="M5 5l14 14M19 5 5 19" className="size-[18px]" />
                </button>
              )}
            </form>

            <div className="px-1 pb-1 pt-3" aria-live="polite">
              {results.length > 0 ? (
                <>
                  {!query.trim() && <p className="px-3 pb-2 text-sm opacity-60">Suggested</p>}
                  <ul>
                    {results.map((h, i) => (
                      <li key={h.href + h.title}>
                        <Link
                          href={h.href}
                          onClick={() => closeSearch()}
                          onPointerEnter={mouseOnly(() => setSel(i))}
                          aria-current={sel === i}
                          className={`flex items-center justify-between gap-4 rounded-[0.9rem] px-3 py-2.5 outline-none transition-colors duration-200 focus-visible:bg-[color-mix(in_srgb,currentColor_10%,transparent)] ${sel === i ? "bg-[color-mix(in_srgb,currentColor_10%,transparent)]" : ""}`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-[1.02rem] font-medium tracking-tight">{h.title}</span>
                            <span className="block truncate text-[0.8rem] opacity-65">{h.sub}</span>
                          </span>
                          <span className="flex shrink-0 items-center gap-2 text-[0.8rem] opacity-65">
                            {h.kind}
                            <Arrow className="size-3.5" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="px-3 py-4 text-[0.95rem] opacity-75">
                  No results for “{query.trim()}”. Try a service such as web design, app development or SEO.
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* click-away scrim (closes the Services, search and mobile menu panels) */}
      <div data-nav-ignore onClick={closeAll} aria-hidden="true" className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${megaOpen || searchOpen || menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} />
    </>
  );
}