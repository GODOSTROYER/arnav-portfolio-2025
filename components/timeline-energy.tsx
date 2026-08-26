"use client"

/* Aceternity-style tracing beam for the timelines — faithful to
   ui.aceternity.com/components/tracing-beam: a thin beam in their exact
   palette (cyan #18CCFC head → violet #6344F5 → purple #AE48FF tail, fading
   at both ends) traces the timeline axis as you scroll. No orb, no dot, no
   glow dressing — just the beam.

   The beam's head tracks a focus line (spring-smoothed, so it trails scroll
   with a little life) and is magnetically drawn into milestone nodes
   ([data-timeline-node]) within capture range: while merged, the WHOLE node —
   colored circle + icon as one unit (via the CSS `scale` property, so
   framer-motion's transform is never touched) — swells under a strong
   gold/magenta bloom, then releases as scroll carries the head on. Fully
   reversible; each axis has its own beam that crossfades as the head crosses
   the gap between timelines.

   Rendered inside the section at z-0 (behind the translucent cards); reads
   batched before writes; reduced-motion users get nothing. */

import { useEffect, useRef } from "react"

const TAIL = 200 // beam segment length, px (head → fading tail)
const FOCUS = 0.42 // viewport fraction the beam head tracks
const CAPTURE = 64 // px: magnetic capture radius around a milestone
const NODE_RANGE = 90 // px falloff for milestone pre-reaction
const K = 200 // spring stiffness — fast follow with slight lag
const C = 26 // spring damping

/* head at the bottom edge: transparent → cyan → violet → purple fading out */
const BEAM_GRADIENT =
  "linear-gradient(to top, rgba(24,204,252,0) 0%, #18CCFC 5%, #6344F5 34%, rgba(174,72,255,0) 100%)"

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export default function TimelineEnergy() {
  const beamRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    const wrapper = beamRefs.current[0]?.parentElement
    const host = wrapper?.parentElement // wrapper -> section
    if (!wrapper || !host) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let headY = window.innerHeight / 2
    let headV = 0
    let amp = 0
    const beamAmps = [0, 0]
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
        n.style.removeProperty("scale")
      })
    }

    const tick = (now: number) => {
      let active = false
      try {
        const dt = Math.min(0.05, lastNow ? (now - lastNow) / 1000 : 0.016)
        lastNow = now
        const focusY = window.innerHeight * FOCUS
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

        let ty = headY
        let tAmp = 0
        let merge = 0
        let chosenIdx = -1

        if (axes.length) {
          const a0 = axes[0]
          const aLast = axes[axes.length - 1]
          /* the beam exists once the first axis approaches the focus line and
             dissolves shortly after the last axis passes it */
          if (a0.top < focusY + 320 && aLast.bottom > focusY - 320) {
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
            ty = Math.min(Math.max(focusY, chosen.top), chosen.bottom)
            /* magnetic milestones: the head bends into a nearby node and dwells */
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
            tAmp = clamp01((focusY + 320 - a0.top) / 320) * clamp01((aLast.bottom - focusY + 320) / 320)
          }
        }

        /* spring the head */
        headV += (ty - headY) * K * dt
        headV *= Math.max(0, 1 - C * dt)
        headY += headV * dt
        amp += (tAmp - amp) * Math.min(1, 8 * dt)

        /* batched writes — the beams, in section-local coordinates */
        for (let i = 0; i < beamRefs.current.length; i++) {
          const beam = beamRefs.current[i]
          if (!beam) continue
          const targetAmp = i === chosenIdx ? amp : 0
          beamAmps[i] += (targetAmp - beamAmps[i]) * Math.min(1, 7 * dt)
          const a = axes[i]
          if (!a || beamAmps[i] < 0.01) {
            beam.style.opacity = "0"
            continue
          }
          const axisXLocal = a.left + a.width / 2 - hostRect.left
          const axisTopLocal = a.top - hostRect.top
          const hy = Math.min(Math.max(headY, a.top), a.bottom) - hostRect.top
          const h = Math.max(20, Math.min(TAIL, hy - axisTopLocal + 10))
          beam.style.transform = `translate3d(${axisXLocal - 1}px, ${hy - h}px, 0)`
          beam.style.height = `${Math.round(h)}px`
          beam.style.opacity = beamAmps[i].toFixed(3)
        }

        /* milestone reaction: the whole node (circle + icon) scales as one unit */
        if (amp > 0.1) {
          effectsApplied = true
          for (const { el, rect } of nodes) {
            const cy = rect.top + rect.height / 2
            const g = Math.exp(-((cy - headY) ** 2) / (NODE_RANGE * NODE_RANGE)) * amp
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
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {[0, 1].map((i) => (
        <div
          key={i}
          ref={(el) => {
            beamRefs.current[i] = el
          }}
          className="absolute left-0 top-0 rounded-full"
          style={{ width: 2, height: 0, opacity: 0, background: BEAM_GRADIENT, willChange: "transform, opacity, height" }}
        />
      ))}
    </div>
  )
}
