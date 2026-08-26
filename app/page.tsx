"use client"

/* Home — one composition, two experiences.

   Desktop (md+) renders the long-form sections exactly as it always has.
   Below md the page becomes the mobile experience: bento about, tabbed
   Apple-cards swipe decks with the tracing beam riding underneath, a
   hexagonal certification honeycomb, marquee technologies, and a tail in the
   same tile language, with snap chapters + a progress rail on the side.

   The swap is a client-side viewport switch (NOT CSS hiding): only one
   variant is mounted at a time, so section ids stay unique for the dock's
   anchors and the chapter rail.

   First paint is the DESKTOP tree on purpose. The static export ships that
   HTML to everyone — crawlers and the OG scrape included — so the full
   experience/project prose stays in the markup instead of the mobile card
   faces' truncated version. Mobile visitors never see it: hero fills the
   first viewport in both variants, so the swap happens entirely below the
   fold, within a frame of hydration.

   Hero is prerendered: its !mounted branch is deterministic static markup, so
   the exported HTML paints the headline instantly; the animated version takes
   over after hydration with identical layout. */

import { MotionConfig, useScroll } from "framer-motion"
import { useEffect, useState } from "react"

import ConnectSection from "@/components/connect-section"
import SiteDock from "@/components/floating-dock"
import Footer from "@/components/footer"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import MainContentSection from "@/components/main-content-section"
import MobileBento from "@/components/mobile-bento"
import MobileCerts from "@/components/mobile-certs"
import MobileChapters from "@/components/mobile-chapters"
import MobileDecks from "@/components/mobile-decks"
import { MobileConnect, MobileFooter, MobileResume } from "@/components/mobile-tail"
import MobileTechMarquee from "@/components/mobile-tech-marquee"
import ResumeSection from "@/components/resume-section"
import TechnologiesSection from "@/components/technologies-section"
import SignatureSection from "@/components/text-hover-effect"

export default function Home() {
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
  })

  const [isMobile, setIsMobile] = useState(false)
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
          {/* reducedMotion="user" makes the mobile components' framer springs
             honor the OS setting (CSS-only guards can't reach them). Scoped to
             these six: wrapping the signature's motion.radialGradient keyframes
             breaks its SVG attributes, and hero keeps production behavior. */}
          <MotionConfig reducedMotion="user">
            <MobileBento />
            <MobileDecks />
            <MobileCerts />
            <MobileTechMarquee />
            <MobileConnect />
            <MobileResume />
          </MotionConfig>
          <SignatureSection />
          <MobileFooter />
        </>
      ) : (
        <>
          <MainContentSection />
          <TechnologiesSection />
          <ConnectSection />
          <ResumeSection />
          <SignatureSection />
          <Footer />
        </>
      )}
      <SiteDock />
      {isMobile && <MobileChapters />}
    </main>
  )
}
