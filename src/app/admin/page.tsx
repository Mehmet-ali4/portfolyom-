"use client";

import { useState, useEffect, useCallback } from "react";
import {
    LayoutDashboard,
    FolderGit2,
    MessageSquare,
    UserCog,
    LogOut,
    Plus,
    Trash2,
    Eye,
    X,
    Loader2,
    Mail,
    Clock,
    Check,
    ExternalLink,
    Star,
    GitFork,
    ChevronRight,
} from "lucide-react";
import {
    logoutAction,
    getMessagesAction,
    deleteMessageAction,
    markMessageReadAction,
    addProjectAction,
    deleteProjectAction,
    updateProfileAction,
    getProfileAction,
} from "@/app/actions";
import { getProjects as getProjectsFromDB } from "@/lib/db";
import type { Message, Project, Profile } from "@/lib/db";

type Tab = "dashboard" | "projects" | "messages" | "profile";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<Tab>("dashboard");
    const [messages, setMessages] = useState<Message[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddProject, setShowAddProject] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [msgs, prof] = await Promise.all([
                getMessagesAction(),
                getProfileAction(),
            ]);
            setMessages(msgs);
            setProfile(prof);
            // Fetch projects via API call from client side
            const res = await fetch("/api/projects");
            if (res.ok) {
                const projData = await res.json();
                setProjects(projData);
            }
        } catch (err) {
            console.error("Failed to load data", err);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleDeleteMessage = async (id: string) => {
        await deleteMessageAction(id);
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setSelectedMessage(null);
        showToast("Message deleted");
    };

    const handleMarkRead = async (id: string) => {
        await markMessageReadAction(id);
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
        showToast("Marked as read");
    };

    const handleDeleteProject = async (id: string) => {
        await deleteProjectAction(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
        showToast("Project deleted");
    };

    const handleAddProject = async (formData: FormData) => {
        const result = await addProjectAction(formData);
        if (result.success) {
            setShowAddProject(false);
            await loadData();
            showToast("Project added!");
        } else {
            showToast(result.error || "Failed to add project", "error");
        }
    };

    const handleUpdateProfile = async (formData: FormData) => {
        const result = await updateProfileAction(formData);
        if (result.success) {
            await loadData();
            showToast("Profile updated!");
        } else {
            showToast(result.error || "Failed to update", "error");
        }
    };

    const sidebarItems: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
        { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { key: "projects", label: "Projects", icon: <FolderGit2 size={18} />, count: projects.length },
        {
            key: "messages",
            label: "Messages",
            icon: <MessageSquare size={18} />,
            count: messages.filter((m) => !m.read).length,
        },
        { key: "profile", label: "Profile", icon: <UserCog size={18} /> },
    ];

    const unreadCount = messages.filter((m) => !m.read).length;

    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar */}
            <aside className="admin-sidebar w-64 p-6 hidden md:flex flex-col">
                <div className="mb-8">
                    <span className="logo-initials text-lg">{profile?.initials || "FD"}</span>
                    <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
                </div>

                <nav className="flex-1 space-y-1">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveTab(item.key)}
                            className={`admin-nav-item w-full ${activeTab === item.key ? "active" : ""}`}
                        >
                            {item.icon}
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.count !== undefined && item.count > 0 && (
                                <span className="text-[10px] bg-red-primary/20 text-red-primary px-2 py-0.5 rounded-full font-medium">
                                    {item.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="admin-nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </form>
            </aside>

            {/* Mobile nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/5 z-50 px-2 py-2">
                <div className="flex justify-around">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveTab(item.key)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs ${activeTab === item.key ? "text-white" : "text-gray-500"
                                }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main content */}
            <main className="flex-1 p-6 md:p-10 pb-24 md:pb-10 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 size={32} className="animate-spin text-gray-500" />
                    </div>
                ) : (
                    <>
                        {/* Dashboard */}
                        {activeTab === "dashboard" && (
                            <div className="space-y-8">
                                <div>
                                    <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
                                    <p className="text-gray-500 text-sm mt-1">Welcome back, {profile?.name}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard
                                        label="Total Projects"
                                        value={projects.length}
                                        icon={<FolderGit2 size={20} />}
                                        color="blue"
                                    />
                                    <StatCard
                                        label="Featured"
                                        value={projects.filter((p) => p.featured).length}
                                        icon={<Star size={20} />}
                                        color="yellow"
                                    />
                                    <StatCard
                                        label="Messages"
                                        value={messages.length}
                                        icon={<MessageSquare size={20} />}
                                        color="green"
                                    />
                                    <StatCard
                                        label="Unread"
                                        value={unreadCount}
                                        icon={<Mail size={20} />}
                                        color="red"
                                    />
                                </div>

                                {/* Recent messages */}
                                <div className="glass-card p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="font-bold text-white">Recent Messages</h2>
                                        <button
                                            onClick={() => setActiveTab("messages")}
                                            className="text-xs text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
                                        >
                                            View all <ChevronRight size={12} />
                                        </button>
                                    </div>
                                    {messages.length === 0 ? (
                                        <p className="text-gray-600 text-sm">No messages yet.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {messages.slice(0, 5).map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {!msg.read && (
                                                            <div className="w-2 h-2 rounded-full bg-red-primary" />
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-medium text-white">{msg.name}</p>
                                                            <p className="text-xs text-gray-500">{msg.subject}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-600">
                                                        {new Date(msg.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Projects Tab */}
                        {activeTab === "projects" && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-black tracking-tight">Projects</h1>
                                        <p className="text-gray-500 text-sm mt-1">Manage your portfolio projects</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAddProject(true)}
                                        className="btn-primary flex items-center gap-2 text-sm"
                                    >
                                        <Plus size={16} />
                                        Add Project
                                    </button>
                                </div>

                                <div className="grid gap-4">
                                    {projects.map((project) => (
                                        <div
                                            key={project.id}
                                            className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-white">{project.title}</h3>
                                                    {project.featured && (
                                                        <span className="text-[10px] bg-red-primary/20 text-red-primary px-2 py-0.5 rounded-full">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-500 text-sm mt-1 line-clamp-1">{project.description}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    {project.stars !== undefined && (
                                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Star size={10} /> {project.stars}
                                                        </span>
                                                    )}
                                                    {project.forks !== undefined && (
                                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                                            <GitFork size={10} /> {project.forks}
                                                        </span>
                                                    )}
                                                    <div className="flex gap-1">
                                                        {project.tech.slice(0, 3).map((t) => (
                                                            <span
                                                                key={t}
                                                                className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] border border-white/5 text-gray-400"
                                                            >
                                                                {t}
                                                            </span>
                                                        ))}
                                                        {project.tech.length > 3 && (
                                                            <span className="text-[10px] text-gray-500">+{project.tech.length - 3}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="social-btn !w-8 !h-8"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteProject(project.id)}
                                                    className="social-btn !w-8 !h-8 hover:!text-red-400 hover:!border-red-400/30"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Project Modal */}
                                {showAddProject && (
                                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                                        <div className="glass-card p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto neon-border-blue">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-lg font-bold">Add New Project</h2>
                                                <button onClick={() => setShowAddProject(false)} className="text-gray-500 hover:text-white">
                                                    <X size={20} />
                                                </button>
                                            </div>
                                            <form action={handleAddProject} className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-medium text-gray-400 mb-1 block uppercase tracking-wider">Title</label>
                                                    <input name="title" required className="input-dark" placeholder="Project name" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-400 mb-1 block uppercase tracking-wider">Description</label>
                                                    <textarea name="description" required className="input-dark" placeholder="Brief description" rows={3} />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-400 mb-1 block uppercase tracking-wider">Technologies (comma-separated)</label>
                                                    <input name="tech" className="input-dark" placeholder="React, TypeScript, Node.js" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-400 mb-1 block uppercase tracking-wider">GitHub URL</label>
                                                        <input name="githubUrl" required className="input-dark" placeholder="https://github.com/..." />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-400 mb-1 block uppercase tracking-wider">Live URL (optional)</label>
                                                        <input name="liveUrl" className="input-dark" placeholder="https://..." />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-400 mb-1 block uppercase tracking-wider">Stars</label>
                                                        <input name="stars" type="number" className="input-dark" placeholder="0" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-medium text-gray-400 mb-1 block uppercase tracking-wider">Forks</label>
                                                        <input name="forks" type="number" className="input-dark" placeholder="0" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input type="hidden" name="featured" value="false" />
                                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-400">
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) => {
                                                                const hidden = e.target.parentElement?.parentElement?.querySelector(
                                                                    'input[name="featured"][type="hidden"]'
                                                                ) as HTMLInputElement;
                                                                if (hidden) hidden.value = e.target.checked ? "true" : "false";
                                                            }}
                                                            className="w-4 h-4 rounded border-gray-600"
                                                        />
                                                        Featured project
                                                    </label>
                                                </div>
                                                <button type="submit" className="btn-primary w-full">
                                                    Add Project
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Messages Tab */}
                        {activeTab === "messages" && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-black tracking-tight">Messages</h1>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
                                    </p>
                                </div>

                                {messages.length === 0 ? (
                                    <div className="glass-card p-12 text-center">
                                        <MessageSquare size={48} className="text-gray-700 mx-auto mb-4" />
                                        <p className="text-gray-500">No messages yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`glass-card p-5 cursor-pointer transition-all hover:border-white/10 ${!msg.read ? "border-l-2 border-l-red-primary" : ""
                                                    }`}
                                                onClick={() => {
                                                    setSelectedMessage(msg);
                                                    if (!msg.read) handleMarkRead(msg.id);
                                                }}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className={`text-sm font-medium ${!msg.read ? "text-white" : "text-gray-400"}`}>
                                                                {msg.name}
                                                            </h3>
                                                            {!msg.read && (
                                                                <span className="text-[10px] bg-red-primary/20 text-red-primary px-2 py-0.5 rounded-full">
                                                                    New
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-300 mb-1">{msg.subject}</p>
                                                        <p className="text-xs text-gray-600 line-clamp-1">{msg.message}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3 ml-4">
                                                        <span className="text-xs text-gray-600 flex items-center gap-1">
                                                            <Clock size={10} />
                                                            {new Date(msg.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteMessage(msg.id);
                                                            }}
                                                            className="text-gray-600 hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Message detail modal */}
                                {selectedMessage && (
                                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                                        <div className="glass-card p-8 w-full max-w-lg neon-border-blue">
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="text-lg font-bold">{selectedMessage.subject}</h2>
                                                <button onClick={() => setSelectedMessage(null)} className="text-gray-500 hover:text-white">
                                                    <X size={20} />
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="text-gray-500">From:</span>
                                                    <span className="text-white">{selectedMessage.name}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="text-gray-500">Email:</span>
                                                    <a href={`mailto:${selectedMessage.email}`} className="text-blue-primary hover:underline">
                                                        {selectedMessage.email}
                                                    </a>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="text-gray-500">Date:</span>
                                                    <span className="text-gray-300">
                                                        {new Date(selectedMessage.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="pt-4 border-t border-white/5">
                                                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                        {selectedMessage.message}
                                                    </p>
                                                </div>
                                                <div className="flex gap-3 pt-4">
                                                    <a
                                                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                                        className="btn-primary text-sm flex items-center gap-2"
                                                    >
                                                        <Mail size={14} />
                                                        Reply
                                                    </a>
                                                    <button
                                                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                                                        className="btn-secondary text-sm flex items-center gap-2 text-red-400"
                                                    >
                                                        <Trash2 size={14} />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Profile Tab */}
                        {activeTab === "profile" && profile && (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-2xl font-black tracking-tight">Profile Settings</h1>
                                    <p className="text-gray-500 text-sm mt-1">Update your portfolio information</p>
                                </div>

                                <div className="glass-card p-8">
                                    <form action={handleUpdateProfile} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="text-xs font-medium text-gray-400 mb-1 block uppercase tracking-wider">Name</label>
                                                <input name="name" defaultValue={profile.name} className="input-dark" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-400 mb-1 block uppercase tracking-wider">Title</label>
                                                <input name="title" defaultValue={profile.title} className="input-dark" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-400 mb-1 block uppercase tracking-wider">Bio</label>
                                            <textarea name="bio" defaultValue={profile.bio} className="input-dark" rows={4} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-400 mb-1 block uppercase tracking-wider">Email</label>
                                            <input name="email" defaultValue={profile.email} className="input-dark" />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="text-xs font-medium text-gray-400 mb-1 block uppercase tracking-wider">GitHub URL</label>
                                                <input name="githubUrl" defaultValue={profile.githubUrl} className="input-dark" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-400 mb-1 block uppercase tracking-wider">LinkedIn URL</label>
                                                <input name="linkedinUrl" defaultValue={profile.linkedinUrl} className="input-dark" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-400 mb-1 block uppercase tracking-wider">Skills (comma-separated)</label>
                                            <input name="skills" defaultValue={profile.skills.join(", ")} className="input-dark" />
                                        </div>
                                        <button type="submit" className="btn-primary flex items-center gap-2">
                                            <Check size={16} />
                                            Save Changes
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Toast */}
            {toast && (
                <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}

// Stat Card component
function StatCard({
    label,
    value,
    icon,
    color,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: "red" | "blue" | "green" | "yellow";
}) {
    const colorMap = {
        red: "from-red-500/20 to-red-500/5 text-red-400 border-red-500/10",
        blue: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/10",
        green: "from-green-500/20 to-green-500/5 text-green-400 border-green-500/10",
        yellow: "from-yellow-500/20 to-yellow-500/5 text-yellow-400 border-yellow-500/10",
    };

    return (
        <div className={`glass-card p-5 border ${colorMap[color]}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
                <div className={`${colorMap[color]}`}>{icon}</div>
            </div>
            <p className="text-3xl font-black">{value}</p>
        </div>
    );
}
