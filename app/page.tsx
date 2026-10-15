"use client";

/**
 * Empire AE – HOME PAGE (single file)
 *
 * Section order:
 *   1. Video hero (4 videos, auto-advancing)
 *   2. Scroll text reveal
 *   3. Client marquee + testimonials
 *   4. Words showcase (Vision / Expertise / Success, pinned, text only)
 *   5. Services (concave scroll layout)
 *   6. Projects  (pinned)  +  Contact info (slides over the projects)
 *
 * Requires:  npm install gsap lenis lucide-react
 * Save as:   app/page.tsx
 *
 * Lenis (smooth scroll) is started once in Home() and drives GSAP ScrollTrigger.
 * If your layout.tsx already runs Lenis, delete the Lenis effect in Home()
 * and add `lenis.on("scroll", ScrollTrigger.update)` to your existing setup.
 */

import { useState, useEffect, useRef, MouseEvent, ReactNode, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronsDown, Clock, Mail, Phone, Share2, Volume2, VolumeX } from "lucide-react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* Shared Lenis instance so the hero "scroll down" button can use it */
let lenisInstance: Lenis | null = null;

/* =====================================================================
   1. HERO (4 VIDEOS)
   Put your files in /public/videos/ :
     hero-1.mp4 … hero-4.mp4   (each plays once, then the next one starts)
     hero-1.webp … hero-4.webp (poster + thumbnail in the "Next" card)
   ===================================================================== */
type HeroSlide = {
  video: string;
  poster: string;
  title: string;
  text: string;
  cta: string;
  href: string;
};

const HERO_SLIDES: HeroSlide[] = [
  {
    video: "/videos/hero-1.mp4",
    poster: "/videos/hero-1.webp",
    title: "Digital Solutions That Put You Ahead",
    text: "Empire AE delivers innovative digital solutions that empower businesses to grow and succeed.",
    cta: "View all works",
    href: "/portfolio",
  },
  {
    video: "/videos/hero-2.mp4",
    poster: "/videos/hero-2.webp",
    title: "Websites Built to Convert",
    text: "Fast, responsive and beautifully designed websites that turn visitors into loyal customers.",
    cta: "Explore web design",
    href: "/services/web-design",
  },
  {
    video: "/videos/hero-3.mp4",
    poster: "/videos/hero-3.webp",
    title: "Apps People Love to Use",
    text: "Powerful Android and iOS apps engineered for seamless experiences and real business growth.",
    cta: "See mobile apps",
    href: "/services/mobile-app-development",
  },
  {
    video: "/videos/hero-4.mp4",
    poster: "/videos/hero-4.webp",
    title: "Growth You Can Measure",
    text: "SEO and digital marketing strategies that raise your visibility and bring customers to your door.",
    cta: "Grow with us",
    href: "/services/digital-marketing",
  },
];

function VideoHero() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0); // 0–1 for the playing video
  const [muted, setMuted] = useState(true);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);

  const count = HERO_SLIDES.length;
  const slide = HERO_SLIDES[current];
  const next = HERO_SLIDES[(current + 1) % count];

  const goTo = (i: number) => {
    setProgress(0);
    setCurrent(i);
  };
  const advance = () => {
    setProgress(0);
    setCurrent((c) => (c + 1) % count);
  };

  // Play only the active video (restarted from 0); pause the others.
  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (!v) return;
      if (i === current) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [current]);

  const scrollDown = () => {
    if (lenisInstance) lenisInstance.scrollTo(window.innerHeight, { duration: 1.2 });
    else window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative isolate flex h-screen min-h-[640px] w-full items-end overflow-hidden bg-[#222831]">
      {/* all 4 videos stacked, the active one fades in */}
      {HERO_SLIDES.map((s, i) => (
        <video
          key={s.video}
          ref={(el) => {
            videos.current[i] = el;
          }}
          src={s.video}
          poster={s.poster}
          muted={muted}
          playsInline
          preload={i === current || i === (current + 1) % count ? "auto" : "metadata"}
          aria-hidden
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (i === current && v.duration) setProgress(v.currentTime / v.duration);
          }}
          onEnded={() => {
            if (i === current) advance();
          }}
          onError={() => {
            // missing / broken file: move on after a moment so the hero never gets stuck
            if (i === current) window.setTimeout(() => setCurrent((c) => (c === i ? (c + 1) % count : c)), 4000);
          }}
          className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* readability overlays */}
      <div className="absolute inset-0 -z-10 bg-[#222831]/55" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(34,40,49,.85)_0%,rgba(34,40,49,.35)_55%,transparent_100%),linear-gradient(0deg,rgba(34,40,49,.9)_0%,transparent_40%)]" />

      <div className="mx-auto w-full max-w-[1500px] px-6 pb-28 sm:px-12 lg:px-[10%] lg:pb-24">
        {/* key remounts the text so the entrance animation replays on every slide */}
        <div key={current} className="max-w-3xl">
          <h1
            className="hero-title up mt-6 text-5xl font-light leading-[1.12] text-[#EEEEEE] sm:text-6xl xl:text-7xl"
            style={{ animationDelay: ".1s" }}
          >
            <span className="gtext-white font-bold">{slide.title}</span>
          </h1>
          <p className="up mt-6 max-w-xl text-base leading-relaxed text-[#EEEEEE]/75 sm:text-lg" style={{ animationDelay: ".25s" }}>
            {slide.text}
          </p>
          <Link
            href={slide.href}
            className="up group mt-8 inline-flex items-center gap-3 text-base font-medium text-[#EEEEEE] transition-colors hover:text-[#b3f1f4]"
            style={{ animationDelay: ".4s" }}
          >
            {slide.cta}
            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-2" />
          </Link>
        </div>
      </div>

      {/* "Next" card with thumbnail + progress bars (hidden on phones) */}
      <div className="absolute bottom-8 right-20 hidden w-[min(450px,55vw)] overflow-hidden bg-[#222831]/70 backdrop-blur-md sm:flex lg:right-[7%]">
        <button
          type="button"
          onClick={advance}
          aria-label={`Next: ${next.title}`}
          className="w-[30%] shrink-0 bg-[#31363F] bg-cover bg-center"
          style={{ backgroundImage: `url(${next.poster})` }}
        />
        <div className="flex min-w-0 flex-1 flex-col p-4">
          <button type="button" onClick={advance} className="text-left text-[#EEEEEE]">
            <span className="block text-sm">Next</span>
            <span className="mt-0.5 block truncate text-base font-light sm:text-lg">{next.title}</span>
          </button>
          <div className="mt-4 flex gap-3">
            {HERO_SLIDES.map((s, i) => (
              <button key={s.video} type="button" onClick={() => goTo(i)} aria-label={`Show slide ${i + 1}`} className="flex-1 py-2">
                <span className="block h-[2px] w-full overflow-hidden bg-white/30">
                  <span
                    className="block h-full origin-left bg-white transition-transform duration-300 ease-linear"
                    style={{ transform: `scaleX(${i < current ? 1 : i === current ? progress : 0})` }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* mute toggle */}
      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="absolute bottom-24 right-6 grid h-11 w-11 place-items-center text-[#EEEEEE] transition-colors hover:text-[#76ABAE] sm:bottom-8 lg:right-[3%]"
      >
        {muted ? <VolumeX size={26} strokeWidth={1.5} /> : <Volume2 size={26} strokeWidth={1.5} />}
      </button>

      {/* scroll down */}
      <button
        onClick={scrollDown}
        aria-label="Scroll down"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[#EEEEEE] transition-colors hover:text-[#76ABAE]"
      >
        <ChevronsDown size={34} strokeWidth={1.25} className="animate-bounce" />
      </button>
    </section>
  );
}

/* =====================================================================
   2. SCROLL TEXT REVEAL
   ===================================================================== */
const TEXT =
  "At Empire AE, we believe technology should feel effortless, inspire the people who use it, and help ambitious businesses grow. We are here to build digital experiences that move your business forward.";

const WORDS = TEXT.split(" ");

const DIM = 0x45; // #454545
const BRIGHT = 0xff; // #ffffff

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

const toColor = (t: number) => {
  const c = Math.round(DIM + (BRIGHT - DIM) * t);
  return `rgb(${c}, ${c}, ${c})`;
};

function ScrollTextReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const paragraph = paragraphRef.current;
    if (!section || !paragraph) return;

    const words = Array.from(paragraph.querySelectorAll<HTMLSpanElement>("[data-word]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lines: HTMLSpanElement[][] = [];
    let raf = 0;

    // Group word spans into rendered lines by their vertical offset.
    const measure = () => {
      const grouped: HTMLSpanElement[][] = [];
      let currentTop = -Infinity;
      for (const word of words) {
        const top = word.offsetTop;
        if (Math.abs(top - currentTop) > 4) {
          grouped.push([]);
          currentTop = top;
        }
        grouped[grouped.length - 1].push(word);
      }
      lines = grouped;
    };

    const update = () => {
      raf = 0;
      if (!lines.length) return;

      if (reduceMotion) {
        for (const word of words) word.style.color = toColor(1);
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress = scrollable > 0 ? clamp(-rect.top / scrollable) : 1;
      const total = progress * lines.length;

      lines.forEach((line, i) => {
        const color = toColor(clamp(total - i));
        for (const word of line) word.style.color = color;
      });
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const remeasure = () => {
      measure();
      schedule();
    };

    remeasure();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);

    const ro = new ResizeObserver(remeasure);
    ro.observe(paragraph);

    // Fonts loading can change wrapping.
    if (document.fonts?.ready) {
      document.fonts.ready.then(remeasure).catch(() => {});
    }

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="eae-reveal">
      <div className="eae-reveal-sticky">
        <p ref={paragraphRef} className="eae-reveal-text">
          {WORDS.map((word, i) => (
            <span key={i} data-word style={{ color: "#454545", transition: "color 80ms linear" }}>
              {word}
              {i < WORDS.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* =====================================================================
   3. CLIENT MARQUEE + TESTIMONIALS  (demo data – replace later)
   ===================================================================== */
const CLIENT_NAMES: string[] = [
  "NovaTech",
  "Vertex AI",
  "Lumina Health",
  "QuantumWorks",
  "Orbit Systems",
  "Nexora",
  "BluePeak Technologies",
  "CoreVision",
  "Zenith Labs",
  "Aether Digital",
];

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  review: string;
  /** Optional image path. Falls back to an initials avatar when omitted. */
  image?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "david-morgan",
    name: "David Morgan",
    role: "Chief Technology Officer",
    company: "NovaTech",
    review:
      "The team delivered a reliable and scalable solution that helped us streamline our operations. Their technical expertise and practical approach made the entire development process smooth and efficient.",
  },
  {
    id: "sarah-mitchell",
    name: "Sarah Mitchell",
    role: "Head of Product",
    company: "Vertex AI",
    review:
      "Working with this team was a great experience. They understood our product requirements, communicated clearly, and delivered a solution that fit our business needs.",
  },
  {
    id: "daniel-brooks",
    name: "Daniel Brooks",
    role: "Engineering Director",
    company: "QuantumWorks",
    review:
      "Their engineering team helped us improve the reliability of our platform and simplify several complex workflows. The collaboration was professional and well organized.",
  },
  {
    id: "emily-carter",
    name: "Emily Carter",
    role: "Product Manager",
    company: "Lumina Health",
    review:
      "The team took the time to understand our challenges and proposed a practical solution. Their attention to detail and responsiveness made a real difference to our project.",
  },
  {
    id: "michael-reed",
    name: "Michael Reed",
    role: "Founder",
    company: "Orbit Systems",
    review:
      "From planning to delivery, the team maintained a clear focus on quality and usability. The final solution gave us a stronger foundation for future improvements.",
  },
];

function ClientMarquee({ clients }: { clients: string[] }) {
  return (
    <div className="eae-marquee" aria-label="Our clients">
      <div className="eae-track">
        <ul className="eae-group">
          {clients.map((name) => (
            <li key={name} className="eae-client">
              {name}
            </li>
          ))}
        </ul>
        <ul className="eae-group" aria-hidden="true">
          {clients.map((name) => (
            <li key={`${name}-copy`} className="eae-client">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

function ClientTestimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;

  const current = items[index];
  const goPrevious = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div className="eae-container">
      <div className="eae-header">
        <h2 className="eae-heading">What clients say about us</h2>
        <div className="eae-controls">
          <button type="button" className="eae-arrow" onClick={goPrevious} aria-label="Previous testimonial">
            <Chevron direction="left" />
          </button>
          <button type="button" className="eae-arrow" onClick={goNext} aria-label="Next testimonial">
            <Chevron direction="right" />
          </button>
        </div>
      </div>

      {/* key remounts the block so the fade replays on every change */}
      <div key={current.id} className="eae-content" aria-live="polite">
        <div className="eae-person">
          <div className="eae-avatar" aria-hidden="true">
            {current.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={current.image} alt="" />
            ) : (
              getInitials(current.name)
            )}
          </div>
          <div>
            <p className="eae-name">{current.name}</p>
            <p className="eae-meta">{current.role}</p>
            <p className="eae-meta">{current.company}</p>
          </div>
        </div>

        <blockquote className="eae-quote">{current.review}</blockquote>
      </div>
    </div>
  );
}

/* =====================================================================
   4. SERVICES (concave scroll layout)
   ===================================================================== */
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

const PAGE_TITLE = "Our Services";
const PAGE_INTRO =
  "From ideas to breakthrough results, we craft powerful digital experiences that amplify your brand, captivate your audience, and turn clicks into customers.";
const CTA_LABEL = "Start a project";
const CTA_HREF = "/contact";

const SERVICES: Service[] = [
  {
    slug: "web-design",
    title: "Web Design",
    description: "We create stunning, responsive websites that captivate visitors and elevate your brand.",
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
    description: "We build secure, scalable websites engineered for performance and growth.",
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
    description: "We develop powerful Android and iOS apps for seamless user experiences.",
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
    description: "We keep your website fast, secure, and online with reliable hosting solutions.",
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
    description: "We boost visibility and attract customers through result-driven digital strategies.",
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
    description: "We build seamless online stores that turn visitors into loyal customers.",
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
    description: "We create custom software that streamlines workflows and boosts productivity.",
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
    description: "We improve search rankings, increase organic traffic, and grow your online reach.",
    tags: ["On-Page SEO", "Off-Page SEO", "Keyword Optimization"],
    href: "/services/seo",
    bg: "#121414",
    fg: "#ffffff",
    accent: "#3dd6c6",
    shadow: 0.9,
  },
];

/* ---- curve config (distances are % of the card's own size) ---- */
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

/* Active-card state lives in data attributes (no React re-renders). */
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

/* ---- rolling title ---- */
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

/* ---- media (real media or CSS artwork) ---- */
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

/* ---- service card ---- */
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

/* ---- services section ---- */
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

        if (fx)
          cards.forEach((card) => {
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
        <p className="max-w-sm text-[0.95rem] leading-relaxed opacity-65 md:text-base">{PAGE_INTRO}</p>
      </header>

      <ul
        className={`mx-auto grid grid-cols-1 items-start gap-x-[clamp(1.25rem,2.5vw,2.5rem)] gap-y-[clamp(1.5rem,5vw,4.5rem)] lg:grid-cols-2 lg:[&>li:nth-child(even)]:mt-[clamp(2.5rem,7vw,7rem)] ${WIDTH}`}
      >
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

/* =====================================================================
   5. PROJECTS (pinned) + CONTACT INFO (slides over the projects)
   ===================================================================== */
type Category = "Web Design" | "Mobile Apps" | "Marketing" | "Branding";

const filters = ["All Projects", "Web Design", "Mobile Apps", "Marketing", "Branding"] as const;

const projects: {
  title: string;
  tag: string;
  category: Category;
  year: string;
  text: string;
  overlay: string;
  image: string;
}[] = [
  {
    title: "E-Commerce Platform",
    overlay: "Full-featured online store with advanced filtering, secure payments, and a mobile-first checkout experience.",
    tag: "Web Development",
    category: "Web Design",
    year: "2025",
    text: "Custom-built WooCommerce store with advanced product filtering, secure payment gateway integration, and mobile-first design.",
    image: "https://tse4.mm.bing.net/th/id/OIP.kPURjF7-ZvO6mSVpmp95GwHaD8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    title: "Facebook Ad Campaign",
    overlay: "Multi-channel Facebook campaign that generated 300% ROI and 2x lead generation for a retail brand.",
    tag: "Digital Marketing",
    category: "Marketing",
    year: "2025",
    text: "Data-driven social media campaign delivering 300% ROI, reaching 500K+ targeted users with optimized ad creatives.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Social Media Brand Kit",
    overlay: "Complete social media brand identity including logo, templates, color system, and content strategy.",
    tag: "Branding",
    category: "Branding",
    year: "2024",
    text: "Full brand identity system with custom logo design, visual language, and pre-built social media content templates.",
    image: "https://masterbundles.com/wp-content/uploads/2023/05/01--330.jpg",
  },
  {
    title: "Business Management App",
    overlay: "Cross-platform mobile app with real-time data sync, offline capability, and intuitive dashboard interface.",
    tag: "Mobile App",
    category: "Mobile Apps",
    year: "2025",
    text: "Flutter-based cross-platform app serving 1,000+ daily active users with real-time analytics, push notifications, and offline data sync.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Corporate Website Redesign",
    overlay: "Complete website overhaul resulting in 180% increase in organic traffic and 40% better conversion rate.",
    tag: "Web Design",
    category: "Web Design",
    year: "2024",
    text: "Complete redesign with modern UI, optimized page speed (99 Lighthouse score), and SEO-first architecture.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Organic SEO Campaign",
    overlay: "6-month SEO strategy that pushed 50+ keywords to Page 1 and tripled organic traffic.",
    tag: "SEO",
    category: "Marketing",
    year: "2024",
    text: "Comprehensive SEO overhaul pushing 50+ target keywords to Page 1 of Google — 3x organic traffic growth in 6 months.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=900&q=80",
  },
];

function ProjectIndex() {
  const [active, setActive] = useState<(typeof filters)[number]>("All Projects");
  const [hovered, setHovered] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [scrolling, setScrolling] = useState(false);

  /* While the page is scrolling, switch hover effects off. Rows sliding under a still cursor
     would otherwise keep expanding/collapsing and swapping the preview image, which makes the
     wheel feel stuck. Hover comes back ~150ms after scrolling stops. */
  useEffect(() => {
    let t = 0;
    const onScroll = () => {
      setScrolling(true);
      setHovered(null);
      window.clearTimeout(t);
      t = window.setTimeout(() => setScrolling(false), 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(t);
    };
  }, []);

  const visible = active === "All Projects" ? projects : projects.filter((p) => p.category === active);
  const countFor = (f: (typeof filters)[number]) =>
    f === "All Projects" ? projects.length : projects.filter((p) => p.category === f).length;
  const hoveredProject = projects.find((p) => p.title === hovered);

  /* Floating preview follows the cursor over the project list (desktop only) */
  const onListMove = (e: MouseEvent) => {
    const el = previewRef.current;
    if (!el) return;
    const w = 360;
    const flip = e.clientX > window.innerWidth - w - 80;
    const x = flip ? e.clientX - w - 32 : e.clientX + 32;
    const y = Math.max(16, Math.min(e.clientY - 120, window.innerHeight - 340));
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  return (
    <section id="projects" className="relative bg-black text-white [overflow-anchor:none]">
      {/* ───────────── FILTERS ───────────── */}
      <div className="sticky top-0 z-30 border-y border-white/10 bg-black/90 backdrop-blur">
        <div className="mx-auto flex max-w-[88rem] gap-x-8 gap-y-1 overflow-x-auto px-6 sm:px-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              aria-pressed={active === f}
              className={`group relative shrink-0 py-4 text-sm font-medium transition-colors duration-300 ${
                active === f ? "text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {f}
              <sup className={`ml-1 text-xs ${active === f ? "text-[#aaeff3]" : "text-white/40"}`}>{countFor(f)}</sup>
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[#9fedf1] transition-transform duration-500 ease-out ${
                  active === f ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ───────────── PROJECT INDEX ───────────── */}
      <div
        className="mx-auto max-w-[88rem] px-6 pb-24 pt-4 sm:px-10"
        onMouseMove={onListMove}
        onMouseLeave={() => setHovered(null)}
      >
        <ul key={active} className={scrolling ? "pointer-events-none" : ""}>
          {visible.map((p, i) => (
            <li
              key={p.title}
              className="row-in group relative border-b border-white/10"
              style={{ animationDelay: `${i * 70}ms` }}
              onMouseEnter={() => setHovered(p.title)}
              onFocus={() => setHovered(p.title)}
              onBlur={() => setHovered(null)}
            >
              {/* row background wipe */}
              <span className="absolute inset-y-0 -inset-x-6 -z-0 origin-bottom scale-y-0 rounded-2xl bg-[#141414] transition-transform duration-500 ease-out group-hover:scale-y-100 group-focus-within:scale-y-100 sm:-inset-x-10" />

              <div className="relative grid items-start gap-x-8 gap-y-4 py-7 lg:grid-cols-12 lg:py-8">
                {/* Title */}
                <div className="lg:col-span-6">
                  <h2 className="font-display text-xl font-bold leading-tight tracking-tight transition-all duration-500 group-hover:translate-x-3 group-hover:text-[#acf0f4] group-focus-within:translate-x-3 sm:text-3xl">
                    <Link href="/contact" className="outline-none after:absolute after:inset-0 after:content-['']">
                      {p.title}
                    </Link>
                  </h2>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs lg:col-span-3 lg:pt-1">
                  <span className="rounded-full border border-[#76ABAE]/40 px-3 py-1 font-medium text-[#76ABAE]">{p.tag}</span>
                  <span className="text-white/45">{p.year}</span>
                </div>

                {/* Arrow */}
                <div className="hidden justify-end lg:col-span-3 lg:flex">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-all duration-500 group-hover:rotate-45 group-hover:border-[#76ABAE] group-hover:bg-[#76ABAE] group-hover:text-[#222831] group-focus-within:rotate-45 group-focus-within:bg-[#76ABAE] group-focus-within:text-[#222831]">
                    <ArrowUpRight size={20} />
                  </span>
                </div>

                {/* Description: always visible on mobile, expands on hover on desktop */}
                <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out lg:col-span-6 lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-within:grid-rows-[1fr]">
                  <div data-desc className="overflow-hidden">
                    <p className="max-w-xl text-sm leading-relaxed text-white/65">{p.text}</p>
                  </div>
                </div>

                {/* Mobile image (desktop uses the cursor preview) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="aspect-[16/10] w-full rounded-xl object-cover lg:hidden"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Cursor-following preview (desktop) */}
      <div
        ref={previewRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-40 hidden w-[360px] transition-[opacity,scale] duration-300 lg:block ${
          hovered ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        style={{ transform: "translate3d(-999px,-999px,0)" }}
      >
        <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#141414] shadow-2xl shadow-black/40">
          <div className="relative aspect-[16/10]">
            {projects.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.title}
                src={p.image}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                  hovered === p.title ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
          <p className="p-4 text-xs leading-relaxed text-white/75">{hoveredProject?.overlay}</p>
        </div>
      </div>
    </section>
  );
}

/* ───────── scroll-reveal helpers (contact section) ───────── */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, seen };
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, seen } = useInView<HTMLDivElement>(0.12);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-[cubic-bezier(.2,.7,.2,1)] ${
        seen ? "translate-y-0 opacity-100 blur-0" : "translate-y-12 opacity-0 blur-md"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Rule() {
  const { ref, seen } = useInView<HTMLDivElement>(0.5);
  return <div ref={ref} className={`h-[3px] rounded-full bg-black transition-[width] delay-300 duration-1000 ease-out ${seen ? "w-14" : "w-0"}`} />;
}

/* ───────── contact information ───────── */
const contactItems = [
  { icon: Phone, label: "Phone", value: "+91 9847980605", href: "tel:+919847980605" },
  { icon: Mail, label: "Email", value: "info@empireae.xyz", href: "mailto:info@empireae.xyz" },
  { icon: Clock, label: "Response Time", value: "Within 24 hours", href: undefined as string | undefined },
];

const FACEBOOK_URL = "https://www.facebook.com/empireaeitservices";
const INSTAGRAM_URL = "https://instagram.com/empire_ae_official?vrfl=eGo4Y2Fkb3c2anpo";
const LINKEDIN_URL = "https://www.linkedin.com/company/empireaeitservices";

const socialLink =
  "flex-1 whitespace-nowrap rounded-full border border-black/20 px-2 py-1.5 text-center text-xs font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:text-white sm:flex-none sm:px-3.5 sm:text-[13px]";

const infoCard =
  "group/info flex h-full items-center gap-4 rounded-2xl border border-black/10 bg-neutral-50 p-5 transition-all duration-300 hover:translate-x-1 hover:border-black hover:shadow-[0_18px_40px_-16px_rgba(0,0,0,.25)]";
const infoIcon =
  "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-black text-white transition-transform duration-300 group-hover/info:-rotate-6";
const infoLabel = "text-xs font-semibold uppercase tracking-[0.1em] text-black/50";

function ContactInfo() {
  return (
    <section
      id="contact-info"
      className="relative z-10 -mt-px rounded-t-[2rem] bg-white text-black shadow-[0_-40px_80px_-20px_rgba(0,0,0,.6)] sm:rounded-t-[3rem]"
    >
      <div className="mx-auto grid max-w-[88rem] items-start gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16 lg:py-32">
        <div>
          <Reveal>
            <h2 className="font-display text-4xl font-bold leading-[1.1] text-black sm:text-5xl">Contact Information</h2>
          </Reveal>
          <div className="mt-5">
            <Rule />
          </div>
          <Reveal delay={150}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-black/70">
              Ready to take your business to the next level? Reach out to our team and let&apos;s make it happen.
            </p>
          </Reveal>
        </div>

        <div className="grid auto-rows-fr gap-4 xl:grid-cols-2">
          {contactItems.map(({ icon: Icon, label, value, href }, i) => (
            <Reveal key={label} delay={200 + i * 80} className="h-full">
              <div className={infoCard}>
                <span className={infoIcon}>
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <h3 className={infoLabel}>{label}</h3>
                  {href ? (
                    <a href={href} className="mt-0.5 inline-block break-words text-base font-semibold text-black underline-offset-4 hover:underline sm:text-lg">
                      {value}
                    </a>
                  ) : (
                    <span className="mt-0.5 inline-block text-base font-semibold text-black sm:text-lg">{value}</span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={440} className="h-full">
            <div className={infoCard}>
              <span className={infoIcon}>
                <Share2 size={20} strokeWidth={1.8} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className={infoLabel}>Follow Us</h3>
                <div className="mt-2 flex flex-nowrap gap-2">
                  <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={socialLink}>
                    Facebook
                  </a>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={socialLink}>
                    Instagram
                  </a>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={socialLink}>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────── projects stay pinned while the contact section slides over them ───────── */
function StackedProjects() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = NaN;
    const calc = () => {
      // Height of the list with every row collapsed, so hover animations never move the pin point.
      let extra = 0;
      if (window.matchMedia("(min-width: 1024px)").matches) {
        el.querySelectorAll<HTMLElement>("[data-desc]").forEach((d) => {
          extra += d.offsetHeight;
        });
      }
      // pin when the BOTTOM of the projects reaches the bottom of the screen (works for tall lists too)
      const top = Math.min(0, Math.round(window.innerHeight - (el.offsetHeight - extra)));
      if (top !== last) {
        last = top;
        el.style.top = `${top}px`;
      }
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    window.addEventListener("resize", calc);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", calc);
    };
  }, []);

  return (
    <div ref={ref} className="sticky z-0">
      <ProjectIndex />
    </div>
  );
}

/* =====================================================================
   WORDS SHOWCASE – Vision → Expertise → Success (pinned, GSAP scrub)
   Text only: big word + sentence per slide.
   ===================================================================== */
type WordSlide = {
  id: string;
  word: string;
  lines: string[];
  titleLeft: string; // left offset of the big word
  subLeft: string; // left offset of the sub text
};

const WORD_SLIDES: WordSlide[] = [
  {
    id: "vision",
    word: "Vision",
    lines: ["Imagining bold possibilities, shaping creative ideas, and envisioning a smarter digital future."],
    titleLeft: "15%",
    subLeft: "23%",
  },
  {
    id: "expertise",
    word: "Expertise",
    lines: [
      "Combining technology, creativity, and expertise to deliver innovative solutions that move businesses forward.",
    ],
    titleLeft: "36%",
    subLeft: "39%",
  },
  {
    id: "success",
    word: "Success",
    lines: ["Turning ideas into impact, challenges into opportunities, and ambitions into measurable digital growth."],
    titleLeft: "14%",
    subLeft: "20%",
  },
];

/** Splits a word into letters so each one can be animated. */
function ShowWord({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((ch, i) => (
          <span key={i} data-sw-ch className="sw-ch">
            {ch}
          </span>
        ))}
      </span>
    </>
  );
}

function WordsShowcase() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const slides = gsap.utils.toArray<HTMLElement>("[data-sw-slide]");
      const GAP = 2.6; // timeline units between the start of one word and the next

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${window.innerHeight * slides.length * 1.6}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      slides.forEach((slide, i) => {
        const chars = slide.querySelectorAll("[data-sw-ch]");
        const lines = slide.querySelectorAll("[data-sw-line]");

        // starting (hidden) state
        gsap.set(chars, { opacity: 0, filter: "blur(14px)", yPercent: 25 });
        gsap.set(lines, { opacity: 0, filter: "blur(10px)", y: 36, rotation: 2.5, transformOrigin: "0% 50%" });

        const t = i * GAP;

        // ── ENTER ──
        tl.to(chars, { opacity: 1, filter: "blur(0px)", yPercent: 0, duration: 1.1, stagger: 0.09, ease: "power2.out" }, t);
        tl.to(lines, { opacity: 1, filter: "blur(0px)", y: 0, rotation: 0, duration: 1, stagger: 0.18, ease: "power2.out" }, t + 0.6);

        // ── EXIT (the last word stays until the section unpins) ──
        if (i < slides.length - 1) {
          const out = t + 2.0;
          tl.to(lines, { opacity: 0, filter: "blur(10px)", y: -24, duration: 0.7, stagger: 0.08, ease: "power1.in" }, out);
          tl.to(chars, { opacity: 0, filter: "blur(14px)", yPercent: -20, duration: 0.8, stagger: 0.06, ease: "power1.in" }, out + 0.1);
        }
      });

      tl.to({}, { duration: 1 }); // short hold on the last word
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="sw-section" aria-label="What we do">
      <style>{SW_CSS}</style>

      {WORD_SLIDES.map((s) => (
        <div key={s.id} data-sw-slide className="sw-slide">
          <div className="sw-text">
            <div role="heading" aria-level={2} className="sw-title" style={{ "--tl": s.titleLeft } as CSSProperties}>
              <ShowWord text={s.word} />
            </div>

            <div className="sw-sub" style={{ "--sl": s.subLeft } as CSSProperties}>
              {s.lines.map((line) => (
                <p key={line} data-sw-line className="sw-line">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

/* =====================================================================
   6. STYLES
   ===================================================================== */

/* Global / hero styles */
const HOME_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Sans:wght@400;500;600;700&display=swap');
.home-root{font-family:'DM Sans',ui-sans-serif,system-ui,sans-serif}
.home-root h1,.home-root h2,.home-root h3{font-family:'Bricolage Grotesque','DM Sans',ui-sans-serif,system-ui,sans-serif;letter-spacing:-0.035em}
.home-root h1.hero-title{font-weight:300;letter-spacing:-0.02em}
.home-root .font-display{font-family:'Bricolage Grotesque','DM Sans',ui-sans-serif,system-ui,sans-serif}
.home-root h2.font-display{letter-spacing:-0.025em}
@keyframes up { from{opacity:0;transform:translateY(40px);filter:blur(8px)} to{opacity:1;transform:none;filter:blur(0)} }
@keyframes rowIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes grad { to{background-position:200% center} }
.up{opacity:0;animation:up 1s cubic-bezier(.2,.7,.2,1) forwards}
.row-in{animation:rowIn .6s cubic-bezier(.2,.8,.2,1) both}
.gtext{background:linear-gradient(100deg,#EEEEEE 0%,#76ABAE 30%,#EEEEEE 55%,#76ABAE 80%,#EEEEEE 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:grad 6s linear infinite}
.gtext-white{background:linear-gradient(100deg,#FFFFFF 0%,#B8B8B8 30%,#FFFFFF 55%,#B8B8B8 80%,#FFFFFF 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:grad 6s linear infinite}
.grain::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:60;opacity:.06;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
@media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}.up{opacity:1;filter:none}}
`;

/* Scroll text reveal + marquee + testimonials (scoped with "eae-") */
const EAE_CSS = `
/* Scroll text reveal */
.eae-reveal {
  position: relative;
  background: #000000;
  height: 300vh;
}
.eae-reveal-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  display: flex;
  align-items: center;
  background: #000000;
  overflow: hidden;
  padding-left: clamp(20px, 22vw, 440px);
  padding-right: clamp(20px, 5vw, 80px);
  box-sizing: border-box;
}
.eae-reveal-text {
  margin: 0;
  max-width: 1000px;
  width: 100%;
  text-align: justify;
  text-align-last: left;
  text-justify: inter-word;
  hyphens: none;
  word-break: normal;
  overflow-wrap: break-word;
  font-family: inherit;
  font-weight: 300;
  font-size: clamp(26px, 3.9vw, 57px);
  line-height: 1.3;
  letter-spacing: -0.01em;
}
@media (max-width: 1024px) {
  .eae-reveal-sticky { padding-left: clamp(24px, 10vw, 120px); }
}
@media (max-width: 640px) {
  .eae-reveal { height: 260vh; }
  .eae-reveal-sticky { padding-left: 20px; padding-right: 20px; }
  /* Justified text leaves wide gaps on narrow screens */
  .eae-reveal-text {
    text-align: left;
    font-size: clamp(26px, 7vw, 32px);
    line-height: 1.32;
  }
}
.eae-showcase {
  background: #000000;
  color: #ffffff;
  padding: clamp(120px, 16vw, 260px) 0 clamp(56px, 8vw, 120px);
  overflow-x: clip;
  font-family: inherit;
}

/* Marquee */
.eae-marquee { width: 100%; overflow: hidden; background: #000000; }
.eae-track {
  display: flex;
  width: max-content;
  animation: eae-marquee-ltr 45s linear infinite;
  will-change: transform;
}
.eae-marquee:hover .eae-track { animation-play-state: paused; }
.eae-group {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: clamp(32px, 4vw, 64px);
  padding: 0 clamp(32px, 4vw, 64px) 0 0;
  margin: 0;
  list-style: none;
}
.eae-client {
  font-size: clamp(16px, 1.6vw, 22px);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0;
  color: #f5f5f5;
  white-space: nowrap;
}
@keyframes eae-marquee-ltr {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
}

/* Testimonials */
.eae-container {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: clamp(56px, 8vw, 112px) clamp(20px, 5vw, 48px) 0;
  box-sizing: border-box;
}
.eae-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: clamp(40px, 6vw, 80px);
}
.eae-heading {
  margin: 0;
  font-size: clamp(30px, 4.2vw, 52px);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: #ffffff;
}
.eae-controls { display: flex; gap: 12px; flex-shrink: 0; }
.eae-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 50%;
  background: #292929;
  color: #ffffff;
  cursor: pointer;
  transition: background-color 180ms ease, transform 180ms ease;
}
.eae-arrow:hover { background: #3d3d3d; transform: scale(1.06); }
.eae-arrow:focus-visible { outline: 2px solid #ffffff; outline-offset: 3px; }

.eae-content {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(32px, 6vw, 96px);
  align-items: start;
  min-height: 280px;
  animation: eae-fade-slide 380ms ease both;
}
.eae-person { display: flex; align-items: center; gap: 20px; }
.eae-avatar {
  width: 76px;
  height: 76px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #292929;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  overflow: hidden;
}
.eae-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.eae-name { margin: 0; font-size: 20px; font-weight: 600; color: #ffffff; }
.eae-meta { margin: 4px 0 0; font-size: 16px; line-height: 1.4; color: #a3a3a3; }
.eae-quote {
  margin: 0;
  max-width: 680px;
  font-size: clamp(20px, 2.5vw, 34px);
  font-weight: 400;
  line-height: 1.4;
  color: #ffffff;
  text-align: left;
}
@keyframes eae-fade-slide {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 900px) {
  .eae-content { grid-template-columns: 1fr; min-height: 0; }
}
@media (max-width: 640px) {
  .eae-header { align-items: flex-start; gap: 16px; }
  .eae-person { gap: 16px; }
  .eae-arrow { width: 44px; height: 44px; }
  .eae-avatar { width: 64px; height: 64px; font-size: 20px; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .eae-track { animation: none; transform: none; }
  .eae-marquee { overflow-x: auto; }
  .eae-content { animation: none; }
  .eae-arrow { transition: none; }
}
`;

/* Services artwork animation */
const FW_CSS = `
@keyframes fw-drift-a { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(4%,-5%,0) scale(1.06); } }
@keyframes fw-drift-b { 0%,100% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(-5%,4%,0) rotate(8deg); } }
.fw-drift-a { animation: fw-drift-a 14s ease-in-out infinite; }
.fw-drift-b { animation: fw-drift-b 18s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .fw-drift-a, .fw-drift-b { animation: none; } }
`;

/* Words showcase (Vision / Expertise / Success) – scoped with "sw-" */
const SW_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..400&display=swap');

.sw-section {
  position: relative;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background: #000;
  color: #fff;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
}
.sw-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
}
.sw-text { position: relative; z-index: 1; width: 100%; padding-bottom: 4vh; }

/* big word */
.sw-title {
  padding-left: var(--tl);
  font-size: clamp(64px, 14.5vw, 250px);
  font-weight: 200;
  line-height: 1.05;
  letter-spacing: -0.04em;
  white-space: nowrap;
}
.sw-ch { display: inline-block; will-change: transform, filter, opacity; }

/* sub text */
.sw-sub { padding-left: var(--sl); margin-top: clamp(16px, 3vh, 44px); }
.sw-line {
  margin: 0;
  font-size: clamp(14px, 1.5vw, 22px);
  font-weight: 300;
  line-height: 1.9;
  color: #fff;
  will-change: transform, filter, opacity;
}

@media (max-width: 640px) {
  .sw-title { padding-left: 6vw; font-size: clamp(56px, 22vw, 120px); }
  .sw-sub { padding-left: 8vw; padding-right: 6vw; }
}

/* reduced motion: no pinning, show every word stacked */
@media (prefers-reduced-motion: reduce) {
  .sw-section { height: auto; overflow: visible; }
  .sw-slide { position: relative; min-height: 100svh; }
}
`;

/* =====================================================================
   7. PAGE (default export)
   ===================================================================== */
export default function Home() {
  // One global Lenis instance driven by GSAP's ticker (smooth scroll + ScrollTrigger sync).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: false, anchors: true });
    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return (
    <main className="home-root relative overflow-x-clip bg-[linear-gradient(180deg,#31363F_0%,#222831_22%,#31363F_50%,#222831_78%,#222831_100%)] text-[#EEEEEE] selection:bg-[#b4edf0] selection:text-[#222831]">
      <style>{HOME_CSS}</style>
      <style dangerouslySetInnerHTML={{ __html: EAE_CSS }} />
      <style>{FW_CSS}</style>
      <div className="grain" />

      {/* 1. HERO (video) */}
      <VideoHero />

      {/* 2. SCROLL TEXT REVEAL */}
      <ScrollTextReveal />

      {/* 3. CLIENT NAMES + REVIEWS */}
      <section className="eae-showcase">
        <ClientMarquee clients={CLIENT_NAMES} />
        <ClientTestimonials items={TESTIMONIALS} />
      </section>

      {/* 4. WORDS SHOWCASE (Vision / Expertise / Success) */}
      <WordsShowcase />

      {/* 5. SERVICES */}
      <ServicesSection />

      {/* 6. PROJECTS + CONTACT INFO (contact slides over projects) */}
      <div className="relative">
        <StackedProjects />
        <ContactInfo />
      </div>
    </main>
  );
}
