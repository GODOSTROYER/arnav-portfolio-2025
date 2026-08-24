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
    // Exact layout-viewport size: an oversized radius (e.g. from screen.*) makes the
    // visible sweep finish before the animation does, an undersized one truncates it.
    const de = document.documentElement
    const w = de.clientWidth || window.innerWidth || screen.width
    const h = de.clientHeight || window.innerHeight || screen.height
    const x = hasRect ? rect.left + rect.width / 2 : (e?.clientX || w - 40)
    const y = hasRect ? rect.top + rect.height / 2 : (e?.clientY || 40)
    const radius = Math.hypot(Math.max(x, w - x), Math.max(y, h - y))

    // The sweep runs as a CSS keyframe animation on ::view-transition-new(root) (see
    // globals.css), parameterized via custom properties. A CSS animation on the pseudo
    // is first-class to the transition machinery — the snapshot cannot be torn down
    // early, which happened on mobile with a JS-driven (WAAPI) animation.
    de.style.setProperty("--reveal-x", `${x}px`)
    de.style.setProperty("--reveal-y", `${y}px`)
    de.style.setProperty("--reveal-r", `${radius}px`)
    // Global `transition: background-color …` rules keep repainting inside the live new
    // snapshot and muddy the reveal — suspend them for the duration of the transition.
    de.classList.add("theme-transitioning")
    const transition = startViewTransition(() => flushSync(() => applyTheme(next)))
    transition.finished.finally(() => de.classList.remove("theme-transitioning"))
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
