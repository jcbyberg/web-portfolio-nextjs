import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import FAQSection from "./components/FAQSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";
import AchievementsSection from "./components/AchievementsSection";
import Aurora from "./components/Aurora";
import { FAQ_ITEMS } from "./faq-content";

// Built from the same FAQ_ITEMS the visible section renders, so the markup
// and the structured data cannot drift apart.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};

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
          <FAQSection />
          <EmailSection />
        </div>
        <Footer />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}
