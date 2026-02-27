import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { getProfile, getProjects } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Home() {
  const profile = getProfile();
  const projects = getProjects();

  return (
    <main className="min-h-screen bg-black">
      <Navbar initials={profile.initials} />

      <Hero
        name={profile.name}
        initials={profile.initials}
        title={profile.title}
        bio={profile.bio}
      />

      <div className="section-divider" />

      <ProjectsSection projects={projects} />

      <div className="section-divider" />

      <SkillsSection skills={profile.skills} />

      <div className="section-divider" />

      <ContactSection email={profile.email} />

      <Footer
        name={profile.name}
        githubUrl={profile.githubUrl}
        linkedinUrl={profile.linkedinUrl}
      />
    </main>
  );
}
