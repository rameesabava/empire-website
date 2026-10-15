"use client";

import { useEffect, useRef, useState } from "react";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-display" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });


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

const stats = [
  { end: 150, suffix: "+", label: "Projects delivered" },
  { end: 50, suffix: "+", label: "Satisfied clients" },
  { end: 300, suffix: "%", label: "Average ROI for clients" },
];

function CountUp({ end, suffix = "", duration = 1600 }: { end: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(end);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          setVal(Math.round(end * (1 - Math.pow(1 - t, 3))));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [end, duration]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

export default function PortfolioPage() {
  const [active, setActive] = useState<(typeof filters)[number]>("All Projects");
  const [hovered, setHovered] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const visible = active === "All Projects" ? projects : projects.filter((p) => p.category === active);
  const countFor = (f: (typeof filters)[number]) =>
    f === "All Projects" ? projects.length : projects.filter((p) => p.category === f).length;
  const hoveredProject = projects.find((p) => p.title === hovered);

  /* Floating preview follows the cursor over the project list (desktop only) */
  const onListMove = (e: React.MouseEvent) => {
    const el = previewRef.current;
    if (!el) return;
    const w = 360;
    const flip = e.clientX > window.innerWidth - w - 80;
    const x = flip ? e.clientX - w - 32 : e.clientX + 32;
    const y = Math.max(16, Math.min(e.clientY - 120, window.innerHeight - 340));
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  return (
    <main
      className={`${display.variable} ${body.variable} overflow-x-hidden bg-[#222831] text-[#EEEEEE] selection:bg-[#76ABAE] selection:text-[#222831]`}
      style={{ fontFamily: "var(--font-body), sans-serif" }}
    >
      <style>{`
        @keyframes lineUp { from { transform: translateY(105%); } to { transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes rowIn  { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .line-mask { overflow: hidden; padding-bottom: .08em; }
        .line-up   { display: block; animation: lineUp 1s cubic-bezier(.2,.8,.2,1) both; }
        .fade-in   { animation: fadeIn .9s ease-out both; }
        .row-in    { animation: rowIn .6s cubic-bezier(.2,.8,.2,1) both; }
        .font-display { font-family: var(--font-display), sans-serif; }
        @media (prefers-reduced-motion: reduce) {
          .line-up, .fade-in, .row-in { animation: none !important; }
        }
      `}</style>

      {/* ───────────── HERO ───────────── */}
      <section className="mx-auto max-w-[88rem] px-6 pb-16 pt-32 sm:px-10 lg:pt-40">
        <nav className="fade-in flex items-center gap-2 text-sm text-[#EEEEEE]/55" aria-label="Breadcrumb">
          <Link href="/" className="transition-colors hover:text-[#76ABAE]">
            Home
          </Link>
          <span aria-hidden>/</span>
          <span className="text-[#EEEEEE]">Portfolio</span>
        </nav>

        <h1 className="font-display mt-10 text-[clamp(2.25rem,6.5vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
          <span className="line-mask block">
            <span className="line-up" style={{ animationDelay: "100ms" }}>Projects that</span>
          </span>
          <span className="line-mask block">
            <span className="line-up text-[#76ABAE]" style={{ animationDelay: "230ms" }}>speak for</span>
          </span>
          <span className="line-mask block">
            <span className="line-up" style={{ animationDelay: "360ms" }}>themselves.</span>
          </span>
        </h1>

        <div className="fade-in mt-12 grid gap-6 lg:grid-cols-12" style={{ animationDelay: "700ms" }}>
          <p className="max-w-xl text-base leading-relaxed text-[#EEEEEE]/70 lg:col-span-5 lg:col-start-8">
            A curated showcase of our premium digital work — from sleek websites to powerful mobile apps and
            high-impact marketing campaigns.
          </p>
        </div>
      </section>

      {/* ───────────── FILTERS ───────────── */}
      <div className="sticky top-0 z-30 border-y border-[#EEEEEE]/10 bg-[#222831]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[88rem] gap-x-8 gap-y-1 overflow-x-auto px-6 sm:px-10">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              aria-pressed={active === f}
              className={`group relative shrink-0 py-4 text-sm font-medium transition-colors duration-300 ${
                active === f ? "text-[#EEEEEE]" : "text-[#EEEEEE]/50 hover:text-[#EEEEEE]"
              }`}
            >
              {f}
              <sup className={`ml-1 text-xs ${active === f ? "text-[#76ABAE]" : "text-[#EEEEEE]/40"}`}>{countFor(f)}</sup>
              <span
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[#76ABAE] transition-transform duration-500 ease-out ${
                  active === f ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ───────────── PROJECT INDEX ───────────── */}
      <section
        className="mx-auto max-w-[88rem] px-6 pb-24 pt-4 sm:px-10"
        onMouseMove={onListMove}
        onMouseLeave={() => setHovered(null)}
      >
        <ul key={active}>
          {visible.map((p, i) => (
            <li
              key={p.title}
              className="row-in group relative border-b border-[#EEEEEE]/10"
              style={{ animationDelay: `${i * 70}ms` }}
              onMouseEnter={() => setHovered(p.title)}
              onFocus={() => setHovered(p.title)}
              onBlur={() => setHovered(null)}
            >
              {/* row background wipe */}
              <span className="absolute inset-y-0 -inset-x-6 -z-0 origin-bottom scale-y-0 rounded-2xl bg-[#31363F] transition-transform duration-500 ease-out group-hover:scale-y-100 group-focus-within:scale-y-100 sm:-inset-x-10" />

              <div className="relative grid items-start gap-x-8 gap-y-4 py-7 lg:grid-cols-12 lg:py-8">
                {/* Title */}
                <div className="lg:col-span-6">
                  <h2 className="font-display text-xl font-bold leading-tight tracking-tight transition-all duration-500 group-hover:translate-x-3 group-hover:text-[#76ABAE] group-focus-within:translate-x-3 sm:text-3xl">
                    <Link href="/contact" className="outline-none after:absolute after:inset-0 after:content-['']">
                      {p.title}
                    </Link>
                  </h2>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs lg:col-span-3 lg:pt-1">
                  <span className="rounded-full border border-[#76ABAE]/40 px-3 py-1 font-medium text-[#76ABAE]">{p.tag}</span>
                  <span className="text-[#EEEEEE]/45">{p.year}</span>
                </div>

                {/* Arrow */}
                <div className="hidden justify-end lg:col-span-3 lg:flex">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-[#EEEEEE]/20 text-[#EEEEEE] transition-all duration-500 group-hover:rotate-45 group-hover:border-[#76ABAE] group-hover:bg-[#76ABAE] group-hover:text-[#222831] group-focus-within:rotate-45 group-focus-within:bg-[#76ABAE] group-focus-within:text-[#222831]">
                    <ArrowUpRight size={20} />
                  </span>
                </div>

                {/* Description: always visible on mobile, expands on hover on desktop */}
                <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out lg:col-span-6 lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-within:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="max-w-xl text-sm leading-relaxed text-[#EEEEEE]/65">{p.text}</p>
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
      </section>

      {/* Cursor-following preview (desktop) */}
      <div
        ref={previewRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-40 hidden w-[360px] transition-[opacity,scale] duration-300 lg:block ${
          hovered ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        style={{ transform: "translate3d(-999px,-999px,0)" }}
      >
        <div className="overflow-hidden rounded-2xl border border-[#EEEEEE]/15 bg-[#31363F] shadow-2xl shadow-black/40">
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
          <p className="p-4 text-xs leading-relaxed text-[#EEEEEE]/75">{hoveredProject?.overlay}</p>
        </div>
      </div>

      {/* ───────────── STATS ───────────── */}
      <section className="border-y border-[#EEEEEE]/10 bg-[#31363F]">
        <div className="mx-auto grid max-w-[88rem] divide-y divide-[#EEEEEE]/10 px-6 sm:px-10 md:grid-cols-3 md:divide-x md:divide-y-0">
          {stats.map((s) => (
            <div key={s.label} className="py-10 md:px-10 md:first:pl-0 md:last:pr-0">
              <p className="font-display text-5xl font-extrabold tracking-tight text-[#76ABAE] sm:text-6xl">
                <CountUp end={s.end} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-base text-[#EEEEEE]/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section className="bg-[#76ABAE] text-[#222831]">
        <div className="mx-auto max-w-[88rem] px-6 py-20 sm:px-10 lg:py-24">
          <h2 className="font-display max-w-5xl text-[clamp(1.875rem,4.5vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
            Let&apos;s build something amazing together.
          </h2>

          <div className="mt-12 flex flex-wrap items-end justify-between gap-10">
            <p className="max-w-md text-base leading-relaxed text-[#222831]/80">
              Ready to take your digital presence to the next level? Contact our team and let&apos;s make it happen.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-[#222831] py-2.5 pl-7 pr-2.5 text-base font-semibold text-[#EEEEEE] transition-all duration-300 hover:gap-5 hover:bg-[#31363F]"
              >
                Get in touch
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#76ABAE] text-[#222831] transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
              <Link
                href="/services"
                className="rounded-full border-2 border-[#222831] px-7 py-3.5 text-base font-semibold transition-colors duration-300 hover:bg-[#222831] hover:text-[#EEEEEE]"
              >
                View services
              </Link>
            </div>
          </div>
        </div>
      </section>
    
    </main>
  );
}
