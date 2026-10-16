"use client";
import React, { useCallback, useEffect, useRef } from "react";

/* ---------- Data: replace images/names with your real team ---------- */
type Member = { name: string; role: string; image: string };

// const MANAGER = {
//   name: "Sujin P M",
//   role: "Founder & CEO",
//   image: "/team/manager.jpg",
//   quotes: [
//     "We don't just build projects, we build trust that lasts.",
//     "Great results come from a team that genuinely cares.",
//   ],
// };

const TEAM_QUOTE = "Behind every successful project is a team that refuses to settle.";

const TEAM: Member[] = [
  { name: "Meera M", role: "sr.Graphic Designer", image: "/team/Meera1.png" },
  { name: "Alpha Nelson", role: "Graphic Designer", image: "/team/Alpha.jpeg" },
  { name: "Arya P U", role: "Graphic Designer", image: "/team/Arya.jpeg" },
  { name: "Arjun Shaji", role: "Digital Marketing Executive", image: "/team/Arjun.jpeg" },
  { name: "Aslam K M", role: "Flutter Developer", image: "/team/Aslam.jpeg" },
  { name: "Muhammed Nabeel", role: "Python Developer", image: "/team/nebin.jpeg" },
  { name: "Silpa Raji", role: "Content Creator", image: "/team/shilpa.png" },
  { name: "Gayathri Harsha M", role: "Business Development Executive", image: "/team/Gayathri.jpeg" },
  { name: "Karishma H.K", role: "Business Development Executive", image: "/team/Karishma.jpeg" },
  { name: "Nidheesh Krishna N", role: "Flutter Developer", image: "/team/nidheesh.png" },
  { name: "Bijin Mohan", role: "Business Development Manager", image: "/team/Bijin.jpeg" },
  { name: "Raina Ranjan", role: "Software Tester", image: "/team/Raina Ranjan.jpeg" },
  { name: "Nahla Nasarin K.N", role: "Operation Executive", image: "/team/Nahla.jpeg" },
  { name: "J Mahadev", role: "Operation Executive", image: "/team/Mahadevan.png" },
  { name: "Sonamol C M", role: "Backend Developer", image: "/team/Sona.jpeg" },
  { name: "Nicy K kabir", role: "Flutter Developer", image: "/team/Nicy.jpeg" },
  { name: "Shilpa P R", role: "Software Tester", image: "/team/Shilpapr.jpeg" },
  { name: "Jabzeena M A", role: "Python Developer", image: "/team/Jabzee.jpeg" },
  { name: "Jemson Jacob", role: "Flutter Developer", image: "/team/Jemson.png" },
  { name: "Alen Shaji", role: "Operations Assistant", image: "/team/Alen.jpeg" },
  { name: "Soji Kurian", role: "Digital Marketing Executive", image: "/team/soji.PNG" },
  { name: "Tony", role: "Digital Marketing Executive", image: "/team/Tony.PNG" },
  { name: "Shyamil K V", role: "Accountant", image: "/team/Shyamil.png" },
  { name: "Nandhana", role: "Digital Marketing", image: "/team/Nandhana.jpeg" },
];

/* ---------- Components ---------- */
// const ManagerSection: React.FC = () => (
//   <section className="team-manager">
//     <img className="team-manager__photo" src={MANAGER.image} alt={MANAGER.name} />
//     <div className="team-manager__body">
//       {MANAGER.quotes.map((q) => (
//         <blockquote key={q}>“{q}”</blockquote>
//       ))}
//       <p className="team-manager__name">{MANAGER.name}</p>
//       <p className="team-manager__role">{MANAGER.role}</p>
//     </div>
//   </section>
// );

const QuoteSection: React.FC = () => (
  <section className="team-quote">
    <h2>Our Team</h2>
    <p>{TEAM_QUOTE}</p>
  </section>
);

const Card: React.FC<{ member: Member; index: number; hidden?: boolean }> = ({
  member,
  index,
  hidden,
}) => (
  <li
    className={`team-card ${index % 2 === 0 ? "is-low" : "is-high"}`}
    tabIndex={hidden ? -1 : 0}
    aria-hidden={hidden}
  >
    <img src={member.image} alt={hidden ? "" : `${member.name}, ${member.role}`} loading="lazy" />
    <div className="team-card__info">
      <span className="team-card__role">{member.role}</span>
      <span className="team-card__name">{member.name}</span>
    </div>
  </li>
);

const AUTO_SPEED = 50; // pixels per second

const TeamStrip: React.FC = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const pos = useRef(0);               // float scroll position for smooth auto-scroll
  const pausedUntil = useRef(0);       // timestamp until which auto-scroll is paused
  const hovering = useRef(false);

  const half = () => (trackRef.current ? trackRef.current.offsetWidth / 2 : 0);

  const pauseFor = (ms: number) => {
    pausedUntil.current = performance.now() + ms;
  };

  /* Auto-scroll loop */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();
    pos.current = el.scrollLeft;

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!hovering.current && now > pausedUntil.current) {
        // re-sync if the user scrolled manually or via the buttons
        if (Math.abs(el.scrollLeft - pos.current) > 2) pos.current = el.scrollLeft;
        pos.current += AUTO_SPEED * dt;
        const h = half();
        if (h && pos.current >= h) pos.current -= h; // seamless wrap
        el.scrollLeft = pos.current;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Back / Next buttons */
  const slide = useCallback((dir: 1 | -1) => {
    const el = scrollerRef.current;
    const card = trackRef.current?.querySelector("li") as HTMLElement | null;
    if (!el || !card) return;
    const h = half();
    // card width + gap, read from CSS so it stays correct at every screen size
    const step = card.offsetWidth + parseFloat(getComputedStyle(card).marginRight || "0");

    // jump to the identical duplicate set first so the loop never hits an edge
    if (dir === -1 && el.scrollLeft < step * 2) el.scrollLeft += h;
    if (dir === 1 && el.scrollLeft + step * 2 >= h) el.scrollLeft -= h;

    pauseFor(2500);
    // fewer cards per click on small screens
    const cards = window.innerWidth < 720 ? 1 : 2;
    el.scrollBy({ left: dir * step * cards, behavior: "smooth" });
  }, []);

  /* Keep the loop seamless when the user drags / swipes */
  const onScroll = () => {
    const el = scrollerRef.current;
    const h = half();
    if (!el || !h) return;
    if (el.scrollLeft >= h) el.scrollLeft -= h;
    else if (el.scrollLeft <= 0) el.scrollLeft += h;
  };

  return (
    <section className="team-strip" aria-label="Team members">
      <button
        type="button"
        className="team-nav team-nav--prev"
        aria-label="Previous team members"
        onClick={() => slide(-1)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div
        className="team-strip__scroller"
        ref={scrollerRef}
        onScroll={onScroll}
        /* mouse only: a tap on touch screens must not freeze auto-scroll */
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") hovering.current = true;
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") hovering.current = false;
        }}
        /* keyboard focus only, not tap focus */
        onFocus={(e) => {
          if ((e.target as HTMLElement).matches(":focus-visible")) hovering.current = true;
        }}
        onBlur={() => (hovering.current = false)}
        onTouchStart={() => pauseFor(4000)}
        onTouchEnd={() => pauseFor(2500)}
      >
        <ul className="team-strip__track" ref={trackRef}>
          {TEAM.map((m, i) => (
            <Card key={m.name} member={m} index={i} />
          ))}
          {/* duplicate set for a seamless infinite loop */}
          {TEAM.map((m, i) => (
            <Card key={`dup-${m.name}`} member={m} index={i} hidden />
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="team-nav team-nav--next"
        aria-label="Next team members"
        onClick={() => slide(1)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </section>
  );
};

const OurTeam: React.FC = () => (
  <main className="team-page">
    <style>{css}</style>
    
    <QuoteSection />
    <TeamStrip />
  </main>
);

export default OurTeam;

/* ---------- Styles (fluid sizes + tablet/mobile breakpoints) ---------- */
const css = `
.team-page{
  --bg:#000000; --text:#f4f6ff; --muted:#a9b0d0; --accent:#7c8cff;

  /* fluid sizes: they scale smoothly from phone to desktop */
  --card-w:clamp(140px, 17vw, 200px);
  --card-h:calc(var(--card-w) * 2.35);
  --gap:clamp(24px, 4vw, 56px);
  --stagger:calc(var(--card-w) * .5);
  --nav:clamp(42px, 5vw, 52px);
  --edge:clamp(8px, 2vw, 24px);

  background:var(--bg); color:var(--text);
  font-family:system-ui,-apple-system,"Segoe UI",sans-serif;
  padding:clamp(56px, 9vw, 96px) 0; overflow:hidden;
}
.team-page *{box-sizing:border-box}

/* Manager */
.team-manager{
  display:flex; align-items:center; justify-content:center;
  gap:clamp(28px, 5vw, 56px);
  max-width:960px; margin:0 auto; padding:0 clamp(16px, 4vw, 24px);
}
.team-manager__photo{
  width:clamp(180px, 28vw, 240px); aspect-ratio:3 / 4; height:auto;
  object-fit:cover; object-position:center top; flex-shrink:0;
  border-radius:999px; background:#161a35;
}
.team-manager__body{max-width:520px; min-width:0}
.team-manager blockquote{
  margin:0 0 18px; font-size:clamp(1.15rem, 2.2vw, 1.75rem); line-height:1.4; font-weight:500;
  overflow-wrap:anywhere;
}
.team-manager blockquote + blockquote{color:var(--muted); font-size:clamp(.95rem, 1.5vw, 1.05rem); font-weight:400}
.team-manager__name{margin:24px 0 0; font-weight:600; font-size:1.1rem}
.team-manager__role{margin:4px 0 0; color:var(--accent)}

/* Quote */
.team-quote{text-align:center; padding:clamp(56px, 9vw, 96px) 20px clamp(36px, 6vw, 56px)}
.team-quote h2{margin:0; font-size:clamp(1.9rem, 5vw, 3rem); font-weight:700}
.team-quote p{
  margin:14px auto 0; max-width:640px; color:var(--muted);
  font-size:clamp(.95rem, 2vw, 1.25rem); letter-spacing:.03em; line-height:1.5;
}

/* Scrolling strip */
.team-strip{position:relative; padding:0 0 clamp(40px, 7vw, 80px)}
.team-strip__scroller{
  overflow-x:auto; overflow-y:hidden; scrollbar-width:none; -ms-overflow-style:none;
  -webkit-overflow-scrolling:touch; overscroll-behavior-x:contain;
}
.team-strip__scroller::-webkit-scrollbar{display:none}
.team-strip__track{
  display:flex; width:max-content; margin:0; padding:0; list-style:none;
}

/* Back / Next buttons: vertically centred on the strip */
.team-nav{
  position:absolute; z-index:2;
  top:calc((var(--card-h) + var(--stagger)) / 2 - var(--nav) / 2);
  width:var(--nav); height:var(--nav); border-radius:50%;
  border:1px solid rgba(255,255,255,.25);
  background:rgba(10,13,31,.75); color:var(--text); cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  backdrop-filter:blur(6px); -webkit-tap-highlight-color:transparent;
  transition:background .2s ease, transform .2s ease;
}
.team-nav:hover{background:var(--accent); transform:scale(1.06)}
.team-nav:focus-visible{outline:3px solid var(--accent); outline-offset:3px}
.team-nav--prev{left:var(--edge)}
.team-nav--next{right:var(--edge)}

.team-card{
  margin-right:var(--gap);
  position:relative; width:var(--card-w); height:var(--card-h); flex-shrink:0;
  border-radius:calc(var(--card-w) / 2); overflow:hidden; background:#161a35; outline:none;
}
.team-card.is-low{margin-top:var(--stagger)}   /* stagger like the reference */
.team-card.is-high{margin-top:0}
.team-card img{
  width:100%; height:100%; object-fit:cover; object-position:center 20%;
  display:block; transition:transform .5s ease;
}

/* Hover info: designation runs vertically, name sits at the bottom */
.team-card__info{
  position:absolute; inset:0; display:flex; flex-direction:column; justify-content:flex-end;
  padding:clamp(16px, 2vw, 28px) clamp(12px, 1.4vw, 18px); opacity:0; transition:opacity .3s ease;
  background:linear-gradient(to top, rgba(10,13,31,.92) 5%, rgba(10,13,31,.35) 55%, transparent);
}
.team-card__role{
  position:absolute; right:clamp(12px, 1.4vw, 18px); bottom:clamp(16px, 2vw, 28px);
  writing-mode:vertical-rl; transform:rotate(180deg);
  font-size:clamp(.9rem, 1.3vw, 1.2rem); font-weight:600; letter-spacing:.04em;
  max-height:calc(var(--card-h) - 60px);
}
.team-card__name{
  font-size:clamp(.9rem, 1.3vw, 1.05rem); font-weight:600; max-width:55%; text-align:left;
}
.team-card:hover img,.team-card:focus-visible img{transform:scale(1.05)}
.team-card:hover .team-card__info,
.team-card:focus-visible .team-card__info{opacity:1}
.team-card:focus-visible{box-shadow:0 0 0 3px var(--accent)}

/* Touch devices (phones, tablets) have no hover: always show the info */
@media (hover:none){ .team-card__info{opacity:1} }

/* Tablet */
@media (max-width:1024px){
  .team-manager{max-width:760px}
}

/* Mobile: stack the manager block */
@media (max-width:720px){
  .team-manager{flex-direction:column; text-align:center}
  .team-manager__photo{width:min(60vw, 220px)}
}

/* Very small phones */
@media (max-width:380px){
  .team-nav{display:none} /* swipe instead */
}
`;