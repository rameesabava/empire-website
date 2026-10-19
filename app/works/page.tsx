"use client";

// app/works/page.tsx  — everything in ONE file (App Router, Tailwind, next/image).
// Hero: edit HERO_CARDS / INTRO_CARD.  Projects gallery: edit PROJECTS (section 7).
// To tune the feel: edit HERO_TIMING.

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";

/* ========================================================================== */
/* 1. Types                                                                   */
/* ========================================================================== */

interface StageSize {
  width: number;
  height: number;
}

interface HeroCardData {
  id: string;
  image: string; // path under /public, or URL (allow host in next.config)
  alt: string;
  title?: string;
  buttonLabel?: string;
  buttonHref?: string;
  textAlign?: "center" | "left";
  objectPosition?: string;
  size: StageSize; // size while NOT the active card (stage units)
}

type HeroPhase = "intro" | "fan" | "settled";

interface CardGeometry extends StageSize {
  x: number;
  y: number;
  zIndex: number;
}

/* ========================================================================== */
/* 2. Content — REPLACE IMAGES HERE                                           */
/* ========================================================================== */

// Offline placeholder portraits (data URIs). Replace each `image` with e.g.
// "/images/works/my-photo.jpg" once you have real files in /public.
function placeholder(bg: string, body: string, skin: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg}"/><stop offset="1" stop-color="#20262b"/></linearGradient></defs><rect width="600" height="900" fill="url(#g)"/><ellipse cx="300" cy="640" rx="230" ry="260" fill="${body}"/><rect x="268" y="400" width="64" height="120" rx="30" fill="${skin}"/><ellipse cx="300" cy="330" rx="92" ry="112" fill="${skin}"/><path d="M205 320c0-90 60-130 100-130s95 40 95 130c-20-50-60-70-100-70s-75 20-95 70z" fill="#2a1d18"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Shown automatically if any image URL fails to load.
const FALLBACK_IMAGE = placeholder("#9aa5ad", "#3a4650", "#c79678");

const INTRO_CARD: HeroCardData = {
  id: "intro-finance",
  image: "https://images.unsplash.com/photo-1595675024853-0f3ec9098ac7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  alt: "Finance lead looking thoughtfully off-camera",
  title: "Finance automation that puts you in charge",
  buttonLabel: "Request a demo",
  buttonHref: "#demo",
  objectPosition: "50% 25%",
  size: { width: 108, height: 180 },
};

const HERO_CARDS: HeroCardData[] = [
  {
    id: "tailored",
    image: "https://images.unsplash.com/photo-1595675024853-0f3ec9098ac7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    alt: "Woman with curly hair working at an outdoor cafe",
    title: "Tailored solutions for businesses of any type",
    buttonLabel: "Request a demo",
    buttonHref: "#demo",
    objectPosition: "50% 20%",
    size: { width: 134, height: 214 },
  },
  {
    id: "leaders",
    image:
      "https://images.unsplash.com/photo-1759215524472-1b0686fdbd87?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    alt: "Business leader on a call, touching his earpiece",
    title: "For business leaders",
    buttonLabel: "Request a demo",
    buttonHref: "#demo",
    objectPosition: "50% 25%",
    size: { width: 134, height: 198 },
  },
  {
    id: "control",
    image: "https://plus.unsplash.com/premium_photo-1723291331030-d6874d63e5bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    alt: "Woman in a green knit sweater reviewing her finances",
    title: "Take full control of finances",
    textAlign: "left",
    objectPosition: "50% 20%",
    size: { width: 122, height: 158 },
  },
  {
    id: "photo",
    image: "https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    alt: "Woman in a green sweater checking her phone on a terrace",
    objectPosition: "50% 30%",
    size: { width: 160, height: 114 },
  },
];

/* ========================================================================== */
/* 3. Animation + layout config                                               */
/* ========================================================================== */

const HERO_TIMING = {
  introHoldMs: 1100, // single card holds before the flip
  flipMs: 800, // 3D flip + spread
  flipStaggerMs: 70, // delay between cards
  moveMs: 700, // settle + carousel moves
  activeHoldMs: 2000, // time each card stays active
  initialActiveIndex: 1,
  flipEase: "cubic-bezier(0.65, 0, 0.35, 1)",
  moveEase: "cubic-bezier(0.22, 1, 0.36, 1)",
  perspectivePx: 700,
} as const;

const STAGE: StageSize = { width: 400, height: 260 };
const ACTIVE_CARD_SIZE: StageSize = { width: 134, height: 224 };
const LEFT_PEEK = 74;
const RIGHT_OFFSETS = [0, 76, 150, 210];
const SETTLED_SPAN = 384;
const FAN = { cardWidth: 74, spacing: 76 } as const;

function getCardGeometry(
  index: number,
  count: number,
  activeIndex: number,
  phase: HeroPhase,
  card: HeroCardData,
): CardGeometry {
  const centreY = (height: number) => (STAGE.height - height) / 2;

  if (phase === "intro") {
    const { width, height } = INTRO_CARD.size;
    return {
      width,
      height,
      x: (STAGE.width - width) / 2,
      y: centreY(height),
      zIndex: 20 - index,
    };
  }

  if (phase === "fan") {
    const span = (count - 1) * FAN.spacing + FAN.cardWidth;
    return {
      width: FAN.cardWidth,
      height: card.size.height,
      x: (STAGE.width - span) / 2 + index * FAN.spacing,
      y: centreY(card.size.height),
      zIndex: 20 - Math.abs(index - activeIndex),
    };
  }

  const distance = Math.abs(index - activeIndex);
  const size = distance === 0 ? ACTIVE_CARD_SIZE : card.size;
  const left =
    index <= activeIndex
      ? index * LEFT_PEEK
      : activeIndex * LEFT_PEEK +
        RIGHT_OFFSETS[Math.min(distance, RIGHT_OFFSETS.length - 1)];

  return {
    ...size,
    x: left + (STAGE.width - SETTLED_SPAN) / 2,
    y: centreY(size.height),
    zIndex: distance === 0 ? 30 : 20 - distance,
  };
}

// Ping-pong through the row: 1 -> 0 -> 1 -> 2 -> 3 -> 2 ...
function getNextIndex(current: number, direction: 1 | -1, count: number) {
  let nextDirection = direction;
  let next = current + direction;
  if (next < 0 || next >= count) {
    nextDirection = direction === 1 ? -1 : 1;
    next = current + nextDirection;
  }
  return { next, direction: nextDirection };
}

/* ========================================================================== */
/* 4. Styles (kept in this file)                                              */
/* ========================================================================== */

const HERO_CSS = `
.works-hero-stage-wrap{--stage-scale:.78;position:relative;max-width:100%;
  width:calc(400 * var(--stage-scale) * 1px);height:calc(260 * var(--stage-scale) * 1px)}
@media (max-width:389px){.works-hero-stage-wrap{--stage-scale:.66}}
@media (min-width:640px){.works-hero-stage-wrap{--stage-scale:1.2}}
@media (min-width:768px){.works-hero-stage-wrap{--stage-scale:1.45}}
@media (min-width:1024px){.works-hero-stage-wrap{--stage-scale:1.9}}
@media (min-width:1280px){.works-hero-stage-wrap{--stage-scale:2.2}}
.works-hero-stage{position:absolute;left:0;top:0;transform:scale(var(--stage-scale));transform-origin:top left}
.hero-card{will-change:transform;transition-property:transform,width,height,opacity;
  transition-duration:var(--hero-card-ms,700ms),var(--hero-card-ms,700ms),var(--hero-card-ms,700ms),250ms;
  transition-timing-function:var(--hero-card-ease,ease)}
.hero-card-flipper{position:relative;width:100%;height:100%;transform-style:preserve-3d;
  transition-property:transform;transition-duration:var(--hero-card-ms,700ms);
  transition-timing-function:var(--hero-card-ease,ease)}
.hero-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.hero-face-back{transform:rotateY(180deg)}
.hero-card-title{transition:font-size 700ms cubic-bezier(.22,1,.36,1)}
@media (prefers-reduced-motion:reduce){
  .hero-card,.hero-card-flipper,.hero-card-title{transition:none!important}
}`;

/* ========================================================================== */
/* 5. Card components                                                         */
/* ========================================================================== */

function CardFace({
  card,
  titleSize,
  priority = false,
}: {
  card: HeroCardData;
  titleSize: number;
  priority?: boolean;
}) {
  const alignment = card.textAlign === "left" ? "text-left" : "text-center";
  const [hasFailed, setHasFailed] = useState(false);
  const src = hasFailed ? FALLBACK_IMAGE : card.image;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[10px] bg-neutral-800">
      <Image
        src={src}
        alt={card.alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 300px, 200px"
        onError={() => setHasFailed(true)}
        // Remote URLs load directly, so no next.config "remotePatterns" is needed.
        // Remove the "http" check if you add remotePatterns and want optimization.
        unoptimized={
          src.startsWith("data:") || src.startsWith("http") || src.endsWith(".svg")
        }
        className="object-cover"
        style={{ objectPosition: card.objectPosition }}
      />

      {card.title && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[7px] p-[9px]">
            <p
              className={`hero-card-title font-medium leading-[1.08] tracking-[-0.02em] text-white ${alignment}`}
              style={{ fontSize: titleSize }}
            >
              {card.title}
            </p>
            {card.buttonLabel && (
              <a
                href={card.buttonHref ?? "#"}
                className="flex h-[15px] w-full items-center justify-center rounded-[5px] bg-[#F9BE00] text-[6.5px] font-medium text-neutral-900 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                {card.buttonLabel}
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface HeroCardProps {
  card: HeroCardData;
  frontCard?: HeroCardData;
  geometry: CardGeometry;
  isActive: boolean;
  isVisible: boolean;
  isFlipped: boolean;
  isInteractive: boolean;
  isFlipPhase: boolean;
  transitionMs: number;
  transitionDelayMs: number;
  onSelect: () => void;
}

function HeroCard({
  card,
  frontCard,
  geometry,
  isActive,
  isVisible,
  isFlipped,
  isInteractive,
  isFlipPhase,
  transitionMs,
  transitionDelayMs,
  onSelect,
}: HeroCardProps) {
  const outerStyle = {
    width: geometry.width,
    height: geometry.height,
    zIndex: geometry.zIndex,
    opacity: isVisible ? 1 : 0,
    transform: `translate3d(${geometry.x}px, ${geometry.y}px, 0)`,
    transitionDelay: `${transitionDelayMs}ms`,
    perspective: HERO_TIMING.perspectivePx,
    "--hero-card-ms": `${transitionMs}ms`,
    "--hero-card-ease": isFlipPhase ? HERO_TIMING.flipEase : HERO_TIMING.moveEase,
  } as CSSProperties;

  const flipperStyle: CSSProperties = {
    transform: `rotateY(${isFlipped ? -180 : 0}deg)`,
    transitionDelay: `${transitionDelayMs}ms`,
  };

  return (
    <div className="hero-card absolute left-0 top-0" style={outerStyle}>
      <div className="hero-card-flipper" style={flipperStyle}>
        <div className="hero-face">
          <CardFace card={frontCard ?? card} titleSize={12} priority />
        </div>
        <div className="hero-face hero-face-back">
          <CardFace card={card} titleSize={isActive ? 15 : 11.5} />
          {isInteractive && !isActive && (
            <button
              type="button"
              aria-label={`Show ${card.title ?? card.alt}`}
              onClick={onSelect}
              className="absolute inset-0 z-10 rounded-[10px] outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black"
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 6. Hero section                                                            */
/* ========================================================================== */

function WorksHero() {
  const [phase, setPhase] = useState<HeroPhase>("intro");
  const [activeIndex, setActiveIndex] = useState<number>(HERO_TIMING.initialActiveIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const directionRef = useRef<1 | -1>(-1);
  const count = HERO_CARDS.length;

  // Reduced-motion preference
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Intro -> flip -> settled
  useEffect(() => {
    if (prefersReducedMotion) {
      setPhase("settled");
      return;
    }
    if (phase === "intro") {
      const t = setTimeout(() => setPhase("fan"), HERO_TIMING.introHoldMs);
      return () => clearTimeout(t);
    }
    if (phase === "fan") {
      const total = HERO_TIMING.flipMs + (count - 1) * HERO_TIMING.flipStaggerMs;
      const t = setTimeout(() => setPhase("settled"), total);
      return () => clearTimeout(t);
    }
  }, [phase, prefersReducedMotion, count]);

  // Autoplay
  useEffect(() => {
    if (phase !== "settled" || isPaused || prefersReducedMotion) return;
    const t = setTimeout(() => {
      const { next, direction } = getNextIndex(activeIndex, directionRef.current, count);
      directionRef.current = direction;
      setActiveIndex(next);
    }, HERO_TIMING.activeHoldMs);
    return () => clearTimeout(t);
  }, [phase, activeIndex, isPaused, prefersReducedMotion, count]);

  const handleSelect = (index: number) => {
    directionRef.current = index > activeIndex ? 1 : -1;
    setActiveIndex(index);
  };

  const isFlipPhase = phase === "fan";

  return (
    <section
      aria-label="Featured work"
      className="sticky top-0 z-0 flex min-h-[70svh] w-full items-center justify-center overflow-x-clip bg-white px-4 py-12 sm:min-h-[78svh] sm:py-16"
    >
      <style>{HERO_CSS}</style>
      <h1 className="sr-only">Works</h1>

      <div
        className="works-hero-stage-wrap"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        <div className="works-hero-stage" style={{ width: STAGE.width, height: STAGE.height }}>
          {HERO_CARDS.map((card, index) => (
            <HeroCard
              key={card.id}
              card={card}
              frontCard={index === 0 ? INTRO_CARD : undefined}
              geometry={getCardGeometry(index, count, activeIndex, phase, card)}
              isActive={phase === "settled" && index === activeIndex}
              isVisible={phase !== "intro" || index === 0}
              isFlipped={phase !== "intro"}
              isInteractive={phase === "settled"}
              isFlipPhase={isFlipPhase}
              transitionMs={isFlipPhase ? HERO_TIMING.flipMs : HERO_TIMING.moveMs}
              transitionDelayMs={isFlipPhase ? index * HERO_TIMING.flipStaggerMs : 0}
              onSelect={() => handleSelect(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* 7. Projects showcase — types + data (EDIT PROJECTS HERE)                   */
/* ========================================================================== */

type ProjectCategory = "Web Development" | "Digital Marketing" | "App Development";
type FilterCategory = "All Projects" | ProjectCategory;
/** "light" = white text (for dark imagery), "dark" = near-black text (for light imagery). */
type OverlayTone = "light" | "dark";

interface Project {
  id: string; // MUST be unique across the whole PROJECTS list (used as the React key)
  title: string;
  description: string;
  category: ProjectCategory;
  image: string;
  imageAlt: string;
  overlayTone: OverlayTone;
  /** Optional. Relative paths use next/link, http(s) URLs open in a new tab. */
  href?: string;
  year?: string;
}

const FILTER_CATEGORIES: FilterCategory[] = [
  "All Projects",
  "Web Development",
  "Digital Marketing",
  "App Development",
];

// IMPORTANT: every `id` below must be different. Two cards with the same id
// make React throw a duplicate-key error on <ProjectCard key={project.id} />.
const PROJECTS: Project[] = [
  {
    id: "Nakshathra E-com",
    title: "Nakshathra Gold and Diamonds",
    description: "An e-commerce portal to get all the items of Nakshathra's collection online.",
    category: "Digital Marketing",
    image: "/images/Mobile App Logo/Nakshathra E-com.jpeg",
    imageAlt: "Nakshathra Gold and Diamonds logo",
    overlayTone: "dark",
    year: "2025",
  },
  {
    id: "Briyani House",
    title: "Briyani House",
    description:
      "Serves rich, flavorful biriyani made to satisfy every craving.",
    category: "Digital Marketing",
    image: "/images/dm/Briyani House.jpeg",
    imageAlt: "Briyani House logo",
    overlayTone: "light",
    href: "https://example.com",
    year: "2026",
  },
  {
    id: "Caior",
    title: "Caior",
    description:
      "Designs beautiful, functional interiors that turn your space into a home you love.",
    category: "Digital Marketing",
    image: "/images/dm/caior.jpeg",
    imageAlt: "Caior logo",
    overlayTone: "dark",
    year: "2025",
  },
  {
    id: "Credtree",
    title: "Credtree",
    description:
      "Helps you protect and grow your finances with the right financial and insurance solutions.",
    category: "Digital Marketing",
    image: "/images/dm/credtree.png",
    imageAlt: "Credtree logo",
    overlayTone: "light",
    year: "2026",
  },
  {
    id: "EGLeran",
    title: "EGLeran",
    description:
      "Builds practical skills and career-ready knowledge through focused, quality training.",
    category: "Digital Marketing",
    image: "/images/dm/EGL.jpg",
    imageAlt: "EGLeran logo",
    overlayTone: "dark",
    year: "2025",
  },
  {
    id: "Fira",
    title: "Fira",
    description:
      "Offers timeless gold and diamond jewellery crafted for life’s most precious moments.",
    category: "Digital Marketing",
    image: "/images/dm/Fira.jpeg",
    imageAlt: "Fira logo",
    overlayTone: "light",
    href: "https://example.com", // replace with your project URL
    year: "2026",
  },
  {
    id: "Js Glasses",
    title: "Js Glasses",
    description:
      "Offers stylish, comfortable eyewear that helps you see clearly and look great.",
    category: "Digital Marketing",
    image: "/images/dm/JS Glasses.jpeg",
    imageAlt: "Js Glasses logo",
    overlayTone: "dark",
    year: "2025",
  },
  {
    id: "Kesker",
    title: "Kesker",
    description: "Gives your car a showroom-fresh shine with professional detailing and protection services.",
    category: "Digital Marketing",
    image: "/images/dm/kesker .jpeg",
    imageAlt: "Kesker logo",
    overlayTone: "light",
    year: "2026",
  },
  {
    id: "le & lee",
    title: "le & lee",
    description: "Your destination for the latest bikes and a smooth buying experience.",
    category: "Digital Marketing",
    image: "/images/dm/le & lee.png",
    imageAlt: "le & lee logo",
    overlayTone: "dark",
    year: "2025",
  },
  {
    id: "MK Distributors",
    title: "MK Distributors",
    description: "Supplies quality A4 paper reliably for offices, schools, and print shops.",
    category: "Digital Marketing",
    image: "/images/dm/MK.jpeg",
    imageAlt: "MK Distributors logo",
    overlayTone: "dark",
    year: "2025",
  },
  {
    id: "sweero_logo_bg",
    title: "Sweero delights",
    description: " Brings you delicious, freshly made treats that make every moment sweeter.",
    category: "Digital Marketing",
    image: "/images/dm/sweero_logo_bg.png",
    imageAlt: "Sweero delights logo",
    overlayTone: "light",
    year: "2026",
  },
  {
    id: "Tantra",
    title: "Tantra",
    description: "Builds strong, well-planned spaces with quality construction you can depend on.",
    category: "Digital Marketing",
    image: "/images/dm/Tantra.jpeg",
    imageAlt: "Tantra logo",
    overlayTone: "dark",
    year: "2024",
  },
  {
    id: "Trav Around",
    title: "Trav Around",
    description: "Plans smooth, memorable trips so you can enjoy every destination without the stress.",
    category: "Digital Marketing",
    image: "/images/dm/Trav Around.jpeg",
    imageAlt: "Trav Around logo",
    overlayTone: "light",
    year: "2025",
  },
  {
    id: "YDU",
    title: "YDU",
    description: "Takes care of your accounting and bookkeeping needs so you can focus on growing your business.",
    category: "Digital Marketing",
    image: "/images/dm/YDU.jpeg",
    imageAlt: "YDU logo",
    overlayTone: "dark",
    year: "2026",
  },
  {
    // FIXED: this id was a duplicate of the first card ("Nakshathra E-com").
    id: "Nakshathra E-com App",
    title: "Nakshathra",
    description: "An e-commerce portal to get all the items of Nakshathra's collection online.",
    category: "App Development",
    image: "/images/Mobile App Logo/Nakshathra E-com.jpeg",
    imageAlt: "Nakshathra logo",
    overlayTone: "dark",
    year: "2025",
  },
  {
    id: "ZaraDesign",
    title: "Zara Design",
    description: "Designs elegant, comfortable interiors tailored to the way you live.",
    category: "Digital Marketing",
    image: "/images/dm/ZaraDesign.png-.png",
    imageAlt: "Zara Design logo",
    overlayTone: "light",
    year: "2024",
  },
  {
    id: "curefully",
    title: "Curefully",
    description: "Just like ordering food through Swiggy, order your medicines to be delivered to your doorstep.",
    category: "App Development",
    image: "/images/Mobile App Logo/curefully.jpeg",
    imageAlt: "Curefully logo",
    overlayTone: "light",
    year: "2026",
  },
  {
    id: "gabby talk",
    title: "Gabby Talk",
    description: " An application where you can converse, share and always feel like you have a friend by your side.",
    category: "App Development",
    image: "/images/Mobile App Logo/gabby talk.jpeg",
    imageAlt: "Gabby Talk logo",
    overlayTone: "dark",
    year: "2025",
  },
  {
    id: "heartmate",
    title: "Heartmate",
    description: "To help individuals find companionship with those whom they share a special bond.",
    category: "App Development",
    image: "/images/Mobile App Logo/heartmate.jpeg",
    imageAlt: "Heartmate logo",
    overlayTone: "dark",
    year: "2026",
  },
  {
    id: "kerala institute sales app",
    title: "Kerala Institute Sales",
    description: "Makes it easier for the institute's sales team to manage leads, follow-ups, and admissions with ease using their smartphones.",
    category: "App Development",
    image: "/images/Mobile App Logo/kerala institute sales app.jpeg",
    imageAlt: "Kerala Institute Sales logo",
    overlayTone: "light",
    year: "2025",
  },
  {
    id: "Nakshathra Scheme",
    title: "Nakshathra Scheme",
    description: "A great way for the customers to save money in convenient installments towards their purchases.",
    category: "App Development",
    image: "/images/Mobile App Logo/Nakshathra Scheme.jpeg",
    imageAlt: "Nakshathra Scheme logo",
    overlayTone: "dark",
    year: "2025",
  },
  {
    id: "Nakshathra Task",
    title: "Nakshathra",
    description: "An app where you can assign, monitor and complete all tasks within the team.",
    category: "App Development",
    image: "/images/Mobile App Logo/Nakshathra Task.jpeg",
    imageAlt: "Nakshathra Task logo",
    overlayTone: "dark",
    year: "2024",
  },
  {
    id: "suchiGo",
    title: "suchiGo",
    description: "An easy and efficient way to make waste collection and disposal process easy for your house.",
    category: "App Development",
    image: "/images/Mobile App Logo/suchiGo.jpeg",
    imageAlt: "suchiGo logo",
    overlayTone: "light",
    year: "2026",
  },
  {
    id: "AZB",
    title: "AZB",
    description: "Your one-stop store for everyday needs, with quality products at one place.",
    category: "Web Development",
    image: "/images/Web Logo/AZB.jpeg",
    imageAlt: "AZB logo",
    overlayTone: "light",
    year: "2025",
  },
  {
    id: "Devamshi",
    title: "Devamshi",
    description: "A boutique with custom-style outfits and fashion made to fit your taste.",
    category: "Web Development",
    image: "/images/Web Logo/Devamshi.jpeg",
    imageAlt: "Devamshi logo",
    overlayTone: "light",
    year: "2025",
  },
  {
    id: "Elaamy",
    title: "Elaamy",
    description: "Offers premium stationery and thoughtful gifts that make every occasion feel special.",
    category: "Web Development",
    image: "/images/Web Logo/Elaamy.jpeg",
    imageAlt: "Elaamy logo",
    overlayTone: "dark",
    year: "2024",
  },
  {
    id: "Ethenzaa",
    title: "Ethenzaa",
    description: "Your go-to online destination for stylish, comfortable clothing for every occasion.",
    category: "Web Development",
    image: "/images/Web Logo/Ethenzaa.jpeg",
    imageAlt: "Ethenzaa logo",
    overlayTone: "dark",
    year: "2026",
  },
  {
    id: "Falvor House",
    title: "Falvor House",
    description: "Delivers tasty, quality food items made to bring real flavor to your table.",
    category: "Web Development",
    image: "/images/Web Logo/Falvor House.jpeg",
    imageAlt: "Falvor House logo",
    overlayTone: "dark",
    year: "2025",
  },
  {
    id: "Nakshathra Hrms",
    title: "Nakshathra Hrms",
    description: "A comprehensive management system to keep Nakshathra's business working efficiently.",
    category: "Web Development",
    image: "/images/Mobile App Logo/Nakshathra Hrms.jpeg",
    imageAlt: "Nakshathra Hrms logo",
    overlayTone: "light",
    year: "2026",
  },
  {
    id: "Indoor petals",
    title: "Indoor petals",
    description: "Brings fresh greenery into your home with healthy indoor plants and easy gardening solutions.",
    category: "Web Development",
    image: "/images/Web Logo/Indoor petals.PNG",
    imageAlt: "Indoor petals logo",
    overlayTone: "light",
    year: "2026",
  },
  {
    id: "Miorah",
    title: "Miorah",
    description: "Offers elegant jewellery designed to add shine and style to every moment.",
    category: "Web Development",
    image: "/images/Web Logo/Miorah.jpeg",
    imageAlt: "Miorah logo",
    overlayTone: "dark",
    year: "2025",
  },
  {
    id: "Safe Zone",
    title: "Safe Zone",
    description: "Supports a healthier, cleaner lifestyle with trusted wellness and personal hygiene products.",
    category: "Web Development",
    image: "/images/Web Logo/Safe Zone.jpeg",
    imageAlt: "Safe Zone logo",
    overlayTone: "light",
    year: "2024",
  },
  {
    id: "Smylgiftings",
    title: "Smylgiftings",
    description: "Makes everyday writing and gifting more cheerful with cute and useful stationery.",
    category: "Web Development",
    image: "/images/Web Logo/Smylgiftings.jpeg",
    imageAlt: "Smylgiftings logo",
    overlayTone: "dark",
    year: "2026",
  },
  {
    id: "TheLAMPSYco",
    title: "TheLAMPSYco",
    description: "Brings you beauty and cosmetic products that help you look and feel your best.",
    category: "Web Development",
    image: "/images/Web Logo/TheLAMPSYco.jpeg",
    imageAlt: "TheLAMPSYco logo",
    overlayTone: "light",
    year: "2025",
  },
  {
    id: "Uruvi Designs",
    title: "Uruvi Designs",
    description: "Presents unique, trend-forward clothing designs for people who love to stand out.",
    category: "Web Development",
    image: "/images/Web Logo/Uruvi Designs.jpeg",
    imageAlt: "Uruvi Designs logo",
    overlayTone: "dark",
    year: "2024",
  },
  {
    id: "Nila",
    title: "Nila",
    description: "Serves wholesome, good-quality food products made with care.",
    category: "Web Development",
    image: "/images/Web Logo/Nila.jpeg",
    imageAlt: "Nila logo",
    overlayTone: "light",
    year: "2026",
  },
  {
    id: "Punyam",
    title: "Punyam",
    description: "Gives you astrology guidance to help you make confident decisions in life.",
    category: "Web Development",
    image: "/images/Web Logo/Punyam.jpeg",
    imageAlt: "Punyam logo",
    overlayTone: "dark",
    year: "2025",
  },
];

/* ========================================================================== */
/* 8. Projects showcase — behaviour                                           */
/* ========================================================================== */

const FILTER_SWAP_MS = 220;
const REVEAL_THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

const prefersReducedMotionNow = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Scroll-linked zoom. Writes a 0..1 value to the CSS variable --reveal on the
 * element (no React re-renders). Progress only ever increases, so a card never
 * shrinks again as it leaves through the top. Without IntersectionObserver or
 * with reduced motion the card simply stays at its normal size.
 */
function useScrollZoom<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    if (prefersReducedMotionNow()) return;

    let progress = 0;
    element.style.setProperty("--reveal", "0");

    const observer = new IntersectionObserver(
      ([entry]) => {
        let ratio = entry.intersectionRatio;
        // Card is at/above the "intended viewing position" -> fully revealed.
        if (
          ratio >= 0.97 ||
          (entry.isIntersecting && entry.boundingClientRect.top < window.innerHeight * 0.55)
        ) {
          ratio = 1;
        }
        if (ratio > progress) {
          progress = ratio;
          element.style.setProperty("--reveal", String(progress));
        }
      },
      { threshold: REVEAL_THRESHOLDS, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/** One-time fade-up for the section header. Stays visible if JS/observer is unavailable. */
function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    if (prefersReducedMotionNow()) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, state };
}

/* ------------------------------- Styles ----------------------------------- */

// Same rules for "expanded" via hover (mouse only), keyboard focus, or tap.
// When expanded the image fills the WHOLE card and is fitted (object-contain)
// inside it: the bottom padding reserves room for the title overlay, so the
// logo is never cropped or covered.
const expandedRules = (trigger: string) => `
${trigger}{transform:translate3d(0,-6px,0)}
${trigger} .works-project-image{height:100%}
${trigger} .works-project-img{padding:1rem 1rem 5.75rem}
${trigger} .works-project-scrim{opacity:1}
${trigger} .works-project-info{opacity:0}
${trigger} .works-project-overlay{opacity:1;transform:none;transition-delay:.14s,.1s}`;

const PROJECTS_CSS = `
.works-project-reveal{--s0:.88;--y0:20px;--reveal:1;
  opacity:calc(.7 + .3 * var(--reveal));
  transform:translate3d(0,calc((1 - var(--reveal)) * var(--y0)),0) scale(calc(var(--s0) + (1 - var(--s0)) * var(--reveal)));
  transition:transform .5s cubic-bezier(.22,1,.36,1),opacity .5s ease-out}
@media (max-width:767px){.works-project-reveal{--s0:.93;--y0:12px}}

.works-project-card{position:relative;display:block;height:24rem;border-radius:16px;overflow:hidden;
  isolation:isolate;background:#0d0d0d;color:#fff;cursor:pointer;outline:none;
  -webkit-tap-highlight-color:transparent;touch-action:manipulation;transform:translate3d(0,0,0);
  transition:transform .55s cubic-bezier(.65,0,.35,1)}
@media (min-width:640px){.works-project-card{height:26rem}}
@media (min-width:1024px){.works-project-card{height:28rem}}
.works-project-card:focus-visible{box-shadow:0 0 0 2px #000,0 0 0 4px #fff}
.works-project-info{position:absolute;inset:52% 0 0 0;z-index:0;overflow:hidden;
  padding:1rem 1.25rem;background:#0d0d0d;transition:opacity .3s ease}
@media (min-width:640px){.works-project-info{padding:1.25rem 1.5rem}}
.works-project-image{position:absolute;inset:0 0 auto 0;z-index:1;height:52%;overflow:hidden;
  background:#fff;transition:height .56s cubic-bezier(.65,0,.35,1)}
.works-project-img{object-fit:contain;object-position:center;
  transition:padding .56s cubic-bezier(.65,0,.35,1)}
.works-project-scrim{position:absolute;inset:0;opacity:0;pointer-events:none;transition:opacity .45s ease}
.works-project-scrim[data-tone="light"]{background:linear-gradient(to top,rgba(0,0,0,.8),rgba(0,0,0,.28) 28%,transparent 52%)}
.works-project-scrim[data-tone="dark"]{background:linear-gradient(to top,rgba(255,255,255,.85),rgba(255,255,255,.3) 28%,transparent 52%)}
.works-project-overlay{position:absolute;inset:auto 0 0 0;z-index:2;padding:1.25rem;opacity:0;
  transform:translateY(14px);pointer-events:none;
  transition:opacity .3s ease,transform .5s cubic-bezier(.22,1,.36,1)}
@media (min-width:640px){.works-project-overlay{padding:1.5rem}}
.works-project-overlay[data-tone="light"]{color:#fff}
.works-project-overlay[data-tone="dark"]{color:#0a0a0a}
${expandedRules('.works-project-card:is([data-expanded="true"],:focus-visible)')}
@media (hover:hover) and (pointer:fine){${expandedRules(".works-project-card:hover")}}

@media (prefers-reduced-motion:reduce){
  .works-project-reveal{transform:none!important;opacity:1!important;transition:none!important}
  .works-project-card,.works-project-image,.works-project-img,.works-project-scrim,
  .works-project-info,.works-project-overlay{transition:none!important}
  .works-project-card{transform:none!important}
}`;

/* ------------------------------ Components -------------------------------- */

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const revealRef = useScrollZoom<HTMLDivElement>();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasImageFailed, setHasImageFailed] = useState(false);

  const src = hasImageFailed ? FALLBACK_IMAGE : project.image;

  // Touch: tapping outside a tapped-open card closes it again.
  useEffect(() => {
    if (!isExpanded) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!revealRef.current?.contains(event.target as Node)) setIsExpanded(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isExpanded, revealRef]);

  // Touch / pen / phone emulation: first tap expands the card, second tap follows
  // the link (or closes the card when there is no link). Mouse users are unaffected.
  // The pointer type is read from the click itself, so this also works in browser
  // "phone view" where the (hover: none) media query is not always reliable.
  const handleActivate = (event: ReactMouseEvent<HTMLElement>) => {
    const pointerType = (event.nativeEvent as PointerEvent).pointerType;
    const isTouchLike =
      pointerType === "touch" ||
      pointerType === "pen" ||
      window.matchMedia("(hover: none)").matches;
    if (!isTouchLike) return;

    if (!isExpanded) {
      event.preventDefault();
      setIsExpanded(true);
    } else if (!project.href) {
      setIsExpanded(false);
    }
  };

  const content = (
    <>
      {/* Default information panel (the single accessible copy of the text) */}
      <div className="works-project-info">
        <span className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.16em] text-neutral-500 sm:text-[11px]">
          <span>{project.category}</span>
          {project.year && <span>{project.year}</span>}
        </span>
        <span className="mt-2 block text-xl font-medium leading-tight tracking-[-0.02em] text-white sm:mt-3 sm:text-[1.375rem] md:text-2xl">
          {project.title}
        </span>
        <span className="mt-2 block line-clamp-3 text-[13px] leading-relaxed text-neutral-400 sm:text-sm">
          {project.description}
        </span>
      </div>

      {/* Image: top half by default, expands to the whole card and fits inside it */}
      <div className="works-project-image">
        <Image
          src={src}
          alt={project.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          onError={() => setHasImageFailed(true)}
          unoptimized={
            src.startsWith("data:") || src.startsWith("http") || src.endsWith(".svg")
          }
          className="works-project-img object-contain p-4"
        />
        <span className="works-project-scrim" data-tone={project.overlayTone} aria-hidden="true" />
      </div>

      {/* Overlay copy shown on expand (decorative duplicate, hidden from screen readers) */}
      <div className="works-project-overlay" data-tone={project.overlayTone} aria-hidden="true">
        <span className="flex items-end justify-between gap-4">
          <span className="block">
            <span className="block text-xl font-medium leading-tight tracking-[-0.02em] sm:text-2xl">
              {project.title}
            </span>
            <span className="mt-2 block line-clamp-2 text-[13px] leading-relaxed opacity-80 sm:text-sm">
              {project.description}
            </span>
          </span>
          {project.href && <ArrowIcon />}
        </span>
      </div>
    </>
  );

  const cardClass = "works-project-card";
  const isExternal = project.href?.startsWith("http");

  return (
    <div ref={revealRef} className="works-project-reveal">
      {project.href && isExternal ? (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cardClass}
          data-expanded={isExpanded}
          onClick={handleActivate}
        >
          {content}
        </a>
      ) : project.href ? (
        <Link
          href={project.href}
          className={cardClass}
          data-expanded={isExpanded}
          onClick={handleActivate}
        >
          {content}
        </Link>
      ) : (
        <article
          tabIndex={0}
          aria-label={`${project.title} — ${project.category}`}
          className={cardClass}
          data-expanded={isExpanded}
          onClick={handleActivate}
        >
          {content}
        </article>
      )}
    </div>
  );
}

function ProjectsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("All Projects");
  const [displayedCategory, setDisplayedCategory] = useState<FilterCategory>("All Projects");
  const [isSwapping, setIsSwapping] = useState(false);
  const swapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const header = useRevealOnce<HTMLDivElement>();

  useEffect(
    () => () => {
      if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
    },
    [],
  );

  const filteredProjects = useMemo(
    () =>
      displayedCategory === "All Projects"
        ? PROJECTS
        : PROJECTS.filter((project) => project.category === displayedCategory),
    [displayedCategory],
  );

  const handleSelect = (category: FilterCategory) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
    if (swapTimerRef.current) clearTimeout(swapTimerRef.current);

    if (prefersReducedMotionNow()) {
      setDisplayedCategory(category);
      return;
    }

    // Fade the current cards out, swap the set, fade the new cards in.
    setIsSwapping(true);
    swapTimerRef.current = setTimeout(() => {
      setDisplayedCategory(category);
      setIsSwapping(false);
    }, FILTER_SWAP_MS);
  };

  const headerMotion =
    header.state === "idle"
      ? ""
      : `transition duration-700 ease-out motion-reduce:transition-none ${
          header.state === "hidden" ? "translate-y-5 opacity-0" : "translate-y-0 opacity-100"
        }`;

  return (
    <section
      aria-labelledby="works-projects-heading"
      className="works-projects-section relative z-10 w-full rounded-t-[1.5rem] bg-black px-4 py-16 text-white sm:rounded-t-[2rem] sm:px-8 sm:py-20 md:rounded-t-[3rem] md:py-28 lg:px-12 lg:py-32"
    >
      <style>{PROJECTS_CSS}</style>

      <div className="mx-auto w-full max-w-7xl">
        {/* Section introduction */}
        <div ref={header.ref} className={headerMotion}>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400 md:text-[13px]">
            Selected Work
          </p>
          <h2
            id="works-projects-heading"
            className="mt-4 max-w-3xl text-[clamp(1.875rem,6vw,4rem)] font-medium leading-[1.05] tracking-[-0.03em] sm:mt-5"
          >
            Ideas transformed into digital experiences.
          </h2>
          <p className="mt-4 max-w-[600px] text-[14px] leading-relaxed text-neutral-400 sm:mt-6 sm:text-[15px] md:text-[17px]">
            Explore a selection of websites, applications, and digital solutions designed to help
            businesses grow.
          </p>
        </div>

        {/* Category filter */}
        <div
          role="group"
          aria-label="Filter projects by category"
          className="mt-10 flex gap-5 overflow-x-auto border-b border-white/10 [scrollbar-width:none] sm:gap-8 md:mt-16 [&::-webkit-scrollbar]:hidden"
        >
          {FILTER_CATEGORIES.map((category) => {
            const isActive = category === selectedCategory;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleSelect(category)}
                className={`-mb-px shrink-0 whitespace-nowrap border-b-2 py-3 text-[13px] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white sm:py-4 sm:text-sm md:text-[15px] ${
                  isActive
                    ? "border-white text-white"
                    : "border-transparent text-neutral-500 hover:text-neutral-200"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <p role="status" className="sr-only">
          Showing {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
          {displayedCategory === "All Projects" ? "" : ` in ${displayedCategory}`}
        </p>

        {/* Project grid: 1 column on phones, 2 from 640px, 3 from 1024px */}
        <div
          className={`works-projects-grid mt-8 grid min-h-[24rem] grid-cols-1 gap-x-5 gap-y-8 transition duration-200 ease-out motion-reduce:transition-none sm:mt-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12 ${
            isSwapping ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========================================================================== */
/* 9. Page                                                                    */
/* ========================================================================== */

export default function WorksPage() {
  return (
    <main className="bg-black text-white">
      <WorksHero />
      <ProjectsShowcase />
    </main>
  );
}