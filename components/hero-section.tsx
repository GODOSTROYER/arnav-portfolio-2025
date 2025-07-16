"use client"

import { motion, useTransform, useVelocity, useSpring, type MotionValue, cubicBezier } from "framer-motion"
import { useEffect, useState, useRef } from "react"

interface HeroSectionProps {
  scrollYProgress: MotionValue<number>
}

const HEADER_HEIGHT = 112 // px, adjust if your header is taller/shorter

export default function HeroSection({ scrollYProgress }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false)
  const [showFlyingLetters, setShowFlyingLetters] = useState(false)
  const scrollVelocity = useVelocity(scrollYProgress)

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

  // Pre-calculate all letter data at the top level
  const textLines = ["Welcome to", "Arnav's Portfolio."]
  const allLetters: Array<{
    letter: string
    id: string
    row: number
    position: number
    baseSpeed: number
    tiltAngle: number
    originalX: number
    originalY: number
  }> = []

  let globalIndex = 0
  textLines.forEach((line, rowIndex) => {
    const lineLetters = line.split("")
    lineLetters.forEach((letter, letterIndex) => {
      if (letter !== " ") {
        const baseSpeed =
          rowIndex === 0
            ? 1.2 + Math.random() * 2.8 // Reduced speed variation for smoother animation
            : 2.0 + Math.random() * 3.0 // More controlled speed range

        allLetters.push({
          letter,
          id: `${rowIndex}-${letterIndex}-${globalIndex}`,
          row: rowIndex,
          position: letterIndex,
          baseSpeed,
          tiltAngle: (Math.random() - 0.5) * 30, // Reduced tilt for smoother motion
          originalX: 0,
          originalY: 0,
        })
      }
      globalIndex++
    })
  })

  // Enhanced flying letters with smoother distribution
  function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  const base = "creativityismycraft"
  const flyingCount = 45 // Reduced count for better performance
  let lettersArr: string[] = []
  while (lettersArr.length < flyingCount) {
    lettersArr = lettersArr.concat(shuffleArray(base.split("")))
  }
  lettersArr = lettersArr.slice(0, flyingCount)
  const emergingLettersData = lettersArr.map((letter, index) => ({
    letter,
    id: `emerging-${index}`,
    randomDelay: Math.random() * 0.15, // Reduced delay range for smoother staggering
    speed: 0.8 + Math.random() * 1.2, // More controlled speed range
    x: 10 + Math.random() * 80, // Better distribution
    tiltAngle: (Math.random() - 0.5) * 25, // Reduced tilt
  }))

  // Helper for building scroll-linked transforms with optional easing
  const easeCubic = cubicBezier(0.25, 0.1, 0.25, 1)

  const letterTransforms = allLetters.map((letterInfo) => {
    return {
      y: useTransform(
        smoothScrollY,
        [0, 0.2, 0.5, 0.8], // Extended range for smoother progression
        [0, -50 * letterInfo.baseSpeed, -200 * letterInfo.baseSpeed, -350 * letterInfo.baseSpeed],
        { ease: easeCubic, clamp: false },
      ),
      x: useTransform(
        smoothScrollY,
        [0, 0.2, 0.5, 0.8],
        [0, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 80],
        { ease: easeCubic, clamp: false },
      ),
      rotate: useTransform(
        smoothScrollY,
        [0, 0.1, 0.3, 0.6, 0.8], // More control points for smoother rotation
        [0, letterInfo.tiltAngle * 0.2, letterInfo.tiltAngle * 0.6, letterInfo.tiltAngle, letterInfo.tiltAngle * 0.1],
        { ease: easeCubic, clamp: false },
      ),
      scale: useTransform(smoothScrollY, [0, 0.8], [1, 1], { ease: easeCubic, clamp: false }),
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
        [120, -400 * data.speed], // Start from below viewport, move far up
        { ease: easeCubic, clamp: false },
      ),
      x: useTransform(
        smoothScrollY,
        [data.randomDelay, data.randomDelay + 0.4],
        [0, (Math.random() - 0.5) * 150], // Horizontal movement
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

  const [line1Transforms, setLine1Transforms] = useState<any[]>([])
  const [line2Transforms, setLine2Transforms] = useState<any[]>([])

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

    return textLines.map((line, rowIndex) => (
      <div key={rowIndex} className="flex justify-start items-start flex-wrap text-left">
        {line.split("").map((char, charIndex) => {
          if (char === " ") {
            return <span key={`space-${rowIndex}-${charIndex}`} className="inline-block w-4 md:w-6 lg:w-8" />
          }

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
                scale: transforms.scale,
                opacity: transforms.opacity,
                zIndex: 10 + letterIndex,
                // Add will-change for better performance
                willChange: "transform, opacity",
              }}
              className="inline-block hero-text text-[4.5rem] md:text-[7.2rem] lg:text-[9.6rem] leading-none text-black dark:text-white" // Ensure dark mode class is present
              // Add transition for smoother property changes
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
        })}
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
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (!mounted) {
    return (
      <section className="min-h-screen flex items-end justify-start pb-32 pt-20 scroll-section bg-white dark:bg-black transition-colors duration-300">
        <div className="container mx-auto px-6">
          <div className="text-left space-y-4">
            <h1 className="hero-text text-[4.5rem] md:text-[7.2rem] lg:text-[9.6rem] text-black dark:text-white leading-none transition-colors duration-300">
              Welcome to
            </h1>
            <h1 className="hero-text text-[4.5rem] md:text-[7.2rem] lg:text-[9.6rem] text-black dark:text-white leading-none transition-colors duration-300">
              Arnav's Portfolio.
            </h1>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="home"
      className="min-h-screen flex items-end justify-start pb-32 pt-28 relative overflow-hidden scroll-section bg-white dark:bg-black transition-colors duration-300"
    >
      <div className="container mx-auto px-6">
        <div className="space-y-4 relative text-left">
          {!showFlyingLetters ? (
            <>
              <h1 className="hero-text text-[4.5rem] md:text-[7.2rem] lg:text-[9.6rem] leading-none text-black dark:text-white transition-colors duration-300">
                <span ref={line1Ref}>Welcome to</span>
              </h1>
              <h1 className="hero-text text-[4.5rem] md:text-[7.2rem] lg:text-[9.6rem] leading-none text-black dark:text-white transition-colors duration-300">
                <span ref={line2Ref}>Arnav's Portfolio.</span>
              </h1>
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
              className="absolute bottom-0 hero-text text-[4.5rem] md:text-[7.2rem] lg:text-[9.6rem] text-black dark:text-white leading-none transition-colors duration-300"
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

      {/* Enhanced scroll indicator with smooth fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-8 right-8 text-black dark:text-white small-text transition-colors duration-300"
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
