"use client";

import Link from "next/link";
import emailjs from "@emailjs/browser";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";

/* -------------------------------------------------------------------------- */
/*  Content (same as the original Contact page)                               */
/*  Palette: #222831 · #31363F · #76ABAE · #EEEEEE                            */
/* -------------------------------------------------------------------------- */

/**
 * EmailJS settings - add these to .env.local (then restart `npm run dev`):
 * NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
 * NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
 * NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
 */
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";

const SERVICES = [
  "Web Designing",
  "Web Development",
  "Mobile App Development",
  "Digital Marketing",
  "E-Commerce Solution",
  "Hosting & Domain",
  "SEO",
  "Software Application",
  "Other",
];

const STEPS = [
  {
    n: "01",
    title: "Initial Consultation",
    text: "We respond within 24 hours to schedule a free consultation call to understand your requirements.",
    icon: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
  },
  {
    n: "02",
    title: "Proposal & Strategy",
    text: "We provide a detailed project proposal outlining the scope, timeline, and strategy tailored for you.",
    icon: (
      <>
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
        <path d="M14 2v5h5" />
        <path d="M9 13h6M9 17h6" />
      </>
    ),
  },
  {
    n: "03",
    title: "Project Kickoff",
    text: "Once approved, our team gets to work immediately, keeping you updated at every milestone.",
    icon: (
      <>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </>
    ),
  },
];

const ICONS = {
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
  mail: (
    <>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
    </>
  ),
  send: (
    <>
      <path d="m22 2-7 20-4-9-9-4z" />
      <path d="M22 2 11 13" />
    </>
  ),
};

/* -------------------------------------------------------------------------- */
/*  Styles (same design system as the About page, plus contact-specific)      */
/* -------------------------------------------------------------------------- */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=DM+Sans:wght@400;500;600;700&display=swap');

.bd-root {
  --ink: #222831; --deep: #31363F; --abyss: #1D2229;
  --cyan: #76ABAE; --cyan-3: #9CC5C8; --pale: #B9D6D8;
  --mist: #B3B8BD; --snow: #EEEEEE; --slate: #5C6676;
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
.bd-h3 { font-size: clamp(1.45rem, 3vw, 2.1rem); line-height: 1.15; font-weight: 700; }
.bd-lead { font-size: clamp(.97rem, 1.7vw, 1.06rem); line-height: 1.75; }

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
@keyframes bd-sigping { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(2.5); opacity: 0; } }
@keyframes bd-nudge { 0%,100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
@keyframes bd-drawk { to { stroke-dashoffset: 0; } }
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
.bd-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: .7rem; border-radius: 9999px; padding: .9rem 2rem; min-height: 48px; font-weight: 700; font-size: 14.5px; border: 0; transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .3s, background-position .6s, background .3s, border-color .3s, opacity .3s; }
.bd-btn-pri { color: #222831; background: linear-gradient(100deg, #76ABAE, #B9D6D8, #76ABAE); background-size: 200% auto; box-shadow: 0 10px 40px rgba(118,171,174,.45); }
.bd-btn-pri:hover:not(:disabled) { background-position: 100% 0; box-shadow: 0 16px 56px rgba(118,171,174,.65); transform: translateY(-2px); }
.bd-btn-pri::after { content: ''; position: absolute; top: 0; bottom: 0; width: 40%; left: 0; background: linear-gradient(100deg, transparent, rgba(238,238,238,.65), transparent); animation: bd-shine 3.2s ease-in-out infinite; }
.bd-btn:disabled { opacity: .75; cursor: progress; }
.bd-btn-ghost { color: #EEEEEE; border: 1px solid rgba(238,238,238,.3); background: rgba(238,238,238,.03); }
.bd-btn-ghost:hover { background: rgba(238,238,238,.1); border-color: rgba(238,238,238,.6); transform: translateY(-2px); }
.bd-btn-pri .bd-send { transition: transform .35s cubic-bezier(.16,1,.3,1); }
.bd-btn-pri:hover:not(:disabled) .bd-send { transform: translate(3px,-3px); }
@media (max-width: 479px) { .bd-btn { width: 100%; } }
.bd-spinner { width: 18px; height: 18px; border-radius: 9999px; border: 2px solid rgba(34,40,49,.3); border-top-color: #222831; animation: bd-spin .8s linear infinite; }

/* ---------- hero ---------- */
.bd-hero { position: relative; isolation: isolate; overflow: hidden; padding: 116px 20px 72px; background: radial-gradient(700px circle at 70% 30%, rgba(118,171,174,.16), transparent 60%), linear-gradient(180deg, #31363F 0%, #222831 100%); }
@media (min-width: 640px) { .bd-hero { padding: 140px 32px 88px; } }
@media (min-width: 1024px) { .bd-hero { padding: 168px 48px 112px; } }
.bd-cue { width: 24px; height: 38px; border: 2px solid rgba(238,238,238,.35); border-radius: 9999px; position: relative; }
.bd-cue::after { content: ''; position: absolute; left: 50%; top: 7px; width: 4px; height: 7px; margin-left: -2px; border-radius: 9999px; background: var(--cyan-3); animation: bd-cue 1.8s ease-in-out infinite; }

/* signal visual (24h response) */
.bd-sig { position: relative; width: 100%; max-width: 280px; aspect-ratio: 1; margin-inline: auto; }
@media (min-width: 640px) { .bd-sig { max-width: 340px; } }
@media (min-width: 1024px) { .bd-sig { max-width: 380px; } }
.bd-sig-ring { position: absolute; inset: 29%; border-radius: 9999px; border: 1px solid rgba(118,171,174,.55); animation: bd-sigping 4s ease-out infinite; animation-delay: var(--d, 0ms); }
.bd-orbit { position: absolute; border-radius: 9999px; border: 1px dashed rgba(118,171,174,.3); animation: bd-spin var(--t, 30s) linear infinite; }
.bd-orbit i { position: absolute; top: -5px; left: 50%; width: 10px; height: 10px; margin-left: -5px; border-radius: 9999px; background: #9CC5C8; box-shadow: 0 0 16px rgba(156,197,200,.9); }
.bd-core { position: absolute; inset: 29%; border-radius: 9999px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
  background: radial-gradient(circle at 35% 25%, rgba(118,171,174,.45), rgba(34,40,49,.92) 70%); border: 1px solid rgba(118,171,174,.45); box-shadow: 0 0 70px rgba(118,171,174,.5), inset 0 0 30px rgba(118,171,174,.2); animation: bd-float 7s ease-in-out infinite; }

/* ---------- info rows ---------- */
.bd-rule { height: 3px; width: 0; border-radius: 9999px; background: linear-gradient(90deg, #76ABAE, #B9D6D8); box-shadow: 0 0 14px rgba(118,171,174,.7); transition: width 1.1s cubic-bezier(.16,1,.3,1) .3s; }
.bd-in .bd-rule, .bd-rule.bd-in { width: 56px; }
.bd-info { display: flex; align-items: center; gap: 14px; padding: 16px 16px; border-radius: 18px; border: 1px solid rgba(118,171,174,.16); background: linear-gradient(160deg, #353b46, #2c323b); transition: transform .35s cubic-bezier(.16,1,.3,1), border-color .35s, box-shadow .35s; }
.bd-info:hover { transform: translateX(4px); border-color: rgba(118,171,174,.5); box-shadow: 0 18px 40px -16px rgba(118,171,174,.35); }
.bd-ico { width: 44px; height: 44px; border-radius: 13px; display: grid; place-items: center; flex: none; background: rgba(118,171,174,.12); border: 1px solid rgba(118,171,174,.25); color: var(--cyan-3); transition: background .3s, color .3s, transform .3s; }
.bd-info:hover .bd-ico { background: linear-gradient(135deg, #76ABAE, #B9D6D8); color: #222831; transform: rotate(-6deg); }
.bd-info h3 { font-size: 12px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--cyan-3); margin: 0; }
.bd-info a, .bd-info span.bd-val { display: inline-block; margin-top: 2px; font-size: 16px; font-weight: 600; color: #EEEEEE; transition: color .25s; overflow-wrap: anywhere; }
.bd-info a:hover { color: var(--cyan-3); }
.bd-social { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
.bd-social a { margin: 0; font-size: 13.5px; font-weight: 600; padding: 6px 14px; border-radius: 9999px; border: 1px solid rgba(118,171,174,.3); color: #EEEEEE; transition: background .25s, color .25s, border-color .25s, transform .25s; }
.bd-social a:hover { background: linear-gradient(135deg, #76ABAE, #B9D6D8); color: #222831; border-color: transparent; transform: translateY(-2px); }

@media (min-width: 640px) { .bd-info { gap: 18px; padding: 20px 22px; border-radius: 20px; } .bd-info a, .bd-info span.bd-val { font-size: 18px; } }

/* ---------- form ---------- */
.bd-card { position: relative; overflow: hidden; border-radius: 24px; background: linear-gradient(160deg, #353b46, #2c323b); border: 1px solid rgba(118,171,174,.22); padding: 28px 18px; box-shadow: 0 30px 70px -20px rgba(118,171,174,.3); }
@media (min-width: 640px) { .bd-card { padding: 44px 40px; border-radius: 28px; } }
.bd-card::before { content: ''; position: absolute; right: -100px; top: -100px; width: 300px; height: 300px; border-radius: 9999px; background: radial-gradient(circle, rgba(118,171,174,.28), transparent 70%); pointer-events: none; }
.bd-card > * { position: relative; }
.bd-card-center { display: flex; align-items: center; justify-content: center; }
.bd-card-center > .bd-ok { width: 100%; }
.bd-field { position: relative; }
.bd-input { width: 100%; padding: 28px 16px 10px; border-radius: 14px; background: rgba(34,40,49,.65); border: 1px solid rgba(118,171,174,.2); color: #EEEEEE; font: inherit; font-size: 16px; line-height: 1.4; transition: border-color .25s, box-shadow .25s, background .25s; -webkit-appearance: none; appearance: none; }
.bd-input:hover { border-color: rgba(118,171,174,.45); }
.bd-input:focus { outline: none; border-color: var(--cyan); background: rgba(34,40,49,.9); box-shadow: 0 0 0 4px rgba(118,171,174,.16); }
.bd-input[aria-invalid="true"] { border-color: #D99A9A; box-shadow: 0 0 0 3px rgba(217,154,154,.14); }
textarea.bd-input { min-height: 150px; resize: vertical; }
.bd-input option { background: #31363F; color: #EEEEEE; }
.bd-label { position: absolute; left: 17px; top: 17px; max-width: calc(100% - 34px); color: #8A9299; font-size: 16px; pointer-events: none; transform-origin: left top; transition: transform .25s cubic-bezier(.16,1,.3,1), color .25s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bd-input:focus + .bd-label,
.bd-input:not(:placeholder-shown) + .bd-label,
.bd-field-sel .bd-label { transform: translateY(-11px) scale(.76); }
.bd-input:focus + .bd-label { color: var(--cyan-3); }
.bd-chev { position: absolute; right: 16px; top: 50%; margin-top: -9px; color: var(--cyan-3); pointer-events: none; }
.bd-err { display: flex; align-items: center; gap: 6px; margin: 8px 4px 0; font-size: 13.5px; color: #E6B0B0 !important; animation: bd-pop .35s cubic-bezier(.16,1,.3,1); }
.bd-fail { margin-top: 18px; padding: 14px 16px; border-radius: 14px; border: 1px solid rgba(217,154,154,.4); background: rgba(217,154,154,.08); font-size: 15px; color: #EEEEEE !important; animation: bd-pop .4s cubic-bezier(.16,1,.3,1); }
.bd-ok { text-align: center; padding: 20px 0; animation: bd-pop .6s cubic-bezier(.16,1,.3,1); }
.bd-ok-ico { width: 76px; height: 76px; margin: 0 auto 26px; border-radius: 9999px; display: grid; place-items: center; color: #222831; background: linear-gradient(135deg, #76ABAE, #B9D6D8); box-shadow: 0 0 50px rgba(118,171,174,.6); position: relative; }
.bd-ok-ico::after { content: ''; position: absolute; inset: 0; border-radius: inherit; border: 1px solid rgba(118,171,174,.6); animation: bd-ping 2.4s ease-out infinite; }
.bd-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: bd-drawk .7s ease .25s forwards; }

/* ---------- steps ---------- */
.bd-steps { position: relative; display: grid; gap: 20px; }
@media (min-width: 900px) { .bd-steps { grid-template-columns: repeat(3, 1fr); gap: 28px; } }
.bd-steps-line { display: none; }
@media (min-width: 900px) {
  .bd-steps-line { display: block; position: absolute; top: 28px; left: 28px; right: 28px; height: 2px; background: rgba(238,238,238,.12); border-radius: 9999px; overflow: hidden; }
  .bd-steps-line i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, #76ABAE, #B9D6D8); box-shadow: 0 0 12px rgba(118,171,174,.8); transition: width 2s cubic-bezier(.16,1,.3,1) .2s; }
  .bd-in .bd-steps-line i { width: 100%; }
}
.bd-step { position: relative; opacity: 0; transform: translateY(30px); transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); transition-delay: var(--d, 0ms); }
.bd-in .bd-step { opacity: 1; transform: none; }
.bd-step-n { position: relative; z-index: 1; width: 52px; height: 52px; border-radius: 9999px; display: grid; place-items: center; background: var(--abyss); border: 1px solid rgba(118,171,174,.55); color: var(--cyan-3); font-weight: 700; box-shadow: 0 0 0 8px var(--abyss); }
.bd-step-card { margin-top: 18px; height: 100%; position: relative; padding: 24px 20px; border-radius: 22px; border: 1px solid rgba(118,171,174,.16); background: linear-gradient(160deg, #353b46, #2c323b); transition: transform .35s cubic-bezier(.16,1,.3,1), border-color .35s, box-shadow .35s; }
.bd-step-card:hover { transform: translateY(-5px); border-color: rgba(118,171,174,.5); box-shadow: 0 24px 50px -18px rgba(118,171,174,.35); }
.bd-step-card:hover .bd-ico { background: linear-gradient(135deg, #76ABAE, #B9D6D8); color: #222831; transform: rotate(-6deg); }
.bd-step-arrow { display: none; position: absolute; right: 24px; top: 30px; color: var(--cyan-3); font-size: 22px; animation: bd-nudge 2s ease-in-out infinite; }
@media (min-width: 900px) { .bd-step-arrow { display: block; } }
.bd-ghost { position: absolute; right: 14px; bottom: -20px; font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 100px; line-height: 1; color: transparent; -webkit-text-stroke: 1.5px rgba(118,171,174,.16); pointer-events: none; user-select: none; }

@media (min-width: 640px) { .bd-step-card { padding: 30px 28px; border-radius: 24px; } .bd-ghost { font-size: 130px; bottom: -26px; right: 16px; } }

/* ---------- fab ---------- */
.bd-fab { position: fixed; z-index: 40; display: flex; align-items: center; justify-content: center; border-radius: 9999px; transition: transform .3s, opacity .3s; }
.bd-fab:hover { transform: translateY(-3px) scale(1.06); }

.bd-root a[href],
.bd-root button:not(:disabled),
.bd-root [role="tab"],
.bd-root select,
.bd-btn,
.bd-fab { cursor: pointer; }
.bd-root a[href] *, .bd-root button:not(:disabled) * { cursor: inherit; }
.bd-root button:disabled { cursor: progress; }

.bd-root a:focus-visible, .bd-root button:focus-visible { outline: 2px solid var(--cyan-3); outline-offset: 4px; border-radius: 8px; }

@media (prefers-reduced-motion: reduce) {
  .bd-root *, .bd-root *::before, .bd-root *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; scroll-behavior: auto !important; }
  .bd-reveal { opacity: 1 !important; transform: none !important; }
  .bd-word > span { transform: none !important; }
  .bd-hr { opacity: 1 !important; }
  .bd-rule { width: 56px !important; }
  .bd-step { opacity: 1 !important; transform: none !important; }
  .bd-steps-line i { width: 100% !important; }
  .bd-draw { stroke-dashoffset: 0 !important; }
}
`;

/* -------------------------------------------------------------------------- */
/*  Hooks & helpers (same as the About page)                                  */
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

function WordsOnView({ text, wordClassName = "", trailing = true }: { text: string; wordClassName?: string; trailing?: boolean }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.3);
  return (
    <span ref={ref} className={`bd-view ${inView ? "bd-in" : ""}`}>
      <Words text={text} className={wordClassName} trailing={trailing} />
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

/** Flowing light trails + glowing network dots. Static when reduced motion is on. */
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

/* -------------------------------------------------------------------------- */
/*  Hero visual — pulsing signal around the 24h response time                 */
/* -------------------------------------------------------------------------- */

function Signal() {
  const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
  return (
    <div className="bd-sig" aria-hidden="true">
      <span className="bd-sig-ring" style={d(0)} />
      <span className="bd-sig-ring" style={d(1300)} />
      <span className="bd-sig-ring" style={d(2600)} />
      <div className="bd-orbit" style={{ inset: "6%", ["--t" as string]: "36s" }}><i /></div>
      <div className="bd-orbit" style={{ inset: "18%", ["--t" as string]: "24s", animationDirection: "reverse" }}><i /></div>
      <div className="bd-core">
        <span className="mb-1" style={{ color: "#9CC5C8" }}><Icon size={22} stroke={1.8}>{ICONS.mail}</Icon></span>
        <span className="text-xs font-medium" style={{ color: "#B3B8BD" }}>Response Time</span>
        <span className="bd-display bd-gt text-4xl font-bold leading-none sm:text-5xl">24h</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Contact form                                                              */
/* -------------------------------------------------------------------------- */

type Values = { firstName: string; lastName: string; email: string; phone: string; service: string; message: string };
type Errors = Partial<Record<"firstName" | "lastName" | "email" | "message", string>>;
type Status = "idle" | "sending" | "success" | "error";

const EMPTY: Values = { firstName: "", lastName: "", email: "", phone: "", service: "", message: "" };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.firstName.trim()) e.firstName = "Please enter your first name.";
  if (!v.lastName.trim()) e.lastName = "Please enter your last name.";
  if (!v.email.trim()) e.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (!v.message.trim()) e.message = "Please tell us about your project.";
  return e;
}

function Field({
  id,
  label,
  value,
  onChange,
  required = false,
  error,
  type = "text",
  as = "input",
  autoComplete,
}: {
  id: keyof Values;
  label: string;
  value: string;
  onChange: (id: keyof Values, v: string) => void;
  required?: boolean;
  error?: string;
  type?: string;
  as?: "input" | "textarea" | "select";
  autoComplete?: string;
}) {
  const common = {
    id,
    name: id,
    value,
    required,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-err` : undefined,
    className: "bd-input",
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(id, e.target.value),
  };

  return (
    <div className={`bd-field ${as === "select" ? "bd-field-sel" : ""}`}>
      {as === "textarea" && <textarea {...common} placeholder=" " rows={5} />}
      {as === "input" && <input {...common} type={type} placeholder=" " />}
      {as === "select" && (
        <>
          <select {...common}>
            <option value="">Select a service...</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span className="bd-chev"><Icon size={18} stroke={2.2}><path d="m6 9 6 6 6-6" /></Icon></span>
        </>
      )}
      <label htmlFor={id} className="bd-label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {error && (
        <p id={`${id}-err`} className="bd-err">
          <Icon size={14} stroke={2.4}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></Icon>
          {error}
        </p>
      )}
    </div>
  );
}

function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardH, setCardH] = useState(0);

  const set = (id: keyof Values, v: string) => {
    setValues((p) => ({ ...p, [id]: v }));
    if (id in errors) setErrors((p) => ({ ...p, [id]: undefined }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const errs = validate(values);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    setStatus("sending");
    try {
      // Template variables: {{from_name}} {{reply_to}} {{phone}} {{service}} {{message}}
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: `${values.firstName.trim()} ${values.lastName.trim()}`,
          reply_to: values.email.trim(),
          phone: values.phone.trim() || "-",
          service: values.service || "-",
          message: values.message.trim(),
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setCardH(cardRef.current?.offsetHeight ?? 0);
      setValues(EMPTY);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bd-card bd-card-center" style={cardH ? { minHeight: cardH } : undefined}>
        <div className="bd-ok" role="status">
          <div className="bd-ok-ico">
            <Icon size={40} stroke={2.6}><path d="M20 6 9 17l-5-5" pathLength={1} className="bd-draw" /></Icon>
          </div>
          <h2 className="bd-display bd-h3" style={{ color: "#EEEEEE" }}>Message Sent</h2>
          <p className="bd-lead mx-auto mt-4 max-w-sm">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
          <button type="button" className="bd-btn bd-btn-ghost mt-8" onClick={() => setStatus("idle")}>Send another message</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef} className="bd-card">
      <h2 className="bd-display bd-h3" style={{ color: "#EEEEEE" }}>Send Us a Message</h2>
      <div className="bd-rule bd-in mt-4" />
      <p className="bd-lead mt-4">Fill out the form below and our team will get back to you promptly.</p>

      <form onSubmit={onSubmit} noValidate className="mt-6 grid gap-3 sm:mt-8 sm:gap-4">
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <Field id="firstName" label="First Name" value={values.firstName} onChange={set} required error={errors.firstName} autoComplete="given-name" />
          <Field id="lastName" label="Last Name" value={values.lastName} onChange={set} required error={errors.lastName} autoComplete="family-name" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <Field id="email" label="Email Address" type="email" value={values.email} onChange={set} required error={errors.email} autoComplete="email" />
          <Field id="phone" label="Phone Number" type="tel" value={values.phone} onChange={set} autoComplete="tel" />
        </div>
        <Field id="service" label="Service Interested In" as="select" value={values.service} onChange={set} />
        <Field id="message" label="Message" as="textarea" value={values.message} onChange={set} required error={errors.message} />

        <div aria-live="polite">
          {status === "error" && (
            <p className="bd-fail" role="alert">
              Something went wrong while sending your message. Please try again, or email us at info@empireae.xyz.
            </p>
          )}
        </div>

        <div className="mt-2">
          <button type="submit" className="bd-btn bd-btn-pri w-full sm:w-auto" disabled={status === "sending"}>
            {status === "sending" ? (
              <>
                <span className="bd-spinner" aria-hidden="true" /> Sending...
              </>
            ) : (
              <>
                Send Message
                <span className="bd-send"><Icon size={18} stroke={2.4}>{ICONS.send}</Icon></span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  What happens next                                                         */
/* -------------------------------------------------------------------------- */

function Steps() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  return (
    <div ref={ref} className={`bd-steps mt-10 sm:mt-14 ${inView ? "bd-in" : ""}`}>
      <div className="bd-steps-line" aria-hidden="true"><i /></div>
      {STEPS.map((s, i) => (
        <article key={s.n} className="bd-step" style={{ "--d": `${i * 200}ms` } as CSSProperties}>
          <div className="bd-step-n" aria-hidden="true">{s.n}</div>
          <div className="bd-step-card overflow-hidden">
            <span className="bd-ghost" aria-hidden="true">{s.n}</span>
            {i < STEPS.length - 1 && <span className="bd-step-arrow" aria-hidden="true">→</span>}
            <div className="relative">
              <div className="bd-ico"><Icon size={22} stroke={1.8}>{s.icon}</Icon></div>
              <h3 className="bd-display mt-5 text-xl font-semibold sm:text-2xl" style={{ color: "#EEEEEE" }}>{s.title}</h3>
              <p className="mt-2 text-[14.5px] leading-7">{s.text}</p>
            </div>
          </div>
        </article>
      ))}
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
        <Icon size={22} stroke={2.2}>
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

export default function ContactPage() {
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
                <span style={{ color: "#EEEEEE" }}>Contact</span>
              </nav>

              <span className="bd-pill bd-hr" style={d(180)}><i />Get In Touch</span>

              <h1 className="bd-display bd-h1 mt-5" style={{ color: "#EEEEEE" }}>
                <span className="block"><Words text="Let's Start a" startDelay={300} /></span>
                <span className="block"><Words text="Conversation" startDelay={620} className="bd-gt" trailing={false} /></span>
              </h1>

              <p className="bd-hr bd-lead mt-6 max-w-xl" style={{ ...d(1000), color: "#B3B8BD" }}>
                Have a project in mind? We&apos;d love to hear from you. Send us a message and we&apos;ll get back to you within 24 hours.
              </p>
            </div>

            <div className="bd-hr" style={d(700)}>
              <Signal />
            </div>
          </div>

          <div className="bd-hr absolute bottom-7 left-1/2 hidden -translate-x-1/2 lg:block" style={d(1800)} aria-hidden="true">
            <div className="bd-cue" />
          </div>
        </section>

        {/* ======================= INFO + FORM ========================== */}
        <section className="bd-sec">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
            <div className="bd-blob bd-blob-a absolute" style={{ left: "-10%", top: "10%", width: 380, height: 380, background: "rgba(118,171,174,.1)" }} />
            <div className="bd-blob bd-blob-b absolute" style={{ right: "-8%", bottom: 0, width: 440, height: 440, background: "rgba(92,102,118,.15)" }} />
          </div>

          <div className="bd-wrap grid items-start gap-10 sm:gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
            {/* contact information */}
            <div>
              <Reveal>
                <h2 className="bd-display bd-h2" style={{ color: "#EEEEEE" }}>
                  Contact <span className="bd-gt">Information</span>
                </h2>
              </Reveal>
              <Reveal delay={100}><div className="bd-rule bd-in mt-5" /></Reveal>
              <Reveal delay={150}>
                <p className="bd-lead mt-5">
                  Ready to take your business to the next level? Reach out to our team and let&apos;s make it happen.
                </p>
              </Reveal>

              <div className="mt-7 grid gap-3 sm:mt-9 sm:gap-4">
                <Reveal delay={200}>
                  <div className="bd-info">
                    <div className="bd-ico"><Icon size={22} stroke={1.8}>{ICONS.phone}</Icon></div>
                    <div>
                      <h3>Phone</h3>
                      <a href="tel:+919847980605">+91 9847980605</a>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={280}>
                  <div className="bd-info">
                    <div className="bd-ico"><Icon size={22} stroke={1.8}>{ICONS.mail}</Icon></div>
                    <div>
                      <h3>Email</h3>
                      <a href="mailto:info@empireae.xyz">info@empireae.xyz</a>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={360}>
                  <div className="bd-info">
                    <div className="bd-ico"><Icon size={22} stroke={1.8}>{ICONS.clock}</Icon></div>
                    <div>
                      <h3>Response Time</h3>
                      <span className="bd-val">Within 24 hours</span>
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={440}>
                  <div className="bd-info" style={{ alignItems: "flex-start" }}>
                    <div className="bd-ico"><Icon size={22} stroke={1.8}>{ICONS.share}</Icon></div>
                    <div>
                      <h3>Follow Us</h3>
                      <div className="bd-social">
                        <a href="#">Facebook</a>
                        <a href="#">Instagram</a>
                        <a href="#">LinkedIn</a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* form */}
            <Reveal from="right" delay={150}>
              <ContactForm />
            </Reveal>
          </div>
        </section>

        {/* ===================== WHAT HAPPENS NEXT ===================== */}
        <section className="bd-sec bd-abyss">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: "radial-gradient(ellipse at 15% 0%, rgba(118,171,174,.22), transparent 55%), radial-gradient(ellipse at 90% 100%, rgba(118,171,174,.14), transparent 55%)" }} />
          <div className="bd-wrap">
            <SectionHead
              pill="Why Work With Us"
              title={
                <>
                  <span className="block"><WordsOnView text="What Happens After" /></span>
                  <span className="block"><WordsOnView text="You Contact Us" wordClassName="bd-gt" trailing={false} /></span>
                </>
              }
            />
            <Steps />
          </div>
        </section>
      </main>

      <FloatingButtons />
    </div>
  );
}