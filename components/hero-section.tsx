"use client"

import { motion, useTransform, useSpring, type MotionValue, cubicBezier } from "framer-motion"
import { useEffect, useState, useRef, useMemo } from "react"
import HeroGrid from "./hero-grid"

interface HeroSectionProps {
  scrollYProgress: MotionValue<number>
}

const textLines = ["Welcome to", "Arnav's Portfolio."]

function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const easeCubic = cubicBezier(0.25, 0.1, 0.25, 1)

export default function HeroSection({ scrollYProgress }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [showFlyingLetters, setShowFlyingLetters] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile viewport (below Tailwind md breakpoint)
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches)
    handleChange(mql) // set initial value
    mql.addEventListener('change', handleChange as (e: MediaQueryListEvent) => void)
    return () => mql.removeEventListener('change', handleChange as (e: MediaQueryListEvent) => void)
  }, [])

  // Enhanced smooth scrolling with better easing
  const smoothScrollY = useSpring(scrollYProgress, {
    damping: 50, // Increased damping for smoother deceleration
    stiffness: 100, // Reduced stiffness for less abrupt changes
    mass: 0.5, // Reduced mass for more responsive feel
    restDelta: 0.001, // Smaller rest delta for smoother final positioning
  })

  // Refs for scramble text
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)

  // All per-letter random values are generated ONCE — regenerating them every render
  // re-randomized the drift/tilt mid-animation on each state flip
  const allLetters = useMemo(() => {
    const letters: Array<{
      letter: string
      id: string
      baseSpeed: number
      tiltAngle: number
      xDrift: [number, number, number]
    }> = []
    let globalIndex = 0
    textLines.forEach((line, rowIndex) => {
      line.split("").forEach((letter, letterIndex) => {
        if (letter !== " ") {
          letters.push({
            letter,
            id: `${rowIndex}-${letterIndex}-${globalIndex}`,
            baseSpeed:
              rowIndex === 0
                ? 1.2 + Math.random() * 2.8 // Reduced speed variation for smoother animation
                : 2.0 + Math.random() * 3.0, // More controlled speed range
            tiltAngle: (Math.random() - 0.5) * 30, // Reduced tilt for smoother motion
            xDrift: [(Math.random() - 0.5) * 39, (Math.random() - 0.5) * 78, (Math.random() - 0.5) * 104],
          })
        }
        globalIndex++
      })
    })
    return letters
  }, [])

  // Enhanced flying letters with smoother distribution
  const emergingLettersData = useMemo(() => {
    const base = "creativityismycraft"
    const flyingCount = 45 // Reduced count for better performance
    let lettersArr: string[] = []
    while (lettersArr.length < flyingCount) {
      lettersArr = lettersArr.concat(shuffleArray(base.split("")))
    }
    lettersArr = lettersArr.slice(0, flyingCount)
    return lettersArr.map((letter, index) => ({
      letter,
      id: `emerging-${index}`,
      randomDelay: Math.random() * 0.15, // Reduced delay range for smoother staggering
      speed: 0.8 + Math.random() * 1.2, // More controlled speed range
      x: 10 + Math.random() * 80, // Better distribution
      tiltAngle: (Math.random() - 0.5) * 32.5, // Increased tilt (+30%)
      xDrift: (Math.random() - 0.5) * 195, // Horizontal movement (+30%)
    }))
  }, [])

  /* Hooks inside .map are safe here by construction: both arrays are memoized with
     [] deps and have a fixed length derived from constant text, so the hook count
     and order are identical on every render. */
  /* eslint-disable react-hooks/rules-of-hooks */
  const letterTransforms = allLetters.map((letterInfo) => {
    return {
      y: useTransform(
        smoothScrollY,
        [0, 0.2, 0.5, 0.8], // Extended range for smoother progression
        [0, -65 * letterInfo.baseSpeed, -260 * letterInfo.baseSpeed, -455 * letterInfo.baseSpeed],
        { ease: easeCubic, clamp: false },
      ),
      x: useTransform(
        smoothScrollY,
        [0, 0.2, 0.5, 0.8],
        [0, letterInfo.xDrift[0], letterInfo.xDrift[1], letterInfo.xDrift[2]],
        { ease: easeCubic, clamp: false },
      ),
      rotate: useTransform(
        smoothScrollY,
        [0, 0.1, 0.3, 0.6, 0.8], // More control points for smoother rotation
        [0, letterInfo.tiltAngle * 0.26, letterInfo.tiltAngle * 0.78, letterInfo.tiltAngle * 1.3, letterInfo.tiltAngle * 0.13],
        { ease: easeCubic, clamp: false },
      ),
      opacity: useTransform(
        smoothScrollY,
        [0, 0.7, 0.85, 1],
        [1, 1, 0.8, 0], // Gradual fade out instead of abrupt disappearance
        { ease: easeCubic, clamp: false },
      ),
    }
  })

  // Create all useTransform hooks for emerging letters at the top level
  const emergingLetterTransforms = emergingLettersData.map((data) => {
    return {
      y: useTransform(
        smoothScrollY,
        [data.randomDelay, data.randomDelay + 0.1],
        [120, -520 * data.speed], // Start from below viewport, move far up (+30%)
        { ease: easeCubic, clamp: false },
      ),
      x: useTransform(
        smoothScrollY,
        [data.randomDelay, data.randomDelay + 0.4],
        [0, data.xDrift],
        { ease: easeCubic, clamp: false },
      ),
      rotate: useTransform(
        smoothScrollY,
        [data.randomDelay, data.randomDelay + 0.2, data.randomDelay + 0.4],
        [0, data.tiltAngle, 0],
        { ease: easeCubic, clamp: false },
      ),
      opacity: useTransform(
        smoothScrollY,
        [data.randomDelay, data.randomDelay + 0.05, data.randomDelay + 0.35, data.randomDelay + 0.4],
        [0, 1, 1, 0],
        { ease: easeCubic, clamp: false },
      ),
    }
  })
  /* eslint-enable react-hooks/rules-of-hooks */

  useEffect(() => {
    setMounted(true)

    // Enhanced text animation with smoother timing
    const animateText = () => {
      let completed = 0
      const onComplete = () => {
        completed++
        if (completed === 2) {
          // Delay the flying letters for smoother transition
          setTimeout(() => setShowFlyingLetters(true), 200)
        }
      }

      // Animate first line with smoother timing
      if (line1Ref.current) {
        line1Ref.current.textContent = "Welcome to"
        setTimeout(onComplete, 800) // Slightly faster for better flow
      }

      // Animate second line
      if (line2Ref.current) {
        setTimeout(() => {
          if (line2Ref.current) {
            line2Ref.current.textContent = "Arnav's Portfolio."
            setTimeout(onComplete, 800)
          }
        }, 400) // Reduced delay for smoother sequence
      }
    }

    animateText()
  }, [])

  const renderAnimatedText = () => {
    let letterIndex = 0

    // Helper to render a single character span with its scroll-linked animation
    const renderChar = (char: string, fontClass: string) => {
      const currentLetterData = allLetters[letterIndex]
      const transforms = letterTransforms[letterIndex]
      letterIndex++

      return (
        <motion.span
          key={currentLetterData.id}
          style={{
            y: transforms.y,
            x: transforms.x,
            rotate: transforms.rotate,
            opacity: transforms.opacity,
            zIndex: 10 + letterIndex,
            willChange: "transform, opacity",
          }}
          className={`inline-block hero-text ${fontClass} leading-none text-black dark:text-white`}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 120,
            mass: 0.8,
          }}
        >
          {char}
        </motion.span>
      )
    }

    // ── Desktop: current line-per-row layout (unchanged) ──
    if (!isMobile) {
      return textLines.map((line, rowIndex) => (
        <div key={rowIndex} className="flex justify-start items-start flex-wrap text-left">
          {line.split("").map((char, charIndex) => {
            if (char === " ") {
              return <span key={`space-${rowIndex}-${charIndex}`} className="inline-block w-4 md:w-6 lg:w-8" />
            }
            return renderChar(char, "text-[4.5rem] md:text-[7.2rem] lg:text-[9.6rem]")
          })}
        </div>
      ))
    }

    // ── Mobile: one word per row ── (renderChar advances letterIndex itself;
    // spaces are excluded from allLetters, so words map 1:1 onto the letter data)
    const allWords = textLines.flatMap(line => line.split(" "))

    return allWords.map((word, wordIndex) => (
      <div key={`word-${wordIndex}`} className="flex justify-start items-start text-left">
        {word.split("").map((char) => renderChar(char, "hero-text-mobile md:text-[7.2rem] lg:text-[9.6rem]"))}
      </div>
    ))
  }

  // Scroll lazy load trigger
  const isInViewport = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    return rect.top >= 0 && rect.bottom <= window.innerHeight
  }

  useEffect(() => {
    const handleScroll = () => {
      if (line1Ref.current && isInViewport(line1Ref.current)) {
        setShowFlyingLetters(true)
        window.removeEventListener("scroll", handleScroll) // one-shot — no rect reads after it fires
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (!mounted) {
    return (
      <section className="min-h-screen flex items-end justify-start pb-32 pt-20 scroll-section transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-left space-y-4">
            {/* SSR fallback — hidden on mobile via md:block, mobile gets word-per-line below */}
            <div className="hidden md:block">
              <h1 className="hero-text md:text-[7.2rem] lg:text-[9.6rem] text-black dark:text-white leading-none transition-colors duration-300">
                Welcome to
              </h1>
              <h1 className="hero-text md:text-[7.2rem] lg:text-[9.6rem] text-black dark:text-white leading-none transition-colors duration-300">
                Arnav{"'"}{"s"} Portfolio.
              </h1>
            </div>
            {/* Mobile fallback — one word per line */}
            <div className="block md:hidden">
              {["Welcome", "to", "Arnav's", "Portfolio."].map((word) => (
                <h1 key={word} className="hero-text hero-text-mobile text-black dark:text-white leading-none transition-colors duration-300">
                  {word}
                </h1>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="home"
      className="min-h-screen flex items-end justify-start pb-32 pt-28 relative overflow-hidden scroll-section transition-colors duration-300"
    >
      <HeroGrid />
      <div className="container mx-auto px-6">
        <div className="space-y-4 relative text-left">
          {!showFlyingLetters ? (
            <>
              {/* Desktop: two-line layout */}
              <div className="hidden md:block">
                <h1 className="hero-text md:text-[7.2rem] lg:text-[9.6rem] leading-none text-black dark:text-white transition-colors duration-300">
                  <span ref={isMobile ? undefined : line1Ref}>Welcome to</span>
                </h1>
                <h1 className="hero-text md:text-[7.2rem] lg:text-[9.6rem] leading-none text-black dark:text-white transition-colors duration-300">
                  <span ref={isMobile ? undefined : line2Ref}>Arnav{"'"}s Portfolio.</span>
                </h1>
              </div>
              {/* Mobile: one word per line */}
              <div className="block md:hidden">
                <h1 className="hero-text hero-text-mobile hero-text-mobile-wrap leading-none text-black dark:text-white transition-colors duration-300">
                  <span ref={!isMobile ? undefined : line1Ref}>Welcome to</span>
                </h1>
                <h1 className="hero-text hero-text-mobile hero-text-mobile-wrap leading-none text-black dark:text-white transition-colors duration-300">
                  <span ref={!isMobile ? undefined : line2Ref}>Arnav{"'"}s Portfolio.</span>
                </h1>
              </div>
            </>
          ) : (
            renderAnimatedText()
          )}
        </div>
      </div>

      {/* Enhanced emerging letters with smoother animations */}
      <div className="absolute inset-0 pointer-events-none">
        {emergingLettersData.map((data, index) => {
          const transforms = emergingLetterTransforms[index]
          return (
            <motion.span
              key={data.id}
              style={{
                y: transforms.y,
                x: transforms.x,
                rotate: transforms.rotate,
                opacity: transforms.opacity,
                left: `${data.x}%`,
                zIndex: 5 + index,
                willChange: "transform, opacity",
              }}
              className="absolute bottom-0 hero-text hero-text-mobile md:text-[7.2rem] lg:text-[9.6rem] text-black dark:text-white leading-none transition-colors duration-300"
              // Enhanced transition for smoother motion
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 100,
                mass: 0.6,
              }}
            >
              {data.letter}
            </motion.span>
          )
        })}
      </div>

      {/* Enhanced scroll indicator with smooth fade — decorative, so it must
          never intercept taps meant for the dock button beneath it */}
      <motion.div
        data-scroll-cue
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
        className="pointer-events-none absolute bottom-8 right-8 text-black dark:text-white small-text transition-colors duration-300"
        style={{ zIndex: 60 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          Scroll ↓
        </motion.div>
      </motion.div>
    </section>
  )
}
