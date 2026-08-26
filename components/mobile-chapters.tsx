"use client"

/* /dev mobile story-mode: tags the page's sections as snap chapters
   (html.dev-snap + [data-chapter], CSS-gated to mobile widths) and renders a
   right-edge progress rail — one dot per chapter, the active one stretched
   into a beam-palette pill. Tap a dot to jump. */

import { useEffect, useState } from "react"

const CHAPTERS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "technologies", label: "Technologies" },
  { id: "contact", label: "Connect" },
  { id: "resume", label: "Resume" },
  { id: "signature", label: "Signature" },
]

export default function MobileChapters() {
  const [active, setActive] = useState("home")

  useEffect(() => {
    document.documentElement.classList.add("dev-snap")
    const tagged: HTMLElement[] = []
    CHAPTERS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) {
        el.setAttribute("data-chapter", "")
        tagged.push(el)
      }
    })

    /* active = the chapter crossing the viewport's middle band */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    )
    tagged.forEach((el) => io.observe(el))

    return () => {
      io.disconnect()
      tagged.forEach((el) => el.removeAttribute("data-chapter"))
      document.documentElement.classList.remove("dev-snap")
    }
  }, [])

  const jump = (id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
  }

  return (
    <nav aria-label="Chapters" className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center">
      {/* each dot is an 8px mark inside a 44px touch target */}
      {CHAPTERS.map(({ id, label }) => (
        <button
          key={id}
          aria-label={label}
          aria-current={active === id ? "true" : undefined}
          onClick={() => jump(id)}
          className="flex h-11 w-11 items-center justify-center"
        >
          <span
            className={`rounded-full transition-all duration-300 ${
              active === id
                ? "h-5 w-2 bg-gradient-to-b from-[#18CCFC] to-[#6344F5] shadow-[0_0_8px_rgba(99,68,245,0.8)]"
                : "h-2 w-2 bg-gray-400/50 dark:bg-gray-600/60"
            }`}
          />
        </button>
      ))}
    </nav>
  )
}
