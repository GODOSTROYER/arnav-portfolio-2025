"use client"

/* The hero's energy, condensed into a living gradient point that travels the
   timelines. One continuous entity, a pure function of scroll (fully
   reversible), rendered INSIDE the main-content section at z-0 — behind the
   translucent cards and text (they stay crisp; the light lives in the
   background layer, never washing over content).

   Lifecycle:
   - As the hero scrolls out, the hero's palette gathers below it and is pulled
     toward the first timeline, compressing as it travels — the gradient never
     becomes a flat dot: it condenses into a small, intense, still-vibrant
     energy point (hot core ramps in near full compression; core colors are
     theme-adapted via CSS-switched layers).
   - The point rides the timeline axes on an underdamped spring, tracking a
     focus line as you scroll, gliding across the gap between timelines.
   - MILESTONES ([data-timeline-node]) are magnetic: within capture range the
     point's target bends toward the node and merges into it — the node
     pre-reacts on approach, then glows hard and swells while the energy is
     absorbed. Scroll on and the spring snaps the point out toward the next
     node. Works identically in both directions.
   - Past the last axis the point dissolves; while the energy owns the
     timeline it sets data-energy="timeline" on <html> so the cursor aura
     (ambient-glow) yields, then resumes when the energy releases.
   Reads are batched before writes each frame; springs + eases only — no
   layout thrash. Reduced-motion users get nothing. */

import { useEffect, useRef } from "react"

const ORB = 220 // base orb box; the point is this scaled down
const POINT = 26 // condensed energy-point diameter, px
const FOCUS = 0.42 // viewport fraction the point tracks
const CAPTURE = 64 // px: magnetic capture radius around a milestone
const NODE_RANGE = 90 // px falloff for milestone pre-reaction
const K = 150 // spring stiffness (underdamped with C below — playful snap)
const C = 14 // spring damping

const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export default function TimelineEnergy() {
  const orbRef = useRef<HTMLDivElement>(null)
  const gradRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const orb = orbRef.current
    const grad = gradRef.current
    const core = coreRef.current
    const halo = haloRef.current
    const host = orb?.parentElement?.parentElement // wrapper -> section
    if (!orb || !grad || !core || !halo || !host) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2, vx: 0, vy: 0 }
    let amp = 0
    let raf = 0
    let running = false
    let lastNow = 0
    let effectsApplied = false
    let flagSet = false

    const setFlag = (on: boolean) => {
      if (on === flagSet) return
      flagSet = on
      if (on) document.documentElement.dataset.energy = "timeline"
      else delete document.documentElement.dataset.energy
    }

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
        const hostRect = host.getBoundingClientRect()
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
        let condensed = 0 // 0 = diffuse hero blob, 1 = energy point
        let merge = 0 // strongest node absorption this frame

        if (hero && axes.length) {
          const hr = hero.getBoundingClientRect()
          const a0 = axes[0]
          const aLast = axes[axes.length - 1]
          /* convergence progress in document space (scroll-pure & reversible) */
          const y = window.scrollY
          const pStart = hr.bottom + y - vh
          const pEnd = a0.top + y - focusY
          const P = pEnd > pStart ? clamp01((y - pStart) / (pEnd - pStart)) : 0

          if (P > 0.001) {
            const e = easeInOut(P)
            condensed = e
            if (P < 1) {
              /* being pulled together: from beneath the departing hero toward
                 the timeline's origin, compressing all the way */
              const startX = vw * 0.5
              const startY = Math.min(vh * 0.8, Math.max(120, hr.bottom - 140))
              const endX = a0.left + a0.width / 2
              tx = startX + (endX - startX) * e
              ty = startY + (focusY - startY) * e
              tAmp = Math.min(1, P * 5)
            } else {
              /* condensed: ride whichever axis owns the focus line */
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
              /* magnetic milestones: bend the target into the nearest node
                 within capture range and hold it there — the spring supplies
                 the pull-in and the snap-out as scroll carries focus past */
              let nearest: { cy: number; d: number } | null = null
              for (const { rect } of nodes) {
                const cy = rect.top + rect.height / 2
                const d = Math.abs(cy - ty)
                if (d < CAPTURE && (!nearest || d < nearest.d)) nearest = { cy, d }
              }
              if (nearest) {
                const pull = Math.pow(1 - nearest.d / CAPTURE, 1.35)
                ty += (nearest.cy - ty) * pull
                merge = pull
              }
              tAmp = focusY > aLast.bottom ? clamp01(1 - (focusY - aLast.bottom) / 220) : 1
            }
            /* the gradient compresses but never flattens into a plain dot */
            scale = 1 - e * (1 - POINT / ORB)
          }
        }

        /* while the energy owns the timeline, the cursor aura yields */
        setFlag(condensed > 0.5 && tAmp > 0.25)

        /* springs */
        pos.vx += (tx - pos.x) * K * dt
        pos.vy += (ty - pos.y) * K * dt
        pos.vx *= Math.max(0, 1 - C * dt)
        pos.vy *= Math.max(0, 1 - C * dt)
        pos.x += pos.vx * dt
        pos.y += pos.vy * dt
        amp += (tAmp - amp) * Math.min(1, 8 * dt)

        /* batched writes — orb coordinates are section-local (behind content) */
        const lx = pos.x - hostRect.left
        const ly = pos.y - hostRect.top
        /* Siri-like life: the condensed orb breathes — a soft, slow pulse */
        const breath = 0.5 + 0.5 * Math.sin(now / 430)
        const drawScale = scale * (1 - 0.22 * merge) * (1 + 0.06 * breath * condensed)
        orb.style.transform = `translate3d(${lx - ORB / 2}px, ${ly - ORB / 2}px, 0) scale(${drawScale.toFixed(4)})`
        orb.style.opacity = (amp * (1 - 0.45 * merge)).toFixed(3) // hands its light to the node
        /* compression concentrates the light: blur tightens, saturation rises */
        const blurPx = Math.round(40 - 26 * condensed)
        const sat = (1 + 0.6 * condensed).toFixed(2)
        grad.style.filter = `blur(${blurPx}px) saturate(${sat}) hue-rotate(${Math.round((now / 55) % 360)}deg)`
        /* the hot core only exists once the light is truly compressed */
        core.style.opacity = clamp01((condensed - 0.68) / 0.32).toFixed(3)
        /* luminous halo: glowing while riding the line, breathing with the orb;
           during absorption it hands its shine to the milestone's own bloom */
        halo.style.opacity = (clamp01((condensed - 0.5) / 0.5) * (0.55 + 0.35 * breath) * (1 - 0.35 * merge)).toFixed(3)

        /* milestone reaction: gaussian pre-glow + hard absorption bloom */
        if (condensed > 0.5 && amp > 0.1) {
          effectsApplied = true
          for (const { el, rect } of nodes) {
            const cy = rect.top + rect.height / 2
            const g = Math.exp(-((cy - pos.y) ** 2) / (NODE_RANGE * NODE_RANGE)) * amp
            const f = Math.min(1, g + merge * g * 2.1) // absorbed: the whole unit glows
            if (f > 0.03) {
              el.style.filter = `brightness(${(1 + 0.55 * f).toFixed(3)}) saturate(${(1 + 0.5 * f).toFixed(3)})`
              el.style.boxShadow = dark
                ? `0 0 ${Math.round(30 * f)}px ${Math.round(7 * f)}px rgba(253, 224, 71, ${(0.34 * f).toFixed(3)}), 0 0 ${Math.round(60 * f)}px ${Math.round(18 * f)}px rgba(217, 70, 239, ${(0.2 * f).toFixed(3)})`
                : `0 0 ${Math.round(26 * f)}px ${Math.round(6 * f)}px rgba(217, 70, 239, ${(0.3 * f).toFixed(3)}), 0 0 ${Math.round(48 * f)}px ${Math.round(14 * f)}px rgba(244, 63, 94, ${(0.18 * f).toFixed(3)})`
              const svg = el.querySelector("svg")
              if (svg) svg.style.transform = `scale(${(1 + 0.4 * f).toFixed(3)})`
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
        setFlag(false)
        return
      }
      if (active) {
        raf = requestAnimationFrame(tick)
      } else {
        running = false
        clearNodeEffects()
        setFlag(false)
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
      setFlag(false)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div ref={orbRef} className="absolute left-0 top-0" style={{ width: ORB, height: ORB, opacity: 0, willChange: "transform, opacity" }}>
        {/* luminous halo around the condensed orb — the Siri-like glow */}
        <div
          ref={haloRef}
          className="absolute rounded-full"
          style={{
            top: "-55%",
            right: "-55%",
            bottom: "-55%",
            left: "-55%",
            opacity: 0,
            background:
              "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(253,224,71,0.28) 22%, rgba(217,70,239,0.18) 45%, rgba(34,211,238,0.1) 62%, transparent 75%)",
            filter: "blur(10px)",
          }}
        />
        {/* the hero's palette, compressed along with its blur as the orb shrinks */}
        <div
          ref={gradRef}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 40% 38%, rgba(253, 224, 71, 0.7), transparent 55%)," +
              "radial-gradient(circle at 62% 50%, rgba(244, 63, 94, 0.6), transparent 58%)," +
              "radial-gradient(circle at 46% 68%, rgba(139, 92, 246, 0.55), transparent 60%)",
            filter: "blur(40px)",
          }}
        />
        {/* hot core of the condensed point — theme-adapted, never a flat dot */}
        <div ref={coreRef} className="absolute inset-0" style={{ opacity: 0 }}>
          <div
            className="absolute inset-0 hidden rounded-full dark:block"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(253,224,71,0.85) 22%, rgba(244,63,94,0.6) 46%, rgba(139,92,246,0.4) 66%, transparent 78%)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full dark:hidden"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.9) 0%, rgba(217,70,239,0.75) 30%, rgba(244,63,94,0.5) 55%, transparent 75%)",
            }}
          />
        </div>
      </div>
    </div>
  )
}
