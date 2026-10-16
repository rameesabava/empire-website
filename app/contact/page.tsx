"use client";

/* =====================================================================
   Empire: Contact page (single file) with EmailJS
   Save as: app/contact/page.tsx
   ---------------------------------------------------------------------
   Install once:   npm install @emailjs/browser
   Create .env.local in the project root (restart the dev server after):

     NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
     NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
     NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx

   EmailJS template variables used (put these in your template):
     {{from_name}}  {{from_email}}  {{reply_to}}  {{phone}}
     {{company}}    {{service}}     {{message}}

   Optional: to use a downloaded animated icon (GIF / WebP / PNG from
   Flaticon) on the success screen, put it in /public and set
   SUCCESS_ICON_SRC below, for example "/images/message-sent.gif".
   ===================================================================== */

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";

// Runs before paint in the browser (no flash of un-animated text), safe during SSR.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* =====================================================================
   1. CONFIG
   ===================================================================== */

const OFFICE_ADDRESS =
  "Empire Ae IT Services, Transasia Cyber Park, Infopark Phase 2, Kochi, Kerala 682303, India";

const COMPANY: {
  address: string;
  mapQuery: string;
  coordinates: { lat: number; lng: number } | null;
} = {
  address: OFFICE_ADDRESS,
  mapQuery: OFFICE_ADDRESS,
  coordinates: null,
};

// NEXT_PUBLIC_ variables must be written out in full so Next.js can inline them.
const EMAILJS = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

// Optional downloaded animated icon (GIF/WebP/PNG in /public). null = built-in animated SVG.
const SUCCESS_ICON_SRC: string | null = null;

const SERVICES = [
  "Website Design & Development",
  "Web Application Development",
  "Mobile App Development",
  "UI/UX Design",
  "Digital Transformation",
  "AI & Automation",
  "E-commerce Development",
  "Other",
] as const;

/* =====================================================================
   2. FORM TYPES, VALIDATION, SUBMISSION (EmailJS)
   ===================================================================== */

type FieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "company"
  | "service"
  | "message";

type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const FIELD_ORDER: FieldName[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "company",
  "service",
  "message",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readValues(form: HTMLFormElement): FormValues {
  const data = new FormData(form);
  const get = (k: FieldName) => String(data.get(k) ?? "").trim();
  return {
    firstName: get("firstName"),
    lastName: get("lastName"),
    email: get("email"),
    phone: get("phone"),
    company: get("company"),
    service: get("service"),
    message: get("message"),
  };
}

function validate(v: FormValues): FormErrors {
  const e: FormErrors = {};
  if (!v.firstName) e.firstName = "Please enter your first name.";
  if (!v.lastName) e.lastName = "Please enter your last name.";
  if (!v.email) e.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(v.email)) e.email = "Please enter a valid email address.";
  if (v.phone) {
    const digits = v.phone.replace(/\D/g, "");
    const shapeOk = /^\+?[0-9\s().-]+$/.test(v.phone);
    if (!shapeOk || digits.length < 7 || digits.length > 15) {
      e.phone = "Please enter a valid phone number (for example +1 555 123 4567).";
    }
  }
  if (!v.service) e.service = "Please select a service.";
  if (!v.message) e.message = "Please tell us a little about your project.";
  return e;
}

class NotConfiguredError extends Error {}

async function submitContact(values: FormValues): Promise<void> {
  const { serviceId, templateId, publicKey } = EMAILJS;
  if (!serviceId || !templateId || !publicKey) throw new NotConfiguredError();

  await emailjs.send(
    serviceId,
    templateId,
    {
      from_name: `${values.firstName} ${values.lastName}`,
      first_name: values.firstName,
      last_name: values.lastName,
      from_email: values.email,
      reply_to: values.email,
      phone: values.phone || "Not provided",
      company: values.company || "Not provided",
      service: values.service,
      message: values.message,
    },
    { publicKey }
  );
}

/* =====================================================================
   3. ANIMATED BORDER (stroke that draws itself, clockwise)
   ===================================================================== */

const FIELD_RADIUS = 6;

function clockwisePath(w: number, h: number, inset: number, radius: number): string {
  const x1 = inset;
  const y1 = inset;
  const x2 = w - inset;
  const y2 = h - inset;
  const r = Math.max(0, Math.min(radius, (x2 - x1) / 2, (y2 - y1) / 2));
  return [
    `M ${x1} ${y1 + r}`,
    `A ${r} ${r} 0 0 1 ${x1 + r} ${y1}`,
    `H ${x2 - r}`,
    `A ${r} ${r} 0 0 1 ${x2} ${y1 + r}`,
    `V ${y2 - r}`,
    `A ${r} ${r} 0 0 1 ${x2 - r} ${y2}`,
    `H ${x1 + r}`,
    `A ${r} ${r} 0 0 1 ${x1} ${y2 - r}`,
    `V ${y1 + r}`,
  ].join(" ");
}

function AnimatedBorder({
  children,
  invalid,
}: {
  children: ReactNode;
  invalid?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      setBox((p) => (p.w === w && p.h === h ? p : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`ct-ab${active ? " is-active" : ""}${invalid ? " is-invalid" : ""}`}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      {children}
      {box.w > 0 && (
        <svg
          className="ct-ab-svg"
          width={box.w}
          height={box.h}
          viewBox={`0 0 ${box.w} ${box.h}`}
          aria-hidden="true"
          focusable="false"
        >
          <path
            className="ct-ab-stroke"
            d={clockwisePath(box.w, box.h, 1, FIELD_RADIUS - 1)}
            pathLength={100}
            fill="none"
          />
        </svg>
      )}
    </div>
  );
}

/* =====================================================================
   4. FIELD COMPONENTS
   ===================================================================== */

function FieldShell({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="ct-field ct-reveal">
      <label htmlFor={id} className="ct-label">
        {label}
        {required ? (
          <span className="ct-req" aria-hidden="true"> *</span>
        ) : (
          <span className="ct-opt"> (optional)</span>
        )}
      </label>
      <AnimatedBorder invalid={!!error}>{children}</AnimatedBorder>
      {error && (
        <p id={`${id}-err`} className="ct-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type FieldBase = {
  name: FieldName;
  label: string;
  required?: boolean;
  error?: string;
};

function TextField({
  name,
  label,
  required,
  error,
  type = "text",
  autoComplete,
  placeholder,
}: FieldBase & {
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <input
        id={id}
        name={name}
        type={type}
        inputMode={type === "tel" ? "tel" : undefined}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="ct-control"
        aria-required={required ? true : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      />
    </FieldShell>
  );
}

function SelectField({ name, label, required, error }: FieldBase) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <select
        id={id}
        name={name}
        defaultValue=""
        className="ct-control ct-select"
        aria-required={required ? true : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      >
        <option value="">Select a service</option>
        {SERVICES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

function TextAreaField({
  name,
  label,
  required,
  error,
  placeholder,
}: FieldBase & { placeholder?: string }) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <textarea
        id={id}
        name={name}
        rows={5}
        placeholder={placeholder}
        className="ct-control ct-textarea"
        aria-required={required ? true : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
      />
    </FieldShell>
  );
}

/* =====================================================================
   5. ANIMATED ICONS (inline SVG, no external files)
   ===================================================================== */

function PinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

// Small paper plane that flies while the message is sending.
function PlaneIcon() {
  return (
    <svg
      className="ct-plane"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}

// Animated alert icon for errors.
function AlertIcon() {
  return (
    <svg
      className="ct-alert-ico"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 7v6" />
      <circle cx="12" cy="16.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

// "Email sent" animation: ring draws, envelope pops in, flap draws,
// green badge pops, check draws, sparks burst outward.
function SentIcon() {
  if (SUCCESS_ICON_SRC) {
    return (
      <div className="ct-ok-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SUCCESS_ICON_SRC} alt="" width={120} height={120} className="ct-ok-img" />
      </div>
    );
  }

  return (
    <div className="ct-ok-wrap" aria-hidden="true">
      <svg className="ct-ok-svg" viewBox="0 0 120 120" fill="none" focusable="false">
        <circle className="ct-ok-ring" cx="60" cy="60" r="54" pathLength={100} />
        <g className="ct-ok-env">
          <rect className="ct-ok-body" x="26" y="38" width="68" height="46" rx="7" />
          <path className="ct-ok-flap" d="M29 43 L60 66 L91 43" pathLength={100} />
        </g>
        <circle className="ct-ok-badge" cx="90" cy="84" r="15" />
        <path className="ct-ok-check" d="M82.5 84.5 l5 5 l9.5 -10.5" pathLength={100} />
      </svg>
      {Array.from({ length: 10 }).map((_, i) => (
        <span
          key={i}
          className="ct-ok-spark"
          style={{ "--a": `${i * 36}deg`, "--d": `${700 + (i % 3) * 80}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* =====================================================================
   6. SECTIONS
   ===================================================================== */

const HERO_LINES = ["Let's Build Something", "Meaningful Together."];

function SplitHeading({ lines }: { lines: string[] }) {
  return (
    <h1 id="ct-hero-title" className="ct-h1" aria-label={lines.join(" ")}>
      {lines.map((line, li) => (
        <span key={li} className="ct-line" aria-hidden="true">
          {line.split(" ").map((word, wi) => (
            <span key={wi}>
              {wi > 0 ? " " : ""}
              <span className="ct-word">
                {Array.from(word).map((ch, ci) => (
                  <span key={ci} className="ct-char">
                    {ch}
                  </span>
                ))}
              </span>
            </span>
          ))}
          {li < lines.length - 1 ? " " : ""}
        </span>
      ))}
    </h1>
  );
}

function ContactHero() {
  return (
    <section className="ct-hero" aria-labelledby="ct-hero-title">
      <div className="ct-hero-inner">
        <p className="ct-eyebrow">
          <span className="ct-bar" aria-hidden="true" />
          LET&apos;S START A CONVERSATION
        </p>
        <SplitHeading lines={HERO_LINES} />
        <p className="ct-hero-p">
          Have an idea, a challenge, or a project in mind? We&apos;d love to hear from you.
          Let&apos;s explore how we can turn your vision into something meaningful.
        </p>
      </div>
    </section>
  );
}

function ContactInformation() {
  return (
    <div className="ct-left">
      <p className="ct-kicker">LET&apos;S CONNECT</p>
      <h2 className="ct-h2">
        Have an Idea?
        <br className="ct-br" /> Let&apos;s Make It Happen.
      </h2>
      <p className="ct-p">
        Tell us what you&apos;re envisioning, and let&apos;s explore how we can bring it to life.
      </p>
    </div>
  );
}

function ContactForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;

    const form = e.currentTarget;
    const values = readValues(form);
    const found = validate(values);
    setErrors(found);
    setFormError(null);

    const firstInvalid = FIELD_ORDER.find((k) => found[k]);
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      await submitContact(values);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setFormError(
        err instanceof NotConfiguredError
          ? "Email sending is not configured yet. Please add the EmailJS keys to .env.local, or contact us by email or phone."
          : "Something went wrong and your email was not sent. Please try again in a moment."
      );
    }
  };

  const onChange = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name as FieldName;
    if (name && errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  if (status === "success") {
    return (
      <div className="ct-card ct-success" ref={successRef} tabIndex={-1} role="status" aria-live="polite">
        <SentIcon />
        <h2 className="ct-h3 ct-ok-title">Email sent successfully!</h2>
        <p className="ct-p ct-ok-text">
          Thank you for reaching out. We have received your message and will reply within 24 hours.
        </p>
        <button type="button" className="ct-ghost ct-ok-btn" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="ct-card">
      <h2 className="ct-h3">Tell Us About Your Project</h2>
      <p className="ct-sub">Share a few details and we&apos;ll get back to you.</p>

      <form onSubmit={onSubmit} onChange={onChange} noValidate aria-label="Contact form">
        <div className="ct-row2">
          <TextField
            name="firstName"
            label="First Name"
            required
            autoComplete="given-name"
            placeholder="Jane"
            error={errors.firstName}
          />
          <TextField
            name="lastName"
            label="Last Name"
            required
            autoComplete="family-name"
            placeholder="Doe"
            error={errors.lastName}
          />
        </div>
        <TextField
          name="email"
          label="Email Address"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email}
        />
        <TextField
          name="phone"
          label="Phone Number"
          type="tel"
          autoComplete="tel"
          placeholder="+1 555 123 4567"
          error={errors.phone}
        />
        <TextField
          name="company"
          label="Company Name"
          autoComplete="organization"
          placeholder="Your company"
          error={errors.company}
        />
        <SelectField name="service" label="Service Interested In" required error={errors.service} />
        <TextAreaField
          name="message"
          label="Project Message"
          required
          placeholder="Tell us a little about your project, goals, or challenges..."
          error={errors.message}
        />

        {formError && (
          <p className="ct-form-error" role="alert">
            <AlertIcon />
            <span>{formError}</span>
          </p>
        )}

        <button
          type="submit"
          className="ct-submit ct-reveal"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
        >
          {status === "submitting" ? (
            <>
              <PlaneIcon />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}

function CompanyLocation() {
  const { address, mapQuery, coordinates } = COMPANY;

  const embedSrc = coordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.008},${coordinates.lat - 0.005},${coordinates.lng + 0.008},${coordinates.lat + 0.005}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`
    : `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  return (
    <section className="ct-loc-section" aria-labelledby="ct-map-title">
      <div className="ct-container ct-map-block">
        <p className="ct-kicker">FIND US</p>
        <h2 id="ct-map-title" className="ct-h2">
          Let&apos;s Meet in Person.
        </h2>
        <p className="ct-p">
          Great ideas often begin with a conversation. Visit us at our office in Infopark Phase 2,
          Kochi.
        </p>

        <div className="ct-map">
          <iframe
            title="Map showing the Empire Ae IT Services office at Transasia Cyber Park, Infopark Phase 2, Kochi"
            src={embedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="ct-map-foot">
          <p className="ct-map-address">
            <span className="ct-pin">
              <PinIcon />
            </span>
            <span>{address}</span>
          </p>
          <a className="ct-ghost" href={directionsHref} target="_blank" rel="noopener noreferrer">
            Open in Google Maps
            <span className="ct-sr">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   7. PAGE
   ===================================================================== */

export default function ContactPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const chars = gsap.utils.toArray<HTMLElement>(".ct-char");
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".ct-eyebrow", { opacity: 0, duration: 0.6, ease: "power1.out" })
          .from(chars, { opacity: 0, yPercent: 60, duration: 0.55, stagger: 0.03 }, 0.35)
          .from(".ct-hero-p", { opacity: 0, y: 16, duration: 0.7 }, 1.0);

        gsap
          .timeline({
            defaults: { ease: "power2.out", clearProps: "opacity,transform" },
            scrollTrigger: { trigger: ".ct-grid", start: "top 85%", once: true },
          })
          .from(".ct-left > *", { opacity: 0, y: 24, duration: 0.7, stagger: 0.1 }, 0)
          .from(".ct-card", { opacity: 0, y: 24, duration: 0.7 }, 0.1)
          .from(".ct-card .ct-reveal", { opacity: 0, y: 14, duration: 0.5, stagger: 0.06 }, 0.3);

        gsap.fromTo(
          ".ct-grid",
          { y: 28 },
          {
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: ".ct-main", start: "top bottom", end: "top 30%", scrub: true },
          }
        );

        gsap.from(".ct-map-block > *", {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: ".ct-loc-section", start: "top 80%", once: true },
        });
      }, root);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="ct-page" ref={rootRef}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <ContactHero />

      <section className="ct-main" aria-label="Contact Empire">
        <div className="ct-container ct-grid">
          <ContactInformation />
          <ContactForm />
        </div>
      </section>

      <CompanyLocation />
    </div>
  );
}

/* =====================================================================
   8. STYLES (scoped with the "ct-" prefix)
   ===================================================================== */

const STYLES = `
.ct-page {
  --ct-text: #000000;
  --ct-navy: #000000;
  --ct-stroke: #141823;
  --ct-line: #e5e7eb;
  --ct-ok: #16a34a;
  --ct-r: ${FIELD_RADIUS}px;
  --ct-overlap: 120px;
  --ct-radius: 64px;
  --ct-nav: 72px;
  background: #ffffff;
  color: var(--ct-text);
  overflow-x: clip;
}
.ct-page *, .ct-page *::before, .ct-page *::after { box-sizing: border-box; }
.ct-sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}
.ct-container { width: 100%; max-width: 1240px; margin: 0 auto; }

/* ---------- Hero ---------- */
.ct-hero {
  background: #000000;
  color: #ffffff;
  position: relative;
  z-index: 1;
  padding: calc(var(--ct-nav) + clamp(40px, 5vw, 64px)) 24px calc(var(--ct-overlap) + clamp(48px, 6vw, 80px));
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.ct-hero-inner { max-width: 900px; margin: 0 auto; }
.ct-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 20px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: #ffffff;
}
.ct-bar { display: inline-block; width: 20px; height: 2px; background: #ffffff; }
.ct-h1 {
  margin: 0;
  font-size: clamp(2.25rem, 4.6vw + 0.75rem, 4.5rem);
  line-height: 1.08;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #ffffff;
}
.ct-line { display: block; }
.ct-word { display: inline-block; white-space: nowrap; }
.ct-char { display: inline-block; will-change: transform, opacity; }
.ct-hero-p {
  max-width: 700px;
  margin: 24px auto 0;
  font-size: clamp(16px, 1.1vw + 12px, 18px);
  line-height: 1.65;
  color: #ffffff;
}

/* ---------- Main two-column section ---------- */
.ct-main {
  position: relative;
  z-index: 2;
  margin-top: calc(var(--ct-overlap) * -1);
  background: #ffffff;
  border-radius: var(--ct-radius) var(--ct-radius) 0 0;
  padding: clamp(64px, 9vw, 120px) 24px;
}
.ct-grid {
  display: grid;
  grid-template-columns: minmax(0, 48fr) minmax(0, 52fr);
  gap: clamp(40px, 6vw, 90px);
  align-items: center;
}
.ct-kicker {
  margin: 0 0 18px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.15em;
  color: #000000;
}
.ct-h2 {
  margin: 0 0 24px;
  font-size: clamp(2.25rem, 2vw + 1.6rem, 3.5rem);
  line-height: 1.12;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--ct-navy);
}
.ct-p {
  max-width: 500px;
  margin: 0 0 18px;
  font-size: clamp(16px, 0.5vw + 14px, 18px);
  line-height: 1.7;
  color: #000000;
}

.ct-pin { display: inline-flex; margin-top: 3px; color: #000000; flex-shrink: 0; }

/* ---------- Form card ---------- */
.ct-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid var(--ct-line);
  border-radius: 8px;
  padding: clamp(24px, 3vw, 36px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 14px 32px -18px rgba(0, 0, 0, 0.14);
}
.ct-h3 { margin: 0 0 6px; font-size: 24px; line-height: 1.25; font-weight: 700; color: var(--ct-navy); }
.ct-sub { margin: 0 0 26px; font-size: 15px; line-height: 1.55; color: #000000; }

.ct-row2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 16px; }
.ct-field { margin-bottom: 18px; }
.ct-label { display: block; margin-bottom: 7px; font-size: 14px; font-weight: 600; color: var(--ct-text); }
.ct-req { color: var(--ct-text); }
.ct-opt { font-weight: 400; color: #000000; }

/* Field + animated border */
.ct-ab { position: relative; }
.ct-control {
  display: block;
  width: 100%;
  padding: 13px 14px;
  background: #ffffff;
  border: 1px solid #d5dae1;
  border-radius: var(--ct-r);
  font: inherit;
  font-size: 16px;
  line-height: 1.4;
  color: var(--ct-text);
  outline: none;
  transition: border-color 200ms ease;
}
.ct-control::placeholder { color: #000000; opacity: 0.5; }
.ct-control:focus { border-color: #d5dae1; }
.ct-textarea { min-height: 140px; resize: vertical; }
.ct-select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 42px;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
.ct-ab.is-invalid .ct-control { border-color: #000000; }

.ct-ab-svg { position: absolute; top: 0; left: 0; pointer-events: none; overflow: visible; }
.ct-ab-stroke {
  fill: none;
  stroke: var(--ct-stroke);
  stroke-width: 2;
  stroke-linecap: butt;
  stroke-linejoin: round;
  stroke-dasharray: 0 100;
}
.ct-ab.is-active .ct-ab-stroke { animation: ct-draw 780ms cubic-bezier(0.65, 0, 0.35, 1) forwards; }
@keyframes ct-draw {
  from { stroke-dasharray: 0 100; }
  to   { stroke-dasharray: 100 0; }
}

.ct-error {
  margin: 7px 0 0;
  font-size: 13px;
  line-height: 1.4;
  font-weight: 600;
  color: #000000;
}
.ct-error::before { content: "! "; font-weight: 700; }

/* Error banner with shaking icon */
.ct-form-error {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 0 0 16px;
  padding: 12px 14px;
  font-size: 14px;
  line-height: 1.5;
  color: #000000;
  background: #ffffff;
  border: 1px solid #000000;
  border-radius: var(--ct-r);
  animation: ct-fade-up 320ms ease both;
}
.ct-alert-ico { flex-shrink: 0; margin-top: 1px; animation: ct-shake 600ms ease 200ms both; }
@keyframes ct-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px) rotate(-6deg); }
  40% { transform: translateX(4px) rotate(6deg); }
  60% { transform: translateX(-3px) rotate(-4deg); }
  80% { transform: translateX(3px) rotate(4deg); }
}
@keyframes ct-fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.ct-submit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  height: 52px;
  margin-top: 6px;
  border: 0;
  border-radius: var(--ct-r);
  background: var(--ct-text);
  color: #ffffff;
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: background-color 250ms ease, color 250ms ease;
}
.ct-submit:hover:not(:disabled) { background: #141823; color: #ffffff; box-shadow: inset 0 0 0 1px #000000; }
.ct-submit:focus-visible { outline: 2px solid #000000; outline-offset: 3px; }
.ct-submit:disabled { opacity: 0.85; cursor: progress; }

/* Flying paper plane while sending */
.ct-plane { animation: ct-fly 1100ms ease-in-out infinite; }
@keyframes ct-fly {
  0%   { transform: translate(-6px, 4px) rotate(0deg); opacity: 0.6; }
  50%  { transform: translate(6px, -4px) rotate(-8deg); opacity: 1; }
  100% { transform: translate(-6px, 4px) rotate(0deg); opacity: 0.6; }
}

.ct-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  color: var(--ct-text);
  border: 1px solid var(--ct-text);
  border-radius: var(--ct-r);
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 250ms ease, color 250ms ease, border-color 250ms ease;
}
.ct-ghost:hover { background: #000000; border-color: #000000; color: #ffffff; }
.ct-ghost:focus-visible { outline: 2px solid #000000; outline-offset: 3px; }

/* ---------- Success: "Email sent successfully!" ---------- */
.ct-success {
  outline: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: clamp(32px, 4vw, 48px);
  padding-bottom: clamp(32px, 4vw, 48px);
}
.ct-success .ct-p { margin: 0 auto 24px; }
.ct-ok-wrap { position: relative; width: 120px; height: 120px; margin-bottom: 22px; }
.ct-ok-svg, .ct-ok-img { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.ct-ok-ring {
  stroke: #000000;
  stroke-width: 2.5;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 60px 60px;
  animation: ct-ring 900ms cubic-bezier(0.65, 0, 0.35, 1) both;
}
@keyframes ct-ring {
  from { stroke-dasharray: 0 100; }
  to   { stroke-dasharray: 100 0; }
}
.ct-ok-env {
  transform-box: fill-box;
  transform-origin: center;
  animation: ct-pop 650ms cubic-bezier(0.34, 1.56, 0.64, 1) 350ms both;
}
.ct-ok-body { fill: #ffffff; stroke: #000000; stroke-width: 3; }
.ct-ok-flap {
  stroke: #000000;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: ct-draw-line 600ms ease 750ms both;
}
.ct-ok-badge {
  fill: var(--ct-ok);
  stroke: #ffffff;
  stroke-width: 3;
  transform-box: fill-box;
  transform-origin: center;
  animation: ct-pop 600ms cubic-bezier(0.34, 1.56, 0.64, 1) 950ms both;
}
.ct-ok-check {
  stroke: #ffffff;
  stroke-width: 3.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: ct-draw-line 420ms ease 1300ms both;
}
@keyframes ct-pop {
  0%   { opacity: 0; transform: scale(0.4); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes ct-draw-line {
  from { stroke-dasharray: 0 100; }
  to   { stroke-dasharray: 100 0; }
}
.ct-ok-spark {
  position: absolute;
  left: calc(50% - 3px);
  top: calc(50% - 3px);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #000000;
  opacity: 0;
  animation: ct-spark 900ms ease-out var(--d, 900ms) both;
}
.ct-ok-spark:nth-of-type(3n) { background: var(--ct-ok); }
@keyframes ct-spark {
  0%   { opacity: 1; transform: rotate(var(--a)) translateY(-58px) scale(1); }
  100% { opacity: 0; transform: rotate(var(--a)) translateY(-92px) scale(0.3); }
}
.ct-ok-title { animation: ct-fade-up 600ms ease 1100ms both; }
.ct-ok-text  { animation: ct-fade-up 600ms ease 1250ms both; }
.ct-ok-btn   { animation: ct-fade-up 600ms ease 1400ms both; }

/* ---------- Map ---------- */
.ct-loc-section { background: #ffffff; padding: 0 24px clamp(64px, 9vw, 120px); }
.ct-map-block { border-top: 1px solid var(--ct-line); padding-top: clamp(56px, 7vw, 96px); }
.ct-map {
  position: relative;
  margin-top: 32px;
  height: clamp(300px, 38vw, 480px);
  border: 1px solid var(--ct-line);
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
}
.ct-map iframe { display: block; width: 100%; height: 100%; border: 0; }
.ct-map-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
}
.ct-map-address { display: flex; gap: 10px; align-items: flex-start; margin: 0; font-size: 16px; line-height: 1.5; color: var(--ct-text); }

/* ---------- Responsive ---------- */
@media (max-width: 1024px) {
  .ct-page { --ct-overlap: 85px; --ct-radius: 46px; }
}
@media (max-width: 900px) {
  .ct-grid { grid-template-columns: minmax(0, 1fr); gap: 56px; }
}
@media (max-width: 640px) {
  .ct-page { --ct-overlap: 50px; --ct-radius: 32px; }
  .ct-main, .ct-loc-section, .ct-hero { padding-left: 20px; padding-right: 20px; }
  .ct-br { display: none; }
  .ct-line { display: inline; }
  .ct-row2 { grid-template-columns: minmax(0, 1fr); }
  .ct-map-foot .ct-ghost { width: 100%; justify-content: center; }
}

/* ---------- Reduced motion: final states only, no movement ---------- */
@media (prefers-reduced-motion: reduce) {
  .ct-ab.is-active .ct-ab-stroke { animation: none; stroke-dasharray: 100 0; }
  .ct-plane, .ct-alert-ico, .ct-form-error { animation: none; }
  .ct-ok-ring, .ct-ok-env, .ct-ok-flap, .ct-ok-badge, .ct-ok-check,
  .ct-ok-title, .ct-ok-text, .ct-ok-btn { animation: none; }
  .ct-ok-spark { display: none; }
  .ct-submit, .ct-ghost, .ct-control { transition: none; }
}
`;