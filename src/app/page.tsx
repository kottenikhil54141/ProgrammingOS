import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import StatsSection from "@/components/stats/StatsSection";
import FeaturesSection from "@/components/features/FeaturesSection";
import LearningPathsSection from "@/components/roadmap/LearningPathsSection";
import ProjectsSection from "@/components/projects/ProjectsSection";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import FAQSection from "@/components/faq/FAQSection";
import Footer from "@/components/footer/Footer";

export const metadata = {
  title: "ProgrammingOS — Become an Engineer, Not Just a Learner",
  description:
    "Learn Python and JavaScript through live code execution, AI-powered tutoring, real-world projects, and structured roadmaps. Join 25,000+ engineers on ProgrammingOS.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white overflow-x-hidden">
      {/* Fixed ambient background mesh — rendered once for the entire page */}
      <div className="ambient-bg" aria-hidden="true" />

      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <LearningPathsSection />
      <ProjectsSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </main>
  );
}