"use server";

import { addMessage, getMessages, deleteMessage, markMessageRead } from "@/lib/db";
import {
    addProject,
    updateProject,
    deleteProject,
    getProfile,
    updateProfile,
} from "@/lib/db";
import { verifyCredentials, createSession, destroySession, isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// ========== Contact Form ==========

export async function submitContactForm(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !subject || !message) {
        return { success: false, error: "All fields are required." };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { success: false, error: "Please provide a valid email address." };
    }

    try {
        await addMessage({ name, email, subject, message });
        revalidatePath("/admin");
        return { success: true, message: "Message sent successfully!" };
    } catch {
        return { success: false, error: "Failed to send message. Please try again." };
    }
}

// ========== Auth ==========

export async function loginAction(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
        return { success: false, error: "Username and password are required." };
    }

    const valid = await verifyCredentials(username, password);
    if (!valid) {
        return { success: false, error: "Invalid credentials." };
    }

    await createSession();
    redirect("/admin");
}

export async function logoutAction() {
    await destroySession();
    redirect("/login");
}

// ========== Admin - Messages ==========

export async function getMessagesAction() {
    const auth = await isAuthenticated();
    if (!auth) return [];
    return await getMessages();
}

export async function deleteMessageAction(id: string) {
    const auth = await isAuthenticated();
    if (!auth) return { success: false, error: "Unauthorized" };
    await deleteMessage(id);
    revalidatePath("/admin");
    return { success: true };
}

export async function markMessageReadAction(id: string) {
    const auth = await isAuthenticated();
    if (!auth) return { success: false, error: "Unauthorized" };
    await markMessageRead(id);
    revalidatePath("/admin");
    return { success: true };
}

// ========== Admin - Projects ==========

export async function addProjectAction(formData: FormData) {
    const auth = await isAuthenticated();
    if (!auth) return { success: false, error: "Unauthorized" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const techStr = formData.get("tech") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const liveUrl = (formData.get("liveUrl") as string) || undefined;
    const featured = formData.get("featured") === "true";
    const starsStr = formData.get("stars") as string;
    const forksStr = formData.get("forks") as string;

    if (!title || !description || !githubUrl) {
        return { success: false, error: "Title, description, and GitHub URL are required." };
    }

    const tech = techStr ? techStr.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const stars = starsStr ? parseInt(starsStr) : undefined;
    const forks = forksStr ? parseInt(forksStr) : undefined;

    await addProject({ title, description, tech, githubUrl, liveUrl, stars, forks, featured });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Project added successfully!" };
}

export async function updateProjectAction(id: string, formData: FormData) {
    const auth = await isAuthenticated();
    if (!auth) return { success: false, error: "Unauthorized" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const techStr = formData.get("tech") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const liveUrl = (formData.get("liveUrl") as string) || undefined;
    const featured = formData.get("featured") === "true";
    const starsStr = formData.get("stars") as string;
    const forksStr = formData.get("forks") as string;

    const tech = techStr ? techStr.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const stars = starsStr ? parseInt(starsStr) : undefined;
    const forks = forksStr ? parseInt(forksStr) : undefined;

    await updateProject(id, { title, description, tech, githubUrl, liveUrl, stars, forks, featured });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Project updated successfully!" };
}

export async function deleteProjectAction(id: string) {
    const auth = await isAuthenticated();
    if (!auth) return { success: false, error: "Unauthorized" };
    await deleteProject(id);
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
}

// ========== Admin - Profile ==========

export async function getProfileAction() {
    return await getProfile();
}

export async function updateProfileAction(formData: FormData) {
    const auth = await isAuthenticated();
    if (!auth) return { success: false, error: "Unauthorized" };

    const name = formData.get("name") as string;
    const title = formData.get("title") as string;
    const bio = formData.get("bio") as string;
    const email = formData.get("email") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const skillsStr = formData.get("skills") as string;
    const initials = name
        ? name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : undefined;

    const skills = skillsStr ? skillsStr.split(",").map((s) => s.trim()).filter(Boolean) : undefined;

    await updateProfile({
        ...(name && { name, initials }),
        ...(title && { title }),
        ...(bio && { bio }),
        ...(email && { email }),
        ...(githubUrl && { githubUrl }),
        ...(linkedinUrl && { linkedinUrl }),
        ...(skills && { skills }),
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true, message: "Profile updated successfully!" };
}
