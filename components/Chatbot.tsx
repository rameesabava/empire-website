"use client";

import { useState, type FormEvent } from "react";

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

    if (
        text.includes("web") ||
        text.includes("website")
    ) {
        return "We build modern, responsive websites tailored to your business, with a focus on performance, accessibility, and user experience. Would you like to discuss a new website or improve an existing one?";
    }

    if (
        text.includes("mobile") ||
        text.includes("app")
    ) {
        return "We develop mobile applications for Android and iOS, focusing on performance, usability, and scalability.";
    }

    if (
        text.includes("marketing") ||
        text.includes("seo") ||
        text.includes("social media")
    ) {
        return "Our digital marketing services include SEO, social media marketing, and content marketing to help your business reach the right audience.";
    }

    if (
        text.includes("hosting") ||
        text.includes("domain")
    ) {
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

function RobotIcon({ className = "h-7 w-7" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {/* Antenna */}
            <path d="M12 4v2" />
            <circle cx="12" cy="2.5" r="1" />

            {/* Robot head */}
            <rect x="4" y="6" width="16" height="14" rx="4" />

            {/* Robot eyes */}
            <circle cx="9" cy="12" r="1" fill="currentColor" />
            <circle cx="15" cy="12" r="1" fill="currentColor" />

            {/* Robot mouth */}
            <path d="M9 16h6" />

            {/* Side details */}
            <path d="M4 11H2.5v4H4" />
            <path d="M20 11h1.5v4H20" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d="m6 6 12 12M18 6 6 18" />
        </svg>
    );
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

        // Demo response using predefined rules.
        // Connect a server-side AI API for real AI conversations.
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
        <div className="fixed bottom-6 right-6 z-[100] font-sans">
            {/* Chat window */}
            {isOpen && (
                <section
                    aria-label="Empire chatbot"
                    className="mb-4 flex h-[min(560px,calc(100dvh-120px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-[#76ABAE]/20 bg-[#222831] shadow-2xl shadow-black/40"
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 border-b border-white/10 bg-[#31363F] p-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#76ABAE] text-[#222831]">
                            <RobotIcon className="h-7 w-7" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h2 className="font-bold text-[#EEEEEE]">
                                Empire Assistant
                            </h2>

                            <p className="mt-1 flex items-center gap-2 text-xs text-[#76ABAE]">
                                <span className="h-2 w-2 rounded-full bg-[#76ABAE]" />
                                Here to help
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close chatbot"
                            className="rounded-lg p-2 text-[#EEEEEE] transition hover:bg-white/10 hover:text-[#76ABAE]"
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Messages */}
                    <div
                        className="flex-1 space-y-4 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        aria-live="polite"
                    >
                        <p className="text-center text-[11px] tracking-wider text-[#EEEEEE]/40">
                            WELCOME TO EMPIRE
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
                                {message.role === "bot" && (
                                    <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#31363F] text-[#76ABAE]">
                                        <RobotIcon className="h-4 w-4" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[84%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${
                                        message.role === "user"
                                            ? "rounded-br-sm bg-[#76ABAE] text-[#222831]"
                                            : "rounded-bl-sm border border-white/5 bg-[#31363F] text-[#EEEEEE]"
                                    }`}
                                >
                                    {message.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#31363F] text-[#76ABAE]">
                                    <RobotIcon className="h-4 w-4" />
                                </div>

                                <div
                                    className="rounded-xl bg-[#31363F] px-4 py-3 text-sm text-[#76ABAE]"
                                    aria-label="Assistant is typing"
                                >
                                    Thinking...
                                </div>
                            </div>
                        )}

                        {/* Quick questions */}
                        {messages.length === 1 && !isTyping && (
                            <div className="space-y-2 pt-2">
                                <p className="mb-3 text-xs font-medium tracking-wide text-[#EEEEEE]/60">
                                    QUICK QUESTIONS
                                </p>

                                {quickQuestions.map((question) => (
                                    <button
                                        key={question}
                                        type="button"
                                        onClick={() => sendMessage(question)}
                                        className="block w-full rounded-xl border border-[#76ABAE]/30 px-3 py-2.5 text-left text-xs text-[#76ABAE] transition hover:bg-[#76ABAE]/10"
                                    >
                                        {question}
                                        <span className="float-right ml-2">
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
                        className="border-t border-white/10 bg-[#31363F]/60 p-3"
                    >
                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#222831] p-1.5 transition focus-within:border-[#76ABAE]/60">
                            <input
                                type="text"
                                value={input}
                                onChange={(event) =>
                                    setInput(event.target.value)
                                }
                                placeholder="Type your message..."
                                aria-label="Type your message"
                                autoComplete="off"
                                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-[#EEEEEE] outline-none placeholder:text-[#EEEEEE]/40"
                            />

                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                aria-label="Send message"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#76ABAE] text-[#222831] transition hover:bg-[#8ac0c2] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <SendIcon />
                            </button>
                        </div>

                        <p className="mt-2 text-center text-[10px] text-[#EEEEEE]/35">
                            Empire · Your digital growth partner
                        </p>
                    </form>
                </section>
            )}

            {/* Floating robot button */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setIsOpen((previous) => !previous)}
                    aria-label={isOpen ? "Close chat" : "Open chat"}
                    aria-expanded={isOpen}
                    className="group flex h-14 w-14 items-center justify-center rounded-full border border-[#EEEEEE]/20 bg-[#76ABAE] text-[#222831] shadow-lg shadow-black/30 transition duration-300 hover:scale-105 hover:bg-[#8ac0c2] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#76ABAE]"
                >
                    {isOpen ? (
                        <CloseIcon />
                    ) : (
                        <RobotIcon className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
                    )}
                </button>
            </div>
        </div>
    );
}