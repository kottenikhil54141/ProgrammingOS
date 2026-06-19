import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import FloatingBackground from "@/components/layout/FloatingBackground";
import TrustedBySection from "@/components/trustedby/TrustedBySection";
import StatsSection from "@/components/stats/StatsSection";
import FeaturesSection from "@/components/features/FeaturesSection";
import LearningPathsSection from "@/components/roadmap/LearningPathsSection";
import ProjectsSection from "@/components/projects/ProjectsSection";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import FAQSection from "@/components/faq/FAQSection";
import Footer from "@/components/footer/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

export const metadata = {
  title: "NIK's AI — Become an Engineer, Not Just a Learner",
  description:
    "Learn Python and JavaScript through live code execution, AI-powered tutoring, real-world projects, and structured roadmaps. Join 25,000+ engineers on NIK's AI.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-text transition-colors duration-300 overflow-x-hidden relative">
      {/* Floating interactive background */}
      <FloatingBackground />

      <Navbar />
      <HeroSection />
      <TrustedBySection />
      <StatsSection />
      <FeaturesSection />
      <LearningPathsSection />
      <ProjectsSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
      <ScrollToTop />
    </main>
  );
}