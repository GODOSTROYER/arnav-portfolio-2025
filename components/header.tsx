"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

const NAME = "Arnav Bule"
const NAV  = ["Home", "About", "Technologies", "Connect", "Resume"]

/* helper: split a label into spans for fine hover animation (optional) */
const spanify = (txt: string) =>
  txt.split("").map((c, i) =>
    c === " " ? <span key={`sp${i}`}>&nbsp;</span> : <span key={i}>{c}</span>
  )

export default function Header() {
  const { isDarkMode, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Trigger effect after scrolling past the hero section (assume hero is 100vh)
      setIsScrolled(window.scrollY > window.innerHeight - 80)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      id="site-header"
      className={`fixed top-0 left-0 right-0 z-50 h-16 flex transition-all duration-500
        ${isScrolled
          ? "backdrop-blur-xl bg-white/40 dark:bg-black/40 border-b border-white/30 dark:border-zinc-800/60 shadow-lg"
          : "bg-transparent border-b-0 shadow-none"}
      `}
      style={{
        WebkitBackdropFilter: isScrolled ? "blur(24px)" : undefined,
        backdropFilter: isScrolled ? "blur(24px)" : undefined,
        transition: "background 0.4s cubic-bezier(.4,0,.2,1), border 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.4s cubic-bezier(.4,0,.2,1)",
      }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between w-full h-full">
        {/* logo / name */}
        <motion.a
          href="#home"
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold text-gray-900 dark:text-white select-none flex items-center h-full"
        >
          {spanify(NAME)}
        </motion.a>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center space-x-8 h-full">
          {NAV.map((label) => (
            <motion.a
              key={label}
              href={`#${label.toLowerCase()}`}
              whileHover={{ scale: 1.05 }}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium select-none flex items-center h-full"
            >
              {spanify(label)}
            </motion.a>
          ))}

          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center h-10 w-10"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
        </nav>
      </div>
    </header>
  )
}
