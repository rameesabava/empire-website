"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

const MILESTONES = [
  { n: "01", value: "150+", title: "Websites Delivered", text: "Successfully completed projects across e-commerce, SaaS, corporate, and personal brand sectors." },
  { n: "02", value: "50+", title: "Happy Clients", text: "Building long-term partnerships based on trust, transparency, and consistently excellent performance." },
  { n: "03", value: "9+", title: "Years of Experience", text: "Delivering reliable and scalable digital solutions with industry-leading expertise since 2015." },
  { n: "04", value: "100%", title: "Consistent Quality", text: "Building long-term client partnerships through consistent quality and measurable, tangible success." },
];

const FOUNDATION = [
  {
    title: "Our Vision",
    text: "To be the leading digital solutions provider across the globe — empowering businesses of every size to build powerful digital identities that drive growth, engagement, and lasting impact in an ever-evolving digital world.",
    icon: (
      <>
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  {
    title: "Our Mission",
    text: "To deliver high-performance digital solutions — combining strategy, design, and technology — that enable businesses to attract more customers, operate efficiently, and achieve sustainable long-term growth in the digital era.",
    icon: (
      <>
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: "Our Values",
    text: "Integrity, innovation, and impact are at the core of everything we do. We believe in radical transparency, client-first thinking, and relentless pursuit of quality in every pixel, line of code, and marketing strategy we deliver.",
    icon: (
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    ),
  },
];

const BAD = [
  "Inconsistent quality standards",
  "Limited transparency",
  "Short-term project mindset",
  "Minimal accountability",
  "Outdated processes",
];
const GOOD = [
  "Dedicated post-launch support",
  "Fast response & issue resolution",
  "Continuous performance monitoring",
  "Regular updates & optimization",
  "Long-term client partnerships",
];

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=DM+Sans:wght@400;500;600;700&display=swap');

.bd-root {
  --ink: #222831; --deep: #31363F; --abyss: #1D2229;
  --cyan: #76ABAE; --cyan-3: #9CC5C8; --pale: #B9D6D8;
  --mist: #B3B8BD; --snow: #EEEEEE; --slate: #5C6676;
  --card-a: #353b46; --card-b: #2c323b;
  background: var(--ink); color: var(--snow);
  font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif; line-height: 1.6;
  -webkit-font-smoothing: antialiased; overflow-x: clip;
}
.bd-root p { color: var(--mist); }
.bd-display { font-family: 'Bricolage Grotesque', 'DM Sans', ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.035em; }
.bd-wrap { position: relative; margin: 0 auto; width: 100%; max-width: 1180px; }
.bd-sec { position: relative; isolation: isolate; overflow: hidden; padding: 64px 20px; }
@media (min-width: 640px) { .bd-sec { padding: 80px 32px; } }
@media (min-width: 1024px) { .bd-sec { padding: 112px 48px; } }
.bd-abyss { background: var(--abyss); }
.bd-blob { border-radius: 9999px; filter: blur(80px); }
.bd-grid-bg {
  background-image: linear-gradient(rgba(118,171,174,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(118,171,174,.07) 1px, transparent 1px);
  background-size: 56px 56px;
  -webkit-mask-image: radial-gradient(ellipse at 50% 40%, #000 20%, transparent 75%);
  mask-image: radial-gradient(ellipse at 50% 40%, #000 20%, transparent 75%);
}

/* ---------- fluid type (smaller, scales with screen) ---------- */
.bd-h1 { font-size: clamp(2.1rem, 6vw, 4rem); line-height: 1.06; font-weight: 700; }
.bd-h2 { font-size: clamp(1.7rem, 4.2vw, 2.6rem); line-height: 1.12; font-weight: 700; }
.bd-h2-xl { font-size: clamp(1.8rem, 4.8vw, 3rem); line-height: 1.1; font-weight: 700; }
.bd-h3 { font-size: clamp(1.35rem, 3vw, 2rem); line-height: 1.15; font-weight: 700; }
.bd-lead { font-size: clamp(.97rem, 1.7vw, 1.06rem); line-height: 1.75; }
.bd-body { font-size: clamp(.94rem, 1.5vw, 1rem); line-height: 1.8; }
.bd-num { font-size: clamp(2.4rem, 5vw, 3.4rem); line-height: 1; }

/* ---------- keyframes ---------- */
@keyframes bd-spin { to { transform: rotate(360deg); } }
@keyframes bd-rise { from { transform: translateY(110%); } to { transform: translateY(0); } }
@keyframes bd-up { from { opacity: 0; transform: translateY(26px); } to { opacity: 1; transform: none; } }
@keyframes bd-pop { from { opacity: 0; transform: translateY(14px) scale(.985); } to { opacity: 1; transform: none; } }
@keyframes bd-ping { 0% { transform: scale(.6); opacity: .7; } 100% { transform: scale(2.2); opacity: 0; } }
@keyframes bd-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes bd-shine { 0% { transform: translateX(-120%); } 100% { transform: translateX(260%); } }
@keyframes bd-shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
@keyframes bd-cue { 0% { transform: translateY(0); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(14px); opacity: 0; } }
@keyframes bd-drift-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(60px,40px) scale(1.15); } }
@keyframes bd-drift-b { 0%,100% { transform: translate(0,0) scale(1.1); } 50% { transform: translate(-70px,-30px) scale(.95); } }
.bd-blob-a { animation: bd-drift-a 16s ease-in-out infinite; }
.bd-blob-b { animation: bd-drift-b 20s ease-in-out infinite; }

/* ---------- progress ---------- */
.bd-progress { background: linear-gradient(90deg, var(--cyan), var(--cyan-3), var(--pale)); box-shadow: 0 0 14px rgba(118,171,174,.8); }

/* ---------- reveal ---------- */
.bd-reveal { opacity: 0; transform: translateY(40px); transition: opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1); will-change: transform, opacity; }
.bd-reveal.bd-l { transform: translateX(-48px); }
.bd-reveal.bd-r { transform: translateX(48px); }
.bd-reveal.bd-s { transform: scale(.9); }
.bd-reveal.bd-in { opacity: 1; transform: none; }
.bd-hr { opacity: 0; animation: bd-up .9s cubic-bezier(.16,1,.3,1) forwards; animation-delay: var(--d, 0ms); }
@media (max-width: 639px) {
  .bd-reveal, .bd-reveal.bd-l, .bd-reveal.bd-r { transform: translateY(28px); }
  .bd-reveal.bd-in { transform: none; }
}

/* ---------- word rise + gradient text ---------- */
.bd-word { display: inline-block; overflow: hidden; vertical-align: bottom; padding: 0 .06em .14em; margin: 0 -.06em -.14em; }
.bd-word > span { display: inline-block; transform: translateY(110%); animation: bd-rise 1s cubic-bezier(.16,1,.3,1) forwards; animation-delay: var(--d, 0ms); }
.bd-view .bd-word > span { animation-play-state: paused; }
.bd-view.bd-in .bd-word > span { animation-play-state: running; }
.bd-gt {
  background-image: linear-gradient(100deg, #B9D6D8 0%, #76ABAE 30%, #EEEEEE 55%, #76ABAE 80%, #B9D6D8 100%);
  background-size: 200% auto; -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent; animation: bd-shimmer 6s linear infinite;
}

/* ---------- pill ---------- */
.bd-pill { display: inline-flex; align-items: center; gap: .7rem; padding: .42rem 1.1rem; border-radius: 9999px; font-size: .8rem; font-weight: 600; color: var(--pale); background: rgba(118,171,174,.1); border: 1px solid rgba(118,171,174,.3); }
.bd-pill i { position: relative; width: 8px; height: 8px; border-radius: 9999px; background: var(--cyan-3); }
.bd-pill i::after { content: ''; position: absolute; inset: 0; border-radius: inherit; background: var(--cyan-3); animation: bd-ping 1.8s ease-out infinite; }

/* ---------- buttons ---------- */
.bd-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: .7rem; border-radius: 9999px; padding: .9rem 2rem; min-height: 48px; font-weight: 700; font-size: 14.5px; transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .3s, background-position .6s, background .3s, border-color .3s; }
.bd-btn-pri { color: #222831; background: linear-gradient(100deg, #76ABAE, #B9D6D8, #76ABAE); background-size: 200% auto; box-shadow: 0 10px 40px rgba(118,171,174,.45); }
.bd-btn-pri:hover { background-position: 100% 0; box-shadow: 0 16px 56px rgba(118,171,174,.65); transform: translateY(-2px); }
.bd-btn-pri::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40%; left: 0; background: linear-gradient(100deg, transparent, rgba(238,238,238,.65), transparent); animation: bd-shine 3.2s ease-in-out infinite; }
.bd-btn-ghost { color: #EEEEEE; border: 1px solid rgba(238,238,238,.3); background: rgba(238,238,238,.03); }
.bd-btn-ghost:hover { background: rgba(238,238,238,.1); border-color: rgba(238,238,238,.6); transform: translateY(-2px); }
@media (max-width: 479px) { .bd-btn { width: 100%; } }

/* ---------- hero ---------- */
.bd-hero { position: relative; isolation: isolate; overflow: hidden; padding: 116px 20px 72px; background: radial-gradient(700px circle at 70% 30%, rgba(118,171,174,.16), transparent 60%), linear-gradient(180deg, #31363F 0%, #222831 100%); }
@media (min-width: 640px) { .bd-hero { padding: 140px 32px 88px; } }
@media (min-width: 1024px) { .bd-hero { padding: 168px 48px 112px; } }
.bd-rings { position: relative; width: 100%; max-width: 300px; aspect-ratio: 1; margin-inline: auto; }
@media (min-width: 640px) { .bd-rings { max-width: 360px; } }
@media (min-width: 1024px) { .bd-rings { max-width: 400px; } }
.bd-rings svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.bd-ring { transform-box: view-box; transform-origin: 50% 50%; }
.bd-ring-a { animation: bd-spin 60s linear infinite; }
.bd-ring-b { animation: bd-spin 40s linear infinite reverse; }
.bd-ring-c { animation: bd-spin 26s linear infinite; }
.bd-core { position: absolute; inset: 29%; border-radius: 9999px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
  background: radial-gradient(circle at 35% 25%, rgba(118,171,174,.45), rgba(34,40,49,.92) 70%); border: 1px solid rgba(118,171,174,.45); box-shadow: 0 0 70px rgba(118,171,174,.5), inset 0 0 30px rgba(118,171,174,.2); animation: bd-float 7s ease-in-out infinite; }
.bd-cue { width: 24px; height: 38px; border: 2px solid rgba(238,238,238,.35); border-radius: 9999px; position: relative; }
.bd-cue::after { content: ''; position: absolute; left: 50%; top: 7px; width: 4px; height: 7px; margin-left: -2px; border-radius: 9999px; background: var(--cyan-3); animation: bd-cue 1.8s ease-in-out infinite; }

/* ---------- who we are ---------- */
.bd-photo { position: relative; border-radius: 24px; overflow: hidden; aspect-ratio: 4 / 4.4; background: linear-gradient(160deg, #353b46, #222831); border: 1px solid rgba(118,171,174,.25); box-shadow: 0 30px 70px -20px rgba(118,171,174,.35); }
@media (min-width: 640px) { .bd-photo { border-radius: 28px; aspect-ratio: 4 / 4.6; } }
.bd-photo img { width: 100%; height: 100%; object-fit: cover; transform: scale(1.04); transition: transform 1.4s cubic-bezier(.16,1,.3,1); }
.bd-photo:hover img { transform: scale(1.1); }
.bd-photo::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 60%, rgba(34,40,49,.7)); pointer-events: none; }
.bd-tile { position: relative; overflow: hidden; border-radius: 18px; padding: 16px; color: #222831; background: linear-gradient(135deg, #9CC5C8, #76ABAE); box-shadow: 0 18px 40px rgba(118,171,174,.3); transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s; }
@media (min-width: 640px) { .bd-tile { padding: 22px; border-radius: 20px; } }
.bd-tile:hover { transform: translateY(-5px); box-shadow: 0 26px 50px rgba(118,171,174,.4); }
.bd-tile::before { content: ''; position: absolute; right: -30px; top: -30px; width: 110px; height: 110px; border-radius: 9999px; background: rgba(238,238,238,.25); filter: blur(6px); }
.bd-tile-dark { color: #EEEEEE; background: linear-gradient(160deg, #353b46, #2c323b); border: 1px solid rgba(118,171,174,.25); box-shadow: 0 18px 40px rgba(0,0,0,.3); }
.bd-tile-dark::before { background: rgba(118,171,174,.3); }
.bd-rule { height: 3px; width: 0; border-radius: 9999px; background: linear-gradient(90deg, #76ABAE, #B9D6D8); box-shadow: 0 0 14px rgba(118,171,174,.7); transition: width 1.1s cubic-bezier(.16,1,.3,1) .3s; }
.bd-in .bd-rule, .bd-rule.bd-in { width: 56px; }

/* ---------- milestones ---------- */
.bd-bar { height: 2px; background: rgba(238,238,238,.12); border-radius: 9999px; overflow: hidden; }
.bd-bar > i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, #76ABAE, #B9D6D8); box-shadow: 0 0 12px rgba(118,171,174,.8); transition: width 1.6s cubic-bezier(.16,1,.3,1); transition-delay: var(--d, 0ms); }
.bd-in .bd-bar > i { width: 100%; }
.bd-ms-n { font-size: 12.5px; font-weight: 600; color: var(--cyan-3); letter-spacing: .08em; }
.bd-ms-card { padding: 22px 18px; border-radius: 22px; border: 1px solid transparent; transition: background .35s, border-color .35s, transform .35s; }
@media (min-width: 640px) { .bd-ms-card { padding: 26px 24px; } }
.bd-ms-card:hover { background: linear-gradient(160deg, #353b46, #2c323b); border-color: rgba(118,171,174,.3); transform: translateY(-4px); }

/* ---------- foundation tabs ---------- */
.bd-tabs { display: grid; gap: 20px; }
@media (min-width: 900px) { .bd-tabs { grid-template-columns: 320px 1fr; gap: 28px; } }
.bd-tablist { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
.bd-tablist::-webkit-scrollbar { display: none; }
@media (min-width: 900px) { .bd-tablist { flex-direction: column; overflow: visible; } }
.bd-tab { position: relative; flex: 1 0 auto; display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 18px; text-align: left; border: 1px solid rgba(118,171,174,.14); background: linear-gradient(160deg, #353b46, #2c323b); color: #EEEEEE; font-weight: 600; transition: transform .3s, box-shadow .3s, border-color .3s, background .3s; }
@media (min-width: 640px) { .bd-tab { padding: 16px 20px; gap: 14px; border-radius: 20px; } }
.bd-tab:hover { transform: translateX(4px); border-color: rgba(118,171,174,.45); }
.bd-tab[aria-selected="true"] { border-color: transparent; background: linear-gradient(135deg, #76ABAE, #B9D6D8); color: #222831; box-shadow: 0 16px 36px rgba(118,171,174,.4); }
.bd-tab-ico { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; background: rgba(118,171,174,.12); border: 1px solid rgba(118,171,174,.25); color: var(--cyan-3); transition: background .3s, color .3s; flex: none; }
.bd-tab[aria-selected="true"] .bd-tab-ico { background: rgba(34,40,49,.14); border-color: rgba(34,40,49,.2); color: #222831; }
.bd-panel { position: relative; overflow: hidden; border-radius: 24px; background: linear-gradient(160deg, #353b46, #2c323b); border: 1px solid rgba(118,171,174,.2); padding: 28px 22px; box-shadow: 0 30px 70px -20px rgba(118,171,174,.3); min-height: 260px; animation: bd-pop .55s cubic-bezier(.16,1,.3,1); }
@media (min-width: 640px) { .bd-panel { padding: 48px 44px; border-radius: 28px; min-height: 300px; } }
.bd-ghost { position: absolute; right: 14px; bottom: -22px; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 120px; line-height: 1; color: transparent; -webkit-text-stroke: 1.5px rgba(118,171,174,.2); pointer-events: none; user-select: none; }
@media (min-width: 640px) { .bd-ghost { font-size: 170px; bottom: -30px; right: 18px; } }
.bd-panel-ico { width: 60px; height: 60px; border-radius: 18px; display: grid; place-items: center; color: #222831; background: linear-gradient(135deg, #76ABAE, #B9D6D8); box-shadow: 0 0 40px rgba(118,171,174,.5); }
@media (min-width: 640px) { .bd-panel-ico { width: 68px; height: 68px; border-radius: 20px; } }

/* ---------- advantage switch ---------- */
.bd-seg { position: relative; display: inline-grid; grid-template-columns: 1fr 1fr; padding: 5px; max-width: 100%; border-radius: 9999px; background: rgba(238,238,238,.05); border: 1px solid rgba(118,171,174,.3); }
.bd-seg-thumb { position: absolute; top: 5px; bottom: 5px; left: 5px; width: calc(50% - 5px); border-radius: 9999px; box-shadow: 0 8px 30px rgba(118,171,174,.35); transition: transform .5s cubic-bezier(.16,1,.3,1); }
.bd-seg-thumb::before, .bd-seg-thumb::after { content: ''; position: absolute; inset: 0; border-radius: inherit; transition: opacity .5s; }
.bd-seg-thumb::before { background: linear-gradient(135deg, #5A626B, #8A9299); }
.bd-seg-thumb::after { background: linear-gradient(135deg, #76ABAE, #B9D6D8); opacity: 0; }
.bd-seg[data-mode="good"] .bd-seg-thumb { transform: translateX(100%); }
.bd-seg[data-mode="good"] .bd-seg-thumb::after { opacity: 1; }
.bd-seg[data-mode="good"] .bd-seg-thumb::before { opacity: 0; }
.bd-seg-btn { position: relative; z-index: 1; padding: .75rem 1.2rem; border-radius: 9999px; border: 0; background: none; font-weight: 700; font-size: 13.5px; line-height: 1.3; color: var(--mist); transition: color .4s; }
.bd-seg-btn[aria-selected="true"] { color: #EEEEEE; }
.bd-seg[data-mode="good"] .bd-seg-btn[aria-selected="true"] { color: #222831; }
@media (max-width: 560px) { .bd-seg-btn { padding: .7rem .6rem; font-size: 12px; } }

.bd-stage { position: relative; overflow: hidden; border-radius: 26px; padding: clamp(20px, 4vw, 48px); border: 1px solid; transition: background .7s, border-color .7s, box-shadow .7s; }
.bd-stage[data-mode="good"] { background: linear-gradient(150deg, rgba(118,171,174,.22) 0%, #222831 70%); border-color: rgba(118,171,174,.55); box-shadow: 0 30px 80px -24px rgba(118,171,174,.5); }
.bd-stage[data-mode="bad"] { background: rgba(34,40,49,.6); border-color: rgba(238,238,238,.12); box-shadow: none; }
.bd-stage::before { content: ''; position: absolute; right: -90px; top: -90px; width: 300px; height: 300px; border-radius: 9999px; background: radial-gradient(circle, rgba(118,171,174,.4), transparent 70%); opacity: 0; transition: opacity .7s; pointer-events: none; }
.bd-stage[data-mode="good"]::before { opacity: 1; }
.bd-stage-grid { position: relative; display: grid; gap: 24px; align-items: center; }
@media (min-width: 900px) { .bd-stage-grid { grid-template-columns: 270px 1fr; gap: 44px; } }
.bd-stage-head { display: flex; flex-direction: column; align-items: flex-start; gap: 18px; animation: bd-pop .6s cubic-bezier(.16,1,.3,1) both; }
.bd-big { position: relative; width: 72px; height: 72px; border-radius: 9999px; display: grid; place-items: center; }
@media (min-width: 640px) { .bd-big { width: 84px; height: 84px; } }
.bd-stage[data-mode="good"] .bd-big { background: linear-gradient(135deg, #76ABAE, #B9D6D8); color: #222831; box-shadow: 0 0 50px rgba(118,171,174,.6); }
.bd-stage[data-mode="bad"] .bd-big { background: rgba(138,146,153,.12); color: #8A9299; border: 1px solid rgba(138,146,153,.35); }
.bd-big::after { content: ''; position: absolute; inset: 0; border-radius: inherit; border: 1px solid rgba(118,171,174,.6); animation: bd-ping 2.6s ease-out infinite; }
.bd-stage[data-mode="bad"] .bd-big::after { display: none; }
.bd-rows { list-style: none; padding: 0; margin: 0; display: grid; gap: 6px; }
.bd-row { display: flex; align-items: center; gap: 14px; padding: 12px 12px; border-radius: 16px; border: 1px solid transparent; font-size: clamp(14.5px, 1.7vw, 17px); font-weight: 500; opacity: 0; animation: bd-flip .65s cubic-bezier(.16,1,.3,1) forwards; animation-delay: var(--d, 0ms); transition: background .3s, border-color .3s; }
@media (min-width: 640px) { .bd-row { padding: 14px 16px; gap: 16px; } }
.bd-row:hover { background: rgba(238,238,238,.04); border-color: rgba(118,171,174,.3); }
.bd-stage[data-mode="good"] .bd-row { color: #EEEEEE; }
.bd-stage[data-mode="bad"] .bd-row { color: #8A9299; }
@keyframes bd-flip { from { opacity: 0; transform: perspective(700px) rotateX(-65deg) translateY(14px); } to { opacity: 1; transform: none; } }
.bd-strike { position: relative; }
.bd-strike::after { content: ''; position: absolute; left: 0; top: 55%; height: 2px; width: 0; background: #8A9299; animation: bd-strike .6s cubic-bezier(.16,1,.3,1) forwards; animation-delay: calc(var(--d, 0ms) + 450ms); }
@keyframes bd-strike { to { width: 100%; } }
.bd-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: bd-drawk .7s ease forwards; animation-delay: calc(var(--d, 0ms) + 250ms); }
@keyframes bd-drawk { to { stroke-dashoffset: 0; } }
.bd-mk { flex: none; width: 26px; height: 26px; border-radius: 9999px; display: grid; place-items: center; }
.bd-mk-no { background: rgba(138,146,153,.14); color: #8A9299; border: 1px solid rgba(138,146,153,.3); }
.bd-mk-yes { background: linear-gradient(135deg, #76ABAE, #B9D6D8); color: #222831; box-shadow: 0 0 16px rgba(118,171,174,.6); }

/* ---------- CTA ---------- */
.bd-cta-box { position: relative; isolation: isolate; overflow: hidden; border-radius: 26px; padding: 56px 20px; text-align: center; background: linear-gradient(135deg, #31363F 0%, #222831 100%); border: 1px solid rgba(118,171,174,.3); border-bottom: 4px solid #76ABAE; }
@media (min-width: 640px) { .bd-cta-box { padding: 88px 48px; border-radius: 32px; } }
.bd-cta-ring {
  position: absolute; left: 50%; top: 50%; width: 900px; height: 900px; margin: -450px 0 0 -450px; border-radius: 9999px; opacity: .5; pointer-events: none;
  background: conic-gradient(from 0deg, transparent 0 60%, rgba(118,171,174,.35) 78%, transparent 100%);
  -webkit-mask-image: radial-gradient(circle, transparent 38%, #000 39%, #000 40%, transparent 41%, transparent 58%, #000 59%, #000 60%, transparent 61%);
  mask-image: radial-gradient(circle, transparent 38%, #000 39%, #000 40%, transparent 41%, transparent 58%, #000 59%, #000 60%, transparent 61%);
  animation: bd-spin 24s linear infinite;
}

/* ---------- fab ---------- */
.bd-fab { position: fixed; z-index: 40; display: flex; align-items: center; justify-content: center; border-radius: 9999px; transition: transform .3s, opacity .3s; }
.bd-fab:hover { transform: translateY(-3px) scale(1.06); }

/* ---------- pointer cursor on everything clickable ---------- */
.bd-root a[href],
.bd-root button:not(:disabled),
.bd-root [role="tab"],
.bd-root select,
.bd-btn,
.bd-fab { cursor: pointer; }
.bd-root a[href] *, .bd-root button:not(:disabled) * { cursor: inherit; }

.bd-root a:focus-visible, .bd-root button:focus-visible { outline: 2px solid var(--cyan-3); outline-offset: 4px; border-radius: 8px; }

@media (prefers-reduced-motion: reduce) {
  .bd-root *, .bd-root *::before, .bd-root *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; scroll-behavior: auto !important; }
  .bd-reveal { opacity: 1 !important; transform: none !important; }
  .bd-word > span { transform: none !important; }
  .bd-hr { opacity: 1 !important; }
  .bd-row { opacity: 1 !important; animation-delay: 0ms !important; }
  .bd-strike::after { width: 100% !important; animation-delay: 0ms !important; }
  .bd-draw { stroke-dashoffset: 0 !important; animation-delay: 0ms !important; }
  .bd-rule { width: 56px !important; }
  .bd-bar > i { width: 100% !important; }
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
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function Reveal({
  children,
  delay = 0,
  from = "up",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  from?: "up" | "left" | "right" | "scale";
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const dir = from === "left" ? "bd-l" : from === "right" ? "bd-r" : from === "scale" ? "bd-s" : "";
  return (
    <div ref={ref} className={`bd-reveal ${dir} ${inView ? "bd-in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Words({
  text,
  startDelay = 0,
  step = 70,
  className = "",
  trailing = true,
}: {
  text: string;
  startDelay?: number;
  step?: number;
  className?: string;
  trailing?: boolean;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={`${w}-${i}`} className="bd-word">
          <span className={className} style={{ "--d": `${startDelay + i * step}ms` } as CSSProperties}>
            {w}
            {trailing || i < words.length - 1 ? "\u00a0" : ""}
          </span>
        </span>
      ))}
    </>
  );
}

function WordsOnView({
  text,
  wordClassName = "",
  trailing = true,
}: {
  text: string;
  wordClassName?: string;
  trailing?: boolean;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.3);
  return (
    <span ref={ref} className={`bd-view ${inView ? "bd-in" : ""}`}>
      <Words text={text} className={wordClassName} trailing={trailing} />
    </span>
  );
}

function CountUp({ value, className = "", duration = 1900 }: { value: string; className?: string; duration?: number }) {
  const target = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {count}
      {suffix}
    </span>
  );
}

function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const d = document.documentElement;
      const max = d.scrollHeight - d.clientHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? d.scrollTop / max : 0})`;
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
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50" style={{ height: 3 }}>
      <div ref={barRef} className="bd-progress h-full origin-left" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

/** Flowing blue/cyan light trails + glowing network dots. Static when reduced motion is on. */
function NetworkCanvas({ intensity = 1 }: { intensity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, raf = 0;
    let pts: { x: number; y: number; vx: number; vy: number; p: number }[] = [];

    const size = () => {
      const r = c.parentElement!.getBoundingClientRect();
      W = r.width; H = r.height;
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, W / 22) * intensity);
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, p: Math.random() * 6,
      }));
    };

    const draw = (ms: number) => {
      const t = ms / 1000;
      ctx.clearRect(0, 0, W, H);
      for (let k = 0; k < 5; k++) {
        const g = ctx.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0, "rgba(118,171,174,0)");
        g.addColorStop(0.5, k % 2 ? "rgba(185,214,216,.5)" : "rgba(118,171,174,.5)");
        g.addColorStop(1, "rgba(118,171,174,0)");
        ctx.strokeStyle = g; ctx.lineWidth = 1 + k * 0.5; ctx.beginPath();
        for (let i = 0; i <= W; i += 16) {
          const y = H * (0.62 + k * 0.018) + Math.sin((i / W) * 3.2 + t * 0.35 + k * 0.5) * H * 0.1 + Math.sin((i / W) * 7 + t * 0.5 + k) * H * 0.025;
          if (i) ctx.lineTo(i, y); else ctx.moveTo(i, y);
        }
        ctx.stroke();
      }
      pts.forEach((P, a) => {
        P.x += P.vx; P.y += P.vy;
        if (P.x < 0 || P.x > W) P.vx *= -1;
        if (P.y < 0 || P.y > H) P.vy *= -1;
        for (let b = a + 1; b < pts.length; b++) {
          const Q = pts[b], d = Math.hypot(P.x - Q.x, P.y - Q.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(118,171,174,${0.25 * (1 - d / 130)})`;
            ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(Q.x, Q.y); ctx.stroke();
          }
        }
        const gl = 0.5 + 0.5 * Math.sin(t * 1.6 + P.p);
        ctx.fillStyle = `rgba(185,214,216,${0.35 + 0.5 * gl})`;
        ctx.beginPath(); ctx.arc(P.x, P.y, 1.6 + gl, 0, 6.3); ctx.fill();
      });
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    size();
    const onResize = () => { size(); if (reduce) draw(0); };
    window.addEventListener("resize", onResize);
    if (reduce) draw(0); else raf = requestAnimationFrame(draw);
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, [intensity]);
  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}

function Icon({ children, size = 24, stroke = 2 }: { children: ReactNode; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const Arrow = () => (
  <Icon size={18} stroke={2.4}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Icon>
);

function SectionHead({ pill, title, text }: { pill: string; title: ReactNode; text?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Reveal from="scale">
        <span className="bd-pill"><i />{pill}</span>
      </Reveal>
      <h2 className="bd-display bd-h2 mt-4" style={{ color: "#EEEEEE" }}>
        {title}
      </h2>
      {text && (
        <Reveal delay={200}>
          <p className="bd-lead mx-auto mt-4 max-w-xl" style={{ color: "#B3B8BD" }}>{text}</p>
        </Reveal>
      )}
    </div>
  );
}

function Rings() {
  const dot = (cx: number, cy: number, r = 5, o = 1) => <circle cx={cx} cy={cy} r={r} fill="#9CC5C8" opacity={o} />;
  return (
    <div className="bd-rings" aria-hidden="true">
      <svg viewBox="0 0 400 400">
        <defs>
          <linearGradient id="bd-rg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#76ABAE" />
            <stop offset="1" stopColor="#9CC5C8" />
          </linearGradient>
        </defs>
        <g className="bd-ring bd-ring-a">
          <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(118,171,174,.35)" strokeDasharray="3 9" />
          {dot(200, 10, 6)}{dot(390, 200, 4, 0.7)}{dot(60, 335, 5, 0.9)}
        </g>
        <g className="bd-ring bd-ring-b">
          <circle cx="200" cy="200" r="145" fill="none" stroke="url(#bd-rg)" strokeOpacity=".55" strokeWidth="1.2" />
          {dot(345, 200, 6)}{dot(97, 97, 4, 0.8)}{dot(150, 340, 5, 0.9)}
        </g>
        <g className="bd-ring bd-ring-c">
          <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(118,171,174,.4)" strokeDasharray="2 6" />
          {dot(200, 100, 5)}{dot(130, 270, 4, 0.8)}
        </g>
      </svg>
      <div className="bd-core">
        <span className="text-xs font-medium sm:text-sm" style={{ color: "#B3B8BD" }}>Since</span>
        <span className="bd-display bd-gt text-4xl font-bold leading-none sm:text-5xl">2015</span>
      </div>
    </div>
  );
}

function FoundationTabs() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const f = FOUNDATION[active];

  const onKey = (e: ReactKeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = FOUNDATION.length - 1;
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = i === last ? 0 : i + 1;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = i === 0 ? last : i - 1;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="bd-tabs">
      <div className="bd-tablist" role="tablist" aria-label="Vision, mission and values">
        {FOUNDATION.map((item, i) => (
          <button
            key={item.title}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            id={`bd-tab-${i}`}
            aria-selected={active === i}
            aria-controls="bd-tabpanel"
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className="bd-tab"
          >
            <span className="bd-tab-ico"><Icon size={20} stroke={1.8}>{item.icon}</Icon></span>
            <span className="bd-display whitespace-nowrap text-base sm:text-lg">{item.title}</span>
          </button>
        ))}
      </div>

      <div key={active} id="bd-tabpanel" role="tabpanel" aria-labelledby={`bd-tab-${active}`} className="bd-panel">
        <span className="bd-ghost" aria-hidden="true">0{active + 1}</span>
        <div className="relative">
          <div className="bd-panel-ico"><Icon size={28} stroke={1.7}>{f.icon}</Icon></div>
          <h3 className="bd-display bd-h3 mt-6" style={{ color: "#EEEEEE" }}>{f.title}</h3>
          <div className="bd-rule bd-in mt-4" />
          <p className="bd-lead mt-5 max-w-2xl" style={{ color: "#B3B8BD" }}>{f.text}</p>
        </div>
      </div>
    </div>
  );
}

type Mode = "good" | "bad";

function AdvantageSwitch() {
  const { ref, inView } = useInView<HTMLDivElement>(0.35);
  const [mode, setMode] = useState<Mode>("good");
  const touched = useRef(false);
  const btns = useRef<Record<Mode, HTMLButtonElement | null>>({ bad: null, good: null });

  // Story on first view: start on "not aligned", then flip to the Empire AE advantage.
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMode("bad");
    const t = setTimeout(() => {
      if (!touched.current) setMode("good");
    }, 2300);
    return () => clearTimeout(t);
  }, [inView]);

  const choose = (m: Mode) => {
    touched.current = true;
    setMode(m);
  };

  const onKey = (e: ReactKeyboardEvent<HTMLButtonElement>, m: Mode) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) return;
    e.preventDefault();
    const next: Mode = m === "bad" ? "good" : "bad";
    choose(next);
    btns.current[next]?.focus();
  };

  const good = mode === "good";
  const items = good ? GOOD : BAD;
  const title = good ? "The Empire AE Advantage" : "Not Aligned With Our Values";

  const Check = ({ size = 14, stroke = 3 }: { size?: number; stroke?: number }) => (
    <Icon size={size} stroke={stroke}><path d="M20 6 9 17l-5-5" pathLength={1} className="bd-draw" /></Icon>
  );
  const Cross = ({ size = 14, stroke = 2.8 }: { size?: number; stroke?: number }) => (
    <Icon size={size} stroke={stroke}>
      <path d="M18 6 6 18" pathLength={1} className="bd-draw" />
      <path d="m6 6 12 12" pathLength={1} className="bd-draw" />
    </Icon>
  );

  return (
    <div ref={ref} className="mx-auto mt-10 max-w-5xl sm:mt-14">
      <Reveal className="flex justify-center">
        <div className="bd-seg" role="tablist" aria-label="Compare approaches" data-mode={mode}>
          <span className="bd-seg-thumb" aria-hidden="true" />
          {(["bad", "good"] as const).map((m) => (
            <button
              key={m}
              ref={(el) => { btns.current[m] = el; }}
              role="tab"
              id={`bd-adv-${m}`}
              aria-selected={mode === m}
              aria-controls="bd-adv-panel"
              tabIndex={mode === m ? 0 : -1}
              onClick={() => choose(m)}
              onKeyDown={(e) => onKey(e, m)}
              className="bd-seg-btn"
            >
              {m === "bad" ? "Not Aligned With Our Values" : "The Empire AE Advantage"}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={150} className="mt-6 sm:mt-8">
        <div id="bd-adv-panel" role="tabpanel" aria-labelledby={`bd-adv-${mode}`} aria-live="polite" data-mode={mode} className="bd-stage">
          <div className="bd-stage-grid">
            <div key={`head-${mode}`} className="bd-stage-head">
              <div className="bd-big">{good ? <Check size={34} stroke={2.6} /> : <Cross size={30} stroke={2.4} />}</div>
              <h3 className="bd-display bd-h3" style={{ color: good ? "#EEEEEE" : "#8A9299" }}>
                {title}
              </h3>
            </div>

            <ul key={`list-${mode}`} className="bd-rows">
              {items.map((item, i) => (
                <li key={item} className="bd-row" style={{ "--d": `${i * 90}ms` } as CSSProperties}>
                  <span className={`bd-mk ${good ? "bd-mk-yes" : "bd-mk-no"}`}>{good ? <Check size={13} stroke={3.2} /> : <Cross size={12} />}</span>
                  <span className={good ? "" : "bd-strike"}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Floating buttons                                                          */
/* -------------------------------------------------------------------------- */

function FloatingButtons() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <>
      <a
        href="https://wa.me/919847980605" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className="bd-fab"
        style={{ bottom: "calc(80px + env(safe-area-inset-bottom, 0px))", right: 18, width: 50, height: 50, background: "#25d366", color: "#EEEEEE", boxShadow: "0 8px 28px rgba(37,211,102,.45)" }}
      >
        <Icon size={26} stroke={1.8}>
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          <path d="M9 9.5c.5 2 2.5 4 5 5l1.5-1.5-2-1-1 .8c-.8-.4-1.6-1.2-2-2l.8-1-1-2z" />
        </Icon>
      </a>
      <button
        type="button" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="bd-fab"
        style={{
          bottom: "calc(24px + env(safe-area-inset-bottom, 0px))", right: 20, width: 46, height: 46, border: "1px solid rgba(118,171,174,.45)", background: "rgba(49,54,63,.9)", color: "#9CC5C8",
          boxShadow: "0 8px 28px rgba(0,0,0,.4)", opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none",
        }}
      >
        <Icon size={20} stroke={2.2}>
          <path d="m5 12 7-7 7 7" />
          <path d="M12 19V5" />
        </Icon>
      </button>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

  return (
    <div className="bd-root min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <ScrollProgress />

      <main>
        {/* ============================ HERO ============================ */}
        <section className="bd-hero">
          <div className="bd-grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
          <NetworkCanvas />
          <div className="bd-wrap relative z-[2] grid items-center gap-10 sm:gap-14 lg:grid-cols-[1.25fr_1fr]">
            <div>
              <nav aria-label="Breadcrumb" className="bd-hr mb-5 flex items-center gap-2.5 text-sm sm:mb-6" style={d(80)}>
                <Link href="/" className="font-medium" style={{ color: "#8A9299" }}>Home</Link>
                <span style={{ color: "#5A626B" }}>/</span>
                <span style={{ color: "#EEEEEE" }}>About Us</span>
              </nav>

              <span className="bd-pill bd-hr" style={d(180)}><i />About Us</span>

              <h1 className="bd-display bd-h1 mt-5" style={{ color: "#EEEEEE" }}>
                <span className="block"><Words text="Building" startDelay={300} /></span>
                <span className="block"><Words text="Digital Empires" startDelay={480} className="bd-gt" trailing={false} /></span>
                <span className="block"><Words text="Since 2015" startDelay={820} trailing={false} /></span>
              </h1>

              <p className="bd-hr bd-lead mt-6 max-w-xl" style={{ ...d(1250), color: "#B3B8BD" }}>
                A full-service digital solutions company dedicated to helping businesses build, grow, and strengthen their digital presence.
              </p>

              <div className="bd-hr mt-8 flex flex-wrap gap-3 sm:gap-4" style={d(1450)}>
                <Link href="/contact" className="bd-btn bd-btn-pri">Start a Project <Arrow /></Link>
                <Link href="/services" className="bd-btn bd-btn-ghost">Our Services</Link>
              </div>
            </div>

            <div className="bd-hr" style={d(700)}>
              <Rings />
            </div>
          </div>

          <div className="bd-hr absolute bottom-7 left-1/2 hidden -translate-x-1/2 lg:block" style={d(2000)} aria-hidden="true">
            <div className="bd-cue" />
          </div>
        </section>

        {/* ========================== WHO WE ARE ======================== */}
        <section className="bd-sec">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="bd-blob bd-blob-a absolute" style={{ left: "-10%", top: "10%", width: 380, height: 380, background: "rgba(118,171,174,.1)" }} />
            <div className="bd-blob bd-blob-b absolute" style={{ right: "-8%", bottom: 0, width: 440, height: 440, background: "rgba(92,102,118,.15)" }} />
          </div>
          <div className="bd-wrap grid items-center gap-10 sm:gap-14 lg:grid-cols-[.95fr_1.05fr] lg:gap-20">
            {/* photo + stat tiles */}
            <Reveal from="left">
              <div className="mx-auto w-full max-w-md lg:max-w-none">
                <div className="bd-photo">
                  <img src="https://empireae.xyz/images/about.png" alt="Empire AE Team" />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4">
                  <div className="bd-tile">
                    <CountUp value="9+" className="bd-display relative text-3xl font-bold leading-none sm:text-4xl" />
                    <div className="relative mt-2 text-[13px] sm:text-sm" style={{ color: "rgba(34,40,49,.85)" }}>Years of Excellence</div>
                  </div>
                  <div className="bd-tile bd-tile-dark">
                    <CountUp value="150+" className="bd-display bd-gt relative text-3xl font-bold leading-none sm:text-4xl" />
                    <div className="relative mt-2 text-[13px] sm:text-sm" style={{ color: "#B3B8BD" }}>Projects Completed</div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* text */}
            <div>
              <Reveal>
                <span className="bd-pill"><i />Who We Are</span>
              </Reveal>

              <h2 className="bd-display bd-h2 mt-4" style={{ color: "#EEEEEE" }}>
                <span className="block"><WordsOnView text="Your End-to-End" /></span>
                <span className="block"><WordsOnView text="Digital Partner" wordClassName="bd-gt" trailing={false} /></span>
              </h2>

              <Reveal delay={150}><div className="bd-rule mt-5" /></Reveal>

              <Reveal delay={200}>
                <p className="bd-lead mt-6 font-medium" style={{ color: "#EEEEEE", fontSize: "clamp(1rem, 2vw, 1.15rem)" }}>
                  Branding Empire AE is a full-service digital solutions company dedicated to helping businesses build, grow, and strengthen their digital presence.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <p className="bd-body mt-4">
                  We specialize in website development, mobile app development, ERP solutions, digital marketing, and brand identity creation — offering all services under one roof. With over 9 years of industry experience, we bring deep expertise, proven strategies, and reliable solutions to every project we undertake.
                </p>
              </Reveal>
              <Reveal delay={400}>
                <p className="bd-body mt-3">
                  We place our clients at the center of everything we do, focusing on understanding their unique goals and delivering tailored solutions that create real, measurable value for their businesses.
                </p>
              </Reveal>

              <Reveal delay={500}>
                <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
                  <Link href="/contact" className="bd-btn bd-btn-pri">Start a Project <Arrow /></Link>
                  <Link href="/services" className="bd-btn bd-btn-ghost">Our Services</Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ========================== MILESTONES ======================== */}
        <section className="bd-sec bd-abyss">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: "radial-gradient(ellipse at 15% 0%, rgba(118,171,174,.22), transparent 55%), radial-gradient(ellipse at 90% 100%, rgba(118,171,174,.14), transparent 55%)" }} />
          <div className="bd-wrap">
            <SectionHead
              pill="Milestones"
              title={
                <>
                  <span className="block"><WordsOnView text="Digital Experiences." /></span>
                  <span className="block"><WordsOnView text="Proven Results." wordClassName="bd-gt" trailing={false} /></span>
                </>
              }
              text="Numbers that speak for our dedication, quality, and commitment to client success."
            />

            <div className="mt-10 grid gap-2 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
              {MILESTONES.map((m, i) => (
                <MilestoneCol key={m.n} m={m} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ===================== VISION / MISSION / VALUES ================ */}
        <section className="bd-sec">
          <div className="bd-wrap">
            <SectionHead
              pill="Our Foundation"
              title={
                <>
                  <WordsOnView text="Vision &" />
                  <WordsOnView text="Mission" wordClassName="bd-gt" trailing={false} />
                </>
              }
            />
            <Reveal delay={150} className="mt-10 sm:mt-14">
              <FoundationTabs />
            </Reveal>
          </div>
        </section>

        {/* ========================= WHAT SETS US APART ================= */}
        <section className="bd-sec bd-abyss">
          <div className="bd-wrap">
            <SectionHead
              pill="Our Advantage"
              title={
                <>
                  <WordsOnView text="What Sets Us" />
                  <WordsOnView text="Apart" wordClassName="bd-gt" trailing={false} />
                </>
              }
              text="We go beyond just delivering projects — we build lasting partnerships built on trust, transparency, and consistent excellence."
            />

            <AdvantageSwitch />
          </div>
        </section>

        {/* ============================ FINAL CTA ======================= */}
        <section className="bd-sec" style={{ paddingTop: 0 }}>
          <div className="bd-wrap">
            <Reveal from="scale">
              <div className="bd-cta-box">
                <div className="bd-cta-ring" aria-hidden="true" />
                <NetworkCanvas intensity={0.7} />
                <div className="relative z-[2] mx-auto max-w-3xl">
                  <span className="bd-pill"><i />Work With Us</span>
                  <h2 className="bd-display bd-h2-xl mt-5" style={{ color: "#EEEEEE" }}>
                    <WordsOnView text="Let's Build Something" />
                    <br className="hidden sm:block" />
                    <WordsOnView text="Amazing Together" trailing={false} />
                  </h2>
                  <p className="bd-lead mx-auto mt-5 max-w-xl" style={{ color: "rgba(255,255,255,.82)" }}>
                    Ready to take your digital presence to the next level? Contact our team and let&apos;s make it happen.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-9 sm:gap-4">
                    <Link href="/contact" className="bd-btn bd-btn-pri">Get In Touch <Arrow /></Link>
                    <Link href="/services" className="bd-btn bd-btn-ghost">View Services</Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

    </div>
  );
}

function MilestoneCol({ m, index }: { m: (typeof MILESTONES)[number]; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className={`bd-reveal ${inView ? "bd-in" : ""}`} style={{ transitionDelay: `${index * 120}ms` }}>
      <div className="bd-ms-card">
        <div className="bd-bar" style={{ "--d": `${index * 160}ms` } as CSSProperties}><i /></div>
        <div className="mt-5 flex items-center justify-between">
          <span className="bd-ms-n">{m.n}</span>
        </div>
        <div className="bd-display bd-gt bd-num mt-3 font-bold">
          <CountUp value={m.value} />
        </div>
        <h3 className="bd-display mt-4 text-lg font-semibold sm:text-xl" style={{ color: "#EEEEEE" }}>{m.title}</h3>
        <p className="mt-2 text-[14.5px] leading-7" style={{ color: "#B3B8BD" }}>{m.text}</p>
      </div>
    </div>
  );
}