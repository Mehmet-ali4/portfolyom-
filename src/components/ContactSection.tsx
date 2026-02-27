"use client";

import { useState } from "react";
import { Send, Mail, Loader2 } from "lucide-react";
import { submitContactForm } from "@/app/actions";

interface ContactSectionProps {
    email: string;
}

export default function ContactSection({ email }: ContactSectionProps) {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        setStatus("loading");
        try {
            const result = await submitContactForm(formData);
            if (result.success) {
                setStatus("success");
                setMessage(result.message || "Message sent!");
                // Reset form
                const form = document.getElementById("contact-form") as HTMLFormElement;
                form?.reset();
                setTimeout(() => setStatus("idle"), 4000);
            } else {
                setStatus("error");
                setMessage(result.error || "Something went wrong.");
                setTimeout(() => setStatus("idle"), 4000);
            }
        } catch {
            setStatus("error");
            setMessage("Failed to send. Please try again.");
            setTimeout(() => setStatus("idle"), 4000);
        }
    }

    return (
        <section id="contact" className="relative py-24 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-xs uppercase tracking-[0.3em] text-red-primary font-semibold mb-4 block">
                        Get In Touch
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                        Send Me a <span className="gradient-text">Message</span>
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Have a question or want to work together? Drop me a message and I&apos;ll get back to you.
                    </p>
                </div>

                <div className="glass-card p-8 md:p-10 neon-border-blue">
                    <form id="contact-form" action={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="name" className="text-xs font-medium text-gray-400 mb-2 block uppercase tracking-wider">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="input-dark"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="text-xs font-medium text-gray-400 mb-2 block uppercase tracking-wider">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="input-dark"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="subject" className="text-xs font-medium text-gray-400 mb-2 block uppercase tracking-wider">
                                Subject
                            </label>
                            <input
                                id="subject"
                                name="subject"
                                type="text"
                                required
                                className="input-dark"
                                placeholder="Project inquiry..."
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="text-xs font-medium text-gray-400 mb-2 block uppercase tracking-wider">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                className="input-dark"
                                placeholder="Tell me about your project..."
                                rows={5}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === "loading" ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Send Message
                                </>
                            )}
                        </button>
                    </form>

                    {/* Status messages */}
                    {status === "success" && (
                        <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
                            {message}
                        </div>
                    )}
                    {status === "error" && (
                        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {message}
                        </div>
                    )}

                    {/* Email */}
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-gray-500 text-sm">
                        <Mail size={14} />
                        <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                            {email}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
