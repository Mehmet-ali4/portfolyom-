import { ArrowDown, Sparkles } from "lucide-react";

interface HeroProps {
    name: string;
    initials: string;
    title: string;
    bio: string;
}

export default function Hero({ name, initials, title, bio }: HeroProps) {
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center hero-gradient grid-pattern">
            {/* Ambient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-primary/5 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-primary/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: "3s" }} />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                {/* Logo Initials */}
                <div className="animate-fade-in-up mb-8">
                    <div className="inline-flex items-center justify-center w-28 h-28 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm neon-border-red">
                        <span className="text-5xl font-black gradient-text tracking-tighter">
                            {initials}
                        </span>
                    </div>
                </div>

                {/* Name */}
                <h1 className="animate-fade-in-up-delay-1 text-5xl md:text-7xl font-black tracking-tight mb-4">
                    <span className="gradient-text-shimmer">{name}</span>
                </h1>

                {/* Title */}
                <div className="animate-fade-in-up-delay-2 flex items-center justify-center gap-2 mb-6">
                    <Sparkles size={16} className="text-red-primary" />
                    <p className="text-lg md:text-xl text-gray-400 font-medium">
                        {title}
                    </p>
                    <Sparkles size={16} className="text-blue-primary" />
                </div>

                {/* Bio */}
                <p className="animate-fade-in-up-delay-3 text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
                    {bio}
                </p>

                {/* CTA */}
                <div className="animate-fade-in-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a href="#projects" className="btn-primary flex items-center gap-2">
                        View My Work
                        <ArrowDown size={16} />
                    </a>
                    <a href="#contact" className="btn-secondary">
                        Get In Touch
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 rounded-full border-2 border-gray-700 flex items-start justify-center p-2">
                    <div className="w-1 h-2 bg-gray-500 rounded-full" />
                </div>
            </div>
        </section>
    );
}
