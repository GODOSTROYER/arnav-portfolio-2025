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
import { Cpu, FileText, Home, Menu, Moon, Sun, User, AtSign, X } from "lucide-react"
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react"
import { useTheme } from "./theme-provider"

type DockItem = {
  title: string
  icon: ReactNode
  href?: string
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
}

const NAV_ITEMS: DockItem[] = [
  { title: "Home", icon: <Home className="h-full w-full" />, href: "#home" },
  { title: "About", icon: <User className="h-full w-full" />, href: "#about" },
  { title: "Technologies", icon: <Cpu className="h-full w-full" />, href: "#technologies" },
  { title: "Connect", icon: <AtSign className="h-full w-full" />, href: "#contact" },
  { title: "Resume", icon: <FileText className="h-full w-full" />, href: "#resume" },
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
  const { isDarkMode, toggleTheme } = useTheme()
  const pastHero = useScrolledPastHero()

  const themeItem: DockItem = {
    title: isDarkMode ? "Light mode" : "Dark mode",
    icon: isDarkMode ? <Sun className="h-full w-full" /> : <Moon className="h-full w-full" />,
    onClick: toggleTheme,
  }

  return (
    <>
      {/* Mobile: always available, bottom-right */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <FloatingDockMobile items={NAV_ITEMS} />
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

function FloatingDockMobile({ items }: { items: DockItem[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <AnimatePresence>
        {open && (
          <motion.div className="absolute inset-x-0 bottom-full mb-2 flex flex-col items-center gap-2">
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { delay: idx * 0.05 } }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-label={item.title}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 shadow-md dark:bg-neutral-900"
                >
                  <div className="h-4 w-4 text-neutral-600 dark:text-neutral-300">{item.icon}</div>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close navigation" : "Open navigation"}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 shadow-lg dark:bg-neutral-900"
      >
        {open ? (
          <X className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
        ) : (
          <Menu className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
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
        <IconContainer key={item.title} mouseX={mouseX} item={item} />
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
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 2, x: "-50%" }}
            className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
          >
            {item.title}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        style={{ width: iconSize, height: iconSize }}
        className="flex items-center justify-center text-neutral-600 dark:text-neutral-300"
      >
        {item.icon}
      </motion.div>
    </motion.div>
  )

  return item.onClick ? (
    <button onClick={item.onClick} aria-label={item.title}>
      {bubble}
    </button>
  ) : (
    <a href={item.href} aria-label={item.title}>
      {bubble}
    </a>
  )
}
