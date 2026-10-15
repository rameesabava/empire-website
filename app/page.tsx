"use client";

/**
 * Empire AE – HOME PAGE (single file)
 *
 * Section order:
 *   1. Video hero (4 videos, auto-advancing)
 *   2. Scroll text reveal (per-character)
 *   3. Brand showcase (black -> white) + Client reviews (scroll-controlled, mouse reveal)
 *   4. Words showcase (Vision / Expertise / Success, pinned, text only)
 *   5. Services (concave scroll layout)
 *   6. Projects (pinned circular wheel)  +  Contact info
 *
 * Requires:  npm install gsap lenis lucide-react
 * Save as:   app/page.tsx
 *
 * Lenis (smooth scroll) is started once in Home() and drives GSAP ScrollTrigger.
 * If your layout.tsx already runs Lenis, delete the Lenis effect in Home()
 * and add `lenis.on("scroll", ScrollTrigger.update)` to your existing setup.
 */

import { useState, useEffect, useRef, ReactNode, type CSSProperties, type RefObject } from "react";
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
     hero-1.jfif (poster + thumbnail in the "Next" card; one per slide is optional)
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
    poster: "/videos/hero-1.jfif",
    title: "Digital Solutions That Put You Ahead",
    text: "Empire AE delivers innovative digital solutions that empower businesses to grow and succeed.",
    cta: "View all works",
    href: "/portfolio",
  },
  {
    video: "/videos/hero-2.mp4",
    poster: "/videos/hero-1.jfif",
    title: "Websites Built to Convert",
    text: "Fast, responsive and beautifully designed websites that turn visitors into loyal customers.",
    cta: "Explore web design",
    href: "/services",
  },
  {
    video: "/videos/hero-3.mp4",
    poster: "/videos/hero-1.jfif",
    title: "Apps People Love to Use",
    text: "Powerful Android and iOS apps engineered for seamless experiences and real business growth.",
    cta: "See mobile apps",
    href: "/services",
  },
  {
    video: "/videos/hero-4.mp4",
    poster: "/videos/hero-1.jfif",
    title: "Growth You Can Measure",
    text: "SEO and digital marketing strategies that raise your visibility and bring customers to your door.",
    cta: "Grow with us",
    href: "/services",
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
    <section className="relative isolate flex h-[100svh] min-h-[560px] w-full items-end overflow-hidden bg-[#222831]">
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

      <div className="mx-auto w-full max-w-[1500px] px-5 pb-32 sm:px-12 sm:pb-44 lg:px-[10%] lg:pb-36">
        {/* key remounts the text so the entrance animation replays on every slide */}
        <div key={current} className="max-w-3xl">
          <h1
            className="hero-title up mt-6 text-[clamp(2.25rem,9vw,3rem)] font-light leading-[1.12] text-[#EEEEEE] sm:text-6xl xl:text-7xl"
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
      <div className="absolute bottom-8 right-20 hidden w-[min(450px,44vw)] overflow-hidden bg-[#222831]/70 backdrop-blur-md sm:flex lg:right-[7%] lg:w-[min(450px,34vw)]">
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

      {/* progress bars for phones (the "Next" card is hidden there) */}
      <div className="absolute bottom-[3.75rem] left-5 right-5 flex gap-2 sm:hidden">
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
   2. SCROLL TEXT REVEAL (per-character)
   ===================================================================== */

const TEXT =
  "At Empire AE, we believe technology should feel effortless, inspire the people who use it, and help ambitious businesses grow. We are here to build digital experiences that move your business forward.";

// Words are kept as unbreakable units so wrapping stays natural;
// each word's letters are individual spans.
const WORD_LIST = TEXT.split(" ");

const DIM = 0x45; // #454545
const BRIGHT = 0xff; // #ffffff

// How many characters make up the soft "leading edge" of the reveal.
const EDGE = 8;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

function ScrollTextReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const paragraph = paragraphRef.current;
    if (!section || !paragraph) return;

    // DOM order of the spans is the reading order.
    const chars = Array.from(paragraph.querySelectorAll<HTMLSpanElement>("[data-char]"));
    const count = chars.length;
    if (!count) return;

    // Last painted channel value per character (avoids redundant style writes).
    const applied = new Array<number>(count).fill(-1);

    const paint = (i: number, t: number) => {
      const c = Math.round(DIM + (BRIGHT - DIM) * t);
      if (applied[i] !== c) {
        applied[i] = c;
        chars[i].style.color = `rgb(${c}, ${c}, ${c})`;
      }
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion: show the whole sentence in white, no scroll animation.
    if (reduceMotion) {
      for (let i = 0; i < count; i++) paint(i, 1);
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;

      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress = scrollable > 0 ? clamp(-rect.top / scrollable) : 1;

      // Reveal front moves from before the first character to past the last,
      // so char 0 starts dim at progress 0 and the last char is white at 1.
      const front = progress * (count + EDGE);

      for (let i = 0; i < count; i++) {
        paint(i, clamp((front - i) / EDGE));
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    // Section/paragraph size can change when the font loads or text rewraps.
    const ro = new ResizeObserver(schedule);
    ro.observe(paragraph);
    ro.observe(section);

    if (document.fonts?.ready) {
      document.fonts.ready.then(schedule).catch(() => {});
    }

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="eae-reveal">
      <div className="eae-reveal-sticky">
        <p ref={paragraphRef} className="eae-reveal-text">
          {/* One coherent sentence for assistive tech */}
          <span className="eae-sr-only">{TEXT}</span>

          <span aria-hidden="true">
            {WORD_LIST.map((word, w) => (
              <span key={`w-${w}`}>
                <span className="eae-word">
                  {Array.from(word).map((char, c) => (
                    <span key={`c-${w}-${c}`} data-char className="eae-char">
                      {char}
                    </span>
                  ))}
                </span>
                {w < WORD_LIST.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}

/* =====================================================================
   3. DEMO DATA (replace with approved testimonials later)
   ===================================================================== */

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

/* =====================================================================
   3a. BRAND SHOWCASE (GSAP: six clipped slots, logos swap group by group)
   ===================================================================== */

const SHOWCASE_HEADING = "Brands using GSAP®";

/* ---------------------------------------------------------------------
   Showcase theme: a strict, BINARY switch driven by scroll position.
   ---------------------------------------------------------------------
   The showcase is themed only through the CSS variables --bs-bg / --bs-fg,
   which every logo, border and decoration already reads. The section is
   exactly one of two states, never anything in between:

     default      -> DARK  (#000000 background, #FFFFFF text)
     .is-light    -> LIGHT (#FFFFFF background, #000000 text)  = reviews section

   One ScrollTrigger toggles the `is-light` class. There is no tween, no
   gradient and no CSS transition, so no intermediate shade can ever appear.
   EAE_CSS below reads LIGHT.bg for the reviews section too, so they match.
   --------------------------------------------------------------------- */
const THEME_DARK = { bg: "#000000", fg: "#FFFFFF" };
const THEME_LIGHT = { bg: "#FFFFFF", fg: "#000000" };

// The switch point. "bottom 80%" = the showcase's lower edge has risen to 80%
// of the viewport height, i.e. the reviews section now occupies the bottom 20%
// of the screen. Above this scroll position: black. At or below it: white.
// Tune this one string to switch earlier or later.
const THEME_SWITCH_AT = "bottom 80%";

type Dir = "up" | "down" | "left" | "right";

type Variant =
  | "intel" | "youtube" | "netflix" | "amazon" | "ford" | "samsung"
  | "ea" | "nike" | "aol" | "gucci" | "mcdonalds" | "microsoft";

type Brand = {
  name: string;
  variant: Variant;
  /** Optional: path to a real SVG in /public (e.g. "/logos/nike.svg").
   *  When set it is drawn with a CSS mask instead of the text mark. */
  src?: string;
};

// Add more groups here. Every group needs the same number of brands
// (one per slot) and the loop will cycle through them in this order.
const BRAND_GROUPS: Brand[][] = [
  [
    { name: "Intel", variant: "intel" },
    { name: "YouTube", variant: "youtube" },
    { name: "Netflix", variant: "netflix" },
    { name: "Amazon", variant: "amazon" },
    { name: "Ford", variant: "ford" },
    { name: "Samsung", variant: "samsung" },
  ],
  [
    { name: "EA Games", variant: "ea" },
    { name: "Nike", variant: "nike" },
    { name: "AOL", variant: "aol" },
    { name: "Gucci", variant: "gucci" },
    { name: "McDonald's", variant: "mcdonalds" },
    { name: "Microsoft", variant: "microsoft" },
  ],
];

// Per-slot motion.
//   exit      = direction the old logo travels while it leaves its slot
//   enterFrom = side the new logo comes in from
const SLOT_MOTION: { exit: Dir; enterFrom: Dir }[] = [
  { exit: "left", enterFrom: "up" },
  { exit: "down", enterFrom: "right" },
  { exit: "right", enterFrom: "down" },
  { exit: "down", enterFrom: "left" },
  { exit: "left", enterFrom: "down" },
  { exit: "down", enterFrom: "right" },
];

// Timing in seconds.
const TIMING = {
  hold: 2.2, // how long a group stays on screen
  stagger: 0.2, // delay between neighbouring slots
  exitDuration: 0.32,
  gap: 0.32, // empty moment between a logo leaving and the next arriving
  enterDuration: 0.48,
};

// xPercent / yPercent offsets that push a logo fully out of its slot.
const vec = (d: Dir) => {
  switch (d) {
    case "left": return { xPercent: -100, yPercent: 0 };
    case "right": return { xPercent: 100, yPercent: 0 };
    case "up": return { xPercent: 0, yPercent: -100 };
    default: return { xPercent: 0, yPercent: 100 };
  }
};

// Text used by the simple one-word marks.
const MARK_TEXT: Partial<Record<Variant, string>> = {
  intel: "intel",
  netflix: "NETFLIX",
  ford: "Ford",
  samsung: "SAMSUNG",
  nike: "NIKE",
  aol: "Aol.",
  gucci: "GUCCI",
};

function LogoMark({ brand }: { brand: Brand }) {
  if (brand.src) {
    return (
      <span
        role="img"
        aria-label={brand.name}
        className="eae-bs-mask"
        style={{ WebkitMaskImage: `url(${brand.src})`, maskImage: `url(${brand.src})` }}
      />
    );
  }

  switch (brand.variant) {
    case "youtube":
      return (
        <span role="img" aria-label={brand.name} className="eae-mk eae-mk-yt">
          You<span className="eae-mk-yt-box">Tube</span>
        </span>
      );
    case "amazon":
      return (
        <span role="img" aria-label={brand.name} className="eae-mk eae-mk-amz">
          <span>amazon</span>
          <i aria-hidden="true" />
        </span>
      );
    case "ea":
      return (
        <span role="img" aria-label={brand.name} className="eae-mk eae-mk-ea">
          <span>EA</span>
          <small>GAMES</small>
        </span>
      );
    case "mcdonalds":
      return (
        <span role="img" aria-label={brand.name} className="eae-mk eae-mk-mcd">
          <svg viewBox="0 0 24 20" aria-hidden="true">
            <path d="M3 19V8C3 -1.5 12 -1.5 12 9C12 -1.5 21 -1.5 21 8V19" />
          </svg>
        </span>
      );
    case "microsoft":
      return (
        <span role="img" aria-label={brand.name} className="eae-mk eae-mk-ms">
          <span className="eae-mk-ms-grid" aria-hidden="true">
            <b /><b /><b /><b />
          </span>
          <span>Microsoft</span>
        </span>
      );
    default:
      return (
        <span role="img" aria-label={brand.name} className={`eae-mk eae-mk-${brand.variant}`}>
          {MARK_TEXT[brand.variant]}
        </span>
      );
  }
}

function BrandShowcase({ groups }: { groups: Brand[][] }) {
  const sectionRef = useRef<HTMLElement>(null);
  // itemRefs.current[group][slot] -> the logo element for that slot in that group
  const itemRefs = useRef<(HTMLDivElement | null)[][]>([]);

  const slotCount = groups[0]?.length ?? 0;

  /* ---- Logo swap timeline ---------------------------------------------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || groups.length < 2 || slotCount === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    // matchMedia cleans up everything created inside it, and lets visitors
    // with reduced motion keep the static first group (see CSS).
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const { hold, stagger, exitDuration, gap, enterDuration } = TIMING;
      const transition = (slotCount - 1) * stagger + exitDuration + gap + enterDuration;
      const cycle = hold + transition;

      const tl = gsap.timeline({ paused: true, repeat: -1 });

      groups.forEach((_, g) => {
        const next = (g + 1) % groups.length;
        const start = g * cycle + hold;

        for (let s = 0; s < slotCount; s++) {
          const out = itemRefs.current[g]?.[s];
          const incoming = itemRefs.current[next]?.[s];
          const motion = SLOT_MOTION[s % SLOT_MOTION.length];
          if (!out || !incoming) continue;

          const tOut = start + s * stagger;
          const tIn = tOut + exitDuration + gap;
          const away = vec(motion.exit);
          const from = vec(motion.enterFrom);

          // Old logo slides out of its clipped slot, then fades at the very end.
          tl.fromTo(
            out,
            { xPercent: 0, yPercent: 0 },
            { ...away, duration: exitDuration, ease: "power2.in", immediateRender: false },
            tOut
          );
          tl.fromTo(
            out,
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: exitDuration * 0.4, ease: "none", immediateRender: false },
            tOut + exitDuration * 0.6
          );

          // New logo slides into the same slot from its own side.
          tl.fromTo(
            incoming,
            { ...from },
            { xPercent: 0, yPercent: 0, duration: enterDuration, ease: "power3.out", immediateRender: false },
            tIn
          );
          tl.fromTo(
            incoming,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: enterDuration * 0.35, ease: "none", immediateRender: false },
            tIn
          );
        }
      });

      // Only run while the section is on screen.
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      });
    });

    return () => mm.revert();
  }, [groups, slotCount]);

  /* ---- Binary theme switch (black <-> white) ---------------------------
     Active from THEME_SWITCH_AT to the end of the page => `is-light` on.
     Because the state comes from the scroll position itself, fast scrolling,
     jumps and scrolling back up always land on the correct theme. It only
     toggles a class, so it cannot touch the logo timeline. Cleanup kills the
     trigger and removes the class, so Strict Mode leaves exactly one trigger.
     --------------------------------------------------------------------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const st = ScrollTrigger.create({
      trigger: section,
      start: THEME_SWITCH_AT,
      end: "max",
      toggleClass: { targets: section, className: "is-light" },
    });

    return () => {
      st.kill();
      section.classList.remove("is-light");
    };
  }, []);

  return (
    <section ref={sectionRef} className="eae-bs" aria-label={SHOWCASE_HEADING}>
      <div className="eae-bs-row">
        {Array.from({ length: slotCount }, (_, s) => (
          <div key={s} className="eae-bs-slot">
            {groups.map((group, g) => (
              <div
                key={`${g}-${group[s].name}`}
                ref={(node) => {
                  if (!itemRefs.current[g]) itemRefs.current[g] = [];
                  itemRefs.current[g][s] = node;
                }}
                className={`eae-bs-logo${g === 0 ? " is-active" : ""}`}
              >
                <LogoMark brand={group[s]} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* =====================================================================
   3b. CLIENT TESTIMONIALS
   ===================================================================== */

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
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

/* =====================================================================
   3c. MOUSE REVEAL (Client Reviews only)
   =====================================================================
   A canvas that fills the review section, BEHIND the review content. Where
   nothing is revealed it paints nothing, so the section stays pure white.
   Where the cursor has been it shows a slowly drifting animated layer.

   1. A smoothed copy of the cursor follows the real pointer (exponential
      ease), so the reveal trails slightly and never jumps.
   2. Cursor speed -> "energy" (fast attack, slow release). Energy drives
      blob size and strength: a stopped cursor settles back to clean white.
   3. Each frame, soft radial blobs are stamped into an offscreen MASK along
      the path travelled, stretched in the direction of motion and jittered
      with sin() noise, so the edge is feathered and organic. The mask fades
      every frame, which is the trail.
   4. The animated layer is drawn, then clipped with `destination-in` + mask.

   It only listens to pointer movement. It never reads wheel/touch/keys, so
   it cannot advance reviews, and review transitions never restart it.
   Touch: tap-to-reveal. Reduced motion: disabled (clean white surface).
   ===================================================================== */

// Colours of the revealed layer only. The section background is untouched.
const REVEAL_COLORS = ["#bceae8", "#7fd6d1", "#f1dfdf", "#d7f1f7"];

const REVEAL = {
  scale: 0.5, // canvas resolution relative to CSS px
  follow: 0.1, // seconds: how loosely the reveal trails the cursor
  attack: 0.08, // seconds: energy rise time
  release: 0.6, // seconds: energy fall time (how soon it settles once stopped)
  trail: 0.28, // seconds: mask fade time constant (trail length)
  fullSpeed: 700, // px/s that counts as "full energy"
};

// The animated layer: slowly drifting colour blobs and a soft moving highlight.
function drawRevealLayer(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number
) {
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.fillStyle = REVEAL_COLORS[3];
  ctx.fillRect(0, 0, w, h);

  const m = Math.max(w, h);
  const blobs = [
    { c: REVEAL_COLORS[0], fx: 0.23, fy: 0.31, px: 0.0, py: 1.2, r: 0.55 },
    { c: REVEAL_COLORS[1], fx: 0.17, fy: 0.27, px: 2.1, py: 0.4, r: 0.42 },
    { c: REVEAL_COLORS[2], fx: 0.29, fy: 0.19, px: 4.2, py: 2.6, r: 0.5 },
    { c: REVEAL_COLORS[0], fx: 0.13, fy: 0.35, px: 1.1, py: 3.3, r: 0.38 },
    { c: REVEAL_COLORS[1], fx: 0.21, fy: 0.15, px: 5.0, py: 0.9, r: 0.3 },
  ];

  for (const b of blobs) {
    const x = w * (0.5 + 0.45 * Math.sin(t * b.fx * 2 + b.px));
    const y = h * (0.5 + 0.45 * Math.cos(t * b.fy * 2 + b.py));
    const r = m * b.r;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, b.c);
    g.addColorStop(1, `${b.c}00`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  // Soft highlight band drifting across the layer.
  const bx = ((t * 0.05) % 1) * w * 1.6 - w * 0.3;
  const band = ctx.createLinearGradient(bx, 0, bx + w * 0.35, h);
  band.addColorStop(0, "rgba(255,255,255,0)");
  band.addColorStop(0.5, "rgba(255,255,255,0.35)");
  band.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = band;
  ctx.fillRect(0, 0, w, h);
}

function MouseReveal({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    // Reduced motion: no effect at all, the surface simply stays clean white.
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const dctx = canvas.getContext("2d");
      const mask = document.createElement("canvas");
      const mctx = mask.getContext("2d");
      if (!dctx || !mctx) return;

      const S = REVEAL.scale;
      let W = 1;
      let H = 1;

      // State (plain variables: no React updates on pointer movement).
      const pointer = { cx: 0, cy: 0, valid: false };
      let tap: { cx: number; cy: number } | null = null;
      let sx = 0, sy = 0; // smoothed position, section-relative CSS px
      let psx = 0, psy = 0; // previous smoothed position
      let heading = 0;
      let energy = 0;
      let wasInside = false;
      let time = 0;
      let lastStamp = -999;
      let idleCleared = true;
      let visible = false;

      const resize = () => {
        const r = section.getBoundingClientRect();
        W = Math.max(1, Math.round(r.width * S));
        H = Math.max(1, Math.round(r.height * S));
        canvas.width = mask.width = W;
        canvas.height = mask.height = H;
        idleCleared = false;
        lastStamp = -999;
      };

      const stamp = (x: number, y: number, r: number, a: number, e: number) => {
        mctx.save();
        mctx.translate(x * S, y * S);
        mctx.rotate(heading);
        // Stretch along the direction of travel for a fluid, organic feel.
        mctx.scale(1 + 0.55 * e, 1 / (1 + 0.25 * e));
        for (let i = 0; i < 3; i++) {
          const ang = time * (0.9 + 0.45 * i) + i * 2.1;
          const ox = Math.cos(ang) * r * 0.26 * S;
          const oy = Math.sin(ang * 1.3) * r * 0.26 * S;
          const rr = r * S * (0.78 + 0.22 * Math.sin(time * 1.7 + i * 1.9));
          const g = mctx.createRadialGradient(ox, oy, 0, ox, oy, rr);
          g.addColorStop(0, `rgba(0,0,0,${a})`);
          g.addColorStop(0.45, `rgba(0,0,0,${a * 0.7})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          mctx.fillStyle = g;
          mctx.beginPath();
          mctx.arc(ox, oy, rr, 0, Math.PI * 2);
          mctx.fill();
        }
        mctx.restore();
      };

      const tick = (_time: number, deltaMs: number) => {
        if (!visible) return;
        const dt = Math.min(deltaMs, 50) / 1000;
        if (dt <= 0) return;
        time += dt;

        // Pointer relative to THIS section, re-read every frame so the reveal
        // stays aligned while the page scrolls or the viewport resizes.
        const rect = section.getBoundingClientRect();
        const within = (cx: number, cy: number) =>
          cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
        const inside = pointer.valid && within(pointer.cx, pointer.cy);

        if (tap) {
          if (within(tap.cx, tap.cy)) {
            sx = psx = tap.cx - rect.left;
            sy = psy = tap.cy - rect.top;
            energy = 1;
          }
          tap = null;
        }

        if (inside) {
          const tx = pointer.cx - rect.left;
          const ty = pointer.cy - rect.top;
          if (!wasInside) {
            sx = psx = tx; // snap on entry so there is no sweep from an old spot
            sy = psy = ty;
          }
          const k = 1 - Math.exp(-dt / REVEAL.follow);
          sx += (tx - sx) * k;
          sy += (ty - sy) * k;
        }
        wasInside = inside;

        const dist = Math.hypot(sx - psx, sy - psy);
        const speed = dist / dt;
        const target = inside ? Math.pow(clamp(speed / REVEAL.fullSpeed), 0.7) : 0;
        const tau = target > energy ? REVEAL.attack : REVEAL.release;
        energy += (target - energy) * (1 - Math.exp(-dt / tau));
        if (dist > 0.5) heading = Math.atan2(sy - psy, sx - psx);

        const active = energy > 0.02 || time - lastStamp < 2;
        if (!active) {
          if (!idleCleared) {
            mctx.clearRect(0, 0, W, H);
            canvas.style.opacity = "0";
            idleCleared = true;
          }
          psx = sx;
          psy = sy;
          return;
        }

        // Fade the mask (this is the trail), then stamp along the path.
        mctx.globalCompositeOperation = "destination-out";
        mctx.fillStyle = `rgba(0,0,0,${1 - Math.exp(-dt / REVEAL.trail)})`;
        mctx.fillRect(0, 0, W, H);
        mctx.globalCompositeOperation = "source-over";

        if (energy > 0.02) {
          const R = clamp(Math.min(rect.width, rect.height) * 0.3, 110, 300);
          const r = R * (0.35 + 0.65 * energy);
          const a = clamp(energy * 1.8) * 0.95;
          const steps = Math.min(24, Math.max(1, Math.ceil(dist / Math.max(4, r * 0.35))));
          for (let i = 1; i <= steps; i++) {
            const f = i / steps;
            stamp(psx + (sx - psx) * f, psy + (sy - psy) * f, r, a, energy);
          }
          lastStamp = time;
        }
        psx = sx;
        psy = sy;

        // Animated layer, clipped by the mask.
        dctx.globalCompositeOperation = "source-over";
        drawRevealLayer(dctx, W, H, time);
        dctx.globalCompositeOperation = "destination-in";
        dctx.drawImage(mask, 0, 0);
        dctx.globalCompositeOperation = "source-over";

        canvas.style.opacity = "1";
        idleCleared = false;
      };

      /* ---- Input: pointer only (never wheel / touchmove / keys) ---- */
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        pointer.cx = e.clientX;
        pointer.cy = e.clientY;
        pointer.valid = true;
      };
      const onDown = (e: PointerEvent) => {
        if (e.pointerType !== "touch") return;
        tap = { cx: e.clientX, cy: e.clientY }; // tap-to-reveal on touch
      };
      const onLeave = () => {
        pointer.valid = false;
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      document.addEventListener("mouseleave", onLeave);
      window.addEventListener("blur", onLeave);

      const ro = new ResizeObserver(resize);
      ro.observe(section);
      resize();

      // Only work while the section is on screen.
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(section);

      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        document.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("blur", onLeave);
        canvas.style.opacity = "0";
      };
    });

    return () => mm.revert();
  }, [sectionRef]);

  return <canvas ref={canvasRef} className="eae-rv-canvas" aria-hidden="true" />;
}

/* ---------------------------------------------------------------------
   Tuning
   --------------------------------------------------------------------- */
const SLIDE_DURATION = 0.8; // seconds per horizontal transition
const SLIDE_EASE = "power3.inOut";
// The section counts as "active" (wheel/touch/keys control the reviews) once
// its top is within this many px of the viewport top and it still covers it.
const ENGAGE_TOP_PX = 48;
// Wheel: px of accumulated delta that count as an intentional gesture, and
// the pause (ms) between wheel events that separates one gesture from the next.
// Trackpad momentum is one gesture, so a single swipe moves exactly one review.
const WHEEL_THRESHOLD = 30;
const WHEEL_GESTURE_GAP_MS = 100;
const TOUCH_THRESHOLD = 40; // px swipe distance

type Step = 1 | -1; // 1 = next (enters from the right), -1 = previous (enters from the left)

function ClientTestimonials({ items }: { items: Testimonial[] }) {
  const count = items.length;
  const sectionRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Source of truth for logic. React state is only mirrored for aria + the
  // arrow buttons, and is set once per transition (never per wheel event).
  const indexRef = useRef(0);
  const busyRef = useRef(false);
  const stepRef = useRef<((step: Step) => boolean) | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || count === 0) return;

    indexRef.current = 0;
    busyRef.current = false;
    setActive(0);

    // Scopes every tween created below; revert() on cleanup kills them all.
    const ctx = gsap.context(() => {}, section);

    /* ---- One transition. Directions are explicit (not a reversed play) ---- */
    const step = (dir: Step): boolean => {
      if (busyRef.current) return false;

      const from = indexRef.current;
      const to = from + dir;
      if (to < 0 || to >= count) return false;

      const outgoing = slideRefs.current[from];
      const incoming = slideRefs.current[to];
      if (!outgoing || !incoming) return false;

      indexRef.current = to;
      setActive(to);

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      ctx.add(() => {
        // Reduced motion: swap instantly, still scroll-controlled.
        if (reduceMotion) {
          gsap.set(outgoing, { autoAlpha: 0, xPercent: 0 });
          gsap.set(incoming, { autoAlpha: 1, xPercent: 0 });
          return;
        }

        busyRef.current = true;
        const D = SLIDE_DURATION;

        gsap
          .timeline({
            onComplete: () => {
              busyRef.current = false;
            },
          })
          // Incoming: from the right (dir 1) or from the left (dir -1) to centre.
          .fromTo(
            incoming,
            { xPercent: 100 * dir },
            { xPercent: 0, duration: D, ease: SLIDE_EASE },
            0
          )
          .fromTo(
            incoming,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: D * 0.7, ease: "none" },
            0
          )
          // Outgoing: to the left (dir 1) or to the right (dir -1).
          .fromTo(
            outgoing,
            { xPercent: 0 },
            { xPercent: -100 * dir, duration: D, ease: SLIDE_EASE },
            0
          )
          .fromTo(
            outgoing,
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: D * 0.7, ease: "none" },
            D * 0.3
          );
      });

      return true;
    };
    stepRef.current = step;

    /* ---- Is the review stage currently in control of the viewport? ---- */
    const isActive = () => {
      const r = section.getBoundingClientRect();
      return r.top <= ENGAGE_TOP_PX && r.bottom >= window.innerHeight - ENGAGE_TOP_PX;
    };

    // Don't hijack the wheel from an independently scrollable child.
    const canScrollInside = (target: EventTarget | null, delta: number) => {
      let node = target instanceof HTMLElement ? target : null;
      while (node && node !== section) {
        const oy = getComputedStyle(node).overflowY;
        if ((oy === "auto" || oy === "scroll") && node.scrollHeight > node.clientHeight) {
          const atTop = node.scrollTop <= 0;
          const atBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
          if (delta < 0 ? !atTop : !atBottom) return true;
        }
        node = node.parentElement;
      }
      return false;
    };

    /* ---- Wheel / trackpad ---------------------------------------------
       A "gesture" = a run of wheel events with gaps < WHEEL_GESTURE_GAP_MS.
       - A gesture that STARTS while the section is not active (e.g. the
         momentum that carried the page here) is ignored for its whole length.
       - An active gesture moves at most one review, then its remaining
         momentum is swallowed so it can't skip or scroll the page.
       - A gesture that would go past the first/last review is never
         intercepted, so the page scrolls on natively (no trap).
       ------------------------------------------------------------------ */
    let lastWheel = 0;
    let wArmed = false;
    let wConsumed = false;
    let acc = 0;

    const toPx = (e: WheelEvent, v: number) =>
      e.deltaMode === 1 ? v * 16 : e.deltaMode === 2 ? v * window.innerHeight : v;

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom

      const now = performance.now();
      if (now - lastWheel > WHEEL_GESTURE_GAP_MS) {
        wArmed = isActive();
        wConsumed = false;
        acc = 0;
      }
      lastWheel = now;
      if (!wArmed) return;

      const dx = toPx(e, e.deltaX);
      const dy = toPx(e, e.deltaY);
      const horizontal = Math.abs(dx) > Math.abs(dy);
      const delta = horizontal ? dx : dy;
      if (delta === 0) return;

      if (!horizontal && canScrollInside(e.target, delta)) {
        wArmed = false;
        return;
      }

      // Transition running, or momentum after one: swallow, don't advance again.
      if (wConsumed || busyRef.current) {
        wConsumed = true;
        if (e.cancelable) e.preventDefault();
        return;
      }

      const dir: Step = delta > 0 ? 1 : -1;
      const to = indexRef.current + dir;

      if (to < 0 || to >= count) {
        // Horizontal swipes can't leave the section vertically; swallow them
        // (also avoids the browser's back/forward swipe). Vertical ones leave.
        if (horizontal) {
          if (e.cancelable) e.preventDefault();
          return;
        }
        wArmed = false; // native scroll takes over for this whole gesture
        return;
      }

      if (e.cancelable) e.preventDefault();
      acc += delta;
      if (Math.abs(acc) >= WHEEL_THRESHOLD) {
        wConsumed = true;
        step(acc > 0 ? 1 : -1);
      }
    };

    /* ---- Touch: swipe up / left = next, swipe down / right = previous ---- */
    let tArmed = false;
    let tConsumed = false;
    let sx = 0;
    let sy = 0;

    const onTouchStart = (e: TouchEvent) => {
      tArmed = e.touches.length === 1 && isActive();
      tConsumed = false;
      if (tArmed) {
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tArmed) return;
      if (e.touches.length !== 1) {
        tArmed = false;
        return;
      }
      const t = e.touches[0];
      const dx = sx - t.clientX;
      const dy = sy - t.clientY;
      const horizontal = Math.abs(dx) > Math.abs(dy);
      const d = horizontal ? dx : dy;
      if (d === 0) return;

      if (tConsumed || busyRef.current) {
        tConsumed = true;
        if (e.cancelable) e.preventDefault();
        return;
      }

      const dir: Step = d > 0 ? 1 : -1;
      const to = indexRef.current + dir;
      if (to < 0 || to >= count) {
        if (horizontal) {
          if (e.cancelable) e.preventDefault();
          return;
        }
        tArmed = false; // let the page scroll out of the section
        return;
      }

      // Decided on the first move so the browser never starts a page scroll.
      if (e.cancelable) e.preventDefault();
      if (Math.abs(d) >= TOUCH_THRESHOLD) {
        tConsumed = true;
        step(dir);
      }
    };

    /* ---- Keyboard: Left / Right arrows while the section is active ---- */
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (!isActive()) return;
      if (step(e.key === "ArrowRight" ? 1 : -1)) e.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      stepRef.current = null;
      ctx.revert();
      indexRef.current = 0;
      busyRef.current = false;
    };
  }, [count]);

  if (count === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="eae-showcase"
      /* Lenis must not also scroll the page on wheel/touch inside this stage;
         this component handles those events itself. */
      data-lenis-prevent
      aria-roledescription="carousel"
      aria-label="Client reviews"
    >
      <MouseReveal sectionRef={sectionRef} />

      <div className="eae-container">
        <div className="eae-header">
          <h2 className="eae-heading">What clients say about us</h2>
          <div className="eae-controls">
            <button
              type="button"
              className="eae-arrow"
              onClick={() => stepRef.current?.(-1)}
              disabled={active === 0}
              aria-label="Previous testimonial"
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              className="eae-arrow"
              onClick={() => stepRef.current?.(1)}
              disabled={active === count - 1}
              aria-label="Next testimonial"
            >
              <Chevron direction="right" />
            </button>
          </div>
        </div>

        {/* Stationary stage: every review shares one grid cell, so the stage is
            as tall as the tallest review and only the content slides. */}
        <div className="eae-viewport" aria-live="polite">
          {items.map((item, i) => (
            <div
              key={item.id}
              ref={(node) => {
                slideRefs.current[i] = node;
              }}
              className={`eae-slide${i === 0 ? " eae-slide--initial" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== active}
            >
              <div className="eae-content">
                <div className="eae-person">
                  <div className="eae-avatar" aria-hidden="true">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt="" />
                    ) : (
                      getInitials(item.name)
                    )}
                  </div>
                  <div>
                    <p className="eae-name">{item.name}</p>
                    <p className="eae-meta">{item.role}</p>
                    <p className="eae-meta">{item.company}</p>
                  </div>
                </div>

                <blockquote className="eae-quote">{item.review}</blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
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
   5. PROJECTS (circular wheel) + CONTACT INFO
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

/* ---- Circular project wheel: pinned, scroll rotates the projects around a big ring ---- */
function ProjectsWheel() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All Projects");
  const [idx, setIdx] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  const visible = filter === "All Projects" ? projects : projects.filter((p) => p.category === filter);
  const countFor = (f: (typeof filters)[number]) =>
    f === "All Projects" ? projects.length : projects.filter((p) => p.category === f).length;
  const safeIdx = Math.min(idx, visible.length - 1);
  const active = visible[safeIdx];

  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    if (!root || !ring) return;

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-pw-card]"));
    const n = cards.length;
    if (!n) return;

    const DEG = 180 / Math.PI;
    const proxy = { v: 0 }; // fractional index of the card at the top of the wheel
    let R = 600; // ring radius (px)
    let step = 0.3; // angle between neighbouring cards (rad)
    let shown = -1;

    // Sizes depend on the screen, so everything is measured, never hard-coded.
    const measure = () => {
      const W = root.clientWidth;
      const H = root.clientHeight;
      const cw = cards[0].offsetWidth || 300;
      const cardY = Math.round(H * (W < 768 ? 0.72 : 0.7));
      R = Math.max(W * 0.85, 520);
      step = (cw * 1.16) / R;
      gsap.set(cards, { top: cardY, xPercent: -50, yPercent: -50 });
      Object.assign(ring.style, {
        width: `${R * 2}px`,
        height: `${R * 2}px`,
        left: `${W / 2 - R}px`,
        top: `${cardY}px`,
      });
    };

    // Put every card on the circle for the current rotation.
    const render = () => {
      const v = proxy.v;
      cards.forEach((el, i) => {
        const d = i - v;
        const ad = Math.abs(d);
        const a = d * step;
        gsap.set(el, {
          x: R * Math.sin(a),
          y: R * (1 - Math.cos(a)),
          rotation: a * DEG,
          scale: 1.06 - Math.min(ad, 2) * 0.15,
          autoAlpha: ad > 3 ? 0 : Math.max(0.18, 1 - ad * 0.32),
          zIndex: Math.round(20 - ad * 3),
        });
      });
      gsap.set(ring, { rotation: -v * step * DEG });
      if (barRef.current) barRef.current.style.transform = `scaleX(${n > 1 ? v / (n - 1) : 1})`;
      const i = Math.round(v);
      if (i !== shown) {
        shown = i;
        setIdx(i);
      }
    };

    const ctx = gsap.context(() => {
      measure();
      render();

      if (n > 1) {
        const H0 = 0.2; // short hold before and after the rotation
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${Math.round(root.clientHeight * ((n - 1) * 0.7 + 0.4))}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to({}, { duration: H0 });
        tl.to(proxy, { v: n - 1, duration: n - 1, onUpdate: render });
        tl.to({}, { duration: H0 });
        stRef.current = tl.scrollTrigger ?? null;
      }
    }, root);

    const ro = new ResizeObserver(() => {
      measure();
      render();
    });
    ro.observe(root);

    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (cancelled) return;
      measure();
      render();
      ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      ro.disconnect();
      ctx.revert();
      stRef.current = null;
    };
  }, [filter]);

  /* Jump the wheel to card i by scrolling to its position inside the pinned range. */
  const goTo = (i: number) => {
    const st = stRef.current;
    if (!st || i === safeIdx) return;
    const n = visible.length;
    const frac = (0.2 + i) / (n - 1 + 0.4);
    const y = st.start + (st.end - st.start) * frac;
    if (lenisInstance) lenisInstance.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const pick = (f: (typeof filters)[number]) => {
    if (f === filter) return;
    const st = stRef.current;
    if (st) {
      // go back to the start of the pinned range so the new (shorter/longer) wheel starts at card 1
      if (lenisInstance) lenisInstance.scrollTo(st.start, { immediate: true });
      else window.scrollTo(0, st.start);
    }
    setIdx(0);
    setFilter(f);
  };

  return (
    <section id="projects" ref={rootRef} className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-black text-white">
      {/* ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_85%,rgba(118,171,174,.16),transparent_70%)]"
      />

      {/* the ring the cards ride on (rotates with the scroll) */}
      <div ref={ringRef} aria-hidden="true" className="pointer-events-none absolute">
        <div className="absolute inset-0 rounded-full border border-white/15" />
        <div className="absolute rounded-full border border-dashed border-white/10" style={{ inset: "-6%" }} />
        <div className="absolute rounded-full border border-white/[0.07]" style={{ inset: "9%" }} />
        {[0, 72, 144, 216, 288].map((a) => (
          <span key={a} className="absolute inset-0" style={{ transform: `rotate(${a}deg)` }}>
            <i className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#9fedf1]/80" />
          </span>
        ))}
      </div>

      {/* project cards, placed on the ring by GSAP */}
      {visible.map((p, i) => (
        <div
          key={p.title}
          data-pw-card
          role="button"
          tabIndex={0}
          aria-label={`Show ${p.title}`}
          aria-current={i === safeIdx ? "true" : undefined}
          onClick={() => goTo(i)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              goTo(i);
            }
          }}
          className="absolute left-1/2 top-0 w-[clamp(200px,26vw,420px)] cursor-pointer outline-none"
          style={{ opacity: 0 }}
        >
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/15 bg-[#141414] shadow-2xl shadow-black/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt="" draggable={false} loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3 sm:p-4">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/80 sm:text-xs">{p.category}</span>
              <span className="font-display text-lg text-white/90 sm:text-2xl">{String(i + 1).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      ))}

      {/* text + filters (sits above the cards, lets clicks through) */}
      <div className="pointer-events-none relative z-30 mx-auto flex h-full max-w-[88rem] flex-col px-5 pb-6 pt-24 sm:px-10 sm:pt-28">
        <div className="pointer-events-auto -mx-1 flex gap-x-6 overflow-x-auto px-1 [scrollbar-width:none] sm:gap-x-8 [&::-webkit-scrollbar]:hidden">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => pick(f)}
              aria-pressed={filter === f}
              className={`group relative shrink-0 py-2 text-sm font-medium transition-colors duration-300 ${
                filter === f ? "text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {f}
              <sup className={`ml-1 text-xs ${filter === f ? "text-[#aaeff3]" : "text-white/40"}`}>{countFor(f)}</sup>
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[#9fedf1] transition-transform duration-500 ease-out ${
                  filter === f ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                }`}
              />
            </button>
          ))}
        </div>

        {/* key remounts the block so the entrance animation replays for each project */}
        <div key={active.title} aria-live="polite" className="mt-6 max-w-2xl sm:mt-8">
          <div className="up flex items-center gap-3 text-xs" style={{ animationDelay: ".05s" }}>
            <span className="rounded-full border border-[#76ABAE]/40 px-3 py-1 font-medium text-[#76ABAE]">{active.tag}</span>
            <span className="text-white/45">{active.year}</span>
          </div>
          <h2
            className="up mt-3 font-display text-[clamp(2rem,6vw,5rem)] font-bold leading-[1.02] tracking-tight"
            style={{ animationDelay: ".12s" }}
          >
            {active.title}
          </h2>
          <p className="up mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base" style={{ animationDelay: ".2s" }}>
            {active.text}
          </p>
          <Link
            href="/contact"
            className="pointer-events-auto up group mt-5 inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-[#9fedf1] sm:text-base"
            style={{ animationDelay: ".3s" }}
          >
            Start a similar project
            <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* counter + progress */}
      <div className="absolute inset-x-5 bottom-5 z-30 flex items-center gap-4 sm:inset-x-10">
        <span className="font-display text-sm tabular-nums text-white">
          {String(safeIdx + 1).padStart(2, "0")}
          <span className="text-white/40"> / {String(visible.length).padStart(2, "0")}</span>
        </span>
        <span className="relative h-px flex-1 bg-white/15">
          <span ref={barRef} className="absolute inset-0 origin-left bg-[#dff3f4]" style={{ transform: "scaleX(0)" }} />
        </span>
        {visible.length > 1 && <span className="hidden text-xs uppercase tracking-[0.18em] text-white/45 sm:block">Scroll to rotate</span>}
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
const INSTAGRAM_URL = "https://www.instagram.com/empire_ae_official/";
const LINKEDIN_URL = "https://www.linkedin.com/company/empireaeitservices";

const socialLink =
  "inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/20 px-3.5 py-1.5 text-[13px] font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

const infoCard =
  "group/info flex h-full min-w-0 items-center gap-4 rounded-2xl border border-black/10 bg-neutral-50 p-5 transition-all duration-300 hover:translate-x-1 hover:border-black hover:shadow-[0_18px_40px_-16px_rgba(0,0,0,.25)]";
const infoIcon =
  "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-black text-white transition-transform duration-300 group-hover/info:-rotate-6";
const infoLabel = "text-xs font-semibold uppercase tracking-[0.1em] text-black/50";

function ContactInfo() {
  return (
    <section
      id="contact-info" data-nav-theme="light"
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

        <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Empire AE on Facebook" className={socialLink}>
                    Facebook
                  </a>
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Empire AE on Instagram" className={socialLink}>
                    Instagram
                  </a>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="Empire AE on LinkedIn" className={socialLink}>
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
.home-root{font-family:'Inter',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif}
.home-root h1,.home-root h2,.home-root h3{font-family:'Inter',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;letter-spacing:-0.03em}
.home-root h1.hero-title{font-weight:300;letter-spacing:-0.02em}
.home-root .font-display{font-family:'Inter',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif}
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

/* Scroll text reveal + brand showcase + testimonials (scoped with "eae-") */
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
  justify-content: center;
  background: #000000;
  overflow: hidden;
  padding: 0 clamp(20px, 6vw, 96px);
  box-sizing: border-box;
}
.eae-reveal-text {
  margin: 0;
  width: 100%;
  max-width: 1000px;
  text-align: left;
  font-family: inherit;
  font-weight: 300;
  font-size: clamp(28px, 2.8vw, 44px);
  line-height: 1.2;
  letter-spacing: -0.02em;
  overflow-wrap: break-word;
}
/* Keeps each word intact so lines break between words only */
.eae-word { display: inline-block; white-space: nowrap; }
.eae-char { color: #454545; }
.eae-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
@media (max-width: 1024px) {
  .eae-reveal-text { font-size: clamp(24px, 3.6vw, 34px); }
}
@media (max-width: 640px) {
  .eae-reveal { height: 240vh; }
  .eae-reveal-text {
    font-size: clamp(22px, 5.8vw, 28px);
    line-height: 1.22;
  }
}
@media (prefers-reduced-motion: reduce) {
  .eae-reveal { height: auto; }
  .eae-reveal-sticky {
    position: relative;
    height: auto;
    min-height: 100svh;
    padding-top: 80px;
    padding-bottom: 80px;
  }
}

/* Testimonials section background: shares LIGHT.bg with the showcase theme */
.eae-showcase {
  background: ${THEME_LIGHT.bg};
  position: relative;
  isolation: isolate;
  color: #d7f1f7;
  padding: clamp(80px, 10vw, 160px) 0 clamp(56px, 8vw, 120px);
  overflow-x: clip;
  font-family: inherit;
  /* Full-height stage so the section can align with the viewport while the
     reviews are scroll-controlled */
  box-sizing: border-box;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Brand showcase: six clipped slots, logos swap with a staggered slide.
   --bs-bg / --bs-fg default to the black theme so the very first paint is
   correct. The scroll trigger toggles .is-light (binary, never animated). */
.eae-bs {
  --bs-bg: ${THEME_DARK.bg};
  --bs-fg: ${THEME_DARK.fg};
  --bs-fs: clamp(18px, 2.3vw, 40px); /* base logo size, everything scales from it */
  --bs-h: clamp(56px, 5.6vw, 96px);  /* slot height */
  background: var(--bs-bg);
  color: var(--bs-fg);
  padding: clamp(28px, 3vw, 48px) clamp(16px, 2vw, 32px) clamp(48px, 6vw, 96px);
  font-family: inherit;
  overflow: hidden;
}
/* Binary light state: toggled by the scroll trigger, never animated */
.eae-bs.is-light {
  --bs-bg: ${THEME_LIGHT.bg};
  --bs-fg: ${THEME_LIGHT.fg};
}
.eae-bs-heading {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 clamp(36px, 6vw, 96px);
  font-size: clamp(12px, 1.1vw, 15px);
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1;
  color: var(--bs-fg);
}
.eae-bs-brace {
  font-size: 2.6em;
  font-weight: 200;
  line-height: 0.7;
  transform: scaleX(0.7);
}
.eae-bs-row {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: clamp(12px, 2vw, 32px);
}
.eae-bs-slot {
  position: relative;
  height: var(--bs-h);
  overflow: hidden; /* each logo is clipped to its own slot */
}
.eae-bs-logo {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  visibility: hidden; /* GSAP reveals each logo with autoAlpha */
  opacity: 0;
  will-change: transform, opacity;
}
.eae-bs-logo.is-active { visibility: visible; opacity: 1; }

/* Text-based logo marks. Swap in real SVGs through the "src" field in BRAND_GROUPS. */
.eae-mk {
  display: inline-flex;
  align-items: center;
  font-size: var(--bs-fs);
  line-height: 1;
  white-space: nowrap;
  color: var(--bs-fg);
}
.eae-bs-mask {
  display: block;
  width: calc(var(--bs-fs) * 4);
  height: calc(var(--bs-fs) * 1.2);
  background: var(--bs-fg);
  -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
  -webkit-mask-position: left center; mask-position: left center;
  -webkit-mask-size: contain; mask-size: contain;
}
.eae-mk-intel { font-weight: 700; letter-spacing: -0.05em; font-size: calc(var(--bs-fs) * 1.1); }
.eae-mk-youtube, .eae-mk-yt { font-weight: 700; letter-spacing: -0.04em; font-size: calc(var(--bs-fs) * 0.85); }
.eae-mk-yt-box {
  margin-left: 0.12em;
  padding: 0.1em 0.22em;
  border-radius: 0.28em;
  background: var(--bs-fg);
  color: var(--bs-bg);
}
.eae-mk-netflix { font-weight: 800; letter-spacing: 0.02em; font-size: calc(var(--bs-fs) * 0.8); }
.eae-mk-amz { flex-direction: column; align-items: flex-start; gap: 0; font-weight: 700; letter-spacing: -0.04em; font-size: calc(var(--bs-fs) * 1); }
.eae-mk-amz i {
  display: block;
  width: 70%;
  height: 0.3em;
  margin: -0.08em 0 0 0.35em;
  border-bottom: 0.09em solid var(--bs-fg);
  border-radius: 0 0 60% 60%;
}
.eae-mk-ford {
  padding: 0.1em 0.7em 0.16em;
  border: 0.07em solid var(--bs-fg);
  border-radius: 50%;
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-weight: 700;
  font-size: calc(var(--bs-fs) * 0.8);
}
.eae-mk-samsung {
  padding: 0.35em 1em;
  border-radius: 50%;
  background: var(--bs-fg);
  color: var(--bs-bg);
  font-weight: 800;
  letter-spacing: 0.06em;
  font-size: calc(var(--bs-fs) * 0.5);
}
.eae-mk-ea { flex-direction: column; align-items: flex-start; font-style: italic; font-weight: 800; font-size: calc(var(--bs-fs) * 0.95); }
.eae-mk-ea small { font-size: 0.34em; font-style: normal; font-weight: 600; letter-spacing: 0.08em; margin-top: 0.15em; }
.eae-mk-nike { font-style: italic; font-weight: 900; letter-spacing: -0.04em; font-size: calc(var(--bs-fs) * 0.9); }
.eae-mk-aol { font-weight: 800; letter-spacing: -0.02em; font-size: calc(var(--bs-fs) * 1); }
.eae-mk-gucci { font-family: Georgia, "Times New Roman", serif; font-weight: 300; letter-spacing: 0.03em; font-size: calc(var(--bs-fs) * 0.95); }
.eae-mk-mcd svg {
  width: calc(var(--bs-fs) * 0.95);
  height: calc(var(--bs-fs) * 0.8);
  fill: none;
  stroke: var(--bs-fg);
  stroke-width: 3.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  overflow: visible;
}
.eae-mk-ms { gap: 0.25em; font-weight: 500; font-size: calc(var(--bs-fs) * 0.72); }
.eae-mk-ms-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.09em;
  width: 1.15em;
  height: 1.15em;
}
.eae-mk-ms-grid b { display: block; background: var(--bs-fg); }

/* Tablet and phone: same six slots, laid out as 3 x 2 so nothing overflows */
@media (max-width: 900px) {
  .eae-bs { --bs-fs: clamp(20px, 5.2vw, 34px); --bs-h: clamp(56px, 12vw, 84px); }
  .eae-bs-row { grid-template-columns: repeat(3, minmax(0, 1fr)); row-gap: clamp(8px, 3vw, 24px); }
}

/* Reduced motion: the first group stays put, nothing animates */
@media (prefers-reduced-motion: reduce) {
  .eae-bs-logo { transition: none; }
}

/* Testimonials */
.eae-container {
  position: relative;
  z-index: 1; /* review content stays above the reveal layer */
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
  color: #000000;
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
  background: #000000;
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
}
.eae-person { display: flex; align-items: center; gap: 20px; }
.eae-avatar {
  width: 76px;
  height: 76px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #000000;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  overflow: hidden;
}
.eae-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.eae-name { margin: 0; font-size: 20px; font-weight: 600; color: #444141; }
.eae-meta { margin: 4px 0 0; font-size: 16px; line-height: 1.4; color: #4b4545; }
.eae-quote {
  margin: 0;
  max-width: 680px;
  font-size: clamp(20px, 2.5vw, 34px);
  font-weight: 400;
  line-height: 1.4;
  color: #292626;
  text-align: left;
}
/* Mouse-reveal layer: behind the review content, transparent until revealed */
.eae-rv-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0;
  pointer-events: none;
}

/* Review stage: stationary, clipped, all slides share one grid cell */
.eae-viewport {
  position: relative;
  overflow: hidden;
  display: grid;
}
.eae-slide {
  grid-area: 1 / 1;
  min-width: 0;
  visibility: hidden; /* GSAP reveals slides with autoAlpha */
  opacity: 0;
  will-change: transform, opacity;
}
.eae-slide--initial { visibility: visible; opacity: 1; } /* first review: visible on first paint */
.eae-arrow:disabled { opacity: 0.35; cursor: default; }
.eae-arrow:disabled:hover { background: #000000; transform: none; }

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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

.sw-section {
  position: relative;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background: #000;
  color: #fff;
  font-family: 'Inter', ui-sans-serif, system-ui, 'Helvetica Neue', Arial, sans-serif;
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
  font-size: clamp(48px, min(14.5vw, 30svh), 250px);
  font-weight: 200;
  line-height: 1.05;
  letter-spacing: -0.04em;
  white-space: nowrap;
}
.sw-ch { display: inline-block; will-change: transform, filter, opacity; }

/* sub text */
.sw-sub { padding-left: var(--sl); padding-right: clamp(20px, 5vw, 80px); margin-top: clamp(16px, 3vh, 44px); }
.sw-line {
  margin: 0;
  font-size: clamp(14px, 1.5vw, 22px);
  font-weight: 300;
  line-height: 1.9;
  color: #fff;
  will-change: transform, filter, opacity;
}

@media (max-width: 640px) {
  .sw-title { padding-left: 6vw; font-size: clamp(44px, min(22vw, 26svh), 120px); }
  .sw-sub { padding-left: 8vw; padding-right: 6vw; }
}

@media (max-height: 500px) { .sw-line { line-height: 1.5; } }

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

      {/* 3. BRAND SHOWCASE (black -> white) + CLIENT REVIEWS */}
      <BrandShowcase groups={BRAND_GROUPS} />
      <ClientTestimonials items={TESTIMONIALS} />

      {/* 4. WORDS SHOWCASE (Vision / Expertise / Success) */}
      <WordsShowcase />

      {/* 5. SERVICES */}
      <ServicesSection />

      {/* 6. PROJECTS (circular wheel, pinned) + CONTACT INFO */}
      <div className="relative bg-black">
        <ProjectsWheel />
        <ContactInfo />
      </div>
    </main>
  );
}
