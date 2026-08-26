"use client"

/* /dev — the mobile experience preview (www.arnavbule.in/dev).

   Below md the long vertical page is replaced wholesale: bento about, tabbed
   horizontal swipe decks with the tracing beam riding underneath, marquee
   technologies, snap chapters with a progress rail. At md+ it renders the
   exact production sections, so desktop is untouched.

   The swap is a client-side viewport switch (NOT CSS hiding): only one
   variant is mounted at a time, so section ids stay unique for the dock's
   anchors. First paint is the mobile variant — this route's audience is
   phones; desktop sees a brief relayout on hydration, which is fine for a
   preview. */

import { useScroll } from "framer-motion"
import { useEffect, useState } from "react"

import ConnectSection from "@/components/connect-section"
import SiteDock from "@/components/floating-dock"
import Footer from "@/components/footer"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import MainContentSection from "@/components/main-content-section"
import MobileBento from "@/components/mobile-bento"
import MobileChapters from "@/components/mobile-chapters"
import MobileDecks from "@/components/mobile-decks"
import MobileTechMarquee from "@/components/mobile-tech-marquee"
import ResumeSection from "@/components/resume-section"
import TechnologiesSection from "@/components/technologies-section"
import SignatureSection from "@/components/text-hover-effect"

export default function DevHome() {
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
  })

  const [isMobile, setIsMobile] = useState(true)
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  return (
    <main className="relative z-10 min-h-screen scroll-container">
      <Header />
      <HeroSection scrollYProgress={scrollYProgress} />
      {isMobile ? (
        <>
          <MobileBento />
          <MobileDecks />
          <MobileTechMarquee />
        </>
      ) : (
        <>
          <MainContentSection />
          <TechnologiesSection />
        </>
      )}
      <ConnectSection />
      <ResumeSection />
      <SignatureSection />
      <Footer />
      <SiteDock />
      {isMobile && <MobileChapters />}
    </main>
  )
}
