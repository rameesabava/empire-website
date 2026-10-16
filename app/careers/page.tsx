
"use client";

/**
 * Empire AE — Careers Page
 * Save as: app/careers/page.tsx
 *
 * Install:
 * npm install gsap lenis lucide-react
 *
 * Features:
 * 1. Animated hero typography and photo reveal
 * 2. Current openings and empty state
 * 3. Scroll-drawn career growth timeline
 * 4. Animated work-life balance counters
 * 5. Premium animated horizontal photo gallery
 * 6. Open application and contact section
 *
 * If Lenis already runs in layout.tsx, remove the Lenis
 * useEffect below to avoid initializing it twice.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronsDown,
  Mail,
} from "lucide-react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/* =========================================================
   CONTENT
========================================================= */

type Opening = {
  id: string;
  title: string;
  team: string;
  location: string;
  type: string;
};

const OPENINGS: Opening[] = [
  // Example:
  // {
  //   id: "01",
  //   title: "Frontend Developer",
  //   team: "Engineering",
  //   location: "Remote",
  //   type: "Full-time",
  // },
];

const CONTACT_EMAIL = "info@empireae.xyz";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=85";

const GROWTH = [
  {
    when: "FIRST 90 DAYS",
    title: "Learn how we work",
    text: "A senior mentor, a real project from week one, and a plan you agree on with your lead.",
  },
  {
    when: "YEAR ONE",
    title: "Own something",
    text: "Take a client deliverable from start to finish, present your work, and help improve how the team works.",
  },
  {
    when: "YEAR TWO",
    title: "Take the lead",
    text: "Own larger pieces of work, support teammates, and deepen your expertise. Start building the skills to lead projects or specialise in your craft.",
  },
  {
    when: "YEAR THREE AND BEYOND",
    title: "Make your mark",
    text: "Lead teams or major projects, mentor the next generation, or become a recognised expert in your field. Grow in the direction that suits your strengths and ambitions.",
  },
];

const BALANCE = [
  { n: 30, suffix: "", label: "days of paid leave a year" },
  { n: 5, suffix: "", label: "day week, weekends protected" },
  { n: 100, suffix: "%", label: "of learning budget covered" },
  { n: 2, suffix: "", label: "wellness days every quarter" },
];

const LIFE = [
  {
    src: "/images/life-1.jpeg",
    cap: "Success",
  },
  {
    src: "/images/life-2.jpeg",
    cap: "Celebrations",
  },
  {
    src: "/images/life-3.jpeg",
    cap: "Games",
  },
  {
    src: "/images/life-4.jpeg",
    cap: "Champions",
  },
  {
    src: "/images/life-5.jpeg",
    cap: "Onam",
  },
   {
    src: "/images/life-6.jpeg",
    cap: "Onam-2",
  },
];

/* =========================================================
   REUSABLE LETTER ANIMATION
========================================================= */

function Letters({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {text.split(" ").map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="mr-[0.22em] inline-block whitespace-nowrap"
          >
            {Array.from(word).map((char, j) => (
              <span
                key={`${char}-${j}`}
                className="inline-block overflow-hidden pb-[0.08em] align-bottom"
              >
                <span data-ch className="inline-block">
                  {char}
                </span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function Careers() {
  const root = useRef<HTMLElement>(null);

  /* -------------------------------------------------------
     LENIS SMOOTH SCROLL
  ------------------------------------------------------- */

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  /* -------------------------------------------------------
     ALL PAGE ANIMATIONS
  ------------------------------------------------------- */

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const q = <T extends HTMLElement>(selector: string) =>
          gsap.utils.toArray<T>(selector, el);

        const reducedMotion = context.conditions?.reduce;

        /* Make the hero visible before any animation. */
        gsap.set("[data-hero]", { autoAlpha: 1 });

        /* REDUCED MOTION: never leave content hidden. */
        if (reducedMotion) {
          q<HTMLElement>("[data-count]").forEach((node) => {
            node.textContent = node.dataset.count || "0";
          });

          gsap.set(
            [
              "[data-life-heading]",
              "[data-life-subtitle]",
              "[data-life-kicker]",
            ],
            {
              autoAlpha: 1,
              y: 0,
            }
          );

          gsap.set("[data-life-accent]", { scaleX: 1 });

          return;
        }

        /* 1. HERO ENTRANCE */

        const heroTimeline = gsap.timeline({
          defaults: { ease: "power4.out" },
        });

        heroTimeline
          .from("[data-ch]", {
            yPercent: 115,
            rotate: 4,
            duration: 1.1,
            stagger: 0.025,
          })
          .fromTo(
            "[data-photo]",
            {
              clipPath: "inset(100% 0% 0% 0%)",
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.5,
              ease: "power4.inOut",
            },
            0.2
          )
          .fromTo(
            "[data-photo-img]",
            { scale: 1.4 },
            {
              scale: 1,
              duration: 1.8,
              ease: "power3.out",
            },
            0.2
          )
          .from(
            "[data-fade]",
            {
              y: 24,
              autoAlpha: 0,
              duration: 0.9,
              stagger: 0.12,
            },
            0.8
          );

        /* Hero image parallax. */

        gsap.to("[data-photo-img]", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-hero]",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        /* 2. CURRENT OPENINGS */

        ScrollTrigger.batch("[data-row]", {
          start: "top 90%",
          once: true,
          onEnter: (batch) => {
            gsap.from(batch, {
              y: 28,
              autoAlpha: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
            });
          },
        });

        /* 3. GROWTH TIMELINE */

        gsap.fromTo(
          "[data-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-path]",
              start: "top 70%",
              end: "bottom 70%",
              scrub: 0.5,
            },
          }
        );

        q<HTMLElement>("[data-step]").forEach((step) => {
          gsap.fromTo(
            step,
            { opacity: 0.25, y: 20 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: step,
                start: "top 78%",
                end: "top 50%",
                scrub: true,
              },
            }
          );
        });

        /* 4. COUNT-UP NUMBERS */

        q<HTMLElement>("[data-count]").forEach((node) => {
          const counter = { value: 0 };

          gsap.to(counter, {
            value: Number(node.dataset.count),
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: node,
              start: "top 88%",
              once: true,
            },
            onUpdate: () => {
              node.textContent = String(
                Math.round(counter.value)
              );
            },
          });
        });

        /* 5. LIFE AT EMPIRE AE — PREMIUM INTRO */

        const lifeHeading =
          el.querySelector<HTMLElement>("[data-life-heading]");

        const lifeSubtitle =
          el.querySelector<HTMLElement>("[data-life-subtitle]");

        const lifeKicker =
          el.querySelector<HTMLElement>("[data-life-kicker]");

        const lifeAccent =
          el.querySelector<HTMLElement>("[data-life-accent]");

        if (
          lifeHeading &&
          lifeSubtitle &&
          lifeKicker &&
          lifeAccent
        ) {
          gsap.set(
            [lifeHeading, lifeSubtitle, lifeKicker],
            {
              autoAlpha: 0,
              y: 30,
            }
          );

          gsap.set(lifeAccent, {
            scaleX: 0,
            transformOrigin: "left center",
          });

          const intro = gsap.timeline({
            scrollTrigger: {
              trigger: "[data-gallery]",
              start: "top 85%",
              once: true,
            },
          });

          intro
            .to(lifeKicker, {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
            })
            .to(
              lifeAccent,
              {
                scaleX: 1,
                duration: 0.8,
                ease: "power3.out",
              },
              "-=0.3"
            )
            .to(
              lifeHeading,
              {
                autoAlpha: 1,
                y: 0,
                duration: 1.1,
                ease: "power4.out",
              },
              "-=0.4"
            )
            .to(
              lifeSubtitle,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
              },
              "-=0.6"
            );
        }

        /* 6. HORIZONTAL GALLERY */

        const track =
          el.querySelector<HTMLElement>("[data-track]");

        const gallery =
          el.querySelector<HTMLElement>("[data-gallery]");

        if (track && gallery) {
          const getDistance = () =>
            Math.max(
              0,
              track.scrollWidth - window.innerWidth + 48
            );

          gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: gallery,
              start: "top top",
              end: () => `+=${getDistance()}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          /* Image reveal animation. */

          gsap.fromTo(
            "[data-life]",
            {
              clipPath: "inset(0% 100% 0% 0%)",
            },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.1,
              stagger: 0.12,
              ease: "power4.inOut",
              scrollTrigger: {
                trigger: gallery,
                start: "top 70%",
                once: true,
              },
            }
          );

          gsap.fromTo(
            "[data-life-img]",
            { scale: 1.25 },
            {
              scale: 1,
              duration: 1.5,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: gallery,
                start: "top 70%",
                once: true,
              },
            }
          );
        }
      }
    );

    let cancelled = false;

    document.fonts?.ready.then(() => {
      if (!cancelled) {
        ScrollTrigger.refresh();
      }
    });

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, []);

  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main
      ref={root}
      className="relative overflow-x-clip bg-[#222831] font-sans text-[#EEEEEE] selection:bg-[#7b7d7d] selection:text-[#111318]"
      style={{
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");

        html {
          scroll-behavior: auto;
        }

        [data-gallery] {
          isolation: isolate;
        }

        [data-life-img] {
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* ===================================================
          1. HERO
      =================================================== */}

      <section
        data-hero
        className="invisible relative flex min-h-[100svh] items-center overflow-hidden bg-[#111318] px-5 pb-24 pt-28 sm:px-10 lg:px-[8%]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-1/4 size-[30rem] rounded-full bg-[#7b7d7d]/[0.06] blur-[120px]"
        />

        <div className="mx-auto grid w-full max-w-[88rem] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10">
            <div data-fade className="mb-8 flex items-center gap-3">
              <span className="h-px w-8 bg-[#7b7d7d]" />
              <span className="text-xs uppercase tracking-[0.28em] text-[#7b7d7d]">
                Careers at Empire AE
              </span>
            </div>

            <h1 className="text-[clamp(2.8rem,7.4vw,6.5rem)] font-light leading-[1.02] tracking-[-0.065em]">
              <Letters text="Build what's" />
              <br />
              <Letters text="next with us" />
            </h1>

            <p
              data-fade
              className="mt-8 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg"
            >
              Empire AE is a team of designers, developers and
              marketers who ship digital work for businesses
              that want to grow. Come do the best work of your
              career.
            </p>

            <div
              data-fade
              className="mt-9 flex flex-wrap items-center gap-4 sm:gap-6"
            >
              <a
                href="#openings"
                className="group inline-flex items-center gap-3 rounded-full bg-[#f3f7f7] px-6 py-3.5 font-medium text-[#111318] transition-all duration-300 hover:-translate-y-1 hover:bg-white"
              >
                See open roles
                <ArrowUpRight
                  size={18}
                  className="transition-transform duration-300 group-hover:rotate-45"
                />
              </a>

              <Link
                href="#life"
                className="group inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-[#7b7d7d]"
              >
                Life at Empire AE
                <ArrowDown
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-y-1"
                />
              </Link>
            </div>
          </div>

        
        </div>

        <button
          type="button"
          onClick={scrollDown}
          aria-label="Scroll down"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 transition-colors hover:text-[#7b7d7d]"
        >
          <ChevronsDown
            size={34}
            strokeWidth={1.25}
            className="animate-bounce"
          />
        </button>

        <span className="absolute bottom-8 right-6 hidden font-mono text-[10px] tracking-[0.25em] text-white/35 lg:block">
          SCROLL TO DISCOVER
        </span>
      </section>

      {/* ===================================================
          2. CURRENT OPENINGS
      =================================================== */}

      <section
        id="openings"
        className="relative z-10 -mt-px rounded-t-[2rem] bg-white px-5 py-24 text-black sm:rounded-t-[3rem] sm:px-10 lg:px-[8%] lg:py-32"
      >
        <div className="mx-auto max-w-[88rem]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.25em] text-black/45">
                Find your place
              </p>

              <h2 className="text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.055em]">
                Current openings
              </h2>
            </div>

            {OPENINGS.length > 0 && (
              <p className="text-sm text-black/50">
                {OPENINGS.length} open{" "}
                {OPENINGS.length === 1 ? "role" : "roles"}
              </p>
            )}
          </div>

          {OPENINGS.length > 0 ? (
            <ul className="mt-12 border-t border-black/15">
              {OPENINGS.map((opening) => (
                <li
                  key={opening.id}
                  data-row
                  className="border-b border-black/15"
                >
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                      `Application: ${opening.title}`
                    )}`}
                    className="group grid items-center gap-x-6 gap-y-2 py-7 transition-colors duration-300 hover:bg-neutral-50 sm:grid-cols-[1.5fr_1fr_1fr_auto] sm:px-3 sm:hover:pl-6"
                  >
                    <span className="text-xl font-medium tracking-tight sm:text-2xl">
                      {opening.title}
                    </span>

                    <span className="text-sm text-black/55">
                      {opening.team}
                    </span>

                    <span className="text-sm text-black/55">
                      {opening.location}, {opening.type}
                    </span>

                    <span className="hidden size-11 place-items-center rounded-full bg-black text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-[#7b7d7d] group-hover:text-black sm:grid">
                      <ArrowUpRight size={20} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div
              data-row
              className="mt-12 rounded-[1.6rem] bg-[#f5f5f3] px-6 py-16 text-center sm:py-24"
            >
              <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-white">
                <Mail size={23} strokeWidth={1.4} />
              </span>

              <h3 className="mt-6 text-[clamp(1.6rem,3.2vw,2.75rem)] font-semibold tracking-[-0.04em]">
                No openings right now
              </h3>

              <p className="mx-auto mt-4 max-w-md leading-relaxed text-black/55">
                We are not hiring at the moment. Send us your
                portfolio or CV and we will reach out when a
                role fits.
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  "Open application"
                )}`}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 font-medium text-white transition-all duration-300 hover:bg-[#7b7d7d] hover:text-black"
              >
                <Mail size={18} />
                info@empireae.xyz
                <ArrowUpRight size={17} />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================
          3. GROWTH PATH
      =================================================== */}

      <section className="bg-[#111318] px-5 py-24 sm:px-10 lg:px-[8%] lg:py-36">
        <div className="mx-auto grid max-w-[88rem] gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-5 text-xs uppercase tracking-[0.25em] text-[#7b7d7d]">
              Your next chapter
            </p>

            <h2 className="max-w-xl text-[clamp(2.25rem,5vw,4.5rem)] font-light leading-[1.02] tracking-[-0.055em]">
              Grow with people who grow you.
            </h2>

            <p className="mt-6 max-w-md leading-relaxed text-white/55">
              You will work next to senior designers, engineers
              and strategists who teach as they build. Here is
              what your first years can look like.
            </p>

          
          </div>

          <div data-path className="relative pl-10 sm:pl-14">
            <span className="absolute bottom-2 left-[7px] top-2 w-px bg-white/15" />

            <span
              data-line
              className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-[#7b7d7d]"
            />

            {GROWTH.map((step, index) => (
              <div
                key={step.title}
                data-step
                className="relative pb-16 last:pb-0"
              >
                <span className="absolute -left-10 top-1 size-[15px] rounded-full border-2 border-[#7b7d7d] bg-[#111318] shadow-[0_0_18px_rgba(159,237,241,0.25)] sm:-left-14" />

                <p className="font-mono text-xs tracking-[0.16em] text-[#7b7d7d]">
                  {step.when}
                </p>

                <h3 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">
                  {step.title}
                </h3>

                <p className="mt-4 max-w-lg leading-relaxed text-white/55">
                  {step.text}
                </p>

                <span className="mt-6 inline-flex size-9 items-center justify-center rounded-full border border-white/15 text-sm text-white/60">
                  0{index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          4. WORK-LIFE BALANCE
      =================================================== */}

      {/* <section className="rounded-t-[2rem] bg-white px-5 py-24 text-black sm:rounded-t-[3rem] sm:px-10 lg:px-[8%] lg:py-32">
        <div className="mx-auto max-w-[88rem]">
          <p className="mb-5 text-xs uppercase tracking-[0.25em] text-black/45">
            Work well. Live well.
          </p>

          <h2 className="max-w-3xl text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1] tracking-[-0.055em]">
            Great work needs rest.
          </h2>

          <p className="mt-6 max-w-xl leading-relaxed text-black/55">
            We judge people by what they deliver, not by hours
            at a desk. Flexible schedules and protected time
            off keep good people doing good work for years.
          </p>

          <dl className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {BALANCE.map((item) => (
              <div
                key={item.label}
                className="group border-t border-black/20 pt-5"
              >
                <dd className="text-[clamp(3rem,6vw,5.5rem)] font-light leading-none tracking-[-0.06em] transition-colors duration-300 group-hover:text-[#4e9298]">
                  <span data-count={item.n}>{item.n}</span>
                  {item.suffix}
                </dd>

                <dt className="mt-4 max-w-[180px] leading-relaxed text-black/55">
                  {item.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section> */}
      

      {/* ===================================================
          5. LIFE AT EMPIRE AE
          Animated heading + pinned horizontal gallery
      =================================================== */}

      <section
        id="life"
        data-gallery
        className="relative z-0 flex h-[100svh] min-h-[620px] flex-col justify-center overflow-hidden bg-[#111318] py-8 sm:py-10"
      >
        {/* Background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-10 size-96 rounded-full bg-[#7b7d7d]/[0.07] blur-[120px]"
        />

        <div className="relative z-10 shrink-0 px-5 sm:px-10 lg:px-[8%]">
          <div
            data-life-kicker
            className="mb-4 flex items-center gap-3"
          >
            <span
              data-life-accent
              className="h-px w-8 bg-[#7b7d7d]"
            />

            <span className="text-xs font-medium uppercase tracking-[0.28em] text-[#7b7d7d]">
              Inside the studio
            </span>
          </div>

          <h2
            data-life-heading
            className="max-w-5xl text-[clamp(2.7rem,7.5vw,7rem)] font-light leading-[0.95] tracking-[-0.065em] text-white"
          >
            Life at{" "}
            <span className="font-semibold">Empire</span>
            <span className="text-[#7b7d7d]"> AE.</span>
          </h2>

          <p
            data-life-subtitle
            className="mt-4 max-w-md text-sm leading-relaxed text-white/55 sm:text-base"
          >
            Good people. Bold ideas. Work that moves things
            forward.
          </p>
        </div>

        {/* Gallery track — GSAP moves this horizontally */}
        <div
          data-track
          className="relative z-10 mt-6 flex w-max shrink-0 gap-4 px-5 will-change-transform sm:mt-8 sm:gap-5 sm:px-10 lg:px-[8%]"
        >
          {LIFE.map((photo, index) => (
            <figure
              key={photo.cap}
              className="w-[min(60vw,320px)] shrink-0 sm:w-[min(38vw,360px)]"
            >
              <div
                data-life
                className="group relative aspect-[4/4.6] overflow-hidden rounded-2xl bg-[#252a31] sm:rounded-3xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  data-life-img
                  src={photo.src}
                  alt={photo.cap}
                  loading={index === 0 ? "eager" : "lazy"}
                  draggable={false}
                  className="size-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/0 to-black/10" />

                <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/15 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-white backdrop-blur-md">
                  0{index + 1} / 0{LIFE.length}
                </span>

                <span className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full border border-white/40 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:border-[#7b7d7d] group-hover:bg-[#7b7d7d] group-hover:text-black">
                  <ArrowUpRight size={19} />
                </span>
              </div>

              <figcaption className="mt-3 flex items-center gap-3 text-sm text-white/65">
                <span className="font-mono text-xs text-[#7b7d7d]">
                  0{index + 1}
                </span>
                <span>{photo.cap}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Footer detail */}
        <div className="relative z-10 mt-6 flex items-center justify-between gap-4 px-5 text-[9px] uppercase tracking-[0.18em] text-white/35 sm:px-10 sm:text-[10px] sm:tracking-[0.22em] lg:px-[8%]">
          <span>People make the difference</span>

          <span className="flex items-center gap-2">
            Scroll to explore
            <ArrowDown size={13} />
          </span>
        </div>
      </section>

      {/* ===================================================
          6. OPEN APPLICATION
      =================================================== */}

      <section className="relative z-10 rounded-t-[2rem] bg-white px-5 py-24 text-black shadow-[0_-40px_80px_-20px_rgba(0,0,0,0.3)] sm:rounded-t-[3rem] sm:px-10 lg:px-[8%] lg:py-32">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-5 text-xs uppercase tracking-[0.25em] text-black/45">
              Your story starts here
            </p>

            <h2 className="max-w-2xl text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1] tracking-[-0.055em]">
              Don&apos;t see your role?
            </h2>

            <p className="mt-5 max-w-md leading-relaxed text-black/55">
              Tell us what you do best and what you want to
              build. We read every message.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                "Open application"
              )}`}
              className="group inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#7b7d7d] hover:text-black"
            >
              <Mail size={18} />
              {CONTACT_EMAIL}
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:rotate-45"
              />
            </a>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full border border-black/20 px-6 py-3.5 font-medium transition-all duration-300 hover:bg-black hover:text-white"
            >
              Contact page
              <ArrowUpRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-20 flex max-w-[88rem] flex-col justify-between gap-4 border-t border-black/10 pt-6 text-xs text-black/40 sm:flex-row sm:items-center">
          {/* <span>Empire AE © {new Date().getFullYear()}</span> */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="transition-colors hover:text-black"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </section>
    </main>
  );
}
