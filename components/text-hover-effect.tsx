"use client"

/* Signature section: elegant tagline + giant outlined name with a vibrant gradient
   that follows the cursor (adapted from ui.aceternity.com/components/text-hover-effect,
   rebuilt on framer-motion). On touch devices — no cursor — the gradient sweeps across
   the text on its own instead of lying dormant. */

import { motion } from "framer-motion"
import { useEffect, useRef, useState, type MouseEvent } from "react"

const TAGLINE = "creativity is my craft"

function TextHoverEffect({ text }: { text: string }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hovered, setHovered] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" })

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches)
  }, [])

  const onMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    setMaskPosition({
      cx: `${((e.clientX - rect.left) / rect.width) * 100}%`,
      cy: `${((e.clientY - rect.top) / rect.height) * 100}%`,
    })
  }

  const gradientActive = hovered || isTouch

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMouseMove}
      className="select-none"
    >
      <defs>
        <linearGradient id="signature-gradient" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#eab308" />
          <stop offset="25%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="75%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>

        {isTouch ? (
          /* no cursor to follow — sweep the reveal across the name on a loop */
          <motion.radialGradient
            key="touch-sweep"
            id="signature-mask-gradient"
            gradientUnits="userSpaceOnUse"
            r="35%"
            animate={{ cx: ["15%", "85%", "15%"], cy: "50%" }}
            transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </motion.radialGradient>
        ) : (
          <motion.radialGradient
            key="cursor-follow"
            id="signature-mask-gradient"
            gradientUnits="userSpaceOnUse"
            r="22%"
            animate={maskPosition}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </motion.radialGradient>
        )}

        <mask id="signature-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#signature-mask-gradient)" />
        </mask>
      </defs>

      {/* faint permanent outline, brightens slightly under the cursor */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.4"
        className="fill-transparent stroke-neutral-300 font-poppins text-6xl font-extrabold dark:stroke-neutral-800"
        style={{ opacity: hovered ? 0.9 : 0.5, transition: "opacity 0.3s" }}
      >
        {text}
      </text>

      {/* one-time draw-in of the outline when it scrolls into view */}
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.4"
        className="fill-transparent stroke-neutral-400 font-poppins text-6xl font-extrabold dark:stroke-neutral-700"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        whileInView={{ strokeDashoffset: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 3.5, ease: "easeInOut" }}
      >
        {text}
      </motion.text>

      {/* vibrant gradient copy, revealed through the cursor / sweep mask */}
      {gradientActive && (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          stroke="url(#signature-gradient)"
          strokeWidth="0.5"
          mask="url(#signature-mask)"
          className="fill-transparent font-poppins text-6xl font-extrabold"
        >
          {text}
        </text>
      )}
    </svg>
  )
}

export default function SignatureSection() {
  return (
    <section id="signature" className="py-16 transition-colors duration-300">
      <div className="container mx-auto px-6">
        {/* tagline: staggered letter fade-up on scroll into view */}
        <motion.p
          className="mb-2 text-center text-sm uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.035 }}
        >
          {TAGLINE.split("").map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
              }}
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </motion.p>

        <div className="h-40 md:h-56">
          <TextHoverEffect text="ARNAV" />
        </div>
      </div>
    </section>
  )
}
