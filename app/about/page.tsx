"use client";

/**
 * About page – Empire AE
 * ----------------------
 * Where to put it:  app/about/page.tsx   (Next.js App Router + Tailwind CSS)
 *
 * How the animation works (no timers, no auto-play):
 *   Every animation is driven by ONE number: how far the user has scrolled
 *   through a section (0 = not started, 1 = finished).
 *   The hook `useScrollProgress` gives you that number, and each section
 *   turns it into a style (size, opacity, counter value, line width).
 *   Scroll up -> animation plays backwards. Stop scrolling -> it stops.
 */

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import Link from "next/link";
import Lenis from "lenis"; // smooth scrolling:  npm i lenis

/* ------------------------------------------------------------------ */
/* 1. Font                                                             */
/* ------------------------------------------------------------------ */

// This page does NOT load its own font. It inherits the font your site
// already uses (Inter in app/layout.tsx), so it matches every other page.
// Headings only add a weight and tight letter spacing, like "Our Services".

/* ------------------------------------------------------------------ */
/* 2. Scroll helpers                                                   */
/* ------------------------------------------------------------------ */

/** Keeps a number between a min and max. */
const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

/** Maps progress from one range to another, e.g. 0..1 -> 20..0 */
const mapRange = (
  p: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
) => outMin + clamp((p - inMin) / (inMax - inMin)) * (outMax - outMin);

/**
 * useScrollProgress – returns [ref, progress]
 *
 * mode "through": 0 when the element enters the bottom of the screen,
 *                 1 when it has fully left the top.
 * mode "pinned":  0 when the element's top reaches the top of the screen,
 *                 1 when its bottom reaches the bottom.
 *                 Use it on a tall wrapper that contains a <PinnedStage>.
 */
function useScrollProgress<T extends HTMLElement>(
  mode: "through" | "pinned" = "through"
) {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // People who prefer less motion see the finished state right away.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let frame = 0;

    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;

      const value =
        mode === "pinned"
          ? -rect.top / (rect.height - vh)
          : (vh - rect.top) / (rect.height + vh);

      setProgress(reduceMotion ? 1 : clamp(value));
    };

    // requestAnimationFrame = at most one update per screen refresh
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [mode]);

  return [ref, progress] as const;
}

/* ------------------------------------------------------------------ */
/* 3. Content (edit text here, not inside the JSX)                     */
/* ------------------------------------------------------------------ */

const HERO = {
  // Put your video in  public/videos/hero.mp4  (keep it small: 5-10 MB, muted).
  video: "/videos/hero.mp4",
  title: "Building Digital Empires",
  since: "Since 2015",
  intro:
    "A full-service digital solutions company dedicated to helping businesses build, grow, and strengthen their digital presence.",
};

const WHO = {
  label: "Who We Are",
  title: "Your End-to-End Digital Partner",
  // This paragraph is revealed word by word while scrolling.
  lead: "Empire AE is a full-service digital solutions company dedicated to helping businesses build, grow, and strengthen their digital presence.",
  paragraphs: [
    "We specialize in website development, mobile app development, ERP solutions, digital marketing, and brand identity creation — offering all services under one roof. With over 9 years of industry experience, we bring deep expertise, proven strategies, and reliable solutions to every project we undertake.",
    "We place our clients at the center of everything we do, focusing on understanding their unique goals and delivering tailored solutions that create real, measurable value for their businesses.",
  ],
  stats: [
    { value: 9, suffix: "+", label: "Years of Excellence" },
    { value: 150, suffix: "+", label: "Projects Completed" },
  ],
};

const MILESTONES = {
  label: "Milestones",
  title: "Digital Experiences. Proven Results.",
  intro:
    "Numbers that speak for our dedication, quality, and commitment to client success.",
  items: [
    {
      value: 150,
      suffix: "+",
      title: "Websites Delivered",
      text: "Successfully completed projects across e-commerce, SaaS, corporate, and personal brand sectors.",
    },
    {
      value: 50,
      suffix: "+",
      title: "Happy Clients",
      text: "Building long-term partnerships based on trust, transparency, and consistently excellent performance.",
    },
    {
      value: 9,
      suffix: "+",
      title: "Years of Experience",
      text: "Delivering reliable and scalable digital solutions with industry-leading expertise since 2015.",
    },
    {
      value: 100,
      suffix: "%",
      title: "Consistent Quality",
      text: "Building long-term client partnerships through consistent quality and measurable, tangible success.",
    },
  ],
};

const FOUNDATION = {
  label: "Our Foundation",
  title: "Vision & Mission",
  items: [
    {
      title: "Our Vision",
      text: "To be the leading digital solutions provider across the globe — empowering businesses of every size to build powerful digital identities that drive growth, engagement, and lasting impact in an ever-evolving digital world.",
    },
    {
      title: "Our Mission",
      text: "To deliver high-performance digital solutions — combining strategy, design, and technology — that enable businesses to attract more customers, operate efficiently, and achieve sustainable long-term growth in the digital era.",
    },
    {
      title: "Our Values",
      text: "Integrity, innovation, and impact are at the core of everything we do. We believe in radical transparency, client-first thinking, and relentless pursuit of quality in every pixel, line of code, and marketing strategy we deliver.",
    },
  ],
};

const ADVANTAGE = {
  label: "Our Advantage",
  title: "What Sets Us Apart",
  intro:
    "We go beyond just delivering projects — we build lasting partnerships built on trust, transparency, and consistent excellence.",
  otherTitle: "Not Aligned With Our Values",
  other: [
    "Inconsistent quality standards",
    "Limited transparency",
    "Short-term project mindset",
    "Minimal accountability",
    "Outdated processes",
  ],
  oursTitle: "The Empire AE Advantage",
  ours: [
    "Dedicated post-launch support",
    "Fast response & issue resolution",
    "Continuous performance monitoring",
    "Regular updates & optimization",
    "Long-term client partnerships",
  ],
};

const CTA = {
  label: "Work With Us",
  title: "Let's Build Something Amazing Together",
  text: "Ready to take your digital presence to the next level? Contact our team and let's make it happen.",
};

/* ------------------------------------------------------------------ */
/* 4. Small reusable pieces                                            */
/* ------------------------------------------------------------------ */

/** Heading style used everywhere: semibold, tight spacing (site font is inherited). */
const headingClass = "font-semibold tracking-tight";

/** Small text above a heading ("Who We Are", "Milestones", ...). */
function SectionLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`mb-5 text-base ${light ? "text-[#a3a3a3]" : "text-[#6b6b6b]"}`}>
      {children}
    </p>
  );
}

/** Dark filled button + outlined button, used in two places. */
function PrimaryButton({ href, children, onDark = false }: { href: string; children: ReactNode; onDark?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-block rounded-full px-8 py-4 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
        onDark
          ? "bg-white text-black hover:bg-[#d4d4d4] focus-visible:outline-white"
          : "bg-[#000000] text-[#ffffff] hover:bg-[#262626] focus-visible:outline-[#000000]"
      }`}
    >
      {children}
    </Link>
  );
}

function SecondaryButton({ href, children, onDark = false }: { href: string; children: ReactNode; onDark?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-block rounded-full border px-8 py-4 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
        onDark
          ? "border-[#ffffff]/40 text-[#ffffff] hover:bg-[#ffffff]/10 focus-visible:outline-[#ffffff]"
          : "border-[#000000]/30 text-[#000000] hover:bg-[#000000]/5 focus-visible:outline-[#000000]"
      }`}
    >
      {children}
    </Link>
  );
}

/**
 * PinnedStage – keeps its content fixed on screen while the tall wrapper
 * (`sectionRef`) around it scrolls past.
 * Why not CSS `position: sticky`? It silently stops working when any parent
 * layout has `overflow: hidden/auto`, which many Next.js layouts do.
 * Here we move the stage down ourselves. The move is written straight to the
 * element (not through React state) so it stays perfectly in sync with the
 * smooth scroll.
 */
function PinnedStage({
  sectionRef,
  className = "",
  children,
}: {
  sectionRef: RefObject<HTMLElement | null>;
  className?: string;
  children: ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage) return;
      const rect = section.getBoundingClientRect();
      const y = clamp(-rect.top, 0, Math.max(0, rect.height - window.innerHeight));
      stage.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sectionRef]);

  return (
    <div
      ref={stageRef}
      className={`absolute inset-x-0 top-0 h-screen overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * StickyBlock – a column that stays in view (below the site header) while the
 * column next to it is taller. Same idea as PinnedStage, for desktop only.
 */
function StickyBlock({
  className = "",
  top = 112,
  children,
}: {
  className?: string;
  top?: number;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const wrap = wrapRef.current;
      const inner = innerRef.current;
      if (!wrap || !inner) return;

      // On phones the columns stack, so nothing needs to stick.
      if (window.innerWidth < 768) {
        inner.style.transform = "none";
        return;
      }

      const rect = wrap.getBoundingClientRect();
      const maxMove = Math.max(0, rect.height - inner.offsetHeight);
      const y = clamp(top - rect.top, 0, maxMove);
      inner.style.transform = `translate3d(0, ${y}px, 0)`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [top]);

  return (
    <div ref={wrapRef} className={className}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

/**
 * ScrollRow – a row with a divider line that draws across and content that
 * fades in as the row scrolls into view.
 * `children` is a function so the content can also use the progress number
 * (the Milestones section uses it to count numbers up).
 */
function ScrollRow({ children }: { children: (progress: number) => ReactNode }) {
  const [ref, p] = useScrollProgress<HTMLLIElement>("through");

  const lineWidth = mapRange(p, 0.3, 0.5, 0, 100); // %
  const contentOpacity = mapRange(p, 0.3, 0.5, 0.25, 1);

  return (
    <li ref={ref} className="pb-12 md:pb-16">
      <div className="mb-8 h-px bg-[#e5e5e5]">
        <div className="h-px bg-[#000000]" style={{ width: `${lineWidth}%` }} />
      </div>
      <div style={{ opacity: contentOpacity }}>{children(p)}</div>
    </li>
  );
}

/**
 * SmoothScroll – makes mouse-wheel / trackpad scrolling glide instead of
 * jumping. It only changes HOW the page scrolls; all the effects above keep
 * working because they just read the scroll position.
 * lerp: lower = smoother and slower (0.05 - 0.15 is a good range).
 */
function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const lenis = new Lenis({ lerp: 0.09 });

    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}

/* ------------------------------------------------------------------ */
/* 5. Sections                                                         */
/* ------------------------------------------------------------------ */

/** HERO – headline, then a video panel opens to full screen and its text fades in. */
function Hero() {
  const [ref, p] = useScrollProgress<HTMLElement>("pinned");

  // The panel opens up to the whole screen during the first 65% of the scroll.
  const insetSides = mapRange(p, 0, 0.65, 8, 0); // % cut from left and right
  const insetTop = mapRange(p, 0, 0.65, 46, 0); // % cut from the top
  const radius = mapRange(p, 0, 0.65, 24, 0); // px
  const headlineShift = mapRange(p, 0.3, 0.65, 0, -12); // headline drifts up (vh)
  const headlineFade = mapRange(p, 0.3, 0.6, 1, 0);
  // The panel text stays hidden while the panel is small and only fades in
  // once the panel is (almost) fully open.
  const introOpacity = mapRange(p, 0.62, 0.8, 0, 1);

  // Negative margins cancel the page margins, so the hero is full screen width.
  return (
    <section ref={ref} className="relative -mx-6 h-[170vh] md:-mx-12 lg:-mx-24 xl:-mx-32">
      <PinnedStage sectionRef={ref}>
        {/* Headline */}
        <div
          className="absolute inset-x-0 top-0 px-6 pt-28 md:px-12 lg:px-24 xl:px-32"
          style={{
            transform: `translateY(${headlineShift}vh)`,
            opacity: headlineFade,
          }}
        >
          <p className="mb-4 text-base text-[#6b6b6b]">{HERO.since}</p>
          <h1
            className={`${headingClass} max-w-4xl text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95]`}
          >
            {HERO.title}
          </h1>
        </div>

        {/* Panel that opens up. The video plays inside it all the time;
            the text fades in when the panel is fully open. */}
        <div
          className="absolute inset-0 flex items-end overflow-hidden bg-black"
          style={{
            clipPath: `inset(${insetTop}% ${insetSides}% 0% ${insetSides}% round ${radius}px)`,
          }}
        >
          {/* muted + playsInline are required for autoplay on phones and Chrome */}
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={HERO.video}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
          {/* Dark layer so the white text stays readable on any video */}
          <div className="absolute inset-0 bg-black/40" />

          <p
            className={`${headingClass} relative max-w-3xl px-6 pb-16 text-[clamp(1.5rem,3vw,2.75rem)] leading-tight text-white md:px-12 md:pb-20 lg:px-24 xl:px-32`}
            style={{ opacity: introOpacity }}
          >
            {HERO.intro}
          </p>
        </div>
      </PinnedStage>
    </section>
  );
}

/** WHO WE ARE (part 1) – words turn dark one by one as you scroll. */
function WhoWeAreIntro() {
  const [ref, p] = useScrollProgress<HTMLElement>("pinned");
  const words = WHO.lead.split(" ");

  return (
    <section ref={ref} className="relative h-[170vh]">
      <PinnedStage sectionRef={ref} className="flex flex-col justify-center pt-20">
        <div className="mx-auto w-full max-w-5xl">
          <SectionLabel>{WHO.label}</SectionLabel>
          <h2
            className={`${headingClass} mb-10 text-[clamp(2rem,4.5vw,4rem)] leading-none`}
          >
            {WHO.title}
          </h2>
          <p
            className={`${headingClass} text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.2]`}
          >
            {words.map((word, i) => {
              // Word i "switches on" when progress passes its position.
              // Everything is lit by 85% so the last words are readable
              // before the section scrolls away.
              const start = (i / words.length) * 0.75;
              const lit = clamp((p - start) / 0.08);
              return (
                <span
                  key={i}
                  style={{ opacity: 0.18 + lit * 0.82 }}
                  className="mr-[0.25em] inline-block"
                >
                  {word}
                </span>
              );
            })}
          </p>
        </div>
      </PinnedStage>
    </section>
  );
}

/**
 * WHO WE ARE (part 2) – this screen stays pinned while the numbers count up.
 * Counting runs from 0% to 60% of the scroll; the last 40% just holds the
 * finished numbers on screen before the page moves on.
 */
function WhoWeAreDetails() {
  const [ref, p] = useScrollProgress<HTMLElement>("pinned");
  const count = mapRange(p, 0, 0.6, 0, 1);

  return (
    <section ref={ref} className="relative h-[190vh]">
      <PinnedStage
        sectionRef={ref}
        className="grid content-center gap-10 pt-24 md:grid-cols-12 md:items-center md:gap-14"
      >
        <div className="md:col-span-6 md:col-start-1">
          {WHO.paragraphs.map((text) => (
            <p
              key={text}
              className="mb-5 max-w-xl text-lg leading-relaxed text-[#404040] md:text-xl"
            >
              {text}
            </p>
          ))}
          <div className="mt-8 flex flex-wrap gap-4">
            <PrimaryButton href="/contact">Start a Project</PrimaryButton>
            <SecondaryButton href="/services">Our Services</SecondaryButton>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-8 md:col-span-5 md:col-start-8">
          {WHO.stats.map((stat) => (
            <div key={stat.label}>
              <dd
                className={`${headingClass} text-[clamp(3rem,7vw,6rem)] leading-none tabular-nums`}
              >
                {Math.round(stat.value * count)}
                {stat.suffix}
              </dd>
              <dt className="mt-3 text-base text-[#6b6b6b]">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </PinnedStage>
    </section>
  );
}

/** MILESTONES – each number counts up when its row reaches the middle. */
function Milestones() {
  return (
    <section className="border-t border-[#e5e5e5] py-24">
      <div className="mb-20 max-w-2xl">
        <SectionLabel>{MILESTONES.label}</SectionLabel>
        <h2
          className={`${headingClass} text-[clamp(2.25rem,5vw,4.5rem)] leading-none`}
        >
          {MILESTONES.title}
        </h2>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-[#404040]">
          {MILESTONES.intro}
        </p>
      </div>

      <ul>
        {MILESTONES.items.map((item, i) => (
          <ScrollRow key={item.title}>
            {(p) => {
              const count = mapRange(p, 0.3, 0.55, 0, 1);
              return (
                <div className="grid gap-6 md:grid-cols-12">
                  {/* Step number: these four really are a numbered list */}
                  <span className="text-base text-[#6b6b6b] md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className={`${headingClass} text-[clamp(3.5rem,8vw,7rem)] leading-none tabular-nums md:col-span-5`}
                  >
                    {Math.round(item.value * count)}
                    {item.suffix}
                  </p>
                  <div className="md:col-span-6">
                    <h3 className={`${headingClass} text-2xl md:text-3xl`}>
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-md text-lg leading-relaxed text-[#404040]">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            }}
          </ScrollRow>
        ))}
      </ul>
    </section>
  );
}

/** FOUNDATION – title stays pinned on the left, list scrolls on the right. */
function Foundation() {
  return (
    <section className="grid gap-10 py-24 md:grid-cols-12">
      {/* StickyBlock keeps the title in view while the list scrolls */}
      <StickyBlock className="md:col-span-5">
        <SectionLabel>{FOUNDATION.label}</SectionLabel>
        <h2
          className={`${headingClass} text-[clamp(2.25rem,5vw,4.5rem)] leading-none`}
        >
          {FOUNDATION.title}
        </h2>
      </StickyBlock>

      <ul className="md:col-span-7">
        {FOUNDATION.items.map((item) => (
          <ScrollRow key={item.title}>
            {() => (
              <>
                <h3 className={`${headingClass} text-3xl md:text-4xl`}>
                  {item.title}
                </h3>
                <p className="mt-4 max-w-lg text-lg leading-relaxed text-[#404040]">
                  {item.text}
                </p>
              </>
            )}
          </ScrollRow>
        ))}
      </ul>
    </section>
  );
}

/**
 * SwapRow – one line of the comparison.
 * While the row crosses the middle of the screen:
 *   1. a black line strikes through the "old way" text,
 *   2. our text fills in from light grey to black, left to right,
 *   3. the dot between them fills in.
 */
function SwapRow({ other, ours }: { other: string; ours: string }) {
  const [ref, p] = useScrollProgress<HTMLLIElement>("through");
  const t = mapRange(p, 0.38, 0.55, 0, 1); // 0 = before, 1 = swapped

  return (
    <li
      ref={ref}
      className="grid items-center gap-3 border-b border-[#e5e5e5] py-8 md:grid-cols-[1fr_3rem_1fr] md:gap-0 md:py-10"
    >
      {/* The old way: gets crossed out and fades back */}
      <p
        className="relative w-fit text-[clamp(1.25rem,2.2vw,1.9rem)] text-[#6b6b6b]"
        style={{ opacity: 1 - t * 0.55 }}
      >
        {other}
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-[2px] bg-black"
          style={{ width: `${t * 100}%` }}
        />
      </p>

      {/* Dot in the middle: empty -> filled */}
      <span
        aria-hidden="true"
        className="hidden h-3 w-3 justify-self-center rounded-full border border-black md:block"
        style={{ backgroundColor: `rgba(0, 0, 0, ${t})` }}
      />

      {/* Our way: light grey text, black copy is revealed on top of it */}
      <p
        className={`${headingClass} relative text-[clamp(1.5rem,3vw,2.5rem)] leading-tight text-[#e5e5e5]`}
      >
        {ours}
        <span
          aria-hidden="true"
          className="absolute inset-0 text-black"
          style={{ clipPath: `inset(0 ${(1 - t) * 100}% 0 0)` }}
        >
          {ours}
        </span>
      </p>
    </li>
  );
}

/** ADVANTAGE – each weak point is crossed out and replaced as you scroll. */
function Advantage() {
  return (
    <section className="border-t border-[#e5e5e5] py-24">
      <div className="mb-16 max-w-2xl">
        <SectionLabel>{ADVANTAGE.label}</SectionLabel>
        <h2
          className={`${headingClass} text-[clamp(2.25rem,5vw,4.5rem)] leading-none`}
        >
          {ADVANTAGE.title}
        </h2>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-[#404040]">
          {ADVANTAGE.intro}
        </p>
      </div>

      {/* Column titles */}
      <div className="flex flex-col gap-1 border-b border-black pb-4 md:grid md:grid-cols-[1fr_3rem_1fr] md:gap-0">
        <h3 className="text-lg text-[#6b6b6b]">{ADVANTAGE.otherTitle}</h3>
        <span className="hidden text-center text-base md:block">VS</span>
        <h3 className={`${headingClass} text-lg`}>{ADVANTAGE.oursTitle}</h3>
      </div>

      {/* Row i pairs the i-th "other" item with the i-th "ours" item */}
      <ul>
        {ADVANTAGE.ours.map((text, i) => (
          <SwapRow key={text} other={ADVANTAGE.other[i]} ours={text} />
        ))}
      </ul>
    </section>
  );
}

/** CALL TO ACTION – the black panel grows to full screen width as it enters. */
function Cta() {
  const [ref, p] = useScrollProgress<HTMLElement>("through");

  const sideMargin = mapRange(p, 0.35, 0.75, 48, 0); // px
  const radius = mapRange(p, 0.35, 0.75, 28, 0); // px

  return (
    <section ref={ref} className="-mx-6 pt-24 md:-mx-12 lg:-mx-24 xl:-mx-32">
      <div
        className="bg-[#000000] px-6 py-28 text-[#ffffff] md:px-12 lg:px-24 xl:px-32"
        style={{
          marginLeft: sideMargin,
          marginRight: sideMargin,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
        }}
      >
        <SectionLabel light>{CTA.label}</SectionLabel>
        <h2
          className={`${headingClass} max-w-3xl text-[clamp(2.5rem,6vw,5.5rem)] leading-none`}
        >
          {CTA.title}
        </h2>
        <p className="mt-6 max-w-md text-lg text-[#a3a3a3]">{CTA.text}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <PrimaryButton href="/contact" onDark>
            Get In Touch
          </PrimaryButton>
          <SecondaryButton href="/services" onDark>
            View Services
          </SecondaryButton>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. The page                                                         */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  // Side margins for the whole page live on <main>, nowhere else.
  return (
    <main className="bg-white px-6 text-black md:px-12 lg:px-24 xl:px-32">
      <SmoothScroll />
      <Hero />
      <WhoWeAreIntro />
      <WhoWeAreDetails />
      <Milestones />
      <Foundation />
      <Advantage />
      <Cta />
    </main>
  );
}