"use client"

import { createContext, useContext, useEffect, useState, type ReactNode, type MouseEvent } from "react"
import { flushSync } from "react-dom"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

interface ThemeContextType {
  theme: "light" | "dark"
  toggleTheme: (e?: MouseEvent) => void
  isDarkMode: boolean
}

/* Soft, quiet blip — Web Audio, no asset. Created inside the click gesture so autoplay policy allows it. */
const playToggleSound = () => {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain).connect(ctx.destination)
    osc.type = "sine"
    osc.frequency.setValueAtTime(660, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12)
    gain.gain.setValueAtTime(0.05, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15)
    osc.start()
    osc.stop(ctx.currentTime + 0.15)
    osc.onended = () => ctx.close()
  } catch {}
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children, ...props }: ThemeProviderProps & { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  // Read persisted choice on mount
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark") || "dark"
    setTheme(saved)
    document.documentElement.classList.toggle("dark", saved === "dark")
  }, [])

  const applyTheme = (next: "light" | "dark") => {
    localStorage.setItem("theme", next)
    document.documentElement.classList.toggle("dark", next === "dark")
    setTheme(next)
  }

  const toggleTheme = (e?: MouseEvent) => {
    const next = theme === "light" ? "dark" : "light"

    navigator.vibrate?.(10)
    playToggleSound()

    const startViewTransition = (document as any).startViewTransition?.bind(document)
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!startViewTransition || reducedMotion) {
      applyTheme(next)
      return
    }

    // Radial reveal from the click point (fallback: top-right, where the toggle lives)
    const x = e?.clientX ?? window.innerWidth - 40
    const y = e?.clientY ?? 40
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

    const transition = startViewTransition(() => flushSync(() => applyTheme(next)))
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 600, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
        )
      })
      .catch(() => {}) // aborted transition (e.g. hidden tab) — theme is applied either way
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
