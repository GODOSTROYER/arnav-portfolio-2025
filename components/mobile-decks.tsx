"use client"

/* /dev mobile centerpiece: the vertical timelines re-imagined as horizontal
   swipe decks (Apple Cards Carousel pattern — native overflow-x + scroll-snap,
   deliberately NOT scroll-jacked, so the browser's touch physics stay intact).

   - Animated tabs (Experience | Projects | Certs) with a sliding pill.
   - Tall snap-center cards; tap a card and it morphs (framer layoutId) into a
     full-screen detail sheet with the complete bullet list and links.
   - Under the deck, the site's tracing beam — same cyan→violet→purple palette,
     same head/tail/direction physics as the desktop timelines, rotated 90°:
     the head springs after swipe progress, magnetically snaps to the active
     card, and that card's icon chip blooms under the gold/magenta glow.
   - Certs tab: auto-cycling card stack (tap to advance).

   Data is imported from main-content-section — one content source for both
   layouts. Rendered only on the /dev route at mobile widths. */

import { AnimatePresence, motion } from "framer-motion"
import { Award, Briefcase, ChevronRight, ExternalLink, Github, X, type LucideIcon } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { certifications, experiences, projects, timelineColors } from "./main-content-section"

/* beam physics — 1D siblings of the desktop constants */
const K = 180
const C = 24
const TAIL_X = 90 // px beam length on the rail
const DIR_EASE = 3.5
const DIR_MIN_V = 30 // px/s along the rail
const CAPTURE = 0.35 // card-units: magnet range around a card's rail position

/* head leads the direction of travel, bright cyan at the leading edge */
const GRAD_RIGHT =
  "linear-gradient(to left, rgba(24,204,252,0) 0%, #18CCFC 5%, #6344F5 34%, rgba(174,72,255,0) 100%)"
const GRAD_LEFT =
  "linear-gradient(to right, rgba(24,204,252,0) 0%, #18CCFC 5%, #6344F5 34%, rgba(174,72,255,0) 100%)"

type DeckItem = {
  key: string
  icon: LucideIcon
  color: string
  title: string
  sub?: string
  period: string
  bullets: string[]
  chips: string[]
  github?: string
  live?: string
}

const expItems: DeckItem[] = experiences.map((e, i) => ({
  key: `e${i}`,
  icon: Briefcase,
  color: timelineColors[i % timelineColors.length],
  title: e.title,
  sub: e.company,
  period: e.period,
  bullets: e.bullets,
  chips: [],
}))

const projItems: DeckItem[] = projects.map((p, i) => ({
  key: `p${i}`,
  icon: p.icon,
  color: timelineColors[i % timelineColors.length],
  title: p.name,
  period: p.period,
  bullets: p.highlight,
  chips: p.team.split("·").map((s) => s.trim()),
  github: p.github,
  live: p.live,
}))

const TABS = [
  { key: "experience", label: "Experience", subtitle: "Swipe the deck · tap a card for the full story" },
  { key: "projects", label: "Projects", subtitle: "Swipe the deck · tap a card for the full story" },
  { key: "certs", label: "Certs", subtitle: "Tap the stack to flip through" },
] as const

type TabKey = (typeof TABS)[number]["key"]

export default function MobileDecks() {
  const [tab, setTab] = useState<TabKey>("experience")
  const [expanded, setExpanded] = useState<DeckItem | null>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const open = useCallback((item: DeckItem) => {
    openerRef.current = document.activeElement as HTMLElement | null
    setExpanded(item)
  }, [])
  const close = useCallback(() => {
    setExpanded(null)
    openerRef.current?.focus?.()
  }, [])

  /* while the detail sheet is open: lock page scroll, close on Escape,
     move focus into the dialog */
  useEffect(() => {
    if (!expanded) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    window.addEventListener("keydown", onKey)
    closeRef.current?.focus()
    return () => {
      document.documentElement.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [expanded, close])

  const items = tab === "experience" ? expItems : tab === "projects" ? projItems : null
  const activeTab = TABS.find((t) => t.key === tab)!

  return (
    <section id="work" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-24 pt-14">
      <div className="mb-6 px-6 text-center">
        <h2 className="section-heading text-2xl text-gray-900 dark:text-white transition-colors duration-300">Work</h2>
        <p className="small-text mt-1 text-sm text-gray-500 dark:text-gray-400">{activeTab.subtitle}</p>
      </div>

      {/* animated tabs — sliding pill */}
      <div
        role="tablist"
        aria-label="Work categories"
        className="mx-auto mb-6 flex w-fit rounded-full border border-gray-200 bg-white/80 p-1 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80"
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className="relative rounded-full px-4 py-2.5 text-sm font-semibold"
          >
            {tab === t.key && (
              <motion.span
                layoutId="dev-tab-pill"
                className="absolute left-0 top-0 h-full w-full rounded-full bg-gray-900 dark:bg-white"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className={`relative z-10 transition-colors duration-200 ${tab === t.key ? "text-white dark:text-black" : "text-gray-600 dark:text-gray-300"}`}>
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {items ? <Deck key={tab} items={items} onOpen={open} /> : <CertStack />}

      {/* full-screen detail sheet */}
      <AnimatePresence>
        {expanded && (
          <motion.div className="fixed left-0 top-0 z-[100] h-full w-full" initial={false}>
            <motion.div
              className="absolute left-0 top-0 h-full w-full bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
            <motion.div
              layoutId={`devcard-${expanded.key}`}
              role="dialog"
              aria-modal="true"
              aria-label={`${expanded.title} — details`}
              className="absolute bottom-0 left-0 flex max-h-[94svh] min-h-[70svh] w-full flex-col overflow-hidden rounded-t-3xl border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950"
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <div className="flex items-center justify-between p-5 pb-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${expanded.color} shadow-lg`}>
                  <expanded.icon className="h-6 w-6 text-white" />
                </div>
                <button
                  ref={closeRef}
                  onClick={close}
                  aria-label="Close details"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 pb-10">
                <span className="small-text text-xs text-gray-500 dark:text-gray-400">{expanded.period}</span>
                <h3 className="card-title mt-1 text-2xl text-gray-900 dark:text-white">{expanded.title}</h3>
                {expanded.sub && (
                  <p className="mt-1 font-semibold text-blue-600 dark:text-blue-400">{expanded.sub}</p>
                )}
                {expanded.chips.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {expanded.chips.map((chip) => (
                      <span key={chip} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
                <ul className="mt-5 space-y-3">
                  {expanded.bullets.map((b, i) => (
                    <li key={i} className="flex items-start text-gray-700 dark:text-gray-300">
                      <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-gray-400 dark:bg-gray-500" />
                      <span className="body-text text-[15px]">{b}</span>
                    </li>
                  ))}
                </ul>
                {(expanded.github || expanded.live) && (
                  <div className="mt-6 flex gap-3">
                    {expanded.github && (
                      <a
                        href={expanded.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-200"
                      >
                        <Github className="h-4 w-4" /> View Code
                      </a>
                    )}
                    {expanded.live && (
                      <a
                        href={expanded.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                      >
                        <ExternalLink className="h-4 w-4" /> Live Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Deck({ items, onOpen }: { items: DeckItem[]; onOpen: (item: DeckItem) => void }) {
  const deckRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const beamRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)

  /* the horizontal tracing beam + active-card bloom */
  useEffect(() => {
    const deck = deckRef.current
    const rail = railRef.current
    const beam = beamRef.current
    if (!deck || !rail || !beam) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let head = 0
    let headV = 0
    let tail = 0
    let dir = 0
    let raf = 0
    let running = false
    let lastNow = 0
    let idleFrames = 0

    const nodes = () => deck.querySelectorAll<HTMLElement>("[data-deck-node]")

    const clearBlooms = () => {
      nodes().forEach((n) => {
        n.style.removeProperty("scale")
        n.style.filter = ""
        n.style.boxShadow = ""
      })
    }

    const tick = (now: number) => {
      try {
        const dt = Math.min(0.05, lastNow ? (now - lastNow) / 1000 : 0.016)
        lastNow = now
        const max = deck.scrollWidth - deck.clientWidth
        const railW = rail.clientWidth
        const n = items.length
        const progress = max > 0 ? deck.scrollLeft / max : 0
        const idxF = progress * (n - 1) // position in card units

        /* head target: swipe progress on the rail, magnetized to the nearest card */
        let target = progress * railW
        let merge = 0
        const nearest = Math.round(idxF)
        if (countRef.current) {
          const label = `${Math.min(n, Math.max(1, nearest + 1))} / ${n}`
          if (countRef.current.textContent !== label) countRef.current.textContent = label
        }
        const d = Math.abs(idxF - nearest)
        if (d < CAPTURE && n > 1) {
          const pull = Math.pow(1 - d / CAPTURE, 1.35)
          target += ((nearest / (n - 1)) * railW - target) * pull
          merge = pull
        }

        /* same spring + directional tail as the vertical beam */
        headV += (target - head) * K * dt
        headV *= Math.max(0, 1 - C * dt)
        head += headV * dt
        if (Math.abs(headV) > DIR_MIN_V) {
          dir += (Math.sign(headV) - dir) * Math.min(1, DIR_EASE * dt)
        }
        tail += (head - dir * TAIL_X - tail) * Math.min(1, 5 * dt)
        tail = Math.min(Math.max(tail, head - TAIL_X), head + TAIL_X)

        const hx = Math.min(Math.max(head, 0), railW)
        const tx = Math.min(Math.max(tail, 0), railW)
        const left = Math.min(hx, tx)
        const w = Math.max(10, Math.abs(hx - tx))
        beam.style.transform = `translate3d(${left}px, 0, 0)`
        beam.style.width = `${Math.round(w)}px`
        beam.style.background = head >= tail ? GRAD_RIGHT : GRAD_LEFT

        /* active-card bloom — the desktop node glow, per icon chip */
        nodes().forEach((el, i) => {
          const g = Math.exp(-((i - idxF) ** 2) / 0.32)
          const f = Math.min(1, g * (0.55 + merge * 0.6))
          if (f > 0.04) {
            el.style.setProperty("scale", (1 + 0.22 * f).toFixed(3))
            el.style.filter = `brightness(${(1 + 0.45 * f).toFixed(3)}) saturate(${(1 + 0.45 * f).toFixed(3)})`
            el.style.boxShadow = `0 0 ${Math.round(26 * f)}px ${Math.round(7 * f)}px rgba(253, 224, 71, ${(0.38 * f).toFixed(3)}), 0 0 ${Math.round(52 * f)}px ${Math.round(16 * f)}px rgba(217, 70, 239, ${(0.24 * f).toFixed(3)})`
          } else {
            el.style.removeProperty("scale")
            el.style.filter = ""
            el.style.boxShadow = ""
          }
        })

        idleFrames = Math.abs(headV) < 2 && Math.abs(target - head) < 0.5 ? idleFrames + 1 : 0
      } catch {
        running = false
        return
      }
      if (idleFrames < 30) {
        raf = requestAnimationFrame(tick)
      } else {
        running = false
      }
    }

    const wake = () => {
      if (!running) {
        running = true
        lastNow = 0
        idleFrames = 0
        raf = requestAnimationFrame(tick)
      }
    }
    deck.addEventListener("scroll", wake, { passive: true })
    window.addEventListener("resize", wake)
    wake()

    return () => {
      cancelAnimationFrame(raf)
      deck.removeEventListener("scroll", wake)
      window.removeEventListener("resize", wake)
      clearBlooms()
    }
  }, [items])

  return (
    <div>
      <div
        ref={deckRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-[11vw] pb-2 pt-2"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items.map((it) => (
          <motion.div
            key={it.key}
            layoutId={`devcard-${it.key}`}
            data-deck-card
            role="button"
            tabIndex={0}
            aria-label={`${it.title} — open details`}
            onClick={() => onOpen(it)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onOpen(it)
              }
            }}
            className="relative flex h-[54svh] w-[78vw] max-w-[340px] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-gray-200/70 bg-white/85 p-5 shadow-lg backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6344F5] dark:border-gray-800 dark:bg-gray-900/85"
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            <div data-deck-node className={`flex h-12 w-12 items-center justify-center rounded-full ${it.color} shadow-lg`}>
              <it.icon className="h-6 w-6 text-white" />
            </div>
            <span className="small-text mt-4 text-xs text-gray-500 dark:text-gray-400">{it.period}</span>
            <h3 className="card-title mt-1 text-xl leading-snug text-gray-900 dark:text-white line-clamp-2">{it.title}</h3>
            {it.sub && <p className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400 line-clamp-1">{it.sub}</p>}
            {it.chips.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {it.chips.slice(0, 3).map((chip) => (
                  <span key={chip} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {chip}
                  </span>
                ))}
              </div>
            )}
            <p className="body-text mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-5">{it.bullets[0]}</p>
            <div className="mt-auto flex items-center justify-between pt-3">
              <span className="small-text inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                Tap for details <ChevronRight className="h-3.5 w-3.5" />
              </span>
              {/* real links — they looked tappable, so they are */}
              <span className="flex gap-1 text-gray-400 dark:text-gray-500">
                {it.github && (
                  <a
                    href={it.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${it.title} on GitHub`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {it.live && (
                  <a
                    href={it.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${it.title} live demo`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* the beam's rail + card counter — narrow enough to clear the dock */}
      <div className="mx-auto mt-5 flex w-[70%] max-w-[280px] items-center gap-3">
        <div ref={railRef} className="relative h-0.5 flex-1">
          <div className="absolute left-0 top-0 h-full w-full rounded-full bg-gray-200 dark:bg-gray-700" />
          <div ref={beamRef} className="absolute left-0 top-0 h-full rounded-full" style={{ width: 0, background: GRAD_RIGHT, willChange: "transform, width" }} />
        </div>
        <span ref={countRef} aria-hidden className="small-text w-8 text-right text-xs tabular-nums text-gray-500 dark:text-gray-400">
          1 / {items.length}
        </span>
      </div>
    </div>
  )
}

function CertStack() {
  const [top, setTop] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = certifications.length

  /* auto-cycles until the visitor takes control — first tap pauses it for good */
  useEffect(() => {
    if (paused) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = setInterval(() => setTop((v) => (v + 1) % n), 3200)
    return () => clearInterval(t)
  }, [n, paused])

  const advance = () => {
    setPaused(true)
    setTop((v) => (v + 1) % n)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Certifications, ${top + 1} of ${n}. Activate to show the next one.`}
      onClick={advance}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          advance()
        }
      }}
      className="relative mx-auto flex h-[42svh] w-full max-w-[360px] items-center justify-center rounded-3xl px-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6344F5]"
    >
      {certifications.map((cert, i) => {
        const pos = (i - top + n) % n
        const visible = pos < 3
        return (
          <motion.div
            key={cert}
            className="absolute flex h-[180px] w-[78vw] max-w-[330px] flex-col justify-between rounded-2xl border border-gray-200/70 bg-white/90 p-5 shadow-lg backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/90"
            animate={{
              y: pos * 16,
              scale: 1 - pos * 0.06,
              opacity: visible ? 1 - pos * 0.18 : 0,
              zIndex: n - pos,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            style={{ transformOrigin: "top center" }}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#18CCFC] to-[#6344F5] shadow-lg">
                <Award className="h-5 w-5 text-white" />
              </span>
              <span className="small-text text-xs text-gray-500 dark:text-gray-400">
                {i + 1} / {n} · tap to cycle
              </span>
            </div>
            <p className="body-text text-[15px] font-semibold leading-snug text-gray-900 dark:text-white">{cert}</p>
          </motion.div>
        )
      })}
    </div>
  )
}
