"use client";

// app/works/page.tsx  — everything in ONE file (App Router, Tailwind, next/image).
// To swap images/copy: edit HERO_CARDS / INTRO_CARD below.
// To tune the feel: edit HERO_TIMING.

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

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
      className="relative flex min-h-[78svh] w-full items-center justify-center overflow-x-clip bg-white px-4 py-16"
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
/* 7. Page                                                                    */
/* ========================================================================== */

export default function WorksPage() {
  return (
    <main>
      <WorksHero />
      {/* Keep your existing Works page content below the hero. */}
    </main>
  );
}