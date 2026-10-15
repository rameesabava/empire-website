"use client";

import { useState, type CSSProperties, type FormEvent } from "react";

/* ------------------------------------------------------------------ */
/* Theme variables for the logo (inlined so this file is self-contained) */
/* Dark mode follows a `.dark` class or data-theme="dark" on <html>.   */
/* ------------------------------------------------------------------ */
const brandLogoCss = `
:root{--brand-logo-background:#fff;--brand-logo-color:#0a0a0a}
.dark,[data-theme="dark"]{--brand-logo-background:#0a0a0a;--brand-logo-color:#fff}
.brand-surface-light{--brand-logo-background:#fff;--brand-logo-color:#0a0a0a}
.brand-surface-dark{--brand-logo-background:#0a0a0a;--brand-logo-color:#fff}
.brand-launcher{--brand-logo-background:#0a0a0a;--brand-logo-color:#fff;background-color:var(--brand-logo-background)}
.dark .brand-launcher,[data-theme="dark"] .brand-launcher{--brand-logo-background:#fff;--brand-logo-color:#0a0a0a}
`;

/* ------------------------------------------------------------------ */
/* BrandLogo: ring (270° arc, opening upper-right) + four-point sparkle */
/* ------------------------------------------------------------------ */
const RING = "M252 0A252 252 0 1 0 504 252L362 252A110 110 0 1 1 252 142Z";
const SPARKLE =
    "M362 43A99 99 0 0 0 461 142A99 99 0 0 0 362 241A99 99 0 0 0 263 142A99 99 0 0 0 362 43Z";

type BrandLogoProps = {
    size?: number | string;
    className?: string;
    color?: string;
    title?: string;
};

function BrandLogo({ size = 24, className, color, title }: BrandLogoProps) {
    const style: CSSProperties = {
        color: color ?? "var(--brand-logo-color, currentColor)",
        flexShrink: 0,
        pointerEvents: "none",
    };

    return (
        <svg
            viewBox="0 0 504 504"
            width={size}
            height={size}
            fill="currentColor"
            className={className}
            style={style}
            focusable="false"
            {...(title
                ? { role: "img", "aria-label": title }
                : { "aria-hidden": true })}
        >
            {title ? <title>{title}</title> : null}
            <path d={RING} />
            <path d={SPARKLE} />
        </svg>
    );
}

/* ------------------------------------------------------------------ */
/* Chatbot                                                             */
/* ------------------------------------------------------------------ */
type Message = {
    role: "bot" | "user";
    text: string;
};

const quickQuestions = [
    "What services do you offer?",
    "How can I get a quote?",
    "How can I contact you?",
];

function getReply(message: string): string {
    const text = message.toLowerCase();

    if (
        text.includes("service") ||
        text.includes("offer") ||
        text.includes("what do you do")
    ) {
        return "We offer Web Development, Mobile App Development, UI/UX Design, Hosting & Domain, and Digital Marketing. Which service are you interested in?";
    }

    if (
        text.includes("quote") ||
        text.includes("price") ||
        text.includes("cost") ||
        text.includes("budget")
    ) {
        return "We'd love to discuss your project! Share your requirements through our Contact page to get a personalized quote.";
    }

    if (
        text.includes("contact") ||
        text.includes("email") ||
        text.includes("phone") ||
        text.includes("reach")
    ) {
        return "You can reach our team through the Contact page. Tell us about your project, and we'll help you take the next step.";
    }

    if (text.includes("web") || text.includes("website")) {
        return "We build modern, responsive websites tailored to your business, with a focus on performance, accessibility, and user experience. Would you like to discuss a new website or improve an existing one?";
    }

    if (text.includes("mobile") || text.includes("app")) {
        return "We develop mobile applications for Android and iOS, focusing on performance, usability, and scalability.";
    }

    if (
        text.includes("marketing") ||
        text.includes("seo") ||
        text.includes("social media")
    ) {
        return "Our digital marketing services include SEO, social media marketing, and content marketing to help your business reach the right audience.";
    }

    if (text.includes("hosting") || text.includes("domain")) {
        return "We can help with hosting and domain solutions for your website. Contact our team to discuss the right setup for your project.";
    }

    if (
        text.includes("design") ||
        text.includes("ui") ||
        text.includes("ux")
    ) {
        return "Our UI/UX design services focus on creating attractive, intuitive, and user-friendly digital experiences for your customers.";
    }

    if (
        text.includes("hello") ||
        text.includes("hi ") ||
        text === "hi" ||
        text.includes("hey")
    ) {
        return "Hello! 👋 Welcome to Empire. What can I help you with today?";
    }

    return "Thanks for reaching out! I can help you explore our services, learn about project quotes, or get in touch with our team. What would you like to know?";
}

function SendIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
        </svg>
    );
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            text: "Hi there! 👋 Welcome to Empire. How can I help you grow your business today?",
        },
    ]);

    function sendMessage(value: string) {
        const message = value.trim();

        if (!message || isTyping) return;

        setMessages((previous) => [
            ...previous,
            { role: "user", text: message },
        ]);

        setInput("");
        setIsTyping(true);

        window.setTimeout(() => {
            const reply = getReply(message);

            setMessages((previous) => [
                ...previous,
                { role: "bot", text: reply },
            ]);

            setIsTyping(false);
        }, 600);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        sendMessage(input);
    }

    return (
        <div className="fixed bottom-8 right-8 z-[100] font-sans">
            <style>{brandLogoCss}</style>

            {isOpen && (
                <section
                    aria-label="Empire chatbot"
                    className="mb-3 flex h-[min(660px,calc(100dvh-40px))] w-[min(420px,calc(100vw-24px))] flex-col overflow-hidden rounded-[32px] border-2 border-[#D7D7D7] bg-[#F7F7F7] shadow-[0_12px_50px_rgba(0,0,0,0.16)]"
                >
                    {/* Header: logo + brand name, minimize button */}
                    <div className="brand-surface-light flex shrink-0 items-center justify-between px-3 pt-3">
                        <div className="flex items-center gap-2 pl-1">
                            <BrandLogo size={30} />
                            <span className="text-[15px] font-semibold text-[#202124]">
                                Empire
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Minimize chatbot"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#222222] transition hover:bg-[#EAEAEA]"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>
                    </div>

                    {/* Chat messages */}
                    <div
                        className="flex-1 space-y-5 overflow-y-auto px-4 pb-4 pt-2 [scrollbar-width:thin] [scrollbar-color:#D5D5D5_transparent]"
                        aria-live="polite"
                    >
                        <p className="text-right">
                            <span className="inline-block max-w-[85%] rounded-bl-[18px] rounded-br-[6px] rounded-tl-[18px] rounded-tr-[18px] bg-white px-4 py-3 text-sm text-[#202124] shadow-sm">
                                Welcome!
                            </span>
                        </p>

                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    message.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[94%] whitespace-pre-wrap break-words text-[15px] leading-[1.65] ${
                                        message.role === "user"
                                            ? "rounded-2xl rounded-br-md bg-white px-4 py-3 text-[#202124] shadow-sm"
                                            : "text-[#202124]"
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div
                                className="flex items-center gap-2 text-sm text-[#666666]"
                                aria-label="Assistant is thinking"
                            >
                                <span className="flex gap-1">
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7D8798]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7D8798] [animation-delay:150ms]" />
                                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7D8798] [animation-delay:300ms]" />
                                </span>
                                Thinking...
                            </div>
                        )}

                        {messages.length === 1 && !isTyping && (
                            <div className="space-y-2 pt-1">
                                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[#777777]">
                                    Quick questions
                                </p>

                                {quickQuestions.map((question) => (
                                    <button
                                        key={question}
                                        type="button"
                                        onClick={() => sendMessage(question)}
                                        className="block w-full rounded-xl border border-[#E5E5E5] bg-white px-3 py-2.5 text-left text-sm text-[#333333] transition hover:border-[#BFC7D4] hover:bg-[#F5F6F8]"
                                    >
                                        {question}
                                        <span className="float-right ml-2 text-[#788398]">
                                            ↗
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Message input */}
                    <form
                        onSubmit={handleSubmit}
                        className="shrink-0 px-4 pb-1 pt-3"
                    >
                        <div className="flex items-center gap-2 rounded-full border border-[#E2E2E2] bg-white p-1.5 pl-4 transition focus-within:border-[#B9C2D0]">
                            <input
                                type="text"
                                value={input}
                                onChange={(event) =>
                                    setInput(event.target.value)
                                }
                                placeholder="Type a message..."
                                aria-label="Type your message"
                                autoComplete="off"
                                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[#202124] outline-none placeholder:text-[#9299A5]"
                            />

                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                aria-label="Send message"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#929292] text-white transition hover:bg-[#737373] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <SendIcon />
                            </button>
                        </div>

                        <p className="py-3 text-center text-[10px] text-[#9299A5]">
                            Powered by Empire
                        </p>
                    </form>
                </section>
            )}

            {/* Floating chatbot launcher */}
            {!isOpen && (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    aria-label="Open chat"
                    aria-expanded={isOpen}
                    className="brand-launcher group flex h-[66px] w-[66px] items-center justify-center rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--brand-logo-background)]"
                >
                    <BrandLogo size={36} />
                </button>
            )}
        </div>
    );
}