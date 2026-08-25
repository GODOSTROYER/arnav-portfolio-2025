"use client"

/* Grid background for the hero (and only the hero).
   A razor-sharp hairline grid, faint and recessed; near the cursor the lines
   light up with the site's vibrant signature gradient (same palette as the
   text-hover effect), fading with a steep gaussian falloff.

   All math runs in BUFFER pixels, and the cursor is mapped in as a fraction of
   the canvas's own bounding box — this stays exact under display scaling,
   browser zoom, and even ancestor CSS transforms (extension-injected zoom/scale
   included), any of which desync visual pixels from layout pixels. The buffer
   is sized from offsetWidth (layout), never from getBoundingClientRect (visual).
   Geometry is static and snapped to device pixels — nothing ever blurs. */

import { useEffect, useRef } from "react"

const COLORS = ["#eab308", "#ef4444", "#3b82f6", "#06b6d4", "#8b5cf6"]
const CELL = 20 // grid pitch, layout px — fine mesh
const RADIUS = 156 // influence radius, layout px

export default function HeroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const section = canvas?.parentElement
    const ctx = canvas?.getContext("2d")
    if (!canvas || !section || !ctx) return

    let layoutW = 0
    let layoutH = 0
    let dpr = 1
    let cellBuf = CELL // grid pitch in buffer px
    let radiusBuf = RADIUS // influence radius in buffer px
    let raf = 0
    let running = false
    let basePath: Path2D | null = null
    /* cursor state, in buffer pixels */
    const target = { x: -99999, y: -99999, amp: 0 }
    const cur = { x: -99999, y: -99999, amp: 0 }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    /* snap a buffer coordinate onto a half-pixel boundary → 1-device-px hairlines */
    const S = (v: number) => Math.round(v) + 0.5

    const influence = (bx: number, by: number) => {
      if (cur.amp < 0.005) return 0
      const d2 = (bx - cur.x) ** 2 + (by - cur.y) ** 2
      return Math.exp(-d2 / (radiusBuf * radiusBuf)) * cur.amp
    }

    const buildBasePath = () => {
      basePath = new Path2D()
      const cols = Math.ceil(layoutW / CELL) + 1
      const rows = Math.ceil(layoutH / CELL) + 1
      for (let gx = 0; gx < cols; gx++) {
        basePath.moveTo(S(gx * cellBuf), 0)
        basePath.lineTo(S(gx * cellBuf), canvas.height)
      }
      for (let gy = 0; gy < rows; gy++) {
        basePath.moveTo(0, S(gy * cellBuf))
        basePath.lineTo(canvas.width, S(gy * cellBuf))
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
        const reach = radiusBuf * 2
        const gx0 = Math.max(0, Math.floor((cur.x - reach) / cellBuf))
        const gx1 = Math.min(Math.ceil(canvas.width / cellBuf), Math.ceil((cur.x + reach) / cellBuf))
        const gy0 = Math.max(0, Math.floor((cur.y - reach) / cellBuf))
        const gy1 = Math.min(Math.ceil(canvas.height / cellBuf), Math.ceil((cur.y + reach) / cellBuf))
        const seg = (midX: number, midY: number, x1: number, y1: number, x2: number, y2: number) => {
          const infl = influence(midX, midY)
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
            const x = gx * cellBuf
            const y = gy * cellBuf
            // horizontal edge to the right, vertical edge downward
            seg(x + cellBuf / 2, y, S(x), S(y), S(x + cellBuf), S(y))
            seg(x, y + cellBuf / 2, S(x), S(y), S(x), S(y + cellBuf))
          }
        }
        ctx.globalAlpha = 1
      }
    }

    const tick = () => {
      try {
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
      } catch {
        running = false
        return // never let the background effect take the page down
      }
      raf = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }

    const resize = () => {
      const prevW = canvas.width
      const prevH = canvas.height
      // clamp: a huge zoomed-out layout or extreme dpr must never allocate an
      // unbounded backing store (renderer crash territory)
      dpr = Math.min(Math.max(window.devicePixelRatio || 1, 0.5), 3)
      layoutW = canvas.offsetWidth
      layoutH = canvas.offsetHeight
      cellBuf = CELL * dpr
      radiusBuf = RADIUS * dpr
      const bufW = Math.min(Math.max(1, Math.round(layoutW * dpr)), 8192)
      const bufH = Math.min(Math.max(1, Math.round(layoutH * dpr)), 8192)
      if (bufW !== canvas.width) canvas.width = bufW
      if (bufH !== canvas.height) canvas.height = bufH
      // cursor state lives in buffer pixels — rescale it or the highlight jumps
      // to the old buffer's coordinates after any size/zoom change
      if (prevW > 1 && prevH > 1 && (canvas.width !== prevW || canvas.height !== prevH)) {
        const kx = canvas.width / prevW
        const ky = canvas.height / prevH
        cur.x *= kx
        cur.y *= ky
        target.x *= kx
        target.y *= ky
      }
      buildBasePath()
      draw()
    }

    let lastGuardAt = 0
    const onMove = (e: MouseEvent) => {
      if (reducedMotion) return
      try {
        // drift check at most twice a second — a flapping environment (extension
        // zoom, oscillating rounding) must not rebuild the buffer per event
        const now = performance.now()
        if (now - lastGuardAt > 500) {
          lastGuardAt = now
          if (
            canvas.offsetWidth !== layoutW ||
            canvas.offsetHeight !== layoutH ||
            Math.min(Math.max(window.devicePixelRatio || 1, 0.5), 3) !== dpr
          ) {
            resize() // size or scaling drifted since the last build
          }
        }
        /* visual-fraction mapping: exact under zoom, scaling, and ancestor transforms */
        const rect = canvas.getBoundingClientRect()
        if (!(rect.width > 0) || !(rect.height > 0)) return
        const tx = ((e.clientX - rect.left) / rect.width) * canvas.width
        const ty = ((e.clientY - rect.top) / rect.height) * canvas.height
        if (!Number.isFinite(tx) || !Number.isFinite(ty)) return
        target.x = tx
        target.y = ty
        if (cur.amp < 0.01) {
          // fresh entry — appear under the cursor, don't lerp in from a stale corner
          cur.x = target.x
          cur.y = target.y
        }
        target.amp = 1
        wake()
      } catch {
        // never let the background effect take the page down
      }
    }
    const onLeave = () => {
      target.amp = 0
      wake()
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
