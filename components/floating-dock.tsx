"use client"

/* Floating dock adapted from Aceternity UI (ui.aceternity.com/components/floating-dock):
   framer-motion + lucide-react instead of motion/react + tabler, no cn() dependency.
   - Mobile (< md): always-visible collapsible dock, bottom-right.
   - Desktop (>= md): magnifying dock, bottom-center, shown only after scrolling past
     the hero (the top navbar hides at the same threshold — see header.tsx). */

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"
import {
  PiCircuitryDuotone,
  PiDotsNineDuotone,
  PiHouseDuotone,
  PiMoonStarsDuotone,
  PiPaperPlaneTiltDuotone,
  PiReadCvLogoDuotone,
  PiSunDuotone,
  PiUserCircleDuotone,
  PiXDuotone,
} from "react-icons/pi"
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react"
import { useTheme } from "./theme-provider"

type DockItem = {
  title: string
  icon: ReactNode
  href?: string
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  /* stable identity for items whose title changes (e.g. the theme toggle) —
     without it React remounts the item mid-hover and its magnification resets */
  key?: string
}

/* Same vibrant palette as the signature section's text-hover gradient */
const DOCK_GRADIENT = "linear-gradient(135deg, #eab308, #ef4444, #3b82f6, #06b6d4, #8b5cf6)"

const NAV_ITEMS: DockItem[] = [
  { title: "Home", icon: <PiHouseDuotone className="h-full w-full" />, href: "#home" },
  { title: "About", icon: <PiUserCircleDuotone className="h-full w-full" />, href: "#about" },
  { title: "Technologies", icon: <PiCircuitryDuotone className="h-full w-full" />, href: "#technologies" },
  { title: "Connect", icon: <PiPaperPlaneTiltDuotone className="h-full w-full" />, href: "#contact" },
  { title: "Resume", icon: <PiReadCvLogoDuotone className="h-full w-full" />, href: "#resume" },
]

/* Same threshold as the header's isScrolled — the moment the hero has closed up */
function useScrolledPastHero() {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight - 80)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return past
}

/* hide while scrolling down, reveal on scroll-up (with a small hysteresis so
   tiny scroll jitters don't flicker it) */
function useScrollDirectionHidden() {
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastY
      if (Math.abs(delta) < 8) return
      setHidden(delta > 0 && y > 120)
      lastY = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return hidden
}

export default function SiteDock() {
  const { isDarkMode, toggleTheme } = useTheme()
  const pastHero = useScrolledPastHero()
  const scrollHidden = useScrollDirectionHidden()
  const [mobileOpen, setMobileOpen] = useState(false)

  const themeItem: DockItem = {
    key: "theme-toggle",
    title: isDarkMode ? "Light mode" : "Dark mode",
    icon: isDarkMode ? <PiSunDuotone className="h-full w-full" /> : <PiMoonStarsDuotone className="h-full w-full" />,
    onClick: toggleTheme,
  }

  return (
    <>
      {/* Mobile: bottom-right; tucks away while scrolling down (never while open) */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-300 md:hidden ${
          scrollHidden && !mobileOpen ? "pointer-events-none translate-y-24 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <FloatingDockMobile items={NAV_ITEMS} open={mobileOpen} setOpen={setMobileOpen} />
      </div>

      {/* Desktop: takes over from the top navbar once the hero closes up */}
      <AnimatePresence>
        {pastHero && (
          <motion.div
            initial={{ y: 96, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 96, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 260 }}
            className="fixed inset-x-0 bottom-6 z-50 hidden justify-center md:flex"
          >
            <FloatingDockDesktop items={[...NAV_ITEMS, themeItem]} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function FloatingDockMobile({
  items,
  open,
  setOpen,
}: {
  items: DockItem[]
  open: boolean
  setOpen: (v: boolean) => void
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [activeIdx, setActiveIdx] = useState(-1)

  /* Gesture, on raw touch events (no click synthesis involved):
     - press the button → dock opens under your thumb
     - slide the finger up → items highlight as you pass over them
     - release on an item → it's selected, dock closes
     - plain tap (no slide) → dock stays open for classic tap-to-select;
       tap again to close */
  useEffect(() => {
    const btn = btnRef.current
    if (!btn) return
    let moved = false
    let wasOpen = false
    let start = { x: 0, y: 0 }
    let lastTouch = -1e9

    const hitTest = (t: Touch) => {
      const el = document.elementFromPoint(t.clientX, t.clientY)
      const hit = el?.closest?.("[data-dock-idx]") as HTMLElement | null
      return hit ? Number(hit.dataset.dockIdx) : -1
    }
    const onStart = (e: TouchEvent) => {
      lastTouch = performance.now()
      const t = e.touches[0]
      if (!t) return
      start = { x: t.clientX, y: t.clientY }
      moved = false
      wasOpen = open
      setOpen(true)
      setActiveIdx(-1)
    }
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      if (!t) return
      if (!moved && Math.hypot(t.clientX - start.x, t.clientY - start.y) > 12) moved = true
      if (moved) {
        e.preventDefault() // the finger is sliding the dock, not scrolling the page
        setActiveIdx(hitTest(t))
      }
    }
    const onEnd = (e: TouchEvent) => {
      lastTouch = performance.now()
      e.preventDefault() // suppress the synthetic click that would double-toggle
      const t = e.changedTouches[0]
      if (moved && t) {
        const idx = hitTest(t)
        setActiveIdx(-1)
        setOpen(false)
        const href = idx >= 0 ? items[idx]?.href : undefined
        if (href) window.location.hash = href
      } else {
        // plain tap: toggle — opens for tap-to-select, closes if it was open
        setActiveIdx(-1)
        if (wasOpen) setOpen(false)
      }
    }
    const onClick = () => {
      // fallback for environments without touch events
      if (performance.now() - lastTouch > 800) setOpen(!open)
    }

    btn.addEventListener("touchstart", onStart, { passive: true })
    btn.addEventListener("touchmove", onTouchMove, { passive: false })
    btn.addEventListener("touchend", onEnd, { passive: false })
    btn.addEventListener("touchcancel", onEnd, { passive: false })
    btn.addEventListener("click", onClick)
    return () => {
      btn.removeEventListener("touchstart", onStart)
      btn.removeEventListener("touchmove", onTouchMove)
      btn.removeEventListener("touchend", onEnd)
      btn.removeEventListener("touchcancel", onEnd)
      btn.removeEventListener("click", onClick)
    }
  }, [items, open, setOpen])

  return (
    <div className="relative">
      <AnimatePresence>
        {open && (
          <motion.div className="absolute inset-x-0 bottom-full mb-2 flex flex-col items-center gap-2">
            {items.map((item, idx) => (
              <motion.div
                key={item.key ?? item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { delay: idx * 0.05 } }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <a
                  href={item.href}
                  data-dock-idx={idx}
                  onClick={() => setOpen(false)}
                  aria-label={item.title}
                  className={`group relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 shadow-md transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:bg-neutral-900 ${
                    activeIdx === idx ? "scale-125" : ""
                  }`}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {/* vibrant fill while slid-over or pressed */}
                  <span
                    className={`absolute inset-0 rounded-full transition-opacity duration-150 group-active:opacity-100 ${
                      activeIdx === idx ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ background: DOCK_GRADIENT }}
                  />
                  <div
                    className={`relative z-10 h-4 w-4 transition-colors duration-150 group-active:text-white ${
                      activeIdx === idx ? "text-white" : "text-neutral-600 dark:text-neutral-300"
                    }`}
                  >
                    {item.icon}
                  </div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        ref={btnRef}
        aria-label={open ? "Close navigation" : "Open navigation"}
        className="group relative flex h-12 w-12 touch-none items-center justify-center rounded-full bg-gray-50 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 dark:bg-neutral-900"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        <span
          className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-150 group-active:opacity-100"
          style={{ background: DOCK_GRADIENT }}
        />
        {open ? (
          <PiXDuotone className="relative z-10 h-5 w-5 text-neutral-500 transition-colors duration-150 group-active:text-white dark:text-neutral-400" />
        ) : (
          <PiDotsNineDuotone className="relative z-10 h-6 w-6 text-neutral-500 transition-colors duration-150 group-active:text-white dark:text-neutral-400" />
        )}
      </button>
    </div>
  )
}

function FloatingDockDesktop({ items }: { items: DockItem[] }) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY)
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className="flex h-16 items-end gap-4 rounded-2xl bg-gray-50/90 px-4 pb-3 shadow-lg backdrop-blur-md dark:bg-neutral-900/90"
    >
      {items.map((item) => (
        <IconContainer key={item.key ?? item.title} mouseX={mouseX} item={item} />
      ))}
    </motion.div>
  )
}

function IconContainer({ mouseX, item }: { mouseX: MotionValue<number>; item: DockItem }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })
  const size = useSpring(useTransform(distance, [-150, 0, 150], [40, 80, 40]), {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })
  const iconSize = useSpring(useTransform(distance, [-150, 0, 150], [20, 40, 20]), {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  })

  const bubble = (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex aspect-square items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800"
    >
      {/* vibrant fill + glow blooming under the cursor (same palette as the signature) */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: DOCK_GRADIENT }}
        initial={false}
        animate={{
          opacity: hovered ? 1 : 0,
          boxShadow: hovered ? "0 0 26px rgba(59, 130, 246, 0.55)" : "0 0 0px rgba(59, 130, 246, 0)",
        }}
        transition={{ duration: 0.2 }}
      />
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
          >
            {item.title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{ width: iconSize, height: iconSize }}
        className={`relative z-10 flex items-center justify-center transition-colors duration-200 ${
          hovered ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]" : "text-neutral-600 dark:text-neutral-300"
        }`}
      >
        {item.icon}
      </motion.div>
    </motion.div>
  )

  const focusRing =
    "rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 dark:focus-visible:ring-offset-neutral-900"

  return item.onClick ? (
    <button onClick={item.onClick} aria-label={item.title} className={focusRing}>
      {bubble}
    </button>
  ) : (
    <a href={item.href} aria-label={item.title} className={focusRing}>
      {bubble}
    </a>
  )
}
