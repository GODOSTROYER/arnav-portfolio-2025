"use client"

import { useScroll } from "framer-motion"
import Header               from "@/components/header"
import HeroSection          from "@/components/hero-section"
import SiteDock             from "@/components/floating-dock"
import MainContentSection   from "@/components/main-content-section"
import TechnologiesSection  from "@/components/technologies-section"
import ConnectSection       from "@/components/connect-section"
import ResumeSection        from "@/components/resume-section"
import SignatureSection     from "@/components/text-hover-effect"
import Footer               from "@/components/footer"

/* Hero is prerendered: its !mounted branch is deterministic static markup, so the
   exported HTML paints the headline instantly; the animated version takes over
   after hydration with identical layout (no random values render server-side). */

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
      <SignatureSection />
      <Footer />
      <SiteDock />
    </main>
  )
}
