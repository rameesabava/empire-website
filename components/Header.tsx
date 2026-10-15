"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type CSSProperties,
    type MouseEvent as ReactMouseEvent,
} from "react";

/* -------------------------------------------------------------------------- */
/*  Config — change these to match your project                               */
/* -------------------------------------------------------------------------- */

/** Put your logo file in /public and point to it here. */
const LOGO_SRC = "/images/logo.webp";

const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about/" },
    { label: "Services", href: "/services/" },
    { label: "Portfolio", href: "/portfolio/" },
    { label: "Contact", href: "/contact/" },
];

/** Scroll distance (px) at which the bar shrinks / grows back. */
const SHRINK_AT = 80;
const GROW_AT = 30;
/** After opening the bar by hand, scrolling this far closes it again. */
const AUTO_CLOSE_DISTANCE = 140;

/* -------------------------------------------------------------------------- */
/*  Styles                                                                    */
/* -------------------------------------------------------------------------- */

const STYLES = `
.em-nav {
  --bg: #222831;
  --surface: #31363F;
  --accent: #76ABAE;
  --text: #EEEEEE;
  --ease: cubic-bezier(.65,0,.35,1);
  --ease-out: cubic-bezier(.19,1,.22,1);
  position: fixed; top: 1.5rem; left: 50%; z-index: 60;
  width: min(1260px, calc(100% - 2rem));
  transform: translateX(-50%);
  pointer-events: none;
  animation: em-nav-in .9s var(--ease-out) both;
}
@media (min-width: 640px) { .em-nav { width: min(1260px, calc(100% - 3rem)); } }
@keyframes em-nav-in {
  from { opacity: 0; transform: translate(-50%, -24px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
}

/* ---------- the bar: clear glass ----------
   No solid fill. The page shows through, softened by blur. It stays easy
   to notice because of: a slight darkening of what is behind it (so the
   white text always has contrast), a bright edge, a top highlight and a
   soft shadow underneath. */
.em-bar {
  position: relative; height: 58px; width: 100%; margin-inline: auto;
  border-radius: 20px; overflow: hidden; pointer-events: auto;
  background:
    linear-gradient(135deg, rgba(238,238,238,.16) 0%, rgba(238,238,238,.04) 45%, rgba(238,238,238,.10) 100%);
  -webkit-backdrop-filter: blur(18px) saturate(1.6) brightness(.82);
  backdrop-filter: blur(18px) saturate(1.6) brightness(.82);
  border: 1px solid rgba(238,238,238,.38);
  box-shadow:
    0 14px 40px -14px rgba(0,0,0,.55),
    0 0 0 1px rgba(34,40,49,.18),
    inset 0 1px 0 rgba(255,255,255,.55),
    inset 0 -1px 0 rgba(34,40,49,.25);
  color: var(--text);
  text-shadow: 0 1px 3px rgba(0,0,0,.45);
  transition: width .7s var(--ease), background .4s, border-color .4s, box-shadow .4s, transform .5s var(--ease-out);
}
.em-bar[data-compact="true"] { width: 116px; cursor: pointer; }
.em-bar[data-compact="true"]:hover {
  background:
    linear-gradient(135deg, rgba(238,238,238,.26) 0%, rgba(238,238,238,.08) 45%, rgba(118,171,174,.22) 100%);
  border-color: rgba(238,238,238,.6);
  box-shadow:
    0 16px 46px -10px rgba(118,171,174,.5),
    0 0 0 1px rgba(34,40,49,.18),
    inset 0 1px 0 rgba(255,255,255,.65),
    inset 0 -1px 0 rgba(34,40,49,.25);
  transform: translateY(2px) scale(1.04);
}

/* browsers without backdrop-filter: fall back to a light tint so it never vanishes */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .em-bar { background: rgba(34,40,49,.55); }
}

/* ---------- logo (glides from left to centre) ---------- */
.em-logo {
  position: absolute; top: 0; bottom: 0; left: 1.5rem; z-index: 2;
  display: flex; align-items: center;
  transform: translateX(0);
  transition: left .7s var(--ease), transform .7s var(--ease);
}
.em-bar[data-compact="true"] .em-logo { left: 50%; transform: translateX(-50%); }
.em-logo img { display: block; height: 38px; width: auto; transition: transform .5s var(--ease-out); filter: drop-shadow(0 1px 3px rgba(0,0,0,.35)); }
.em-bar[data-compact="true"]:hover .em-logo img { transform: scale(1.06); }

/* ---------- parts that fade out when compact ---------- */
.em-fade {
  opacity: 1; transform: none; filter: none; visibility: visible;
  transition:
    opacity .45s ease calc(.28s + var(--i, 0) * 50ms),
    transform .6s var(--ease-out) calc(.28s + var(--i, 0) * 50ms),
    filter .45s ease calc(.28s + var(--i, 0) * 50ms),
    visibility 0s 0s;
}
.em-bar[data-compact="true"] .em-fade {
  opacity: 0; transform: translateY(8px); filter: blur(4px); visibility: hidden;
  transition: opacity .18s ease, transform .3s ease, filter .18s ease, visibility 0s .25s;
}

/* ---------- centre links ---------- */
.em-links-pos { position: absolute; top: 0; bottom: 0; left: 50%; transform: translateX(-50%); display: none; align-items: center; }
.em-links { position: relative; display: flex; align-items: center; gap: .25rem; margin: 0; padding: 0; list-style: none; }
.em-link {
  position: relative; z-index: 1; display: block; padding: .6rem 1.05rem;
  font-size: .95rem; font-weight: 600; letter-spacing: .005em; color: var(--text); border-radius: 12px;
  transition: color .25s;
}
.em-ind {
  position: absolute; top: 50%; left: 0; height: 40px; margin-top: -20px; border-radius: 12px;
  background: rgba(238,238,238,.16);
  border: 1px solid rgba(238,238,238,.28);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.3);
  width: var(--w, 0px); transform: translateX(var(--x, 0px)); opacity: 0;
  transition: transform .5s var(--ease-out), width .5s var(--ease-out), opacity .25s;
}
.em-ind[data-visible="true"] { opacity: 1; }
.em-bar[data-compact="true"] .em-ind { opacity: 0; }

/* ---------- right side ---------- */
.em-right { position: absolute; top: 0; bottom: 0; right: .6rem; display: flex; align-items: center; gap: .6rem; }
.em-cta {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; gap: .5rem;
  height: 46px; padding: 0 1.5rem; border-radius: 9999px;
  background: rgba(255,255,255,.62); color: #1d232b; font-weight: 700; font-size: .95rem; text-shadow: none;
  -webkit-backdrop-filter: blur(10px); backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,.75);
  box-shadow: 0 6px 18px -8px rgba(34,40,49,.5), inset 0 1px 0 rgba(255,255,255,.9);
  transition: background .3s, transform .35s var(--ease-out), box-shadow .3s;
}
.em-cta::after {
  content: ''; position: absolute; inset: 0; transform: translateX(-120%);
  background: linear-gradient(100deg, transparent 30%, rgba(118,171,174,.35) 50%, transparent 70%);
  transition: transform .7s var(--ease-out);
}
.em-cta:hover { background: #ffffff; transform: translateY(-1px); box-shadow: 0 8px 22px -8px rgba(34,40,49,.5), inset 0 1px 0 #fff; }
.em-cta:hover::after { transform: translateX(120%); }
.em-cta svg { width: 16px; height: 16px; transition: transform .35s var(--ease-out); }
.em-cta:hover svg { transform: translateX(3px); }

/* burger (shown below 1024px) */
.em-burger {
  position: relative; width: 46px; height: 46px; border-radius: 14px;
  background: rgba(238,238,238,.14); border: 1px solid rgba(238,238,238,.28);
  color: var(--text); transition: background .3s;
}
.em-burger:hover { background: rgba(238,238,238,.26); }
.em-burger span {
  position: absolute; left: 13px; right: 13px; height: 2px; border-radius: 2px; background: currentColor;
  transition: transform .45s var(--ease-out), top .45s var(--ease-out), opacity .2s;
}
.em-burger span:nth-child(1) { top: 16px; }
.em-burger span:nth-child(2) { top: 21px; }
.em-burger span:nth-child(3) { top: 26px; }
.em-burger[aria-expanded="true"] span:nth-child(1) { top: 21px; transform: rotate(45deg); }
.em-burger[aria-expanded="true"] span:nth-child(2) { opacity: 0; }
.em-burger[aria-expanded="true"] span:nth-child(3) { top: 21px; transform: rotate(-45deg); }

@media (min-width: 1024px) {
  .em-links-pos { display: flex; }
  .em-burger { display: none; }
}
@media (max-width: 479px) { .em-cta { padding: 0 1.1rem; } }

/* ---------- mobile / tablet dropdown (clear glass too) ---------- */
.em-panel-wrap { display: grid; grid-template-rows: 0fr; margin-top: 10px; transition: grid-template-rows .55s var(--ease-out); }
.em-panel-wrap[data-open="true"] { grid-template-rows: 1fr; }
.em-panel-clip { overflow: hidden; min-height: 0; }
.em-panel {
  pointer-events: auto; border-radius: 20px; padding: .6rem;
  background: linear-gradient(135deg, rgba(238,238,238,.14), rgba(238,238,238,.04));
  -webkit-backdrop-filter: blur(20px) saturate(1.6) brightness(.7);
  backdrop-filter: blur(20px) saturate(1.6) brightness(.7);
  border: 1px solid rgba(238,238,238,.32);
  box-shadow: 0 20px 50px -16px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.45);
  text-shadow: 0 1px 3px rgba(0,0,0,.45);
}
.em-panel a {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.1rem; border-radius: 14px; color: var(--text); font-weight: 600; font-size: 1.05rem;
  opacity: 0; transform: translateY(10px);
  transition: opacity .4s ease, transform .5s var(--ease-out), background .25s, color .25s;
}
.em-panel-wrap[data-open="true"] .em-panel a { opacity: 1; transform: none; transition-delay: calc(.12s + var(--i, 0) * 55ms), calc(.12s + var(--i, 0) * 55ms), 0s, 0s; }
.em-panel a:hover { background: rgba(238,238,238,.14); color: var(--accent); }
.em-panel a[aria-current="page"] { color: var(--accent); }
.em-panel a[aria-current="page"]::after { content: ''; width: 8px; height: 8px; border-radius: 9999px; background: var(--accent); }
@media (min-width: 1024px) { .em-panel-wrap { display: none; } }

/* ---------- light theme: bar sits over a light background ----------
   Set automatically from the colour under the bar. Text turns dark,
   the glass turns white-tinted. */
.em-nav[data-theme="light"] { --text: #14181f; --accent-ink: #3b7e82; }
.em-nav .em-panel a:hover, .em-nav .em-panel a[aria-current="page"] { color: var(--accent-ink, var(--accent)); }
.em-nav[data-theme="light"] .em-bar {
  background: linear-gradient(135deg, rgba(255,255,255,.6) 0%, rgba(255,255,255,.28) 100%);
  -webkit-backdrop-filter: blur(18px) saturate(1.5) brightness(1.04);
  backdrop-filter: blur(18px) saturate(1.5) brightness(1.04);
  border-color: rgba(20,24,31,.14);
  box-shadow:
    0 14px 40px -16px rgba(20,24,31,.3),
    0 0 0 1px rgba(255,255,255,.45),
    inset 0 1px 0 rgba(255,255,255,.95),
    inset 0 -1px 0 rgba(20,24,31,.06);
  text-shadow: none;
}
.em-nav[data-theme="light"] .em-bar[data-compact="true"]:hover {
  background: linear-gradient(135deg, rgba(255,255,255,.8) 0%, rgba(255,255,255,.45) 100%);
  border-color: rgba(20,24,31,.22);
  box-shadow: 0 16px 46px -12px rgba(20,24,31,.35), 0 0 0 1px rgba(255,255,255,.5), inset 0 1px 0 #fff, inset 0 -1px 0 rgba(20,24,31,.06);
}
.em-nav[data-theme="light"] .em-ind {
  background: rgba(20,24,31,.07); border-color: rgba(20,24,31,.12);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.8);
}
.em-nav[data-theme="light"] .em-burger { background: rgba(20,24,31,.06); border-color: rgba(20,24,31,.16); }
.em-nav[data-theme="light"] .em-burger:hover { background: rgba(20,24,31,.12); }
.em-nav[data-theme="light"] .em-cta {
  background: rgba(255,255,255,.78); border-color: rgba(20,24,31,.12);
  box-shadow: 0 6px 18px -8px rgba(20,24,31,.3), inset 0 1px 0 #fff;
}
.em-nav[data-theme="light"] .em-cta:hover { background: #ffffff; }
.em-nav[data-theme="light"] .em-panel {
  background: linear-gradient(135deg, rgba(255,255,255,.7), rgba(255,255,255,.4));
  -webkit-backdrop-filter: blur(20px) saturate(1.5) brightness(1.04);
  backdrop-filter: blur(20px) saturate(1.5) brightness(1.04);
  border-color: rgba(20,24,31,.14);
  box-shadow: 0 20px 50px -18px rgba(20,24,31,.3), inset 0 1px 0 #fff;
  text-shadow: none;
}
.em-nav[data-theme="light"] .em-panel a:hover { background: rgba(20,24,31,.06); }

/* ---------- focus + reduced motion ---------- */
.em-nav a:focus-visible, .em-nav button:focus-visible { outline: 2px solid var(--text); outline-offset: 3px; border-radius: 12px; }

@media (prefers-reduced-motion: reduce) {
  .em-nav, .em-nav *, .em-nav *::before, .em-nav *::after {
    animation-duration: .001ms !important; transition-duration: .001ms !important; transition-delay: 0s !important;
  }
}
`;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

function isActive(pathname: string | null, href: string) {
    if (!pathname) return false;
    const clean = (s: string) => (s.length > 1 ? s.replace(/\/$/, "") : s);
    const p = clean(pathname);
    const h = clean(href);
    return h === "/" ? p === "/" : p === h || p.startsWith(`${h}/`);
}

export default function Header() {
    const pathname = usePathname();

    const [scrolled, setScrolled] = useState(false); // page has been scrolled down
    const [pinnedOpen, setPinnedOpen] = useState(false); // user opened the bar by hand
    const [menuOpen, setMenuOpen] = useState(false); // mobile dropdown

    const compact = scrolled && !pinnedOpen;

    const navRef = useRef<HTMLElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const openedAt = useRef(0);
    const [light, setLight] = useState(false); // bar is over a light background

    /* ---- scroll behaviour ---- */
    useEffect(() => {
        let raf = 0;

        const update = () => {
            raf = 0;
            const y = window.scrollY;
            setScrolled((prev) => (y > SHRINK_AT ? true : y < GROW_AT ? false : prev));
            if (y < GROW_AT || Math.abs(y - openedAt.current) > AUTO_CLOSE_DISTANCE) {
                setPinnedOpen(false);
            }
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    /* ---- detect light / dark background under the bar ---- */
    useEffect(() => {
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        // Normalises any CSS colour (rgb, hex, oklch, …) to RGBA via canvas.
        const toRGBA = (css: string) => {
            if (!ctx) return null;
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = "rgba(0,0,0,0)";
            ctx.fillStyle = css;
            ctx.fillRect(0, 0, 1, 1);
            const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
            return { r, g, b, a: a / 255 };
        };
        const isLightColor = (c: { r: number; g: number; b: number }) =>
            (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255 > 0.6;

        /** true = light, false = dark, based on what is painted at (x, y). */
        const lightAt = (x: number, y: number): boolean => {
            const stack = document.elementsFromPoint(x, y).filter(
                (el) => !navRef.current?.contains(el)
            );
            for (const el of stack) {
                const themed = el.closest<HTMLElement>("[data-nav-theme]");
                if (themed) return themed.dataset.navTheme === "light";
                if (/^(IMG|VIDEO|CANVAS|PICTURE)$/.test(el.tagName)) return false;
                const cs = getComputedStyle(el);
                if (cs.backgroundImage !== "none") return false; // photo / gradient
                const c = toRGBA(cs.backgroundColor);
                if (c && c.a > 0.6) return isLightColor(c);
            }
            return true; // nothing painted: browser default is white
        };

        let raf = 0;
        const check = () => {
            raf = 0;
            const bar = barRef.current;
            if (!bar) return;
            const r = bar.getBoundingClientRect();
            const y = r.top + r.height / 2;
            const xs = [0.2, 0.5, 0.8].map((f) => r.left + r.width * f);
            const votes = xs.filter((x) => lightAt(x, y)).length;
            setLight(votes >= 2);
        };
        const schedule = () => {
            if (!raf) raf = requestAnimationFrame(check);
        };

        check();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        // catches colour changes that happen without scrolling (hover effects, route changes)
        const timer = window.setInterval(schedule, 300);
        return () => {
            window.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            window.clearInterval(timer);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [pathname]);

    /* ---- close things on outside click / Escape ---- */
    useEffect(() => {
        if (!pinnedOpen && !menuOpen) return;

        const onDown = (e: PointerEvent) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setPinnedOpen(false);
                setMenuOpen(false);
            }
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setPinnedOpen(false);
                setMenuOpen(false);
            }
        };
        document.addEventListener("pointerdown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [pinnedOpen, menuOpen]);

    /* ---- reset on navigation / when the bar shrinks ---- */
    useEffect(() => {
        setMenuOpen(false);
        setPinnedOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (compact) setMenuOpen(false);
    }, [compact]);

    /* ---- logo / bar interactions ---- */
    const openBar = () => {
        openedAt.current = window.scrollY;
        setPinnedOpen(true);
    };

    const onLogoClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
        if (!scrolled) return; // at the top the logo is a normal home link
        e.preventDefault();
        e.stopPropagation();
        if (compact) openBar();
        else {
            setPinnedOpen(false);
            setMenuOpen(false);
        }
    };

    const onBarClick = () => {
        if (compact) openBar();
    };

    /* ---- sliding hover indicator ---- */
    const listRef = useRef<HTMLUListElement>(null);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [ind, setInd] = useState({ x: 0, w: 0, visible: false });
    const activeIndex = links.findIndex((l) => isActive(pathname, l.href));

    const moveTo = useCallback((i: number) => {
        const list = listRef.current;
        const el = itemRefs.current[i];
        if (!list || !el || i < 0) {
            setInd((p) => ({ ...p, visible: false }));
            return;
        }
        const lr = list.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        setInd({ x: r.left - lr.left, w: r.width, visible: true });
    }, []);

    useLayoutEffect(() => {
        moveTo(activeIndex);
        const onResize = () => moveTo(activeIndex);
        window.addEventListener("resize", onResize);
        // fonts can change link widths after first paint
        document.fonts?.ready.then(() => moveTo(activeIndex));
        return () => window.removeEventListener("resize", onResize);
    }, [activeIndex, moveTo]);

    return (
        <header
            ref={navRef}
            className="em-nav"
            data-theme={light ? "light" : "dark"}
        >
            <style dangerouslySetInnerHTML={{ __html: STYLES }} />

            <div
                ref={barRef}
                className="em-bar"
                data-compact={compact}
                onClick={onBarClick}
            >
                {/* Logo — home link at the top, open/close toggle once scrolled */}
                <Link
                    href="/"
                    className="em-logo"
                    onClick={onLogoClick}
                    role={scrolled ? "button" : undefined}
                    aria-expanded={scrolled ? !compact : undefined}
                    aria-label={
                        scrolled
                            ? compact
                                ? "Open navigation menu"
                                : "Close navigation menu"
                            : "Empireae home"
                    }
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={LOGO_SRC} alt="Empireae" width={64} height={38} />
                </Link>

                {/* Centre links (desktop) */}
                <div className="em-links-pos">
                    <ul
                        ref={listRef}
                        className="em-links"
                        onMouseLeave={() => moveTo(activeIndex)}
                    >
                        <li
                            className="em-ind"
                            data-visible={ind.visible}
                            style={{ "--x": `${ind.x}px`, "--w": `${ind.w}px` } as CSSProperties}
                            aria-hidden="true"
                            role="presentation"
                        />
                        {links.map((l, i) => (
                            <li
                                key={l.href}
                                className="em-fade"
                                style={{ "--i": i } as CSSProperties}
                            >
                                <Link
                                    href={l.href}
                                    ref={(el) => {
                                        itemRefs.current[i] = el;
                                    }}
                                    className="em-link"
                                    aria-current={i === activeIndex ? "page" : undefined}
                                    onMouseEnter={() => moveTo(i)}
                                    onFocus={() => moveTo(i)}
                                    onBlur={() => moveTo(activeIndex)}
                                >
                                    {l.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right: CTA + burger */}
                <div className="em-right em-fade" style={{ "--i": 5 } as CSSProperties}>
                    <Link href="/contact/" className="em-cta">
                        Let&apos;s Talk
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.2}
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                        </svg>
                    </Link>

                    <button
                        type="button"
                        className="em-burger"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="em-mobile-menu"
                        onClick={() => setMenuOpen((o) => !o)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </div>

            {/* Mobile / tablet dropdown */}
            <div
                id="em-mobile-menu"
                className="em-panel-wrap"
                data-open={menuOpen && !compact}
            >
                <div className="em-panel-clip">
                    <nav className="em-panel" aria-label="Mobile">
                        {links.map((l, i) => (
                            <Link
                                key={l.href}
                                href={l.href}
                                tabIndex={menuOpen && !compact ? 0 : -1}
                                aria-current={i === activeIndex ? "page" : undefined}
                                style={{ "--i": i } as CSSProperties}
                            >
                                {l.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}