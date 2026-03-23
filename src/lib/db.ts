import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://xsfmtjfjqbqcucvxxwxh.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzZm10amZqcWJxY3Vjdnh4d3hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NzYxODksImV4cCI6MjA4ODQ1MjE4OX0.uu9e4QebYhE9z-zDml31CH36IcfxApjbi2E6tEMjS2g";
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions to act as a Key-Value store on Supabase
async function getKV<T>(key: string, defaultValue: T): Promise<T> {
  if (!supabaseKey) return defaultValue;
  try {
    const { data, error } = await supabase
      .from("veri_deposu")
      .select("veri")
      .eq("isim", key)
      .single();

    if (error || !data) return defaultValue;
    return data.veri as T;
  } catch (err) {
    console.error(`Supabase GET Error [${key}]:`, err);
    return defaultValue;
  }
}

async function setKV<T>(key: string, value: T): Promise<void> {
  if (!supabaseKey) return;
  try {
    await supabase.from("veri_deposu").upsert({ isim: key, veri: value });
  } catch (err) {
    console.error(`Supabase SET Error [${key}]:`, err);
  }
} // ========== Messages ==========

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export async function getMessages(): Promise<Message[]> {
  return await getKV<Message[]>("messages", []);
}

export async function addMessage(msg: Omit<Message, "id" | "createdAt" | "read">): Promise<Message> {
  const messages = await getMessages();
  const newMsg: Message = {
    ...msg,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    createdAt: new Date().toISOString(),
    read: false,
  };
  messages.unshift(newMsg);
  await setKV("messages", messages);
  return newMsg;
}

export async function markMessageRead(id: string): Promise<void> {
  const messages = await getMessages();
  const msg = messages.find((m) => m.id === id);
  if (msg) {
    msg.read = true;
    await setKV("messages", messages);
  }
}

export async function deleteMessage(id: string): Promise<void> {
  let messages = await getMessages();
  messages = messages.filter((m) => m.id !== id);
  await setKV("messages", messages);
}

// ========== Projects ==========

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl: string;
  liveUrl?: string;
  stars?: number;
  forks?: number;
  featured: boolean;
  createdAt: string;
}

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "AI Chat Application",
    description: "Real-time AI-powered chat application with natural language processing capabilities and a modern dark UI.",
    tech: ["Next.js", "TypeScript", "OpenAI", "Tailwind CSS"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    stars: 128,
    forks: 34,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Cloud Infrastructure CLI",
    description: "Command-line tool for managing cloud infrastructure across multiple providers with a unified API.",
    tech: ["Rust", "Docker", "AWS", "Terraform"],
    githubUrl: "https://github.com",
    stars: 256,
    forks: 67,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Real-time Analytics Dashboard",
    description: "High-performance analytics dashboard that processes millions of events per second with beautiful visualizations.",
    tech: ["React", "D3.js", "WebSocket", "Redis"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    stars: 89,
    forks: 21,
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Distributed Task Queue",
    description: "Scalable distributed task queue system with retry mechanisms, dead letter handling, and monitoring.",
    tech: ["Go", "PostgreSQL", "gRPC", "Kubernetes"],
    githubUrl: "https://github.com",
    stars: 412,
    forks: 93,
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "E2E Testing Framework",
    description: "Modern end-to-end testing framework with AI-powered test generation and self-healing selectors.",
    tech: ["TypeScript", "Playwright", "Machine Learning"],
    githubUrl: "https://github.com",
    stars: 67,
    forks: 15,
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "GraphQL API Gateway",
    description: "Federated GraphQL API gateway that stitches together multiple microservices into a unified graph.",
    tech: ["Node.js", "GraphQL", "Apollo", "Redis"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    stars: 198,
    forks: 52,
    featured: false,
    createdAt: new Date().toISOString(),
  },
];

export async function getProjects(): Promise<Project[]> {
  const projs = await getKV<Project[] | null>("projects", null);
  if (projs === null) {
    await setKV("projects", defaultProjects);
    return defaultProjects;
  }
  return projs;
}

export async function addProject(proj: Omit<Project, "id" | "createdAt">): Promise<Project> {
  const projects = await getProjects();
  const newProj: Project = {
    ...proj,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    createdAt: new Date().toISOString(),
  };
  projects.unshift(newProj);
  await setKV("projects", projects);
  return newProj;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<void> {
  const projects = await getProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx !== -1) {
    projects[idx] = { ...projects[idx], ...updates };
    await setKV("projects", projects);
  }
}

export async function deleteProject(id: string): Promise<void> {
  let projects = await getProjects();
  projects = projects.filter((p) => p.id !== id);
  await setKV("projects", projects);
}

// ========== Profile ==========

export interface Profile {
  name: string;
  initials: string;
  title: string;
  bio: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  skills: string[];
}

const defaultProfile: Profile = {
  name: "Mehmet Ali KIRAÇÇAKALI",
  initials: "M-K",
  title: "Full Stack Developer & Open Source Enthusiast",
  bio: "Passionate developer crafting elegant solutions to complex problems. I specialize in building high-performance web applications with modern technologies. When I'm not coding, I'm contributing to open source projects and exploring the latest in AI and distributed systems.",
  email: "mehmet5657ali@gmail.com",
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Rust",
    "PostgreSQL",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "GraphQL",
    "TailwindCSS",
    "Git",
  ],
};

export async function getProfile(): Promise<Profile> {
  const prof = await getKV<Profile | null>("profile", null);
  if (!prof) {
    await setKV("profile", defaultProfile);
    return defaultProfile;
  }
  return prof;
}

export async function updateProfile(updates: Partial<Profile>): Promise<Profile> {
  const profile = await getProfile();
  const updated = { ...profile, ...updates };
  await setKV("profile", updated);
  return updated;
}
