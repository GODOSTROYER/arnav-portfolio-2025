"use client"

import { useScroll } from "framer-motion"
import dynamic from "next/dynamic"

import Header               from "@/components/header"
import MainContentSection   from "@/components/main-content-section"
import TechnologiesSection  from "@/components/technologies-section"
import ConnectSection       from "@/components/connect-section"
import ResumeSection        from "@/components/resume-section"
import Footer               from "@/components/footer"

/* ───── client‑only hero (no SSR, fixes hydration mismatch) ───── */
const HeroSection = dynamic(() => import("@/components/hero-section"), {
  ssr: false,
})

export default function Home() {
  const { scrollYProgress } = useScroll({
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
