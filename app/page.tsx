"use client"

import { useScroll } from "framer-motion"
import HeroSection from "@/components/hero-section"
import MainContentSection from "@/components/main-content-section"
import TechnologiesSection from "@/components/technologies-section"
import ConnectSection from "@/components/connect-section"
import ResumeSection from "@/components/resume-section"
import Footer from "@/components/footer"
import Header from "@/components/header"

export default function Home() {
  const { scrollYProgress } = useScroll({
    // Enhanced scroll configuration for smoother tracking
    layoutEffect: false,
    // Add smooth scroll behavior
    offset: ["start start", "end end"],
  })

  return (
    <main className="min-h-screen scroll-container">
      <Header />
      <HeroSection scrollYProgress={scrollYProgress} />
      <MainContentSection />
      <TechnologiesSection />
      <ConnectSection />
      <ResumeSection />
      <Footer />
    </main>
  )
}
