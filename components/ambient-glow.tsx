"use client"

/* Site-wide ambient light that responds to the structure of each section.

   One small fixed layer (multi-tone radial blob, heavily blurred, composited on
   the GPU) follows the cursor on a damped spring. Its behavior morphs by region:
   - Hero: defers to the hero grid's own highlight — the aura fades out.
   - Timeline sections (elements tagged data-timeline-axis): magnetizes to the
     timeline — x locks onto the axis, y loosely tracks the cursor (clamped to
     the line), and the blob stretches along the line while narrowing across it.
   - Everywhere else: a free-moving soft aura at the cursor.
   All transitions are spring-driven, so attach/detach feel like one continuous
   light. Hue rotates slowly for the site's living-color language. Dark mode
   blends with `screen` so text stays readable; light mode runs at lower opacity.
   Touch-only devices and reduced-motion users get nothing (cursor-centric FX). */

import { useEffect, useRef } from "react"

const SIZE = 260
const POS_STIFFNESS = 110
const POS_DAMPING = 14
const BLEND_SPEED = 6 // how fast amp/magnet factors ease

export default function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(hover: none)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2, vx: 0, vy: 0 }
    let amp = 0 // visibility 0..1
    let magnet = 0 // 0 = free aura, 1 = attached to a timeline axis
    const mouse = { x: -9999, y: -9999, seen: false }
    let raf = 0
    let running = false
    let lastNow = 0

    const tick = (now: number) => {
      try {
        const dt = Math.min(0.05, lastNow ? (now - lastNow) / 1000 : 0.016)
        lastNow = now

        /* decide the light's allegiance this frame */
        let tx = mouse.x
        let ty = mouse.y
        let tAmp = mouse.seen ? 1 : 0
        let tMag = 0
        const hero = document.getElementById("home")
        if (hero) {
          const hr = hero.getBoundingClientRect()
          if (mouse.y >= hr.top && mouse.y <= hr.bottom && hr.bottom > 0) {
            tAmp = 0 // the hero grid owns the light here
          }
        }
        if (tAmp > 0) {
          const axes = document.querySelectorAll<HTMLElement>("[data-timeline-axis]")
          for (const axis of axes) {
            const r = axis.getBoundingClientRect()
            if (r.height < 1) continue
            if (mouse.y >= r.top - 60 && mouse.y <= r.bottom + 60 && Math.abs(mouse.x - r.left) < 720) {
              tx = r.left + r.width / 2
              ty = Math.min(Math.max(mouse.y, r.top), r.bottom)
              tMag = 1
              break
            }
          }
        }

        /* springs: position with momentum; amp/magnet as smooth exponential eases */
        pos.vx += (tx - pos.x) * POS_STIFFNESS * dt
        pos.vy += (ty - pos.y) * POS_STIFFNESS * dt
        pos.vx *= Math.max(0, 1 - POS_DAMPING * dt)
        pos.vy *= Math.max(0, 1 - POS_DAMPING * dt)
        pos.x += pos.vx * dt
        pos.y += pos.vy * dt
        amp += (tAmp - amp) * Math.min(1, BLEND_SPEED * dt)
        magnet += (tMag - magnet) * Math.min(1, BLEND_SPEED * dt)

        const dark = document.documentElement.classList.contains("dark")
        /* along the timeline: taller, narrower, slightly stronger; free: round */
        const sx = 1 - 0.3 * magnet
        const sy = 1 + 0.55 * magnet
        el.style.transform = `translate3d(${pos.x - SIZE / 2}px, ${pos.y - SIZE / 2}px, 0) scale(${sx}, ${sy})`
        el.style.opacity = (amp * (dark ? 0.5 : 0.38) * (1 + 0.25 * magnet)).toFixed(3)
        el.style.filter = `blur(48px) hue-rotate(${Math.round((now / 55) % 360)}deg)`
      } catch {
        running = false
        return
      }
      if (amp > 0.005 || mouse.seen) {
        raf = requestAnimationFrame(tick)
      } else {
        running = false
      }
    }

    const wake = () => {
      if (!running) {
        running = true
        lastNow = 0
        raf = requestAnimationFrame(tick)
      }
    }
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.seen = true
      wake()
    }
    const onLeaveWindow = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        mouse.seen = false // cursor left the window — let the aura fade out
      }
    }
    const onScroll = () => wake() // rects move under a still cursor

    window.addEventListener("mousemove", onMove, { passive: true })
    document.addEventListener("mouseout", onLeaveWindow)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseout", onLeaveWindow)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 rounded-full dark:mix-blend-screen"
      style={{
        width: SIZE,
        height: SIZE,
        opacity: 0,
        willChange: "transform, opacity, filter",
        background:
          "radial-gradient(circle at 35% 35%, rgba(253, 224, 71, 0.30), transparent 60%)," +
          "radial-gradient(circle at 65% 45%, rgba(244, 63, 94, 0.24), transparent 62%)," +
          "radial-gradient(circle at 45% 70%, rgba(139, 92, 246, 0.22), transparent 65%)",
      }}
    />
  )
}
