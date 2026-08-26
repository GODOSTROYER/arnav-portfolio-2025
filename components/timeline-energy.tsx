"use client"

/* The hero's energy, traced along the timelines.

   Aceternity-style tracing beam adapted to this site's palette and physics:
   - As the hero scrolls out, its palette gathers and is pulled toward the first
     timeline, compressing into a compact glowing tip (never a flat dot — a
     breathing gradient point with a soft halo).
   - Once on the line, a luminous BEAM lights the axis itself: a gradient
     segment (bright head at the tip's position, tail dissolving above) sweeps
     the timeline with scroll, glow bleeding around the hairline. Each axis has
     its own beam; the active one crossfades in as the tip crosses the gap.
   - MILESTONES ([data-timeline-node]) are magnetic: the tip's target bends
     into a node within capture range and merges — the node pre-reacts on
     approach, then the WHOLE node (colored circle + icon, one unit, via the
     CSS `scale` property so framer-motion's transform is never touched) swells
     under a strong gold/magenta bloom while the energy is absorbed. Scroll on
     and the spring snaps the tip out. Fully reversible.
   - Past the last axis everything dissolves; data-energy="timeline" on <html>
     makes the cursor aura yield while the beam owns the light.
   Rendered inside the section at z-0 — behind the translucent cards; reads are
   batched before writes; springs + eases only. Reduced-motion users get
   nothing. */

import { useEffect, useRef } from "react"

const ORB = 220 // base orb box for the condensation flight
const POINT = 18 // condensed tip diameter, px
const SEG = 360 // beam segment length, px
const FOCUS = 0.42 // viewport fraction the tip tracks
const CAPTURE = 64 // px: magnetic capture radius around a milestone
const NODE_RANGE = 90 // px falloff for milestone pre-reaction
const K = 150 // spring stiffness (underdamped — playful snap)
const C = 14 // spring damping

const BEAM_CORE =
  "linear-gradient(to top, rgba(253,224,71,0.95) 0%, rgba(244,63,94,0.8) 28%, rgba(139,92,246,0.55) 62%, rgba(34,211,238,0.25) 82%, transparent 100%)"
const BEAM_GLOW =
  "linear-gradient(to top, rgba(253,224,71,0.7) 0%, rgba(244,63,94,0.5) 30%, rgba(139,92,246,0.35) 65%, transparent 100%)"

const easeInOut = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export default function TimelineEnergy() {
  const orbRef = useRef<HTMLDivElement>(null)
  const gradRef = useRef<HTMLDivElement>(null)
  const coreRef = useRef<HTMLDivElement>(null)
  const haloRef = useRef<HTMLDivElement>(null)
  const beamRefs = useRef<Array<HTMLDivElement | null>>([])

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
    const beamAmps = [0, 0]
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
        n.style.removeProperty("scale")
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

        let tx = pos.x
        let ty = pos.y
        let tAmp = 0
        let scale = 1
        let condensed = 0
        let merge = 0
        let chosenIdx = -1

        if (hero && axes.length) {
          const hr = hero.getBoundingClientRect()
          const a0 = axes[0]
          const aLast = axes[axes.length - 1]
          const y = window.scrollY
          const pStart = hr.bottom + y - vh
          const pEnd = a0.top + y - focusY
          const P = pEnd > pStart ? clamp01((y - pStart) / (pEnd - pStart)) : 0

          if (P > 0.001) {
            const e = easeInOut(P)
            condensed = e
            if (P < 1) {
              const startX = vw * 0.5
              const startY = Math.min(vh * 0.8, Math.max(120, hr.bottom - 140))
              const endX = a0.left + a0.width / 2
              tx = startX + (endX - startX) * e
              ty = startY + (focusY - startY) * e
              tAmp = Math.min(1, P * 5)
            } else {
              let chosen = a0
              let best = Number.POSITIVE_INFINITY
              for (let i = 0; i < axes.length; i++) {
                const a = axes[i]
                const d = focusY < a.top ? a.top - focusY : focusY > a.bottom ? focusY - a.bottom : 0
                if (d < best) {
                  best = d
                  chosen = a
                  chosenIdx = i
                }
              }
              tx = chosen.left + chosen.width / 2
              ty = Math.min(Math.max(focusY, chosen.top), chosen.bottom)
              /* magnetic milestones */
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
            scale = 1 - e * (1 - POINT / ORB)
          }
        }

        setFlag(condensed > 0.5 && tAmp > 0.25)

        /* springs */
        pos.vx += (tx - pos.x) * K * dt
        pos.vy += (ty - pos.y) * K * dt
        pos.vx *= Math.max(0, 1 - C * dt)
        pos.vy *= Math.max(0, 1 - C * dt)
        pos.x += pos.vx * dt
        pos.y += pos.vy * dt
        amp += (tAmp - amp) * Math.min(1, 8 * dt)

        /* batched writes — coordinates are section-local (behind content) */
        const lx = pos.x - hostRect.left
        const ly = pos.y - hostRect.top
        const breath = 0.5 + 0.5 * Math.sin(now / 430)
        const hue = Math.round((now / 55) % 360)
        const drawScale = scale * (1 - 0.25 * merge) * (1 + 0.06 * breath * condensed)
        orb.style.transform = `translate3d(${lx - ORB / 2}px, ${ly - ORB / 2}px, 0) scale(${drawScale.toFixed(4)})`
        orb.style.opacity = (amp * (1 - 0.5 * merge)).toFixed(3)
        const blurPx = Math.round(40 - 28 * condensed)
        grad.style.filter = `blur(${blurPx}px) saturate(${(1 + 0.6 * condensed).toFixed(2)}) hue-rotate(${hue}deg)`
        core.style.opacity = clamp01((condensed - 0.68) / 0.32).toFixed(3)
        halo.style.opacity = (clamp01((condensed - 0.5) / 0.5) * (0.5 + 0.3 * breath) * (1 - 0.35 * merge)).toFixed(3)

        /* the tracing beams: the active axis lights up, head at the tip */
        for (let i = 0; i < beamRefs.current.length; i++) {
          const beam = beamRefs.current[i]
          if (!beam) continue
          const targetAmp = i === chosenIdx && condensed > 0.95 ? amp : 0
          beamAmps[i] += (targetAmp - beamAmps[i]) * Math.min(1, 7 * dt)
          const a = axes[i]
          if (!a || beamAmps[i] < 0.01) {
            beam.style.opacity = "0"
            continue
          }
          const axisXLocal = a.left + a.width / 2 - hostRect.left
          const axisTopLocal = a.top - hostRect.top
          const headY = Math.min(Math.max(ly, axisTopLocal), a.bottom - hostRect.top)
          const h = Math.max(24, Math.min(SEG, headY - axisTopLocal + 14))
          beam.style.transform = `translate3d(${axisXLocal - 2}px, ${headY - h}px, 0)`
          beam.style.height = `${Math.round(h)}px`
          beam.style.opacity = (beamAmps[i] * (0.75 + 0.25 * breath)).toFixed(3)
          beam.style.filter = `hue-rotate(${hue}deg)`
        }

        /* milestone reaction: whole node (circle + icon) scales as one unit */
        if (condensed > 0.5 && amp > 0.1) {
          effectsApplied = true
          for (const { el, rect } of nodes) {
            const cy = rect.top + rect.height / 2
            const g = Math.exp(-((cy - pos.y) ** 2) / (NODE_RANGE * NODE_RANGE)) * amp
            const f = Math.min(1, g + merge * g * 2.1)
            if (f > 0.03) {
              el.style.setProperty("scale", (1 + 0.32 * f).toFixed(3))
              el.style.filter = `brightness(${(1 + 0.5 * f).toFixed(3)}) saturate(${(1 + 0.5 * f).toFixed(3)})`
              el.style.boxShadow = `0 0 ${Math.round(34 * f)}px ${Math.round(9 * f)}px rgba(253, 224, 71, ${(0.4 * f).toFixed(3)}), 0 0 ${Math.round(70 * f)}px ${Math.round(22 * f)}px rgba(217, 70, 239, ${(0.26 * f).toFixed(3)})`
            } else {
              el.style.removeProperty("scale")
              el.style.filter = ""
              el.style.boxShadow = ""
            }
          }
        } else if (effectsApplied) {
          clearNodeEffects()
        }

        active = tAmp > 0 || amp > 0.005 || beamAmps.some((b) => b > 0.01)
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
      {/* tracing beams — one per timeline axis, lit while the tip rides it */}
      {[0, 1].map((i) => (
        <div
          key={i}
          ref={(el) => {
            beamRefs.current[i] = el
          }}
          className="absolute left-0 top-0"
          style={{ width: 4, height: 0, opacity: 0, willChange: "transform, opacity, height" }}
        >
          <div
            className="absolute rounded-full"
            style={{ left: -5, right: -5, top: 0, bottom: 0, background: BEAM_GLOW, filter: "blur(7px)" }}
          />
          <div
            className="absolute rounded-full"
            style={{ left: 0, right: 0, top: 0, bottom: 0, background: BEAM_CORE }}
          />
        </div>
      ))}

      {/* the condensation flight orb, ending as the beam's compact tip */}
      <div ref={orbRef} className="absolute left-0 top-0" style={{ width: ORB, height: ORB, opacity: 0, willChange: "transform, opacity" }}>
        {/* luminous halo around the tip */}
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
          className="absolute rounded-full"
          style={{
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 40% 38%, rgba(253, 224, 71, 0.7), transparent 55%)," +
              "radial-gradient(circle at 62% 50%, rgba(244, 63, 94, 0.6), transparent 58%)," +
              "radial-gradient(circle at 46% 68%, rgba(139, 92, 246, 0.55), transparent 60%)",
            filter: "blur(40px)",
          }}
        />
        {/* hot core of the condensed tip — theme-adapted */}
        <div ref={coreRef} className="absolute" style={{ left: 0, right: 0, top: 0, bottom: 0, opacity: 0 }}>
          <div
            className="absolute hidden rounded-full dark:block"
            style={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(253,224,71,0.85) 22%, rgba(244,63,94,0.6) 46%, rgba(139,92,246,0.4) 66%, transparent 78%)",
            }}
          />
          <div
            className="absolute rounded-full dark:hidden"
            style={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              background:
                "radial-gradient(circle, rgba(139,92,246,0.9) 0%, rgba(217,70,239,0.75) 30%, rgba(244,63,94,0.5) 55%, transparent 75%)",
            }}
          />
        </div>
      </div>
    </div>
  )
}
