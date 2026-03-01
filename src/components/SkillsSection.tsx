import { Code2 } from "lucide-react";

interface SkillsSectionProps {
    skills: string[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
    return (
        <section id="skills" className="relative py-24 px-6 flex justify-center">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-16">
                    <span className="text-xs uppercase tracking-[0.3em] text-blue-primary font-semibold mb-4 block">
                        Expertise
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                        Skills & <span className="gradient-text">Technologies</span>
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Technologies and tools I work with to bring ideas to life.
                    </p>
                </div>

                <div className="glass-card p-8 md:p-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-primary/20 to-red-primary/20 flex items-center justify-center border border-white/5">
                            <Code2 size={18} className="text-gray-300" />
                        </div>
                        <h3 className="font-bold text-white">Tech Stack</h3>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {skills.map((skill, i) => (
                            <span
                                key={skill}
                                className="skill-badge"
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
