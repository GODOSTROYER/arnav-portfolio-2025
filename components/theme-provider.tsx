"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

interface ThemeContextType {
  theme: "light" | "dark"
  toggleTheme: () => void
  isDarkMode: boolean
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children, ...props }: ThemeProviderProps & { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  // Read persisted choice on mount
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark") || "light"
    setTheme(saved)
    document.documentElement.classList.toggle("dark", saved === "dark")
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light"
      localStorage.setItem("theme", next)
      document.documentElement.classList.toggle("dark", next === "dark")
      return next
    })
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
