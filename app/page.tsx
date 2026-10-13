
"use client";

import { useState, useEffect, useRef, ReactNode, MouseEvent } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowUp, ArrowUpRight, Check, CheckCircle2, Code2, Megaphone,
  Monitor, Palette, Plus, Rocket, ShieldCheck, Smartphone, Users, Zap,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact", href: "/contact" },
];

const marqueeItems = [
  "Software Solutions", "Brand Identity", "Web Design", "Web Development",
  "Mobile Apps", "Digital Marketing", "SEO", "E-Commerce", "Hosting & Domain",
];

const services = [
  { icon: Monitor, title: "Web Design", text: "Visually stunning, responsive websites that reflect your brand identity and deliver smooth user experiences across all devices." },
  { icon: Code2, title: "Web Development", text: "Secure, scalable, high-performance websites built with the latest technologies to ensure smooth functionality and long-term growth." },
  { icon: Smartphone, title: "Mobile App Development", text: "High-quality mobile apps that are fast, secure and scalable, delivering seamless experiences across Android and iOS." },
  { icon: Palette, title: "Brand Identity", text: "Logos and complete brand systems that make your business instantly recognisable." },
  { icon: Megaphone, title: "Digital Marketing & SEO", text: "Data-driven campaigns and search strategies that bring the right customers to you." },
  { icon: Rocket, title: "Hosting & Support", text: "Secure hosting, regular backups and continuous monitoring so your website stays fast and online." },
];

const checks = [
  "Client-Centric Approach",
  "Dedicated Post-Launch Support",
  "Fast Response & Issue Resolution",
  "Continuous Performance Monitoring",
];

const stats = [
  { value: 9, suffix: "+", label: "Years of Experience" },
  { value: 150, suffix: "+", label: "Websites Delivered" },
  { value: 50, suffix: "+", label: "Happy Clients" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
];

const faqs = [
  { q: "How long does it take to build a website?", a: "Most websites are completed within 1–3 weeks, depending on the project scope and content availability. We keep you informed at every stage of the process." },
  { q: "Do you provide hosting and maintenance?", a: "Yes. We offer secure hosting with regular backups, performance monitoring, and ongoing technical support to keep your site running perfectly." },
];

/* ───────── helpers ───────── */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { threshold });
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
      className={`transition-all duration-1000 ease-[cubic-bezier(.2,.7,.2,1)] ${seen ? "translate-y-0 opacity-100 blur-0" : "translate-y-12 opacity-0 blur-md"} ${className}`}
    >
      {children}
    </div>
  );
}

function CountUp({ end, suffix = "+" }: { end: number; suffix?: string }) {
  const { ref, seen } = useInView<HTMLSpanElement>(0.5);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const dur = 1500, t0 = performance.now();
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      setN(Math.round((1 - Math.pow(1 - p, 4)) * end));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, end]);
  return <span ref={ref}>{n}{suffix}</span>;
}

const glass = "border border-[#76ABAE]/20 bg-[#EEEEEE]/[0.05] backdrop-blur-xl";

const Tag = ({ children }: { children: ReactNode }) => (
  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#EEEEEE] ${glass}`}>
    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#76ABAE] shadow-[0_0_10px_#76ABAE]" />
    {children}
  </span>
);

const Btn = ({ href, children, ghost = false }: { href: string; children: ReactNode; ghost?: boolean }) => (
  <Link
    href={href}
    className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-bold transition-all duration-300 hover:-translate-y-1 ${
      ghost
        ? `${glass} text-[#EEEEEE] hover:bg-[#EEEEEE]/10`
        : "bg-[#76ABAE] text-[#222831] shadow-[0_10px_40px_-10px_rgba(118,171,174,.6)] hover:bg-[#EEEEEE] hover:shadow-[0_16px_50px_-8px_rgba(118,171,174,.8)]"
    }`}
  >
    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#EEEEEE]/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    <span className="relative">{children}</span>
    {!ghost && <ArrowRight size={16} className="relative transition-transform group-hover:translate-x-1" />}
  </Link>
);

/* ───────── page ───────── */
export default function Home() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const [showTop, setShowTop] = useState(false);
  const tilt = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShowTop(scrollY > 400);
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  const onTilt = (e: MouseEvent<HTMLDivElement>) => {
    const el = tilt.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };
  const resetTilt = () => { if (tilt.current) tilt.current.style.transform = "perspective(1000px)"; };

  return (
    <main className="home-root relative overflow-x-clip bg-[linear-gradient(180deg,#31363F_0%,#222831_22%,#31363F_50%,#222831_78%,#222831_100%)] text-[#EEEEEE] selection:bg-[#76ABAE] selection:text-[#222831]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=DM+Sans:wght@400;500;600;700&display=swap');
        .home-root{font-family:'DM Sans',ui-sans-serif,system-ui,sans-serif}
        .home-root h1,.home-root h2,.home-root h3{font-family:'Bricolage Grotesque','DM Sans',ui-sans-serif,system-ui,sans-serif;letter-spacing:-0.035em}
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes up { from{opacity:0;transform:translateY(40px);filter:blur(8px)} to{opacity:1;transform:none;filter:blur(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes drift { 0%,100%{transform:translate(0,0)} 50%{transform:translate(50px,-40px)} }
        @keyframes grad { to{background-position:200% center} }
        .up{opacity:0;animation:up 1s cubic-bezier(.2,.7,.2,1) forwards}
        .gtext{background:linear-gradient(100deg,#EEEEEE 0%,#76ABAE 30%,#EEEEEE 55%,#76ABAE 80%,#EEEEEE 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:grad 6s linear infinite}
        .outline{color:transparent;-webkit-text-stroke:1.5px rgba(118,171,174,.7)}
        .grid-bg{background-image:linear-gradient(rgba(118,171,174,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(118,171,174,.07) 1px,transparent 1px);background-size:56px 56px;-webkit-mask-image:radial-gradient(ellipse at 50% 40%,#000 20%,transparent 75%);mask-image:radial-gradient(ellipse at 50% 40%,#000 20%,transparent 75%)}
        .grain::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:60;opacity:.06;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
        @media (prefers-reduced-motion: reduce){*{animation:none!important;transition:none!important}.up{opacity:1;filter:none}}
      `}</style>
      <div className="grain" />

      {/* ───── HERO ───── */}
      <section className="relative isolate flex min-h-screen items-center px-6 pb-20 pt-40">
        <div className="absolute inset-0 -z-10 grid-bg" aria-hidden />
        <div className="absolute left-[8%] top-1/3 -z-10 h-80 w-80 animate-[drift_16s_ease-in-out_infinite] rounded-full bg-[#76ABAE]/30 blur-[120px]" />
        <div className="absolute bottom-10 right-[10%] -z-10 h-96 w-96 animate-[drift_20s_ease-in-out_infinite_reverse] rounded-full bg-[#EEEEEE]/10 blur-[130px]" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="up"><Tag>Complete Digital Solutions</Tag></div>
            <h1 className="up mt-8 text-6xl font-extrabold leading-[0.98] text-[#EEEEEE] sm:text-7xl xl:text-8xl" style={{ animationDelay: ".15s" }}>
              Build.
              <span className="outline block">Grow.</span>
              <span className="gtext block">Dominate.</span>
            </h1>
            <p className="up mt-8 max-w-lg text-lg leading-relaxed text-[#EEEEEE]/70" style={{ animationDelay: ".3s" }}>
              Empire AE is your end-to-end partner — from stunning websites and powerful
              mobile apps to data-driven marketing strategies that grow your business.
            </p>
            <div className="up mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: ".45s" }}>
              <Btn href="/contact">Get Started</Btn>
              <Btn href="/services" ghost>Explore Services</Btn>
            </div>
          </div>

          {/* tilt visual */}
          <div className="up relative mx-auto w-full max-w-xl" style={{ animationDelay: ".4s" }} onMouseMove={onTilt} onMouseLeave={resetTilt}>
            <div ref={tilt} className="relative transition-transform duration-200 ease-out [transform-style:preserve-3d]">
              <div className={`overflow-hidden rounded-[2rem] p-2 shadow-2xl shadow-black/40 ${glass}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/hero.webp" alt="Modern office with team" className="aspect-[4/5] w-full rounded-[1.5rem] object-cover sm:aspect-[4/3]" />
              </div>
              <div className={`absolute -left-6 top-10 flex animate-[float_4s_ease-in-out_infinite] items-center gap-3 rounded-2xl px-4 py-3 shadow-xl [transform:translateZ(60px)] ${glass} bg-[#222831]/70`}>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#76ABAE]/20 text-[#aceef1]"><Zap size={18} /></span>
                <div><p className="text-sm font-bold">Fast Delivery</p><p className="text-xs text-[#EEEEEE]/90">1–3 weeks</p></div>
              </div>
              <div className={`absolute -bottom-6 right-6 flex animate-[float_5s_ease-in-out_infinite_1s] items-center gap-3 rounded-2xl px-4 py-3 shadow-xl [transform:translateZ(80px)] ${glass} bg-[#222831]/70`}>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#76ABAE]/20 text-[#EEEEEE]"><CheckCircle2 size={18} /></span>
                <div><p className="text-sm font-bold">9+ Years</p><p className="text-xs text-[#EEEEEE]/70">Of experience</p></div>
              </div>
            </div>

            {/* rotating badge */}
           
<div>
  <svg
    viewBox="0 0 120 120"
    className="absolute -right-6 -top-10 hidden h-28 w-28 animate-[spin_18s_linear_infinite] sm:block"
    aria-hidden="true"
  >
    <defs>
      <path
        id="scroll-circle"
        d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
      />
    </defs>

    <text
      fontSize="10.5"
      fontWeight="700"
      letterSpacing="3.2"
      fill="#EEEEEE"
    >
      <textPath href="#scroll-circle" startOffset="0%">
        SCROLL • EXPLORE • DISCOVER •
      </textPath>
    </text>

    <circle cx="60" cy="60" r="6" fill="#76ABAE" />
  </svg>
</div>

          </div>
        </div>
      </section>

      {/* ───── MARQUEE ───── */}
      <div className="overflow-hidden border-y border-[#76ABAE]/15 bg-[#31363F] py-6 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="outline flex items-center whitespace-nowrap text-3xl font-extrabold uppercase tracking-tight transition-all hover:!text-[#EEEEEE]">
              <span className="px-8">{item}</span>
              <span className="text-[#76ABAE] [-webkit-text-stroke:0]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ───── STATS ───── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 120}>
              <div className={`group rounded-3xl p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:border-[#76ABAE]/50 hover:bg-[#76ABAE]/10 ${glass}`}>
                <p className="text-5xl font-extrabold text-[#EEEEEE] drop-shadow-[0_0_30px_rgba(118,171,174,.55)]"><CountUp end={s.value} suffix={s.suffix} /></p>
                <div className="mx-auto mt-4 h-px w-10 bg-[#76ABAE] transition-all duration-500 group-hover:w-24" />
                <p className="mt-4 text-xs uppercase tracking-widest text-[#EEEEEE]/70">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── ABOUT ───── */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#76ABAE]/30 to-transparent blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/about.webp" alt="Our team" className="relative aspect-[4/5] w-full rounded-[2rem] border border-[#76ABAE]/25 object-cover" />
            <div className={`absolute -bottom-6 -right-2 flex animate-[float_5s_ease-in-out_infinite] items-center gap-3 rounded-2xl bg-[#222831]/80 px-5 py-4 shadow-2xl ${glass}`}>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#76ABAE]/20 text-[#76ABAE]"><Users size={20} /></span>
              <div><p className="text-xl font-extrabold leading-none">50+</p><p className="text-xs text-[#EEEEEE]/70">Happy Clients</p></div>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal><Tag>About Us</Tag></Reveal>
          <Reveal delay={100}><h2 className="mt-6 text-4xl font-extrabold text-[#EEEEEE] sm:text-5xl">Who <span className="gtext">We Are</span></h2></Reveal>
          <Reveal delay={200}>
            <p className="mt-6 text-lg leading-relaxed text-[#EEEEEE]">
              Branding Empire AE is a full-service digital solutions company dedicated to helping businesses build, grow, and strengthen their digital presence.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#EEEEEE]/70">
              We specialize in website development, mobile app development, ERP solutions, digital marketing, and brand identity creation — end-to-end services under one roof. With over 9 years of industry experience, we bring deep expertise, proven strategies, and reliable solutions to every project.
            </p>
          </Reveal>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {checks.map((c, i) => (
              <Reveal key={c} delay={300 + i * 100}>
                <li className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-medium transition-all hover:-translate-y-1 hover:border-[#76ABAE]/50 hover:bg-[#76ABAE]/10 ${glass}`}>
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#76ABAE] text-[#222831]"><Check size={13} /></span>
                  {c}
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={700}><div className="mt-9"><Btn href="/about">Learn More About Us</Btn></div></Reveal>
        </div>
      </section>

      {/* ───── SERVICES (expanding rows) ───── */}
      <section id="services" className="mx-auto max-w-5xl px-6 py-28">
        <div className="text-center">
          <Reveal><Tag>Our Services</Tag></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 text-4xl font-extrabold text-[#EEEEEE] sm:text-6xl">
              Smart services for a <span className="gtext">smarter digital future.</span>
            </h2>
          </Reveal>
          <Reveal delay={200}><p className="mx-auto mt-5 max-w-lg text-[#EEEEEE]/70">Everything you need to build, grow, and scale your digital presence — all under one roof.</p></Reveal>
        </div>

        <div className="mt-14 space-y-3">
          {services.map(({ icon: Icon, title, text }, i) => {
            const on = active === i;
            return (
              <Reveal key={title} delay={i * 80}>
                <div
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`cursor-pointer rounded-3xl px-6 py-5 transition-all duration-500 sm:px-8 ${on ? "border border-[#76ABAE]/60 bg-[#76ABAE]/10 shadow-[0_0_50px_-20px_#76ABAE] backdrop-blur-xl" : glass}`}
                >
                  <div className="flex items-center gap-5">
                    <span className="text-sm font-bold tabular-nums text-[#76ABAE]">0{i + 1}</span>
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-all duration-500 ${on ? "rotate-6 bg-[#76ABAE] text-[#222831]" : "bg-[#76ABAE]/10 text-[#76ABAE]"}`}><Icon size={22} /></span>
                    <h3 className="flex-1 text-xl font-bold text-[#EEEEEE] sm:text-2xl">{title}</h3>
                    <span className={`grid h-10 w-10 place-items-center rounded-full border border-[#76ABAE]/30 transition-all duration-500 ${on ? "rotate-45 border-[#76ABAE] bg-[#76ABAE] text-[#222831]" : "text-[#76ABAE]"}`}><ArrowUpRight size={18} /></span>
                  </div>
                  <div className={`grid transition-all duration-500 ${on ? "grid-rows-[1fr] pt-4" : "grid-rows-[0fr]"}`}>
                    <p className="overflow-hidden pl-0 text-sm leading-relaxed text-[#EEEEEE]/70 sm:pl-[5.5rem]">{text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal className="mt-12 text-center"><Btn href="/services">View All Services</Btn></Reveal>
      </section>

      {/* ───── WHY + FAQ ───── */}
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2">
        <div>
          <Reveal><Tag>Why Choose Us</Tag></Reveal>
          <Reveal delay={100}>
            <h2 className="mt-6 text-4xl font-extrabold leading-tight text-[#EEEEEE] sm:text-5xl">
              Your Trusted <span className="gtext">Digital Partner</span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-md text-[#EEEEEE]/70">
              We place our clients at the center of everything we do, focusing on understanding their goals and delivering tailored solutions that create real value.
            </p>
            <div className={`mt-8 flex items-start gap-4 rounded-3xl p-6 ${glass}`}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#76ABAE]/20 text-[#76ABAE]"><ShieldCheck size={22} /></span>
              <div>
                <h3 className="font-bold text-[#EEEEEE]">Dedicated Post-Launch Support</h3>
                <p className="mt-1 text-sm text-[#EEEEEE]/70">We stay with you after launch, providing ongoing monitoring and optimization.</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="space-y-4">
          <Reveal><h3 className="mb-2 text-2xl font-bold text-[#EEEEEE]">Your Questions, <span className="text-[#76ABAE]">Answered</span></h3></Reveal>
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 120}>
              <div className={`rounded-2xl transition-all duration-300 ${open === i ? "border border-[#76ABAE]/60 bg-[#76ABAE]/10 backdrop-blur-xl" : glass}`}>
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-sm font-semibold text-[#EEEEEE]">
                  {f.q}
                  <Plus size={18} className={`shrink-0 text-[#76ABAE] transition-transform duration-300 ${open === i ? "rotate-45" : ""}`} />
                </button>
                <div className={`grid transition-all duration-500 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <p className="overflow-hidden px-6 text-sm leading-relaxed text-[#EEEEEE]/70"><span className="block pb-5">{f.a}</span></p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section id="contact" className="px-6 pb-24">
        <Reveal>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] p-px">
            <div className="absolute inset-[-100%] animate-[spin_9s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_60%,#76ABAE_85%,#EEEEEE_100%)]" />
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#31363F] to-[#222831] px-6 py-24 text-center">
              <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#76ABAE]/25 blur-[100px]" />
              <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#EEEEEE]/10 blur-[100px]" />
              <div className="relative mx-auto max-w-2xl">
                <Tag>Get Started Today</Tag>
                <h2 className="mt-7 text-4xl font-extrabold text-[#EEEEEE] sm:text-6xl">
                  Ready to <span className="gtext">Elevate Your Digital</span> Presence?
                </h2>
                <p className="mx-auto mt-5 max-w-md text-[#EEEEEE]/70">
                  Join 50+ satisfied clients who trust Empire AE for their digital transformation journey.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  <Btn href="/contact">Start Your Project</Btn>
                  <a href="tel:+919847980605" className={`inline-flex items-center rounded-full px-8 py-4 text-sm font-bold text-[#EEEEEE] transition-all duration-300 hover:-translate-y-1 hover:bg-[#EEEEEE] hover:text-[#222831] ${glass}`}>
                    Call Us Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ───── Floating buttons ───── */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3">
        <Link href="https://wa.me/919847980605" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"
          className="relative grid h-14 w-14 place-items-center rounded-full bg-[#76ABAE] text-[#222831] shadow-[0_0_30px_-5px_#76ABAE] transition-all duration-300 hover:scale-110">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#76ABAE]/40" />
          <FaWhatsapp size={30} className="relative" />
        </Link>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Scroll to top"
          aria-hidden={!showTop} tabIndex={showTop ? 0 : -1}
          className={`grid h-12 w-12 place-items-center rounded-full bg-[#EEEEEE] text-[#222831] shadow-xl transition-all duration-300 hover:scale-110 hover:bg-[#76ABAE] ${showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}>
          <ArrowUp size={22} />
        </button>
      </div>
    </main>
  );
}

