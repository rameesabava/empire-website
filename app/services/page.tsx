"use client";

import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type MouseEvent as ReactMouseEvent,
    type ReactNode,
} from "react";


/*  Data      
                                                                */


const stats = [
    { number: "9+", label: "Services offered" },
    { number: "150+", label: "Projects completed" },
    { number: "100%", label: "Client satisfaction" },
];

type Service = {
    title: string;
    description: string;
    tags: string[];
    icon: string;
    span: string;
};

const services: Service[] = [
    {
        title: "Web Designing",
        description:
            "We design visually stunning, responsive websites that reflect your brand identity and deliver smooth user experiences across all devices. Designs that don't just look good — they work smart. We create engaging, modern websites that capture attention and drive results.",
        tags: ["UI/UX Design", "Responsive", "Brand Identity"],
        icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
        span: "lg:col-span-3",
    },
    {
        title: "Web Development",
        description:
            "We build secure, scalable, and high-performance websites using the latest technologies to ensure smooth functionality and long-term growth. From concept to deployment, our web development solutions turn ideas into powerful digital platforms that drive real results.",
        tags: ["React / Next.js", "WordPress", "Laravel"],
        icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
        span: "lg:col-span-3",
    },
    {
        title: "Mobile App Development",
        description:
            "We develop high-quality mobile apps that are fast, secure, and scalable, delivering seamless experiences across Android and iOS platforms. From idea to launch, we build mobile applications that engage users, streamline operations, and drive business growth.",
        tags: ["Android", "iOS", "Flutter"],
        icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
        span: "lg:col-span-2",
    },
    {
        title: "Hosting & Domain",
        description:
            "Reliable hosting and domain solutions that ensure speed, security, and uninterrupted online presence. We provide secure hosting and easy domain management to keep your website running smoothly, always. Fast servers, regular backups, SSL included.",
        tags: ["SSL Security", "99.9% Uptime", "Daily Backups"],
        icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2",
        span: "lg:col-span-2",
    },
    {
        title: "Digital Marketing",
        description:
            "Data-driven digital marketing strategies that boost visibility, engage audiences, and grow your business online. We help brands reach the right audience, at the right time, with powerful digital marketing solutions that deliver measurable results and real ROI.",
        tags: ["SEO", "Social Media", "Content Marketing"],
        icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064",
        span: "lg:col-span-2",
    },
    {
        title: "E-Commerce Application",
        description:
            "We develop secure, scalable e-commerce applications that deliver seamless shopping experiences and drive online sales. From product listing to payment gateway, our e-commerce apps are built to convert visitors into loyal customers and maximize revenue.",
        tags: ["WooCommerce", "Payment Gateway", "Inventory Mgmt"],
        icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
        span: "lg:col-span-2",
    },
    {
        title: "Software Application",
        description:
            "We develop custom software applications tailored to your specific business processes, ensuring efficiency, security, and scalability. Robust, high-performance software applications built with the latest technologies for seamless functionality and long-term reliability.",
        tags: ["ERP Systems", "CRM", "Custom Software"],
        icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
        span: "lg:col-span-2",
    },
    {
        title: "SEO",
        description:
            "We optimize your website to rank higher on search engines, driving organic traffic and increasing brand visibility. Our proven SEO strategies ensure your business is easily found by the right audience when they search for your products or services.",
        tags: ["On-Page SEO", "Off-Page SEO", "Keyword Research"],
        icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
        span: "lg:col-span-2",
    },
];

const allTags = services.flatMap((s) => s.tags);
const tagsRowA = allTags.slice(0, Math.ceil(allTags.length / 2));
const tagsRowB = allTags.slice(Math.ceil(allTags.length / 2));

/* -------------------------------------------------------------------------- */
/*  Styles (keyframes, custom effects)                                        */
/* -------------------------------------------------------------------------- */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=DM+Sans:wght@400;500;600;700&display=swap');

@property --sv-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }

.sv-root {
  --ink: #222831;
  --deep: #31363F;
  --cyan: #76ABAE;
  --cyan-2: #76ABAE;
  --cyan-3: #9CC5C8;
  --mist: #B3B8BD;
  background: var(--ink);
  color: #EEEEEE;
  font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  overflow-x: clip;
}
.sv-display {
  font-family: 'Bricolage Grotesque', 'DM Sans', ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.035em;
}

/* ---------- keyframes ---------- */
@keyframes sv-spin { to { transform: rotate(360deg); } }
@keyframes sv-rise { from { transform: translateY(110%); } to { transform: translateY(0); } }
@keyframes sv-fade { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes sv-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
@keyframes sv-pulse { 0%,100% { transform: scale(1); opacity: .9; } 50% { transform: scale(1.08); opacity: 1; } }
@keyframes sv-ping { 0% { transform: scale(.6); opacity: .7; } 100% { transform: scale(2.2); opacity: 0; } }
@keyframes sv-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@keyframes sv-marquee-rev { from { transform: translateX(-50%); } to { transform: translateX(0); } }
@keyframes sv-shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
@keyframes sv-draw { to { stroke-dashoffset: 0; } }
@keyframes sv-ken { from { transform: scale(1.05); } to { transform: scale(1.18) translate(-1.5%, -1%); } }
@keyframes sv-drift-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px,40px) scale(1.15); } }
@keyframes sv-drift-b { 0%,100% { transform: translate(0,0) scale(1.1); } 50% { transform: translate(-70px,-30px) scale(.95); } }
@keyframes sv-drift-c { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,-60px); } }
@keyframes sv-scroll-dot { 0% { transform: translateY(0); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(14px); opacity: 0; } }
@keyframes sv-twinkle { 0%,100% { opacity: .15; transform: translateY(0); } 50% { opacity: .9; transform: translateY(-18px); } }
@keyframes sv-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(120%); } }

/* ---------- scroll progress ---------- */
.sv-progress {
  background: linear-gradient(90deg, var(--cyan), var(--cyan-3), #B9D6D8);
  box-shadow: 0 0 14px rgba(118,171,174,.8);
}

/* ---------- reveal on scroll ---------- */
.sv-reveal {
  opacity: 0;
  transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1);
  will-change: transform, opacity;
}
.sv-from-up { transform: translateY(56px); }
.sv-from-left { transform: translateX(-64px); }
.sv-from-right { transform: translateX(64px); }
.sv-from-scale { transform: scale(.88); }
.sv-reveal.sv-in { opacity: 1; transform: none; }

/* ---------- headline word-rise ---------- */
.sv-word { display: inline-block; overflow: hidden; vertical-align: bottom; padding: 0 .06em .14em; margin: 0 -.06em -.14em; }
.sv-word > span {
  display: inline-block;
  transform: translateY(110%);
  animation: sv-rise 1s cubic-bezier(.16,1,.3,1) forwards;
  animation-delay: var(--d, 0ms);
}
.sv-reveal-words .sv-word > span { animation-play-state: paused; }
.sv-reveal-words.sv-in .sv-word > span { animation-play-state: running; }

.sv-grad-text {
  background: linear-gradient(100deg, #B9D6D8 0%, #76ABAE 30%, #EEEEEE 55%, #76ABAE 80%, #B9D6D8 100%);
  background-size: 200% auto;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  animation: sv-shimmer 6s linear infinite;
}

.sv-fade-in { opacity: 0; animation: sv-fade .9s cubic-bezier(.16,1,.3,1) forwards; animation-delay: var(--d, 0ms); }

/* ---------- hero ---------- */
.sv-hero {
  background:
    radial-gradient(700px circle at var(--mx, 70%) var(--my, 30%), rgba(118,171,174,.16), transparent 60%),
    linear-gradient(180deg, #31363F 0%, var(--ink) 100%);
}
.sv-grid-bg {
  background-image:
    linear-gradient(rgba(118,171,174,.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(118,171,174,.07) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(ellipse at 50% 40%, #000 20%, transparent 75%);
  mask-image: radial-gradient(ellipse at 50% 40%, #000 20%, transparent 75%);
}
.sv-parallax { transition: transform .5s cubic-bezier(.16,1,.3,1); }
.sv-blob { border-radius: 9999px; filter: blur(80px); }
.sv-blob-a { animation: sv-drift-a 16s ease-in-out infinite; }
.sv-blob-b { animation: sv-drift-b 20s ease-in-out infinite; }
.sv-blob-c { animation: sv-drift-c 14s ease-in-out infinite; }
.sv-dot { position: absolute; border-radius: 9999px; background: #B9D6D8; animation: sv-twinkle var(--dur, 8s) ease-in-out infinite; animation-delay: var(--delay, 0s); }

.sv-live-dot { position: relative; width: 8px; height: 8px; border-radius: 9999px; background: var(--cyan-3); }
.sv-live-dot::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: var(--cyan-3); animation: sv-ping 1.8s ease-out infinite; }

.sv-mouse { width: 24px; height: 38px; border: 2px solid rgba(238,238,238,.35); border-radius: 9999px; position: relative; }
.sv-mouse::after { content: ''; position: absolute; left: 50%; top: 7px; width: 4px; height: 7px; margin-left: -2px; border-radius: 9999px; background: var(--cyan-3); animation: sv-scroll-dot 1.8s ease-in-out infinite; }

/* ---------- orbit (hero centrepiece) ---------- */
.sv-orbit { container-type: inline-size; position: relative; width: 100%; max-width: 500px; aspect-ratio: 1; margin-inline: auto; }
.sv-orbit-path { position: absolute; border-radius: 9999px; border: 1px dashed rgba(118,171,174,.28); }
.sv-ring { position: absolute; inset: 0; animation: sv-spin var(--dur) linear infinite; }
.sv-ring-outer { --dur: 56s; }
.sv-ring-inner { --dur: 38s; animation-direction: reverse; }
.sv-orbit-item {
  position: absolute; top: 50%; left: 50%;
  width: var(--s); height: var(--s);
  margin: calc(var(--s) / -2) 0 0 calc(var(--s) / -2);
  transform: rotate(var(--a)) translateX(var(--r)) rotate(calc(var(--a) * -1));
}
.sv-orbit-counter { width: 100%; height: 100%; }
.sv-ring-outer .sv-orbit-counter { animation: sv-spin 56s linear infinite reverse; }
.sv-ring-inner .sv-orbit-counter { animation: sv-spin 38s linear infinite; }
.sv-orbit:hover .sv-ring,
.sv-orbit:hover .sv-orbit-counter { animation-play-state: paused; }
.sv-orbit-icon {
  position: relative; width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  border-radius: 28%;
  color: var(--cyan-3);
  background: linear-gradient(145deg, rgba(118,171,174,.22), rgba(49,54,63,.92));
  border: 1px solid rgba(118,171,174,.35);
  box-shadow: 0 0 24px rgba(118,171,174,.25), inset 0 1px 0 rgba(238,238,238,.12);
  backdrop-filter: blur(6px);
  transition: transform .35s cubic-bezier(.16,1,.3,1), background .3s, color .3s, box-shadow .3s;
}
.sv-orbit-icon svg { width: 46%; height: 46%; }
.sv-orbit-icon:hover { transform: scale(1.22); background: var(--cyan); color: #222831; box-shadow: 0 0 40px rgba(118,171,174,.8); z-index: 5; }
.sv-tip {
  position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(-4px);
  white-space: nowrap; font-size: 12px; font-weight: 600; color: #EEEEEE;
  background: #222831; border: 1px solid rgba(118,171,174,.45); border-radius: 8px; padding: 5px 10px;
  opacity: 0; pointer-events: none; transition: opacity .25s, transform .25s;
}
.sv-orbit-icon:hover .sv-tip { opacity: 1; transform: translateX(-50%) translateY(0); }
.sv-core {
  position: absolute; top: 50%; left: 50%; width: 26cqw; height: 26cqw; margin: -13cqw 0 0 -13cqw;
  border-radius: 9999px; display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: radial-gradient(circle at 35% 30%, #B9D6D8 0%, #76ABAE 40%, #4A7578 100%);
  box-shadow: 0 0 80px rgba(118,171,174,.6), inset 0 -10px 30px rgba(0,0,0,.35);
  animation: sv-pulse 4s ease-in-out infinite;
  color: #222831;
}
.sv-core::before, .sv-core::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  border: 1px solid rgba(118,171,174,.6); animation: sv-ping 3.2s ease-out infinite;
}
.sv-core::after { animation-delay: 1.6s; }

/* ---------- marquee ---------- */
.sv-marquee-wrap {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
}
.sv-marquee { display: flex; width: max-content; animation: sv-marquee 45s linear infinite; }
.sv-marquee-rev { animation-name: sv-marquee-rev; animation-duration: 55s; }
.sv-marquee-wrap:hover .sv-marquee { animation-play-state: paused; }
.sv-chip {
  margin-right: .75rem; padding: .55rem 1.1rem; border-radius: 9999px; white-space: nowrap;
  font-size: .9rem; font-weight: 500; color: var(--mist);
  border: 1px solid rgba(118,171,174,.18); background: rgba(238,238,238,.02);
  transition: color .3s, border-color .3s, background .3s;
}
.sv-chip:hover { color: #EEEEEE; border-color: var(--cyan-3); background: rgba(118,171,174,.14); }

/* ---------- stats ---------- */
.sv-stat-sweep::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(100deg, transparent 30%, rgba(238,238,238,.14) 50%, transparent 70%);
  animation: sv-sweep 6s ease-in-out infinite;
  pointer-events: none;
}

/* ---------- service cards ---------- */
.sv-card {
  --mx: 50%; --my: 50%; --rx: 0deg; --ry: 0deg;
  position: relative; isolation: isolate; overflow: hidden;
  border-radius: 1.5rem;
  background: linear-gradient(160deg, #353b46, #2c323b);
  border: 1px solid rgba(118,171,174,.14);
  transform: perspective(1000px) rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform .25s ease-out, border-color .4s, box-shadow .4s;
  transform-style: preserve-3d;
}
.sv-card.sv-leaving { transition: transform .7s cubic-bezier(.16,1,.3,1), border-color .4s, box-shadow .4s; }
.sv-card:hover { border-color: transparent; box-shadow: 0 30px 70px -20px rgba(118,171,174,.35); }
.sv-card::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1.5px; z-index: 3; pointer-events: none;
  background: conic-gradient(from var(--sv-angle), transparent 0 55%, var(--cyan-3) 80%, #EEEEEE 90%, transparent 100%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  opacity: 0; transition: opacity .4s; animation: sv-spin-angle 3.5s linear infinite;
}
@keyframes sv-spin-angle { to { --sv-angle: 360deg; } }
.sv-card:hover::before { opacity: 1; }
.sv-spot {
  position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0; transition: opacity .35s;
  background: radial-gradient(420px circle at var(--mx) var(--my), rgba(118,171,174,.2), transparent 55%);
}
.sv-card:hover .sv-spot { opacity: 1; }
.sv-card-body { position: relative; z-index: 2; transform: translateZ(30px); }

.sv-icon-box {
  position: relative; width: 3.5rem; height: 3.5rem; border-radius: 1rem;
  display: flex; align-items: center; justify-content: center;
  color: var(--cyan-3); background: rgba(118,171,174,.12); border: 1px solid rgba(118,171,174,.25);
  transition: background .4s, color .4s, transform .5s cubic-bezier(.34,1.56,.64,1), box-shadow .4s;
}
.sv-card:hover .sv-icon-box { background: var(--cyan); color: #222831; transform: rotate(-8deg) scale(1.12); box-shadow: 0 0 30px rgba(118,171,174,.7); }
.sv-draw path { stroke-dasharray: 1; stroke-dashoffset: 1; }
.sv-in .sv-draw path { animation: sv-draw 1.6s cubic-bezier(.65,0,.35,1) forwards .35s; }

.sv-tag { transition: transform .3s cubic-bezier(.34,1.56,.64,1), background .3s, color .3s, border-color .3s; }
.sv-card:hover .sv-tag { border-color: rgba(118,171,174,.45); }
.sv-tag:hover { transform: translateY(-3px); background: rgba(118,171,174,.2); color: #EEEEEE; }

.sv-link { position: relative; }
.sv-link::after { content: ''; position: absolute; left: 0; bottom: -2px; height: 2px; width: 100%; background: var(--cyan-3); transform: scaleX(0); transform-origin: left; transition: transform .4s cubic-bezier(.16,1,.3,1); }
.sv-link:hover::after, .sv-link:focus-visible::after { transform: scaleX(1); }

/* ---------- CTA ---------- */
.sv-cta { background: linear-gradient(135deg, #31363F 0%, #222831 100%); }
.sv-cta-ring {
  position: absolute; left: 50%; top: 50%; width: 900px; height: 900px; margin: -450px 0 0 -450px; border-radius: 9999px; opacity: .5;
  background: conic-gradient(from 0deg, transparent 0 60%, rgba(118,171,174,.35) 78%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle, transparent 38%, #000 39%, #000 40%, transparent 41%, transparent 58%, #000 59%, #000 60%, transparent 61%);
  mask-image: radial-gradient(circle, transparent 38%, #000 39%, #000 40%, transparent 41%, transparent 58%, #000 59%, #000 60%, transparent 61%);
  animation: sv-spin 24s linear infinite;
}
.sv-btn-primary {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: .75rem;
  border-radius: 9999px; padding: 1rem 2.25rem; font-weight: 700; color: #222831;
  background: linear-gradient(100deg, #76ABAE, #B9D6D8, #76ABAE); background-size: 200% auto;
  box-shadow: 0 10px 40px rgba(118,171,174,.45);
  transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .3s, background-position .6s;
}
.sv-btn-primary:hover { background-position: 100% 0; box-shadow: 0 16px 56px rgba(118,171,174,.65); }
.sv-btn-primary::after {
  content: ''; position: absolute; top: 0; bottom: 0; width: 40%; left: 0;
  background: linear-gradient(100deg, transparent, rgba(238,238,238,.65), transparent);
  animation: sv-sweep 3.2s ease-in-out infinite;
}
.sv-btn-ghost {
  display: inline-flex; align-items: center; justify-content: center; border-radius: 9999px; padding: 1rem 2.25rem; font-weight: 700; color: #EEEEEE;
  border: 1px solid rgba(238,238,238,.3); background: rgba(238,238,238,.03);
  transition: transform .25s cubic-bezier(.16,1,.3,1), background .3s, border-color .3s;
}
.sv-btn-ghost:hover { background: rgba(238,238,238,.1); border-color: rgba(238,238,238,.6); }

/* ---------- focus + reduced motion ---------- */
.sv-root a:focus-visible { outline: 2px solid var(--cyan-3); outline-offset: 4px; border-radius: 8px; }

@media (prefers-reduced-motion: reduce) {
  .sv-root *, .sv-root *::before, .sv-root *::after {
    animation-duration: .001ms !important; animation-iteration-count: 1 !important;
    transition-duration: .001ms !important; scroll-behavior: auto !important;
  }
  .sv-reveal { opacity: 1 !important; transform: none !important; }
  .sv-word > span { transform: none !important; }
  .sv-fade-in { opacity: 1 !important; }
  .sv-draw path { stroke-dashoffset: 0 !important; }
}
`;

/* -------------------------------------------------------------------------- */
/*  Hooks & helpers                                                           */
/* -------------------------------------------------------------------------- */

function useInView<T extends HTMLElement>(threshold = 0.15) {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold, rootMargin: "0px 0px -6% 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, inView };
}

type Direction = "up" | "left" | "right" | "scale";

function Reveal({
    children,
    delay = 0,
    from = "up",
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    from?: Direction;
    className?: string;
}) {
    const { ref, inView } = useInView<HTMLDivElement>();
    return (
        <div
            ref={ref}
            className={`sv-reveal sv-from-${from} ${inView ? "sv-in" : ""} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

/** Splits text into words that rise out of a mask, one after another. */
function Words({
    text,
    startDelay = 0,
    step = 70,
    className = "",
}: {
    text: string;
    startDelay?: number;
    step?: number;
    className?: string;
}) {
    return (
        <>
            {text.split(" ").map((word, i) => (
                <span key={`${word}-${i}`} className="sv-word">
                    <span
                        className={className}
                        style={{ "--d": `${startDelay + i * step}ms` } as CSSProperties}
                    >
                        {word}&nbsp;
                    </span>
                </span>
            ))}
        </>
    );
}

/** Same as Words, but triggers when scrolled into view. */
function WordsOnView({
    text,
    className = "",
    wordClassName = "",
}: {
    text: string;
    className?: string;
    wordClassName?: string;
}) {
    const { ref, inView } = useInView<HTMLHeadingElement>(0.3);
    return (
        <span
            ref={ref}
            className={`sv-reveal-words ${inView ? "sv-in" : ""} ${className}`}
        >
            <Words text={text} className={wordClassName} />
        </span>
    );
}

/* -------------------------------------------------------------------------- */
/*  Small components                                                          */
/* -------------------------------------------------------------------------- */

function ScrollProgress() {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let raf = 0;
        const update = () => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - doc.clientHeight;
            const p = max > 0 ? doc.scrollTop / max : 0;
            if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
            raf = 0;
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

    return (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.75">
            <div
                ref={barRef}
                className="sv-progress h-full origin-left"
                style={{ transform: "scaleX(0)" }}
            />
        </div>
    );
}

function AnimatedCounter({
    value,
    duration = 2200,
}: {
    value: string;
    duration?: number;
}) {
    const { ref, inView } = useInView<HTMLSpanElement>(0.5);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const target = parseInt(value.replace(/\D/g, ""), 10);
        const start = performance.now();
        let frame = 0;

        const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            setCount(Math.round(eased * target));
            if (progress < 1) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [inView, value, duration]);

    const suffix = value.replace(/[0-9]/g, "");

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
}

function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
    const row = [...items, ...items];
    return (
        <div className="sv-marquee-wrap">
            <div className={`sv-marquee ${reverse ? "sv-marquee-rev" : ""}`}>
                {row.map((tag, i) => (
                    <span key={`${tag}-${i}`} className="sv-chip">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

function Magnetic({
    href,
    className,
    children,
}: {
    href: string;
    className: string;
    children: ReactNode;
}) {
    const ref = useRef<HTMLAnchorElement>(null);

    const onMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.28;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const onLeave = () => {
        if (ref.current) ref.current.style.transform = "";
    };

    return (
        <a
            ref={ref}
            href={href}
            className={className}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
        >
            {children}
        </a>
    );
}

function ArrowIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className={className}
            aria-hidden="true"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
        </svg>
    );
}

/* -------------------------------------------------------------------------- */
/*  Hero orbit — services circling a glowing core                             */
/* -------------------------------------------------------------------------- */

function OrbitItem({
    service,
    angle,
    radius,
    size,
}: {
    service: Service;
    angle: number;
    radius: string;
    size: string;
}) {
    return (
        <div
            className="sv-orbit-item"
            style={
                {
                    "--a": `${angle}deg`,
                    "--r": radius,
                    "--s": size,
                } as CSSProperties
            }
        >
            <div className="sv-orbit-counter">
                <div className="sv-orbit-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.7}
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                    </svg>
                    <span className="sv-tip">{service.title}</span>
                </div>
            </div>
        </div>
    );
}

function Orbit() {
    const outer = services.slice(0, 5);
    const inner = services.slice(5);

    return (
        <div className="sv-orbit" aria-hidden="true">
            <div className="sv-orbit-path" style={{ inset: "10cqw" }} />
            <div className="sv-orbit-path" style={{ inset: "26cqw" }} />

            <div className="sv-ring sv-ring-outer">
                {outer.map((s, i) => (
                    <OrbitItem
                        key={s.title}
                        service={s}
                        angle={i * (360 / outer.length) - 90}
                        radius="40cqw"
                        size="14cqw"
                    />
                ))}
            </div>

            <div className="sv-ring sv-ring-inner">
                {inner.map((s, i) => (
                    <OrbitItem
                        key={s.title}
                        service={s}
                        angle={i * (360 / inner.length) - 30}
                        radius="24cqw"
                        size="12cqw"
                    />
                ))}
            </div>

            <div className="sv-core">
                <span className="sv-display font-extrabold leading-none" style={{ fontSize: "8cqw" }}>
                    9+
                </span>
                <span className="font-semibold" style={{ fontSize: "3cqw" }}>
                    services
                </span>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Service card — 3D tilt, cursor spotlight, rotating border                 */
/* -------------------------------------------------------------------------- */

function ServiceCard({ service, index }: { service: Service; index: number }) {
    const cardRef = useRef<HTMLElement>(null);
    const { ref, inView } = useInView<HTMLDivElement>(0.12);
    const isWide = service.span === "lg:col-span-3";

    const onMove = (e: ReactMouseEvent<HTMLElement>) => {
        const el = cardRef.current;
        if (!el) return;
        el.classList.remove("sv-leaving");
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
        el.style.setProperty("--rx", `${(y / r.height - 0.5) * -8}deg`);
        el.style.setProperty("--ry", `${(x / r.width - 0.5) * 8}deg`);
    };

    const onLeave = () => {
        const el = cardRef.current;
        if (!el) return;
        el.classList.add("sv-leaving");
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
    };

    return (
        <div
            ref={ref}
            className={`sv-reveal sv-from-up h-full w-full ${
    inView ? "sv-in" : ""
}`}
            style={{ transitionDelay: `${(index % 3) * 130}ms` }}
        >
            <article
                ref={cardRef}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                className="sv-card flex h-full flex-col p-6 sm:p-8"
            >
                <div className="sv-spot" aria-hidden="true" />

                <div className="sv-card-body flex h-full flex-col">
                    <div className="sv-icon-box">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="sv-draw h-7 w-7"
                            aria-hidden="true"
                        >
                            <path
                                pathLength={1}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.6}
                                d={service.icon}
                            />
                        </svg>
                    </div>

                    <h3
                        className={`sv-display mt-6 font-bold leading-tight text-[#EEEEEE] ${isWide ? "text-3xl sm:text-4xl" : "text-2xl"
                            }`}
                    >
                        {service.title}
                    </h3>

                    <p
                        className={`mt-3 flex-1 leading-7 text-[#B3B8BD] ${isWide ? "max-w-xl text-base" : "text-[15px]"
                            }`}
                    >
                        {service.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {service.tags.map((tag) => (
                            <span
                                key={tag}
                                className="sv-tag rounded-full border border-[#76ABAE]/20 bg-[#76ABAE]/8 px-3 py-1.5 text-xs font-medium text-[#A9CCCE]"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="mt-7">
                        <a
                            href="/contact/"
                            className="sv-link group/cta inline-flex items-center gap-2 py-1 text-sm font-bold text-[#76ABAE]"
                        >
                            <span>Get started</span>
                            <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1.5" />
                        </a>
                    </div>
                </div>
            </article>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Services() {
    const heroRef = useRef<HTMLElement>(null);
    const [parallax, setParallax] = useState({ x: 0, y: 0 });

    const onHeroMove = (e: ReactMouseEvent<HTMLElement>) => {
        const el = heroRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", `${px * 100}%`);
        el.style.setProperty("--my", `${py * 100}%`);
        setParallax({ x: px - 0.5, y: py - 0.5 });
    };

    const shift = (depth: number): CSSProperties => ({
        transform: `translate(${parallax.x * depth}px, ${parallax.y * depth}px)`,
    });

    const carouselRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const interval = window.setInterval(() => {
        if (container.getAttribute("data-autoplay-paused") === "true") {
            return;
        }

        const firstCard = container.firstElementChild as HTMLElement | null;
        if (!firstCard) return;

        const gap = 24; // gap-6 = 24px
        const step = firstCard.getBoundingClientRect().width + gap;

        const atEnd =
            container.scrollLeft + container.clientWidth >=
            container.scrollWidth - 10;

        container.scrollTo({
            left: atEnd ? 0 : container.scrollLeft + step,
            behavior: "smooth",
        });
    }, 4000);

    return () => window.clearInterval(interval);
}, []);

    return (
        <main className="sv-root min-h-screen">
            <style dangerouslySetInnerHTML={{ __html: STYLES }} />
            <ScrollProgress />

            {/* ============================ HERO ============================ */}
            <section
                ref={heroRef}
                onMouseMove={onHeroMove}
                className="sv-hero relative isolate overflow-hidden px-6 pb-24 pt-28 sm:px-10 lg:px-16 lg:pb-32 lg:pt-36"
            >
                {/* Aurora blobs with mouse parallax */}
                <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
                    <div className="sv-parallax absolute -left-32 top-0" style={shift(-50)}>
                        <div className="sv-blob sv-blob-a h-105 w-105 bg-[#76ABAE]/30" />
                    </div>
                    <div className="sv-parallax absolute -right-24 top-20" style={shift(70)}>
                        <div className="sv-blob sv-blob-b h-120 w-120 bg-[#5C6676]/30" />
                    </div>
                    <div className="sv-parallax absolute bottom-0 left-1/3" style={shift(-30)}>
                        <div className="sv-blob sv-blob-c h-90 w-90 bg-[#76ABAE]/20" />
                    </div>
                    <div className="sv-grid-bg absolute inset-0" />

                    {Array.from({ length: 28 }).map((_, i) => (
                        <span
                            key={i}
                            className="sv-dot"
                            style={
                                {
                                    left: `${(i * 53 + 17) % 100}%`,
                                    top: `${(i * 29 + 7) % 100}%`,
                                    width: `${2 + (i % 3)}px`,
                                    height: `${2 + (i % 3)}px`,
                                    "--dur": `${6 + (i % 5) * 2}s`,
                                    "--delay": `-${i % 7}s`,
                                } as CSSProperties
                            }
                        />
                    ))}
                </div>

                <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
                    {/* Copy */}
                    <div>
                        <nav
                            aria-label="Breadcrumb"
                            className="sv-fade-in mb-8 flex items-center gap-3 text-sm"
                            style={{ "--d": "100ms" } as CSSProperties}
                        >
                            <a href="/" className="font-medium text-[#8A9299] transition-colors hover:text-[#EEEEEE]">
                                Home
                            </a>
                            <span className="text-[#5A626B]">/</span>
                            <span className="text-[#EEEEEE]">Services</span>
                        </nav>

                        <div
                            className="sv-fade-in mb-7 inline-flex items-center gap-3 rounded-full border border-[#76ABAE]/30 bg-[#76ABAE]/10 px-5 py-2 text-sm font-semibold text-[#B9D6D8]"
                            style={{ "--d": "250ms" } as CSSProperties}
                        >
                            <span className="sv-live-dot" />
                            What we do
                        </div>

                        <h1 className="sv-display text-5xl font-extrabold leading-[1.02] text-[#EEEEEE] sm:text-6xl xl:text-7xl">
                            <span className="block">
                                <Words text="Smart Services for a" startDelay={350} />
                            </span>
                            <span className="block">
                                <Words
                                    text="Smarter Digital Future"
                                    startDelay={800}
                                    className="sv-grad-text"
                                />
                            </span>
                        </h1>

                        <p
                            className="sv-fade-in mt-8 max-w-xl text-lg leading-8 text-[#B3B8BD]"
                            style={{ "--d": "1500ms" } as CSSProperties}
                        >
                            From concept to launch and beyond — we provide every digital
                            service your business needs to succeed in the modern world.
                        </p>

                        <div
                            className="sv-fade-in mt-10 flex flex-wrap items-center gap-5"
                            style={{ "--d": "1700ms" } as CSSProperties}
                        >
                            <Magnetic href="/contact/" className="sv-btn-primary">
                                <span className="relative z-10">Start a project</span>
                                <ArrowIcon className="relative z-10 h-5 w-5" />
                            </Magnetic>
                            <a
                                href="#services"
                                className="sv-link text-sm font-semibold text-[#EEEEEE]/80 transition-colors hover:text-[#EEEEEE]"
                            >
                                Browse all services
                            </a>
                        </div>
                    </div>

                    {/* Orbit centrepiece */}
                    <div
                        className="sv-fade-in sv-parallax"
                        style={{ "--d": "900ms", ...shift(18) } as CSSProperties}
                    >
                        <div style={{ animation: "sv-float 9s ease-in-out infinite" }}>
                            <Orbit />
                        </div>
                    </div>
                </div>

                {/* Scroll cue */}
                <div
                    className="sv-fade-in absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
                    style={{ "--d": "2200ms" } as CSSProperties}
                    aria-hidden="true"
                >
                    <div className="sv-mouse" />
                </div>
            </section>

            {/* ========================= TECH MARQUEE ======================= */}
            <section className="border-y border-[#76ABAE]/10 bg-[#1D2229] py-8" aria-label="Technologies and specialities">
                <div className="space-y-3">
                    <Marquee items={tagsRowA} />
                    <Marquee items={tagsRowB} reverse />
                </div>
            </section>

            {/* ============================ STATS =========================== */}
            <section className="relative h-auto min-h-80 w-full overflow-hidden py-16 sm:py-0">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/images/services.jpg')",
                        animation: "sv-ken 24s ease-in-out infinite alternate",
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(135deg, #222831ee, #76ABAE88)" }}
                />
                <div className="sv-stat-sweep absolute inset-0" aria-hidden="true" />

                <div className="relative z-10 mx-auto grid h-full min-h-80 max-w-6xl grid-cols-1 items-center sm:grid-cols-3">
                    {stats.map((stat, i) => (
                        <Reveal key={stat.label} delay={i * 150} from="scale" className="h-full">
                            <div
                                className={`flex h-full flex-col items-center justify-center px-6 py-8 text-center sm:py-0 ${i > 0 ? "sm:border-l sm:border-[#EEEEEE]/15" : ""
                                    }`}
                            >
                                <span className="sv-display text-6xl font-extrabold text-[#EEEEEE] drop-shadow-[0_0_30px_rgba(118,171,174,.55)] sm:text-7xl">
                                    <AnimatedCounter value={stat.number} />
                                </span>
                                <span className="mt-3 text-sm font-semibold tracking-wide text-[#EEEEEE]/85 sm:text-base">
                                    {stat.label}
                                </span>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ========================== ALL SERVICES ====================== */}
            <section
                id="services"
                className="relative isolate overflow-hidden px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
            >
                <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
                    <div className="sv-blob absolute left-[-10%] top-[20%] h-96 w-96 bg-[#76ABAE]/10" />
                    <div className="sv-blob absolute bottom-[5%] right-[-8%] h-112 w-md bg-[#5C6676]/15" />
                </div>

                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 max-w-3xl">
                        <Reveal from="left">
                            <span className="inline-flex items-center rounded-full border border-[#76ABAE]/30 bg-[#76ABAE]/10 px-5 py-2 text-sm font-semibold text-[#B9D6D8]">
                                Our services
                            </span>
                        </Reveal>

                        <h2 className="sv-display mt-6 text-4xl font-extrabold leading-[1.05] text-[#EEEEEE] sm:text-5xl md:text-6xl">
                            <WordsOnView text="Everything you need to grow online" />
                        </h2>

                        <Reveal delay={250}>
                            <p className="mt-6 max-w-xl text-lg leading-8 text-[#B3B8BD]">
                                End-to-end digital solutions designed to help your business
                                thrive at every stage.
                            </p>
                        </Reveal>
                    </div>

                    <div
    ref={carouselRef}
    className="flex items-stretch gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide"
>
    {services.map((service, i) => (
        <div
            key={service.title}
            className="flex w-[85%] flex-none snap-start sm:w-[48%] lg:w-[31%]"
        >
            <div className="h-full w-full">
                <ServiceCard service={service} index={i} />
            </div>
        </div>
    ))}
</div>
                </div>
            </section>

            {/* ============================ CTA ============================= */}

            <section className="sv-cta relative isolate mx-4 my-16 overflow-hidden rounded-3xl border border-[#76ABAE]/40 bg-[#20272F] px-5 py-20 text-center shadow-[0_0_40px_rgba(118,171,174,0.08)] sm:mx-8 sm:px-8 sm:py-28 lg:mx-auto lg:max-w-7xl">

                {/* Background decorations */}
                <div
                    className="pointer-events-none absolute inset-0 -z-10"
                    aria-hidden="true"
                >
                    <div className="sv-cta-ring" />
                    <div className="sv-blob sv-blob-a absolute -top-20 left-[10%] h-72 w-72 rounded-full bg-[#76ABAE]/10 blur-3xl" />
                    <div className="sv-blob sv-blob-b absolute -bottom-24 right-[8%] h-80 w-80 rounded-full bg-[#5C6676]/15 blur-3xl" />
                </div>

                {/* Subtle top border accent */}
                <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#76ABAE]/80 to-transparent" />

                <div className="mx-auto flex max-w-4xl flex-col items-center">

                    <Reveal from="scale">
                        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#76ABAE]/30 bg-[#76ABAE]/10 px-5 py-2 text-sm font-semibold tracking-wide text-[#B9D6D8]">
                            <span className="sv-live-dot" />
                            Let&apos;s talk
                        </div>
                    </Reveal>

                    <h2 className="sv-display text-4xl font-extrabold leading-[1.1] tracking-tight text-[#EEEEEE] sm:text-5xl md:text-7xl">
                        <WordsOnView text="Ready to build your" />
                        <br className="hidden sm:block" />
                        <WordsOnView
                            text="digital empire?"
                            wordClassName="sv-grad-text"
                        />
                    </h2>

                    <Reveal delay={300}>
                        <p className="mt-7 max-w-2xl text-base leading-8 text-[#EEEEEE]/70 sm:text-lg">
                            Contact our team today and let&apos;s turn your ideas into digital
                            reality.
                        </p>
                    </Reveal>

                    <Reveal delay={450} className="w-full sm:w-auto">
                        <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row">

                            <Magnetic
                                href="/contact/"
                                className="sv-btn-primary w-full sm:w-auto"
                            >
                                <span className="relative z-10">Start a project</span>
                                <ArrowIcon className="relative z-10 h-5 w-5" />
                            </Magnetic>

                            <Magnetic
                                href="tel:+0000000000"
                                className="sv-btn-ghost w-full sm:w-auto"
                            >
                                Call us now
                            </Magnetic>

                        </div>
                    </Reveal>
                </div>
            </section>
        </main>
    );
}