"use client"

/* Apple-style inertial scrolling via Lenis: the page keeps gliding briefly after
   you release the wheel/trackpad and eases out smoothly. Touch devices keep their
   native momentum (Lenis leaves touch alone by default). Anchor links (#home …)
   are routed through Lenis so they glide too, offset for the fixed header.
   Reduced-motion users get untouched native scrolling.
   NOTE: CSS `scroll-behavior: smooth` must stay OFF while Lenis drives the wheel —
   the two smoothing layers fight (see globals.css). */

import { useEffect } from "react"
import Lenis from "lenis"

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: -80 },
      duration: 1.25, // glide length after release — higher = floatier
      smoothWheel: true,
    })
    return () => lenis.destroy()
  }, [])
  return null
}
