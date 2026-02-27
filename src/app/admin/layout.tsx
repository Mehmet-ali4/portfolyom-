import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const auth = await isAuthenticated();
    if (!auth) {
        redirect("/login");
    }

    return <>{children}</>;
}
