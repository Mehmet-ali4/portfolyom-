import fs from "fs";
import path from "path";

const isProd = process.env.NODE_ENV === "production";
const DATA_DIR = isProd ? path.join("/tmp", "data") : path.join(process.cwd(), "data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const PROFILE_FILE = path.join(DATA_DIR, "profile.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filePath: string, defaultValue: T): T {
  ensureDataDir();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function writeJSON<T>(filePath: string, data: T) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ========== Messages ==========

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export function getMessages(): Message[] {
  return readJSON<Message[]>(MESSAGES_FILE, []);
}

export function addMessage(msg: Omit<Message, "id" | "createdAt" | "read">): Message {
  const messages = getMessages();
  const newMsg: Message = {
    ...msg,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    createdAt: new Date().toISOString(),
    read: false,
  };
  messages.unshift(newMsg);
  writeJSON(MESSAGES_FILE, messages);
  return newMsg;
}

export function markMessageRead(id: string) {
  const messages = getMessages();
  const msg = messages.find((m) => m.id === id);
  if (msg) {
    msg.read = true;
    writeJSON(MESSAGES_FILE, messages);
  }
}

export function deleteMessage(id: string) {
  let messages = getMessages();
  messages = messages.filter((m) => m.id !== id);
  writeJSON(MESSAGES_FILE, messages);
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

export function getProjects(): Project[] {
  return readJSON<Project[]>(PROJECTS_FILE, defaultProjects);
}

export function addProject(proj: Omit<Project, "id" | "createdAt">): Project {
  const projects = getProjects();
  const newProj: Project = {
    ...proj,
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    createdAt: new Date().toISOString(),
  };
  projects.unshift(newProj);
  writeJSON(PROJECTS_FILE, projects);
  return newProj;
}

export function updateProject(id: string, updates: Partial<Project>) {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx !== -1) {
    projects[idx] = { ...projects[idx], ...updates };
    writeJSON(PROJECTS_FILE, projects);
  }
}

export function deleteProject(id: string) {
  let projects = getProjects();
  projects = projects.filter((p) => p.id !== id);
  writeJSON(PROJECTS_FILE, projects);
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

export function getProfile(): Profile {
  return readJSON<Profile>(PROFILE_FILE, defaultProfile);
}

export function updateProfile(updates: Partial<Profile>) {
  const profile = getProfile();
  const updated = { ...profile, ...updates };
  writeJSON(PROFILE_FILE, updated);
  return updated;
}
