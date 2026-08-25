"use client"

/* Site-wide ambient light that responds to the structure of each section.

   Two sibling fixed layers move together on a damped spring (siblings, not a
   wrapped group: a transformed/faded parent would create a CSS isolation group
   and the blend modes would stop interacting with the page):
   - CORE: a dense, tight blob — the light's solid body.
   - REFLECT: a wider halo blended as color-dodge (dark mode): pure black stays
     pure black, but text, cards and borders beneath it catch and re-emit the
     glow's color as it passes — light reflecting off the page's surfaces.
   Behavior morphs by region:
   - Hero: emerges/dissolves gradually across a band at the hero's lower edge —
     the hero grid owns the light inside, and crossing feels like one light
     condensing, not a switch.
   - Timeline sections (elements tagged data-timeline-axis): magnetizes to the
     axis — x locks on, y loosely chases the cursor, the body stretches along
     the line.
   - Everywhere else: free-moving aura at the cursor.
   Hue rotates slowly (living-color language). Touch-only devices and
   reduced-motion users get nothing. */

import { useEffect, useRef } from "react"

const CORE_SIZE = 280
const REFLECT_SIZE = 400
const POS_STIFFNESS = 95 // a touch heavier than the hero field — the light has mass
const POS_DAMPING = 15
const BLEND_SPEED = 6 // how fast amp/magnet factors ease
const HERO_FADE_BAND = 220 // px over which the aura emerges below the hero

export default function AmbientGlow() {
  const coreRef = useRef<HTMLDivElement>(null)
  const reflectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const core = coreRef.current
    const reflect = reflectRef.current
    if (!core || !reflect) return
    if (window.matchMedia("(hover: none)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2, vx: 0, vy: 0 }
    let amp = 0
    let magnet = 0
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
        if (hero && tAmp > 0) {
          const hr = hero.getBoundingClientRect()
          if (hr.bottom > 0 && mouse.y < hr.bottom) {
            /* inside the hero and its emergence band: fade by depth, not a switch */
            const emerge = (mouse.y - (hr.bottom - HERO_FADE_BAND)) / HERO_FADE_BAND
            tAmp *= Math.min(1, Math.max(0, emerge))
          }
        }
        if (tAmp > 0.01) {
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
        const hue = Math.round((now / 55) % 360)
        /* along the timeline: taller, narrower, slightly stronger; free: round */
        const sx = 1 - 0.3 * magnet
        const sy = 1 + 0.55 * magnet

        core.style.transform = `translate3d(${pos.x - CORE_SIZE / 2}px, ${pos.y - CORE_SIZE / 2}px, 0) scale(${sx}, ${sy})`
        core.style.opacity = (amp * (dark ? 0.85 : 0.55) * (1 + 0.2 * magnet)).toFixed(3)
        core.style.filter = `blur(38px) hue-rotate(${hue}deg)`

        reflect.style.transform = `translate3d(${pos.x - REFLECT_SIZE / 2}px, ${pos.y - REFLECT_SIZE / 2}px, 0) scale(${sx}, ${sy})`
        reflect.style.opacity = (amp * (dark ? 0.45 : 0.4)).toFixed(3)
        reflect.style.filter = `blur(60px) hue-rotate(${hue}deg)`
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
    <>
      {/* dense body of the light */}
      <div
        ref={coreRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 rounded-full dark:mix-blend-screen"
        style={{
          width: CORE_SIZE,
          height: CORE_SIZE,
          opacity: 0,
          willChange: "transform, opacity, filter",
          background:
            "radial-gradient(circle at 42% 40%, rgba(253, 224, 71, 0.55), transparent 55%)," +
            "radial-gradient(circle at 62% 48%, rgba(244, 63, 94, 0.45), transparent 58%)," +
            "radial-gradient(circle at 48% 66%, rgba(139, 92, 246, 0.40), transparent 62%)",
        }}
      />
      {/* cinematic reflection: content beneath catches the color; pure black doesn't */}
      <div
        ref={reflectRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 rounded-full mix-blend-soft-light dark:mix-blend-color-dodge"
        style={{
          width: REFLECT_SIZE,
          height: REFLECT_SIZE,
          opacity: 0,
          willChange: "transform, opacity, filter",
          background:
            "radial-gradient(circle at 45% 45%, rgba(253, 224, 71, 0.5), transparent 60%)," +
            "radial-gradient(circle at 60% 55%, rgba(217, 70, 239, 0.4), transparent 65%)",
        }}
      />
    </>
  )
}
