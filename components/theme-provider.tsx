"use client"

import { createContext, useContext, useState, type ReactNode, type MouseEvent } from "react"
import { flushSync } from "react-dom"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

interface ThemeContextType {
  theme: "light" | "dark"
  toggleTheme: (e?: MouseEvent) => void
  isDarkMode: boolean
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children, ...props }: ThemeProviderProps & { children: ReactNode }) {
  // Lazy init from the persisted choice so the first client render matches the applied theme.
  // (next-themes' pre-paint script has already set the class on <html> from the same key.)
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof window === "undefined" ? "dark" : (localStorage.getItem("theme") as "light" | "dark") || "dark",
  )

  const applyTheme = (next: "light" | "dark") => {
    localStorage.setItem("theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
    setTheme(next)
  }

  const toggleTheme = (e?: MouseEvent) => {
    const next = theme === "light" ? "dark" : "light"

    navigator.vibrate?.(10)

    const startViewTransition = (document as any).startViewTransition?.bind(document)
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!startViewTransition || reducedMotion) {
      applyTheme(next)
      return
    }

    // Reveal origin: center of the pressed button. Keyboard/synthetic clicks report
    // clientX/Y as 0,0 (top-left corner), so the element rect is the reliable source.
    // A zero-area rect (mid-layout measure) would anchor the circle at the top-left
    // corner, so require a real box before trusting it; tap coordinates are the fallback.
    const rect = (e?.currentTarget as HTMLElement | undefined)?.getBoundingClientRect?.()
    const hasRect = !!rect && (rect.width > 0 || rect.height > 0)
    // Viewport numbers can read 0 or stale in webviews/background tabs — screen.* never
    // does. An oversized radius is harmless; an undersized one truncates the sweep.
    const w = Math.max(window.innerWidth, document.documentElement.clientWidth || 0, screen.width || 0)
    const h = Math.max(window.innerHeight, document.documentElement.clientHeight || 0, screen.height || 0)
    const x = hasRect ? rect.left + rect.width / 2 : (e?.clientX || w - 40)
    const y = hasRect ? rect.top + rect.height / 2 : (e?.clientY || 40)
    const radius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y))

    // Global `transition: background-color …` rules keep repainting inside the live new
    // snapshot and muddy the reveal — suspend them for the duration of the transition.
    document.documentElement.classList.add("theme-transitioning")
    const transition = startViewTransition(() => flushSync(() => applyTheme(next)))
    transition.ready
      .then(() => {
        // ease-in-out: the circle visibly *births* at the button, sweeps, and lands —
        // a strong ease-out covers 30% of the screen in the first frames, which reads
        // as "started from nowhere", then crawls, which reads as "stalled then snapped"
        const anim = document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 700, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
        )
        return anim.finished // keep the view transition alive until the sweep completes
      })
      .catch(() => {}) // aborted transition (e.g. hidden tab) — theme is applied either way
    transition.finished.finally(() => document.documentElement.classList.remove("theme-transitioning"))
  }

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    isDarkMode: theme === "dark",
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <NextThemesProvider attribute="class" value={{ light: "light", dark: "dark" }} {...props}>
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}
