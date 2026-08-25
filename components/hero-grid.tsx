"use client"

/* Grid background for the hero (and only the hero).
   A razor-sharp hairline grid, faint and recessed; near the cursor the lines
   light up with the site's vibrant signature gradient (same palette as the
   text-hover effect), fading with a steep gaussian falloff. Geometry is static —
   every line sits snapped on device-pixel boundaries at all times, so nothing
   ever antialiases into blur. Canvas 2D, no dependencies; a single static draw
   when idle, rAF only while the cursor is inside. Works in both themes. */

import { useEffect, useRef } from "react"

const COLORS = ["#eab308", "#ef4444", "#3b82f6", "#06b6d4", "#8b5cf6"]
const CELL = 20 // grid pitch, CSS px — fine mesh
const RADIUS = 156 // influence radius, CSS px

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
    let basePath: Path2D | null = null
    const target = { x: -9999, y: -9999, amp: 0 }
    const cur = { x: -9999, y: -9999, amp: 0 }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    /* snap a CSS coordinate onto a half-pixel device boundary → 1-device-px hairlines */
    const S = (v: number) => Math.round(v * dpr) + 0.5

    const influence = (cssX: number, cssY: number) => {
      if (cur.amp < 0.005) return 0
      const d2 = (cssX - cur.x) ** 2 + (cssY - cur.y) ** 2
      return Math.exp(-d2 / (RADIUS * RADIUS)) * cur.amp
    }

    const buildBasePath = () => {
      basePath = new Path2D()
      const cols = Math.ceil(w / CELL) + 1
      const rows = Math.ceil(h / CELL) + 1
      for (let gx = 0; gx < cols; gx++) {
        basePath.moveTo(S(gx * CELL), 0)
        basePath.lineTo(S(gx * CELL), h * dpr)
      }
      for (let gy = 0; gy < rows; gy++) {
        basePath.moveTo(0, S(gy * CELL))
        basePath.lineTo(w * dpr, S(gy * CELL))
      }
    }

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const dark = document.documentElement.classList.contains("dark")

      /* pass 1 — recessed grey hairline grid (geometry cached in a Path2D) */
      ctx.strokeStyle = dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.07)"
      ctx.lineWidth = 1
      ctx.globalAlpha = 1
      if (basePath) ctx.stroke(basePath)

      /* pass 2 — vibrant gradient hairlines near the cursor, per-segment alpha.
         Only the cells inside the influence box are visited. */
      if (cur.amp >= 0.005) {
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        COLORS.forEach((c, i) => grad.addColorStop(i / (COLORS.length - 1), c))
        ctx.strokeStyle = grad
        ctx.lineWidth = 1
        const reach = RADIUS * 2
        const gx0 = Math.max(0, Math.floor((cur.x - reach) / CELL))
        const gx1 = Math.min(Math.ceil(w / CELL), Math.ceil((cur.x + reach) / CELL))
        const gy0 = Math.max(0, Math.floor((cur.y - reach) / CELL))
        const gy1 = Math.min(Math.ceil(h / CELL), Math.ceil((cur.y + reach) / CELL))
        const seg = (cssMidX: number, cssMidY: number, x1: number, y1: number, x2: number, y2: number) => {
          const infl = influence(cssMidX, cssMidY)
          if (infl < 0.02) return
          // steepened curve: saturated core, crisp edge
          ctx.globalAlpha = Math.min(Math.pow(infl, 1.4) * 2.5, 1)
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
        for (let gy = gy0; gy <= gy1; gy++) {
          for (let gx = gx0; gx <= gx1; gx++) {
            const x = gx * CELL
            const y = gy * CELL
            // horizontal edge to the right, vertical edge downward
            seg(x + CELL / 2, y, S(x), S(y), S(x + CELL), S(y))
            seg(x, y + CELL / 2, S(x), S(y), S(x), S(y + CELL))
          }
        }
        ctx.globalAlpha = 1
      }
    }

    const tick = () => {
      /* hold still while the theme reveal sweeps, so its edge stays crisp */
      if (!document.documentElement.classList.contains("theme-transitioning")) {
        cur.x += (target.x - cur.x) * 0.3
        cur.y += (target.y - cur.y) * 0.3
        cur.amp += (target.amp - cur.amp) * 0.2
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
      // A stale backing store gets stretched across the CSS box — the highlight
      // then lands scaled away from the cursor and every line blurs. If the
      // section's size or the zoom/scaling factor drifted since the last build,
      // rebuild before drawing anything at this cursor position.
      if (
        Math.abs(rect.width - w) > 1 ||
        Math.abs(rect.height - h) > 1 ||
        (window.devicePixelRatio || 1) !== dpr
      ) {
        resize()
      }
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
      dpr = window.devicePixelRatio || 1
      w = rect.width
      h = rect.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      buildBasePath()
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
