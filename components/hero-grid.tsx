"use client"

/* Spacetime-fabric grid background for the hero (and only the hero).
   At rest: a faint grey grid, visually recessed. Under the cursor: vertices
   magnify locally with a gaussian falloff — the fabric bulges toward the
   viewer — while the lines pick up the site's vibrant signature gradient,
   revealed by proximity (same palette as the text-hover effect, larger radius).
   Canvas 2D, no dependencies; static single draw when idle, rAF only while
   the cursor is inside. Light theme gets a faint black grid instead. */

import { useEffect, useRef } from "react"

const COLORS = ["#eab308", "#ef4444", "#3b82f6", "#06b6d4", "#8b5cf6"]
const CELL = 48 // grid pitch, px
const RADIUS = 260 // influence radius, px — deliberately wide
const MAGNIFY = 0.22 // how far the fabric bulges toward the viewer

export default function HeroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = canvas?.parentElement
    const ctx = canvas?.getContext("2d")
    if (!canvas || !section || !ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let running = false
    const target = { x: -9999, y: -9999, amp: 0 }
    const cur = { x: -9999, y: -9999, amp: 0 }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const influence = (x: number, y: number) => {
      if (cur.amp < 0.005) return 0
      const d2 = (x - cur.x) ** 2 + (y - cur.y) ** 2
      return Math.exp(-d2 / (RADIUS * RADIUS)) * cur.amp
    }

    /* local magnification around the cursor = the bulge toward the viewer */
    const project = (gx: number, gy: number): [number, number] => {
      const x = gx * CELL
      const y = gy * CELL
      const infl = influence(x, y)
      if (infl < 0.005) return [x, y]
      const s = 1 + MAGNIFY * infl
      return [cur.x + (x - cur.x) * s, cur.y + (y - cur.y) * s]
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const dark = document.documentElement.classList.contains("dark")
      const cols = Math.ceil(w / CELL) + 1
      const rows = Math.ceil(h / CELL) + 1

      /* pass 1 — recessed grey grid, one batched path */
      ctx.strokeStyle = dark ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.06)"
      ctx.lineWidth = 1
      ctx.globalAlpha = 1
      ctx.beginPath()
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols - 1; gx++) {
          const [x1, y1] = project(gx, gy)
          const [x2, y2] = project(gx + 1, gy)
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
        }
      }
      for (let gx = 0; gx < cols; gx++) {
        for (let gy = 0; gy < rows - 1; gy++) {
          const [x1, y1] = project(gx, gy)
          const [x2, y2] = project(gx, gy + 1)
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
        }
      }
      ctx.stroke()

      /* pass 2 — vibrant gradient near the cursor, per-segment alpha */
      if (cur.amp >= 0.005) {
        const grad = ctx.createLinearGradient(0, 0, w, h)
        COLORS.forEach((c, i) => grad.addColorStop(i / (COLORS.length - 1), c))
        ctx.strokeStyle = grad
        const seg = (x1: number, y1: number, x2: number, y2: number) => {
          const infl = influence((x1 + x2) / 2, (y1 + y2) / 2)
          if (infl < 0.02) return
          ctx.globalAlpha = Math.min(infl * 1.25, 1)
          ctx.lineWidth = 1 + 1.4 * infl
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
        for (let gy = 0; gy < rows; gy++) {
          for (let gx = 0; gx < cols - 1; gx++) {
            const [x1, y1] = project(gx, gy)
            const [x2, y2] = project(gx + 1, gy)
            seg(x1, y1, x2, y2)
          }
        }
        for (let gx = 0; gx < cols; gx++) {
          for (let gy = 0; gy < rows - 1; gy++) {
            const [x1, y1] = project(gx, gy)
            const [x2, y2] = project(gx, gy + 1)
            seg(x1, y1, x2, y2)
          }
        }
        ctx.globalAlpha = 1
      }
    }

    const tick = () => {
      /* hold still while the theme reveal sweeps, so its edge stays crisp */
      if (!document.documentElement.classList.contains("theme-transitioning")) {
        cur.x += (target.x - cur.x) * 0.18
        cur.y += (target.y - cur.y) * 0.18
        cur.amp += (target.amp - cur.amp) * 0.12
        draw()
      }
      if (target.amp === 0 && cur.amp < 0.01) {
        cur.amp = 0
        running = false
        draw() // settle on the clean resting grid
        return
      }
      raf = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }

    const onMove = (e: MouseEvent) => {
      if (reducedMotion) return
      const rect = section.getBoundingClientRect()
      target.x = e.clientX - rect.left
      target.y = e.clientY - rect.top
      if (cur.amp < 0.01) {
        // fresh entry — appear under the cursor, don't lerp in from a stale corner
        cur.x = target.x
        cur.y = target.y
      }
      target.amp = 1
      wake()
    }
    const onLeave = () => {
      target.amp = 0
      wake()
    }

    const resize = () => {
      const rect = section.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      draw()
    }

    section.addEventListener("mousemove", onMove, { passive: true })
    section.addEventListener("mouseleave", onLeave)
    const ro = new ResizeObserver(resize)
    ro.observe(section)
    resize()

    /* repaint the base grid when the theme class flips (fires before the view
       transition captures the new state, so the reveal shows the right colors) */
    const mo = new MutationObserver(draw)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      section.removeEventListener("mousemove", onMove)
      section.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 z-0" />
}
