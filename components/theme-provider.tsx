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
    const rect = (e?.currentTarget as HTMLElement | undefined)?.getBoundingClientRect?.()
    const x = rect ? rect.left + rect.width / 2 : (e?.clientX || window.innerWidth - 40)
    const y = rect ? rect.top + rect.height / 2 : (e?.clientY || 40)
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    // Global `transition: background-color …` rules keep repainting inside the live new
    // snapshot and muddy the reveal — suspend them for the duration of the transition.
    document.documentElement.classList.add("theme-transitioning")
    const transition = startViewTransition(() => flushSync(() => applyTheme(next)))
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 500, easing: "cubic-bezier(0.25, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
        )
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
