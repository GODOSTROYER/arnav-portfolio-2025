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
import { memo, useEffect, useMemo, useRef, useState, type MouseEvent, type ReactNode } from "react"
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

export default function SiteDock() {
  const { toggleTheme } = useTheme()
  const pastHero = useScrolledPastHero()
  const [mobileOpen, setMobileOpen] = useState(false)

  /* The items array is PERMANENTLY stable: the theme icon flips via CSS dark:
     classes (no React state), and onClick reads the latest toggle through a ref.
     Combined with the memoized desktop dock, a theme change never re-renders the
     dock — its magnification springs are untouched, so the hovered icon stays
     enlarged through the theme switch and glides back only when the cursor moves. */
  const toggleRef = useRef(toggleTheme)
  toggleRef.current = toggleTheme
  const desktopItems = useMemo<DockItem[]>(
    () => [
      ...NAV_ITEMS,
      {
        key: "theme-toggle",
        title: "Theme",
        icon: (
          <>
            <PiSunDuotone className="hidden h-full w-full dark:block" />
            <PiMoonStarsDuotone className="h-full w-full dark:hidden" />
          </>
        ),
        onClick: (e: MouseEvent<HTMLButtonElement>) => toggleRef.current(e),
      },
    ],
    [],
  )

  return (
    <>
      {/* Mobile: bottom-right, always available */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
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
            <FloatingDockDesktop items={desktopItems} />
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
      setActiveIdx(-1)
      if (!t) return
      const idx = hitTest(t)
      const btnRect = btn.getBoundingClientRect()
      const onButton =
        t.clientX >= btnRect.left - 8 &&
        t.clientX <= btnRect.right + 8 &&
        t.clientY >= btnRect.top - 8 &&
        t.clientY <= btnRect.bottom + 8
      if (idx >= 0) {
        // released on an item (slid or not) → select it
        setOpen(false)
        const href = items[idx]?.href
        if (href) window.location.hash = href
      } else if (onButton) {
        // released on the button itself → a tap, however wobbly the finger was:
        // opens for tap-to-select, closes if it was already open
        if (wasOpen) setOpen(false)
      } else if (moved) {
        // slid away and released on nothing → close
        setOpen(false)
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
          <motion.div className="absolute bottom-full right-0 mb-2 flex flex-col items-end gap-2">
            {items.map((item, idx) => (
              <motion.div
                key={item.key ?? item.title}
                data-dock-idx={idx}
                initial={{ opacity: 0, y: 10, x: 12 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: 10, x: 12, transition: { delay: idx * 0.04 } }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                className="flex items-center gap-2"
              >
                {/* text label, slides in beside the icon */}
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-medium shadow-md transition-colors duration-150 ${
                    activeIdx === idx
                      ? "bg-neutral-900 text-white dark:bg-gray-50 dark:text-neutral-900"
                      : "bg-gray-50/95 text-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-200"
                  }`}
                >
                  {item.title}
                </span>
                <a
                  href={item.href}
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

/* Chromium re-evaluates hover when the theme's view-transition overlay mounts and
   unmounts, firing a TRUSTED mouseleave/mouseenter pair on the dock even though the
   cursor never moves (measured live). A leave that arrives during the sweep is
   therefore held for 900ms and cancelled by the matching re-enter — the magnified
   icon sails through the theme change. A genuine departure still shrinks the dock
   via the delayed fallback. */
function phantomLeaveGuard(onLeave: () => void, cancelRef: { current: ReturnType<typeof setTimeout> | null }) {
  if (cancelRef.current) clearTimeout(cancelRef.current)
  if (document.documentElement.classList.contains("theme-transitioning")) {
    cancelRef.current = setTimeout(onLeave, 900)
  } else {
    onLeave()
  }
}

/* memo: with the stable items array, theme changes skip this subtree entirely */
const FloatingDockDesktop = memo(function FloatingDockDesktop({ items }: { items: DockItem[] }) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY)
  const pendingLeave = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelPending = () => {
    if (pendingLeave.current) {
      clearTimeout(pendingLeave.current)
      pendingLeave.current = null
    }
  }
  return (
    <motion.div
      onMouseMove={(e) => {
        cancelPending()
        mouseX.set(e.pageX)
      }}
      onMouseEnter={(e) => {
        cancelPending()
        mouseX.set(e.pageX) // re-magnify on re-entry without waiting for movement
      }}
      onMouseLeave={() => phantomLeaveGuard(() => mouseX.set(Number.POSITIVE_INFINITY), pendingLeave)}
      className="flex h-16 items-end gap-4 rounded-2xl bg-gray-50/90 px-4 pb-3 shadow-lg backdrop-blur-md dark:bg-neutral-900/90"
    >
      {items.map((item) => (
        <IconContainer key={item.key ?? item.title} mouseX={mouseX} item={item} />
      ))}
    </motion.div>
  )
})

function IconContainer({ mouseX, item }: { mouseX: MotionValue<number>; item: DockItem }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const pendingUnhover = useRef<ReturnType<typeof setTimeout> | null>(null)

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
      onMouseEnter={() => {
        if (pendingUnhover.current) clearTimeout(pendingUnhover.current)
        setHovered(true)
      }}
      onMouseLeave={() => phantomLeaveGuard(() => setHovered(false), pendingUnhover)}
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
