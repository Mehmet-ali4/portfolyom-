import { Star, GitFork, ExternalLink, Github } from "lucide-react";
import { Project } from "@/lib/db";

interface ProjectCardProps {
    project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="glass-card card-hover p-6 flex flex-col h-full border border-white/5">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-primary/20 to-blue-primary/20 flex items-center justify-center border border-white/5">
                        <Github size={18} className="text-gray-300" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-base">{project.title}</h3>
                        {project.featured && (
                            <span className="text-[10px] uppercase tracking-widest text-red-primary font-semibold">
                                Featured
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow">
                {project.description}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((t) => (
                    <span
                        key={t}
                        className="text-xs px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/5 text-gray-400"
                    >
                        {t}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-4">
                    {project.stars !== undefined && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Star size={12} />
                            {project.stars}
                        </span>
                    )}
                    {project.forks !== undefined && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                            <GitFork size={12} />
                            {project.forks}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-btn !w-8 !h-8"
                        aria-label="GitHub"
                    >
                        <Github size={14} />
                    </a>
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn !w-8 !h-8"
                            aria-label="Live Demo"
                        >
                            <ExternalLink size={14} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

interface ProjectsSectionProps {
    projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
    return (
        <section id="projects" className="relative py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <span className="text-xs uppercase tracking-[0.3em] text-red-primary font-semibold mb-4 block">
                        Open Source
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                        My <span className="gradient-text">Projects</span>
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        A showcase of my open source contributions and personal projects that I&apos;m passionate about.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
