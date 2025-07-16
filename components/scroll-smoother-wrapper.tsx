"use client"

import type React from "react"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollSmoother, ScrollTrigger)

export default function ScrollSmootherWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only create ScrollSmoother if it hasn't been created already
    if (!ScrollSmoother.get()) {
      ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1, // how long it takes to "catch up" to the scrollbar's position
        effects: true, // looks for data-speed and data-lag attributes on elements
      })
    }
  }, [])

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  )
}
