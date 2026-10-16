"use client";

/**
 * Empire AE – SERVICES PAGE (black & white, no full-black background)
 * Save as:  app/services/page.tsx
 * Requires: npm install gsap lucide-react
 *
 * 1. Hero (black): stacked card fan with colour photos. Click a card to read its service.
 *    Every STACK_EVERY-th click the fan stacks itself; click the stack to fan it again.
 * 2. Card deck (white): colour photo cards. Click or swipe the top card to toss it.
 * 3. Contact CTA (white).
 *
 * Photos: replace the URLs in IMGS with your own files, e.g. "/services/web-design.jpg" in /public.
 * If an image fails to load, the card falls back to its plain tone.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Megaphone,
  Palette,
  Code2,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";

const STACK_EVERY = 3; // the fan stacks itself on every 3rd click

type Service = { n: string; Icon: LucideIcon; t: string };

const S: Service[] = [
  { n: "Web Designing", Icon: Palette, t: "We create stunning, responsive websites that make your brand come to life and look great across all platforms. More than just esthetics, good design directs and engages users. Our cutting-edge UI/UX designs are designed to draw attention and convert visitors into buyers." },
  { n: "Web Development", Icon: Code2, t: "Using React, Next.js, WordPress, and Laravel, we create dependable, scalable, and quick websites that are designed to function today and expand with you tomorrow. Our development method transforms your idea into a trustworthy online platform that offers genuine value from conception to launch." },
  { n: "Mobile App Development", Icon: Smartphone, t: "We create iOS and Android apps, including Flutter apps, that are quick, safe, and easy to use on any device. We develop mobile experiences that captivate people and advance your company from the initial concept to the app store." },
  { n: "Hosting & Domain", Icon: ShieldCheck, t: "With SSL protection, daily backups, and 99.9% uptime, we provide easy domain registration and safe web hosting. You can concentrate on managing your business since your website is always up, quick, and secure." },
  { n: "Digital Marketing", Icon: Megaphone, t: "We help your brand reach the appropriate audience at the right time by using data-driven digital marketing, including social media and content marketing. To produce noticeable development and a high return on investment, each plan is evaluated and improved." },
  { n: "E-Commerce Application", Icon: ShoppingCart, t: "For a flawless shopping experience, we create safe, scalable online businesses using WooCommerce, payment gateway connection, and inventory management. Our e-commerce solutions, from product listing to final checkout, are made to turn visitors into devoted clients and boost your revenue." },
  { n: "Software Application", Icon: Settings2, t: "For increased productivity, security, and scalability, we create custom software, such as ERP and CRM systems, based on your company's operations. Our solutions, which are based on cutting-edge technology, streamline your processes and remain reliable as you expand." },
  { n: "SEO", Icon: Search, t: "Through keyword research, on-page SEO, and off-page SEO, we raise your website's search engine rating so that the proper people can find you on Google. Our tried-and-true methods boost organic traffic, enhance brand awareness, and promote sustained expansion." },
];

// One related photo per service (same order as S). Swap for your own images any time.
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;
const IMGS = [
  u("photo-1561070791-2526d30994b5"), // web design
  u("photo-1498050108023-c5249f4df085"), // web development
  u("photo-1512941937669-90a1b58e7e9c"), // mobile apps
  u("photo-1558494949-ef010cbdcc31"), // hosting
  u("photo-1460925895917-afdab827c52f"), // marketing
  u("photo-1556742049-0cfed4f6a45d"), // e-commerce
  u("photo-1551288049-bebda4e38f71"), // software
  u("photo-1432888622747-4eb9a8efeb07"), // seo
];

// Black & white card tones, cycled by service index
const TONES = [
  { bg: "#111111", fg: "#FFFFFF" },
  { bg: "#FFFFFF", fg: "#000000" },
  { bg: "#D9D9D9", fg: "#000000" },
  { bg: "#444444", fg: "#FFFFFF" },
];
const tone = (i: number) => TONES[i % TONES.length];

const N = S.length;
const DECK = [0, 1, 2, 5]; // Web Design, Web Dev, Mobile Apps, E-Commerce

const h2 = "text-[clamp(2rem,4.6vw,3.75rem)] font-bold leading-[1.05] tracking-tight";

export default function ServicesPage() {
  const rm = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const T = (x: number) => (rm() ? 0 : x);

  /* fan */
  const fanRef = useRef<HTMLDivElement>(null);
  const fc = useRef<(HTMLButtonElement | null)[]>([]);
  const fs = useRef({ open: false, sel: 0, hv: -1, clicks: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const [sel, setSel] = useState(0);

  /* deck */
  const dc = useRef<(HTMLDivElement | null)[]>([]);
  const q = useRef<number[]>(DECK.map((_, i) => i));
  const drag = useRef<{ x: number; t: number; dx: number } | null>(null);
  const side = useRef(1);

  /* ---------- 1. Fan ---------- */
  const place = (i: number, d: number) => {
    const el = fc.current[i];
    if (!el || !fanRef.current) return;
    const { open, sel: sl, hv } = fs.current;
    const m = i - (N - 1) / 2;
    const step = Math.min(fanRef.current.clientWidth / (N + 1.2), 94);
    const on = i === sl;
    gsap.to(el, {
      x: open ? m * step : 0,
      y: (open ? Math.abs(m) ** 1.7 * 6 : -i * 1.5) - (open && on ? 46 : 0) - (open && hv === i ? 22 : 0),
      rotation: open && !on ? m * 7 : 0,
      scale: on && open ? 1.06 : 1,
      zIndex: on ? 50 : hv === i ? 40 : i,
      duration: T(open ? 0.8 : 0.6),
      delay: T(d),
      ease: d ? "back.out(1.3)" : "power3.out",
    });
  };
  const placeAll = (stagger: boolean) => fc.current.forEach((_, i) => place(i, stagger ? i * 0.07 : 0));

  const pick = (i: number) => {
    const f = fs.current;
    // Stacked: the first click just fans the cards back out.
    if (!f.open) {
      f.open = true;
      f.clicks = 0;
      placeAll(true);
      return;
    }
    f.sel = i;
    setSel(i);
    f.clicks += 1;
    // Every STACK_EVERY-th click, the fan stacks itself.
    if (f.clicks >= STACK_EVERY) {
      f.clicks = 0;
      f.open = false;
      placeAll(true);
    } else {
      placeAll(false);
    }
  };

  useEffect(() => {
    if (panelRef.current) gsap.fromTo(panelRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: T(0.45) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel]);

  /* ---------- 2. Deck toss ---------- */
  const lay = () =>
    q.current.forEach((ci, k) => {
      const el = dc.current[ci];
      if (!el) return;
      gsap.to(el, {
        x: 0,
        y: k * 12,
        scale: 1 - k * 0.045,
        rotation: k ? (k % 2 ? 1 : -1) * k * 1.6 : 0,
        zIndex: q.current.length - k,
        duration: T(0.5),
        ease: "power3.out",
      });
    });

  const toss = (dir: number) => {
    const ci = q.current.shift();
    if (ci === undefined) return;
    const el = dc.current[ci];
    if (!el) return;
    gsap.to(el, {
      x: dir * window.innerWidth * 0.7,
      y: -50,
      rotation: dir * 32,
      opacity: 0,
      duration: T(0.5),
      ease: "power2.in",
      onComplete: () => {
        q.current.push(ci);
        gsap.set(el, { x: 0, opacity: 0 });
        lay();
        gsap.to(el, { opacity: 1, duration: T(0.35) });
      },
    });
    lay();
  };

  const clickToss = () => {
    side.current *= -1; // alternate left / right
    toss(side.current);
  };

  const onDeckDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-dc]") !== dc.current[q.current[0]]) return;
    drag.current = { x: e.clientX, t: performance.now(), dx: 0 };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onDeckMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    d.dx = e.clientX - d.x;
    gsap.set(dc.current[q.current[0]], { x: d.dx, rotation: d.dx / 14 });
  };
  const onDeckUp = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const v = Math.abs(d.dx) / (performance.now() - d.t);
    if (Math.abs(d.dx) < 6) clickToss(); // a click on the top card
    else if (Math.abs(d.dx) > 90 || (v > 0.5 && Math.abs(d.dx) > 30)) toss(Math.sign(d.dx));
    else lay();
  };

  /* ---------- setup ---------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      fc.current.forEach((el, i) => el && gsap.set(el, { xPercent: -50, yPercent: -50, y: -i * 1.5, zIndex: i }));
      lay();
    });
    const t = setTimeout(() => {
      fs.current.open = true;
      placeAll(true);
    }, 350);
    const onResize = () => placeAll(false);
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Sel = S[sel];

  return (
    <main className="sv-root relative overflow-x-clip bg-white text-black selection:bg-black selection:text-white">
      <style>{SV_CSS}</style>

      {/* 1. HERO (light): stacked card fan */}
      <section className="relative overflow-hidden bg-black px-5 pb-16 pt-32 text-white sm:px-10 sm:pt-40">
        <h1 className="sv-gtext mx-auto max-w-4xl text-center text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[1.02]">
          Eight services.
          <br />
          One empire.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-center text-base leading-relaxed text-white/70 sm:text-lg">
          Empire AE designs, builds, hosts and grows your brand online. Pick a card to see what each service covers.
        </p>

        <div ref={fanRef} className="relative mx-auto mt-8 h-[340px] max-w-[1100px] sm:h-[400px]" aria-label="Services">
          {S.map((s, i) => {
            const c = tone(i);
            return (
              <button
                key={s.n}
                ref={(el) => {
                  fc.current[i] = el;
                }}
                aria-label={s.n}
                onClick={() => pick(i)}
                onMouseEnter={() => {
                  fs.current.hv = i;
                  place(i, 0);
                }}
                onMouseLeave={() => {
                  fs.current.hv = -1;
                  place(i, 0);
                }}
                style={{ background: c.bg, color: c.fg }}
                className="absolute left-1/2 top-1/2 flex h-[190px] w-[128px] flex-col gap-2 overflow-hidden rounded-2xl p-1.5 text-left shadow-[0_18px_40px_-12px_rgba(0,0,0,.9)] ring-1 ring-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:h-[250px] sm:w-[170px] sm:gap-3 sm:p-2"
              >
                <span className="relative block min-h-0 flex-1 overflow-hidden rounded-xl bg-black/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={IMGS[i]}
                    alt=""
                    draggable={false}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-2 top-2 grid size-7 place-items-center rounded-full bg-white text-black sm:size-8">
                    <s.Icon className="size-4" strokeWidth={1.75} />
                  </span>
                </span>
                <b className="px-1.5 pb-1.5 text-[13px] font-semibold leading-tight tracking-tight sm:text-[17px]">{s.n}</b>
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-14 min-h-[230px] max-w-2xl text-center">
          <div ref={panelRef}>
            <h2 className={h2}>{Sel.n}</h2>
            <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">{Sel.t}</p>
          </div>
        </div>
      </section>

      {/* 2. CARD DECK (graphite): photo cards, click or swipe the top card to toss it */}
      <section className="bg-white text-black">
        <div className="mx-auto max-w-[88rem] px-6 py-24 sm:px-10 lg:py-32">
          <div className="flex justify-center">
            <div
              role="button"
              tabIndex={0}
              aria-label="Toss the top card"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  clickToss();
                }
              }}
              onPointerDown={onDeckDown}
              onPointerMove={onDeckMove}
              onPointerUp={onDeckUp}
              onPointerCancel={onDeckUp}
              className="relative h-[500px] w-[min(330px,86vw)] touch-pan-y select-none outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
            >
              {DECK.map((k, i) => {
                const c = tone(k);
                const I = S[k].Icon;
                return (
                  <div
                    key={k}
                    data-dc
                    ref={(el) => {
                      dc.current[i] = el;
                    }}
                    style={{ background: c.bg, color: c.fg }}
                    className="absolute inset-x-0 bottom-10 top-0 flex cursor-pointer flex-col gap-3 overflow-hidden rounded-3xl p-4 shadow-[0_24px_50px_-14px_rgba(0,0,0,.45)] ring-1 ring-black/15"
                  >
                    <div className="relative h-[150px] shrink-0 overflow-hidden rounded-2xl bg-black/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={IMGS[k]}
                        alt=""
                        draggable={false}
                        loading="lazy"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-white text-black">
                        <I className="size-[18px]" strokeWidth={1.75} />
                      </span>
                    </div>
                    <h3 className="px-1 text-[22px] font-bold leading-tight tracking-tight">{S[k].n}</h3>
                    <p className="px-1 text-[13.5px] leading-snug opacity-80">{S[k].t}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CTA (light) */}
      <section className="border-t border-black/10 bg-white px-6 py-24 text-center text-black sm:px-10">
        <h2 className={`${h2} mx-auto max-w-3xl`}>Ready to build something that moves your business forward?</h2>
        <Link
          href="/contact"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#333]"
        >
          Start a project
          <ArrowUpRight size={20} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </section>
    </main>
  );
}

const SV_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
.sv-root{font-family:'Inter',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif}
.sv-root h1,.sv-root h2,.sv-root h3{letter-spacing:-0.03em}
@keyframes sv-grad{to{background-position:200% center}}
.sv-gtext{background:linear-gradient(100deg,#FFFFFF 0%,#8a8a8a 30%,#FFFFFF 55%,#8a8a8a 80%,#FFFFFF 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:sv-grad 6s linear infinite}
@media (prefers-reduced-motion: reduce){.sv-gtext{animation:none}}
`;
