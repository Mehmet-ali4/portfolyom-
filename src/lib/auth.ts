import { cookies } from "next/headers";

const SESSION_TOKEN = "portfolio_admin_session";

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPass) {
        console.error("Missing ADMIN_USERNAME or ADMIN_PASSWORD inside environment variables. Please check your .env files.");
        return false;
    }
    return username === adminUser && password === adminPass;
}

export async function createSession(): Promise<void> {
    const cookieStore = await cookies();
    const token = Buffer.from(`${Date.now()}-authenticated`).toString("base64");
    cookieStore.set(SESSION_TOKEN, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
    });
}

export async function destroySession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_TOKEN);
}

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_TOKEN);
    return !!session?.value;
}
