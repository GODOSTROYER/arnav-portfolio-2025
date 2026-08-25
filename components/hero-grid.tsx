"use client"

/* Living energy-field background for the hero (and only the hero).

   A razor-sharp hairline grid, faint and recessed. Through it moves a glowing
   energy center: when the pointer is inside the hero it follows the pointer on
   a damped SPRING (real momentum — slight overshoot, elastic settle); when the
   pointer is still or absent, a slow ambient wanderer keeps a soft glow
   drifting along a non-repeating lissajous path, so the field never freezes.
   The spectrum itself rotates hue continuously and two incommensurate ripple
   waves interfere across the lines, so colors flow even at a standstill. The
   glow is a two-pass bloom: a wide soft halo (additive in dark mode) beneath a
   crisp 1-device-px core.

   All math runs in BUFFER pixels, and the pointer is mapped in as a fraction of
   the canvas's own bounding box — exact under display scaling, browser zoom,
   and ancestor CSS transforms. The buffer is sized from the SECTION's layout
   size, never from the canvas or getBoundingClientRect. Base geometry is
   static and snapped to device pixels — the grid itself never blurs.

   Performance: the animation loop runs only while the hero is on-screen and
   the tab is visible (IntersectionObserver + visibilitychange); reduced-motion
   users get the static grid only. */

import { useEffect, useRef } from "react"

/* vivid neon set as HSL (warm core → cool rim); hue rotates over time */
const COLOR_STOPS: Array<[number, number, number]> = [
  [50, 98, 64], // gold
  [25, 95, 53], // orange
  [350, 89, 60], // rose
  [292, 84, 61], // magenta
  [258, 90, 66], // violet
  [187, 85, 53], // cyan
]
const CELL = 20 // grid pitch, layout px — fine mesh
const RADIUS = 156 // influence radius, layout px
const AMBIENT_AMP = 0.34 // glow strength of the idle wanderer
/* spring constants — underdamped on purpose: the glow leans, overshoots a touch, settles */
const POS_STIFFNESS = 140
const POS_DAMPING = 16
const AMP_STIFFNESS = 60
const AMP_DAMPING = 11

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
    let cellBuf = CELL
    let radiusBuf = RADIUS
    let raf = 0
    let running = false
    let onScreen = true
    let pageVisible = document.visibilityState === "visible"
    let basePath: Path2D | null = null
    /* energy-center state, in buffer pixels, driven by a damped spring */
    const pointer = { x: 0, y: 0, active: false }
    const cur = { x: -99999, y: -99999, amp: 0, vx: 0, vy: 0, vamp: 0 }
    let lastT = 0
    const t0 = performance.now()
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    /* snap a buffer coordinate onto a half-pixel boundary → 1-device-px hairlines */
    const S = (v: number) => Math.round(v) + 0.5

    const buildBasePath = () => {
      basePath = new Path2D()
      const cols = Math.ceil(canvas.width / cellBuf) + 1
      const rows = Math.ceil(canvas.height / cellBuf) + 1
      for (let gx = 0; gx < cols; gx++) {
        basePath.moveTo(S(gx * cellBuf), 0)
        basePath.lineTo(S(gx * cellBuf), canvas.height)
      }
      for (let gy = 0; gy < rows; gy++) {
        basePath.moveTo(0, S(gy * cellBuf))
        basePath.lineTo(canvas.width, S(gy * cellBuf))
      }
    }

    const draw = (t: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = "source-over"
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const dark = document.documentElement.classList.contains("dark")

      /* pass 1 — recessed grey hairline grid (geometry cached in a Path2D) */
      ctx.strokeStyle = dark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.07)"
      ctx.lineWidth = 1
      ctx.globalAlpha = 1
      if (basePath) ctx.stroke(basePath)

      if (cur.amp < 0.02) return

      /* the field breathes: radius swells and relaxes on two incommensurate waves */
      const breath = 1 + 0.06 * Math.sin(t * 0.8) + 0.04 * Math.sin(t * 1.7 + 1.3)
      const R = radiusBuf * breath
      const hueShift = t * 14 // slow continuous spectrum rotation

      const influence = (bx: number, by: number) => {
        const d2 = (bx - cur.x) ** 2 + (by - cur.y) ** 2
        return Math.exp(-d2 / (R * R)) * cur.amp
      }
      /* two traveling waves interfering across the plane — organic shimmer,
         never a visible loop */
      const ripple = (bx: number, by: number) =>
        0.78 +
        0.22 * Math.sin(bx * 0.011 + t * 2.1) * Math.sin(by * 0.013 - t * 1.6) +
        0.1 * Math.sin((bx + by) * 0.006 + t * 0.9)

      const stop = (i: number) => {
        const [h, s, l] = COLOR_STOPS[i]
        return `hsl(${(h + hueShift) % 360}, ${s}%, ${l}%)`
      }

      /* soft atmospheric aura beneath the lines */
      const aura = ctx.createRadialGradient(cur.x, cur.y, 0, cur.x, cur.y, R * 1.9)
      aura.addColorStop(0, `hsla(${(COLOR_STOPS[0][0] + hueShift) % 360}, 95%, 60%, ${dark ? 0.1 : 0.055 * cur.amp})`)
      aura.addColorStop(0.5, `hsla(${(COLOR_STOPS[3][0] + hueShift) % 360}, 85%, 55%, ${dark ? 0.05 : 0.03 * cur.amp})`)
      aura.addColorStop(1, "transparent")
      if (dark) ctx.globalCompositeOperation = "lighter"
      ctx.globalAlpha = dark ? cur.amp : 1
      ctx.fillStyle = aura
      ctx.fillRect(cur.x - R * 1.9, cur.y - R * 1.9, R * 3.8, R * 3.8)

      /* spectrum gradient anchored to the energy center */
      const grad = ctx.createRadialGradient(cur.x, cur.y, 0, cur.x, cur.y, R * 1.8)
      COLOR_STOPS.forEach((_, i) => grad.addColorStop(i / (COLOR_STOPS.length - 1), stop(i)))
      ctx.strokeStyle = grad

      const reach = R * 2
      const gx0 = Math.max(0, Math.floor((cur.x - reach) / cellBuf))
      const gx1 = Math.min(Math.ceil(canvas.width / cellBuf), Math.ceil((cur.x + reach) / cellBuf))
      const gy0 = Math.max(0, Math.floor((cur.y - reach) / cellBuf))
      const gy1 = Math.min(Math.ceil(canvas.height / cellBuf), Math.ceil((cur.y + reach) / cellBuf))

      /* two passes: a wide soft halo bloom, then the crisp core */
      for (const pass of [0, 1] as const) {
        ctx.lineWidth = pass === 0 ? 5 * dpr : 1
        const alphaScale = pass === 0 ? (dark ? 0.2 : 0.12) : 1
        const seg = (midX: number, midY: number, x1: number, y1: number, x2: number, y2: number) => {
          const infl = influence(midX, midY)
          if (infl < (pass === 0 ? 0.06 : 0.02)) return
          const a = Math.min(Math.pow(infl, 1.4) * 2.5, 1) * ripple(midX, midY) * alphaScale
          if (a < 0.01) return
          ctx.globalAlpha = Math.min(a, 1)
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
        for (let gy = gy0; gy <= gy1; gy++) {
          for (let gx = gx0; gx <= gx1; gx++) {
            const x = gx * cellBuf
            const y = gy * cellBuf
            seg(x + cellBuf / 2, y, S(x), S(y), S(x + cellBuf), S(y))
            seg(x, y + cellBuf / 2, S(x), S(y), S(x), S(y + cellBuf))
          }
        }
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = "source-over"
    }

    const tick = (now: number) => {
      try {
        const t = (now - t0) / 1000
        const dt = Math.min(0.05, lastT ? t - lastT : 0.016)
        lastT = t

        /* where the energy wants to be: the pointer, or the ambient wanderer
           drifting a slow lissajous path while nobody is interacting */
        let tx: number
        let ty: number
        let tAmp: number
        if (pointer.active) {
          tx = pointer.x
          ty = pointer.y
          tAmp = 1
        } else {
          tx = canvas.width * (0.5 + 0.36 * Math.sin(t * 0.13))
          ty = canvas.height * (0.5 + 0.3 * Math.sin(t * 0.17 + 1.7))
          tAmp = AMBIENT_AMP
        }

        /* damped springs — momentum, slight overshoot, elastic settle */
        cur.vx += (tx - cur.x) * POS_STIFFNESS * dt
        cur.vy += (ty - cur.y) * POS_STIFFNESS * dt
        cur.vx *= Math.max(0, 1 - POS_DAMPING * dt)
        cur.vy *= Math.max(0, 1 - POS_DAMPING * dt)
        cur.x += cur.vx * dt
        cur.y += cur.vy * dt
        cur.vamp += (tAmp - cur.amp) * AMP_STIFFNESS * dt
        cur.vamp *= Math.max(0, 1 - AMP_DAMPING * dt)
        cur.amp += cur.vamp * dt

        /* hold still while the theme reveal sweeps, so its edge stays crisp */
        if (!document.documentElement.classList.contains("theme-transitioning")) {
          draw(t)
        }
      } catch {
        running = false
        return // never let the background effect take the page down
      }
      if (onScreen && pageVisible && !reducedMotion) {
        raf = requestAnimationFrame(tick)
      } else {
        running = false
      }
    }

    const ensureLoop = () => {
      if (!running && onScreen && pageVisible && !reducedMotion) {
        running = true
        lastT = 0
        raf = requestAnimationFrame(tick)
      }
    }

    const resize = () => {
      const prevW = canvas.width
      const prevH = canvas.height
      // clamp: a huge zoomed-out layout or extreme dpr must never allocate an
      // unbounded backing store (renderer crash territory)
      dpr = Math.min(Math.max(window.devicePixelRatio || 1, 0.5), 3)
      // measure the SECTION, never the canvas: a canvas whose positioning fails
      // falls back to its intrinsic (buffer) size — measuring it feeds that back
      // into the buffer and inflates it every cycle
      layoutW = section.offsetWidth
      layoutH = section.offsetHeight
      // proportional on small screens: desktop keeps 20px cells / 156px radius,
      // a phone gets a finer mesh and a fingertip-sized highlight
      const cellCss = Math.min(CELL, Math.max(13, (layoutW / 32) * 1.3))
      const radiusCss = Math.min(RADIUS, layoutW * 0.16)
      cellBuf = cellCss * dpr
      radiusBuf = radiusCss * dpr
      const bufW = Math.min(Math.max(1, Math.round(layoutW * dpr)), 8192)
      const bufH = Math.min(Math.max(1, Math.round(layoutH * dpr)), 8192)
      if (bufW !== canvas.width) canvas.width = bufW
      if (bufH !== canvas.height) canvas.height = bufH
      // energy-center state lives in buffer pixels — rescale it or the glow
      // jumps to the old buffer's coordinates after any size/zoom change
      if (prevW > 1 && prevH > 1 && (canvas.width !== prevW || canvas.height !== prevH)) {
        const kx = canvas.width / prevW
        const ky = canvas.height / prevH
        cur.x *= kx
        cur.y *= ky
        pointer.x *= kx
        pointer.y *= ky
      }
      buildBasePath()
      draw((performance.now() - t0) / 1000)

      /* temporary field diagnostic: visit /?griddebug=1 to see the measured values */
      if (window.location.search.includes("griddebug")) {
        let dbg = document.getElementById("grid-debug") as HTMLDivElement | null
        if (!dbg) {
          dbg = document.createElement("div")
          dbg.id = "grid-debug"
          dbg.style.cssText =
            "position:fixed;bottom:90px;left:8px;z-index:99999;background:rgba(0,0,0,.85);color:#0f0;font:12px/1.5 monospace;padding:8px 10px;border-radius:6px;pointer-events:none;white-space:pre"
          document.body.appendChild(dbg)
        }
        dbg.textContent =
          `layoutW  ${layoutW}\n` +
          `layoutH  ${layoutH}\n` +
          `dpr      ${dpr.toFixed(2)} (raw ${window.devicePixelRatio})\n` +
          `cellCss  ${(cellBuf / dpr).toFixed(1)}\n` +
          `radiusCss ${(radiusBuf / dpr).toFixed(1)}\n` +
          `buffer   ${canvas.width}x${canvas.height}\n` +
          `innerW   ${window.innerWidth}\n` +
          `rectW    ${Math.round(canvas.getBoundingClientRect().width)}`
      }
    }

    let lastGuardAt = 0
    const pointTo = (clientX: number, clientY: number) => {
      if (reducedMotion) return
      try {
        // drift check at most twice a second — a flapping environment (extension
        // zoom, oscillating rounding) must not rebuild the buffer per event
        const now = performance.now()
        if (now - lastGuardAt > 500) {
          lastGuardAt = now
          if (
            section.offsetWidth !== layoutW ||
            section.offsetHeight !== layoutH ||
            Math.min(Math.max(window.devicePixelRatio || 1, 0.5), 3) !== dpr
          ) {
            resize() // size or scaling drifted since the last build
          }
        }
        /* visual-fraction mapping: exact under zoom, scaling, and ancestor transforms */
        const rect = canvas.getBoundingClientRect()
        if (!(rect.width > 0) || !(rect.height > 0)) return
        const tx = ((clientX - rect.left) / rect.width) * canvas.width
        const ty = ((clientY - rect.top) / rect.height) * canvas.height
        if (!Number.isFinite(tx) || !Number.isFinite(ty)) return
        pointer.x = tx
        pointer.y = ty
        pointer.active = true
        ensureLoop()
      } catch {
        // never let the background effect take the page down
      }
    }
    const onMove = (e: MouseEvent) => pointTo(e.clientX, e.clientY)
    /* touch: swipes track the finger, press-and-hold keeps the glow alight —
       passive listeners, so page scrolling is never blocked */
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) pointTo(t.clientX, t.clientY)
    }
    const onLeave = () => {
      pointer.active = false // the energy drifts back to its ambient wander
      ensureLoop()
    }

    const io = new IntersectionObserver((entries) => {
      onScreen = entries[0]?.isIntersecting ?? true
      ensureLoop()
    })
    io.observe(section)
    const onVisibility = () => {
      pageVisible = document.visibilityState === "visible"
      ensureLoop()
    }
    document.addEventListener("visibilitychange", onVisibility)

    section.addEventListener("mousemove", onMove, { passive: true })
    section.addEventListener("mouseleave", onLeave)
    section.addEventListener("touchstart", onTouch, { passive: true })
    section.addEventListener("touchmove", onTouch, { passive: true })
    section.addEventListener("touchend", onLeave, { passive: true })
    section.addEventListener("touchcancel", onLeave, { passive: true })
    const ro = new ResizeObserver(resize)
    ro.observe(section)
    resize()
    /* the field starts alive at its ambient center */
    cur.x = canvas.width / 2
    cur.y = canvas.height / 2
    ensureLoop()

    /* repaint the base grid when the theme class flips (fires before the view
       transition captures the new state, so the reveal shows the right colors) */
    const mo = new MutationObserver(() => draw((performance.now() - t0) / 1000))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      mo.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      section.removeEventListener("mousemove", onMove)
      section.removeEventListener("mouseleave", onLeave)
      section.removeEventListener("touchstart", onTouch)
      section.removeEventListener("touchmove", onTouch)
      section.removeEventListener("touchend", onLeave)
      section.removeEventListener("touchcancel", onLeave)
    }
  }, [])

  /* left-0 top-0 h-full w-full instead of inset-0: the `inset` shorthand is
     unsupported in some mobile browsers, which left the canvas unconstrained
     and sizing itself from its own buffer (compounding every resize) */
  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full" />
}
