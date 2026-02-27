import { Github, Linkedin, Heart } from "lucide-react";

interface FooterProps {
    name: string;
    githubUrl: string;
    linkedinUrl: string;
}

export default function Footer({ name, githubUrl, linkedinUrl }: FooterProps) {
    return (
        <footer className="relative border-t border-white/5 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>© {new Date().getFullYear()} {name}.</span>
                    <span className="flex items-center gap-1">
                        Built with <Heart size={12} className="text-red-primary" /> and code.
                    </span>
                </div>

                {/* Social buttons */}
                <div className="flex items-center gap-3">
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-btn"
                        aria-label="GitHub"
                    >
                        <Github size={18} />
                    </a>
                    <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-btn"
                        aria-label="LinkedIn"
                    >
                        <Linkedin size={18} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
