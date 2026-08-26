"use client"

/* The hero's energy, condensed into the timeline's cursor.

   One fixed orb whose whole lifecycle is a pure function of scroll position
   (fully reversible):
   - As the hero scrolls out, the orb appears as a blob of the hero's palette
     and is pulled toward the top of the first timeline, compressing as it goes
     (the gradient layer scales down WITH its blur — light squeezed to a point).
   - In the last quarter of the journey the gradient crossfades into a clean
     solid dot: white in dark mode, black in light mode.
   - The dot then rides the timeline axes on a spring (slight inertia), tracking
     a focus line as you scroll — gliding across the gap between the Experience
     and Projects timelines.
   - Milestone nodes ([data-timeline-node]) react by continuous proximity:
     a gaussian of distance to the cursor drives icon scale, brightness, and a
     soft glow — strongest at alignment, easing away on both sides. No class
     toggles; everything is frame-driven and spring-smoothed.
   Reads are batched before writes each frame. Reduced-motion users get nothing
   (the timeline stays static and clean). */

import { useEffect, useRef } from "react"

const ORB = 200 // base orb box; the dot is this scaled way down
const DOT = 13 // final cursor diameter, px
const FOCUS = 0.42 // viewport fraction the cursor tracks
const NODE_RANGE = 75 // px falloff for milestone activation
const K = 130 // spring stiffness
const C = 17 // spring damping

const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export default function TimelineEnergy() {
  const orbRef = useRef<HTMLDivElement>(null)
  const gradRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const orb = orbRef.current
    const grad = gradRef.current
    const dot = dotRef.current
    if (!orb || !grad || !dot) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2, vx: 0, vy: 0 }
    let amp = 0
    let raf = 0
    let running = false
    let lastNow = 0
    let effectsApplied = false

    const clearNodeEffects = () => {
      if (!effectsApplied) return
      effectsApplied = false
      document.querySelectorAll<HTMLElement>("[data-timeline-node]").forEach((n) => {
        n.style.boxShadow = ""
        n.style.filter = ""
        const svg = n.querySelector("svg")
        if (svg) svg.style.transform = ""
      })
    }

    const tick = (now: number) => {
      let active = false
      try {
        const dt = Math.min(0.05, lastNow ? (now - lastNow) / 1000 : 0.016)
        lastNow = now
        const vh = window.innerHeight
        const vw = window.innerWidth
        const focusY = vh * FOCUS
        const hero = document.getElementById("home")
        /* batched reads */
        const axes = [...document.querySelectorAll<HTMLElement>("[data-timeline-axis]")]
          .map((a) => a.getBoundingClientRect())
          .filter((r) => r.height > 1)
          .sort((a, b) => a.top - b.top)
        const nodes = [...document.querySelectorAll<HTMLElement>("[data-timeline-node]")].map((n) => ({
          el: n,
          rect: n.getBoundingClientRect(),
        }))
        const dark = document.documentElement.classList.contains("dark")

        let tx = pos.x
        let ty = pos.y
        let tAmp = 0
        let scale = 1
        let dotOpacity = 0

        if (hero && axes.length) {
          const hr = hero.getBoundingClientRect()
          const a0 = axes[0]
          const aLast = axes[axes.length - 1]
          /* convergence progress, in document space so it's scroll-pure:
             0 when the hero's bottom edge is at the viewport bottom,
             1 when the first axis' top reaches the focus line */
          const y = window.scrollY
          const pStart = hr.bottom + y - vh
          const pEnd = a0.top + y - focusY
          const P = pEnd > pStart ? clamp01((y - pStart) / (pEnd - pStart)) : 0

          if (P > 0.001) {
            const e = easeInOut(P)
            if (P < 1) {
              /* being pulled together: from beneath the departing hero toward
                 the timeline's origin, compressing all the way */
              const startX = vw * 0.5
              const startY = Math.min(vh * 0.8, Math.max(120, hr.bottom - 140))
              const endX = a0.left + a0.width / 2
              tx = startX + (endX - startX) * e
              ty = startY + (focusY - startY) * e
              tAmp = Math.min(1, P * 5)
              scale = 1 - e * (1 - DOT / ORB)
              dotOpacity = clamp01((P - 0.75) / 0.25)
            } else {
              /* the cursor: ride whichever axis owns the focus line */
              let chosen = a0
              let best = Number.POSITIVE_INFINITY
              for (const a of axes) {
                const d = focusY < a.top ? a.top - focusY : focusY > a.bottom ? focusY - a.bottom : 0
                if (d < best) {
                  best = d
                  chosen = a
                }
              }
              tx = chosen.left + chosen.width / 2
              ty = Math.min(Math.max(focusY, chosen.top), chosen.bottom)
              scale = DOT / ORB
              dotOpacity = 1
              /* dissolve once the journey ends past the last timeline */
              tAmp = focusY > aLast.bottom ? clamp01(1 - (focusY - aLast.bottom) / 220) : 1
            }
          }
        }

        /* springs */
        pos.vx += (tx - pos.x) * K * dt
        pos.vy += (ty - pos.y) * K * dt
        pos.vx *= Math.max(0, 1 - C * dt)
        pos.vy *= Math.max(0, 1 - C * dt)
        pos.x += pos.vx * dt
        pos.y += pos.vy * dt
        amp += (tAmp - amp) * Math.min(1, 8 * dt)

        /* batched writes */
        orb.style.transform = `translate3d(${pos.x - ORB / 2}px, ${pos.y - ORB / 2}px, 0) scale(${scale.toFixed(4)})`
        orb.style.opacity = amp.toFixed(3)
        grad.style.opacity = (1 - dotOpacity).toFixed(3)
        grad.style.filter = `blur(40px) hue-rotate(${Math.round((now / 55) % 360)}deg)`
        dot.style.opacity = dotOpacity.toFixed(3)

        /* milestone activation by proximity — only while the cursor form exists */
        if (dotOpacity > 0.5 && amp > 0.1) {
          effectsApplied = true
          for (const { el, rect } of nodes) {
            const cy = rect.top + rect.height / 2
            const f = Math.exp(-((cy - pos.y) ** 2) / (NODE_RANGE * NODE_RANGE)) * amp
            if (f > 0.03) {
              el.style.filter = `brightness(${(1 + 0.45 * f).toFixed(3)})`
              el.style.boxShadow = dark
                ? `0 0 ${Math.round(24 * f)}px ${Math.round(5 * f)}px rgba(255,255,255,${(0.4 * f).toFixed(3)})`
                : `0 0 ${Math.round(20 * f)}px ${Math.round(4 * f)}px rgba(0,0,0,${(0.28 * f).toFixed(3)})`
              const svg = el.querySelector("svg")
              if (svg) svg.style.transform = `scale(${(1 + 0.38 * f).toFixed(3)})`
            } else {
              el.style.filter = ""
              el.style.boxShadow = ""
              const svg = el.querySelector("svg")
              if (svg) svg.style.transform = ""
            }
          }
        } else if (effectsApplied) {
          clearNodeEffects()
        }

        active = tAmp > 0 || amp > 0.005
      } catch {
        running = false
        return
      }
      if (active) {
        raf = requestAnimationFrame(tick)
      } else {
        running = false
        clearNodeEffects()
      }
    }

    const wake = () => {
      if (!running) {
        running = true
        lastNow = 0
        raf = requestAnimationFrame(tick)
      }
    }
    window.addEventListener("scroll", wake, { passive: true })
    window.addEventListener("resize", wake)
    wake()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", wake)
      window.removeEventListener("resize", wake)
      clearNodeEffects()
    }
  }, [])

  return (
    <div
      ref={orbRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30"
      style={{ width: ORB, height: ORB, opacity: 0, willChange: "transform, opacity" }}
    >
      {/* the hero's palette, compressed along with its blur as the orb shrinks */}
      <div
        ref={gradRef}
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 40% 38%, rgba(253, 224, 71, 0.65), transparent 55%)," +
            "radial-gradient(circle at 62% 50%, rgba(244, 63, 94, 0.55), transparent 58%)," +
            "radial-gradient(circle at 46% 68%, rgba(139, 92, 246, 0.5), transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      {/* the condensed form: a clean solid dot that joins the timeline */}
      <div ref={dotRef} className="absolute inset-0 rounded-full bg-black shadow-md dark:bg-white" style={{ opacity: 0 }} />
    </div>
  )
}
