import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";
import AchievementsSection from "./components/AchievementsSection";
import Aurora from "./components/Aurora";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#121212]">
      <Aurora intensity="full" />
      <div className="relative z-[1] flex min-h-screen flex-col">
        <Navbar />
        <div className="container mt-24 mx-auto px-12 py-4">
          <HeroSection />

          <AboutSection />
          <ProjectsSection />
          <EmailSection />
        </div>
        <Footer />
      </div>
    </main>
  );
}
