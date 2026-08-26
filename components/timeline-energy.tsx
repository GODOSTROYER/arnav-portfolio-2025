"use client"

/* Aceternity-style tracing beam for the timelines — faithful to
   ui.aceternity.com/components/tracing-beam: a thin beam in their exact
   palette (cyan #18CCFC head → violet #6344F5 → purple #AE48FF tail, fading
   at both ends) traces the timeline axis as you scroll. No orb, no dot, no
   glow dressing — just the beam.

   The beam is directional and fully reversible: the head springs after a
   focus line while the tail chases a point TAIL px behind it (behind = the
   smoothed travel direction, in DOCUMENT space, where scrolling is motion) —
   scroll back up and the beam sweeps around and runs backwards, bright head
   leading. When fully dispersed it re-materializes as a point at whichever
   end the scroll approaches from (the top of the first axis when arriving
   from the hero, the bottom of the last when returning from below) and grows
   out of it; leaving in either direction the head pins to the exit end,
   aiming at what takes over — the hero grid's highlight above, the cursor
   aura below — and streams off as it fades.

   One light, three forms: the hero grid highlight, this beam, and the cursor
   aura are the same energy. `beamState` (read by ambient-glow every frame)
   carries the beam's ownership + head position so the aura merges into the
   head as the beam takes over and re-emerges from it on release — the beam
   and the aura never co-exist.

   Milestone nodes ([data-timeline-node]) within capture range magnetically
   draw the head in: while merged, the WHOLE node — colored circle + icon as
   one unit (via the CSS `scale` property, so framer-motion's transform is
   never touched) — swells under a strong gold/magenta bloom, then releases
   as scroll carries the head on. Each axis has its own beam that crossfades
   as the head crosses the gap between timelines.

   Rendered inside the section at z-0 (behind the translucent cards); reads
   batched before writes; reduced-motion users get nothing. */

import { useEffect, useRef } from "react"

/* one light: while amp > 0 the beam owns it — ambient-glow steers its aura
   into (x, y), the beam head in viewport coords, fading in proportion */
export const beamState = { amp: 0, x: 0, y: 0 }

const TAIL = 200 // max beam segment length, px (head → fading tail)
const FOCUS = 0.42 // viewport fraction the beam head tracks
const CAPTURE = 64 // px: magnetic capture radius around a milestone
const NODE_RANGE = 90 // px falloff for milestone pre-reaction
const K = 200 // spring stiffness — fast follow with slight lag
const C = 26 // spring damping
const TAIL_EASE = 5 // tail chase rate — its lag gives the beam its life
const DIR_EASE = 3.5 // how fast the beam swings around on a scroll reversal
const DIR_MIN_V = 40 // px/s of head speed before travel direction updates

/* bright cyan head at the leading edge, fading purple tail behind it */
const GRAD_DOWN =
  "linear-gradient(to top, rgba(24,204,252,0) 0%, #18CCFC 5%, #6344F5 34%, rgba(174,72,255,0) 100%)"
const GRAD_UP =
  "linear-gradient(to bottom, rgba(24,204,252,0) 0%, #18CCFC 5%, #6344F5 34%, rgba(174,72,255,0) 100%)"

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export default function TimelineEnergy() {
  const beamRefs = useRef<Array<HTMLDivElement | null>>([])
  const trackRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    const wrapper = beamRefs.current[0]?.parentElement
    const host = wrapper?.parentElement // wrapper -> section
    if (!wrapper || !host) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    /* head/tail live in DOCUMENT space: under a steady scroll the head moves
       along the content at scroll speed, so velocity (and with it the beam's
       travel direction) is real — in viewport space it would just sit at the
       fixed focus line and never register motion */
    let headDoc = window.scrollY + window.innerHeight / 2
    let headV = 0
    let tailDoc = headDoc
    let dir = 0 // smoothed travel direction: +1 down, -1 up, 0 at birth
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

        const sy = window.scrollY
        let ty = headDoc - sy // viewport-space target for this frame
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

        const tyDoc = ty + sy

        /* materialize as a point at the entry edge when fully dispersed, so
           the beam grows out of whichever end the scroll arrives from */
        if (amp < 0.02 && tAmp > 0.02) {
          headDoc = tyDoc
          tailDoc = tyDoc
          headV = 0
          dir = 0
        }

        /* spring the head; the tail chases a point TAIL px behind it, where
           "behind" is the smoothed travel direction — so the beam keeps its
           full length at rest and sweeps through zero only on a reversal */
        headV += (tyDoc - headDoc) * K * dt
        headV *= Math.max(0, 1 - C * dt)
        headDoc += headV * dt
        if (Math.abs(headV) > DIR_MIN_V) {
          dir += (Math.sign(headV) - dir) * Math.min(1, DIR_EASE * dt)
        }
        tailDoc += (headDoc - dir * TAIL - tailDoc) * Math.min(1, TAIL_EASE * dt)
        tailDoc = Math.min(Math.max(tailDoc, headDoc - TAIL), headDoc + TAIL)
        amp += (tAmp - amp) * Math.min(1, 8 * dt)

        const headY = headDoc - sy // back to viewport space for draws & nodes
        const tailY = tailDoc - sy

        /* hand the light to the aura: ownership + head position (viewport) */
        beamState.amp = amp
        if (chosenIdx >= 0) {
          const a = axes[chosenIdx]
          beamState.x = a.left + a.width / 2
          beamState.y = Math.min(Math.max(headY, a.top), a.bottom)
        }

        /* batched writes — tracks (the faint line itself lives in this layer,
           since the beam must paint over it) then beams, section-local coords */
        for (let i = 0; i < trackRefs.current.length; i++) {
          const track = trackRefs.current[i]
          const a = axes[i]
          if (!track) continue
          if (!a) {
            track.style.opacity = "0"
            continue
          }
          track.style.transform = `translate3d(${a.left + a.width / 2 - hostRect.left - 1}px, ${a.top - hostRect.top}px, 0)`
          track.style.height = `${Math.round(a.height)}px`
          track.style.opacity = "1"
        }
        const down = headY >= tailY // which way the beam is travelling
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
          const hy = Math.min(Math.max(headY, a.top), a.bottom) - hostRect.top
          const tly = Math.min(Math.max(tailY, a.top), a.bottom) - hostRect.top
          const h = Math.max(14, Math.abs(hy - tly))
          beam.style.transform = `translate3d(${axisXLocal - 1}px, ${down ? hy - h : hy}px, 0)`
          beam.style.height = `${Math.round(h)}px`
          beam.style.background = down ? GRAD_DOWN : GRAD_UP
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
        beamState.amp = 0
        return
      }
      if (active) {
        raf = requestAnimationFrame(tick)
      } else {
        running = false
        clearNodeEffects()
        beamState.amp = 0
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
      beamState.amp = 0
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* the faint tracks (the visible timeline lines) — the beam paints over them */}
      {[0, 1].map((i) => (
        <div
          key={`track-${i}`}
          ref={(el) => {
            trackRefs.current[i] = el
          }}
          className="absolute left-0 top-0 bg-gray-200 dark:bg-gray-700"
          style={{ width: 2, height: 0, opacity: 0, willChange: "transform, height" }}
        />
      ))}
      {[0, 1].map((i) => (
        <div
          key={`beam-${i}`}
          ref={(el) => {
            beamRefs.current[i] = el
          }}
          className="absolute left-0 top-0 rounded-full"
          style={{ width: 2, height: 0, opacity: 0, background: GRAD_DOWN, willChange: "transform, opacity, height" }}
        />
      ))}
    </div>
  )
}
