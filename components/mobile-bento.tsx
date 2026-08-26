"use client"

/* /dev mobile about: the long profile column condensed into a glanceable
   bento grid — photo, location, what's happening now, a line of intent, and
   socials. The beam palette (cyan→violet→purple) threads through as accents
   to keep the one-light identity. */

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, MapPin, Phone, Zap } from "lucide-react"
import Image from "next/image"

import { experiences } from "./main-content-section"

/* no backdrop-blur: nothing moves behind these tiles on mobile (the cursor
   aura is desktop-only), so the blur was pure GPU cost during scroll */
const tile =
  "rounded-3xl border border-gray-200/70 bg-white/95 p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900/95"

/* light mode uses deeper stops of the same hues — #18CCFC on white is ~2.2:1,
   far below even the 3:1 large-text bar; the dark: variant keeps the beam's
   exact palette where it was born */
const gradText =
  "bg-gradient-to-r from-cyan-700 via-violet-700 to-purple-700 bg-clip-text text-transparent dark:from-[#18CCFC] dark:via-[#6344F5] dark:to-[#AE48FF]"

const socials = [
  { Icon: Github, href: "https://github.com/GODOSTROYER/", label: "GitHub" },
  { Icon: Linkedin, href: "https://www.linkedin.com/in/arnavbule/", label: "LinkedIn" },
  { Icon: Mail, href: "mailto:arnav.bule05@gmail.com", label: "Email" },
  { Icon: Phone, href: "tel:+918767602012", label: "Phone" },
]

export default function MobileBento() {
  return (
    <section id="about" className="relative flex min-h-[100svh] flex-col justify-center px-4 py-14">
      <div className="mb-6 text-center">
        <h2 className="section-heading text-2xl text-gray-900 dark:text-white transition-colors duration-300">About</h2>
        <p className="small-text mt-1 text-sm text-gray-500 dark:text-gray-400">Turning ideas into impactful solutions</p>
      </div>

      <motion.div
        className="mx-auto grid w-full max-w-[420px] grid-cols-2 gap-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
      >
        {/* photo — tall tile */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
          className={`${tile} relative row-span-2 overflow-hidden p-0`}
        >
          <Image src="/mypic.jpeg" alt="Arnav Prashant Bule" fill sizes="50vw" className="object-cover" priority />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
            <p className="text-sm font-bold text-white">Arnav Bule</p>
            <p className="text-[11px] font-medium text-gray-200">AI/ML Developer</p>
          </div>
        </motion.div>

        {/* location */}
        <motion.div variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }} className={tile}>
          <MapPin className="mb-2 h-5 w-5 text-blue-500" />
          <p className="text-sm font-bold text-gray-900 dark:text-white">Pune, MH</p>
          <p className="small-text text-xs text-gray-500 dark:text-gray-400">India</p>
        </motion.div>

        {/* now — what's actually happening, straight from the top of experiences[] */}
        <motion.div variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }} className={tile}>
          <Zap className="mb-2 h-5 w-5 text-[#6344F5] dark:text-[#18CCFC]" />
          <p className="small-text text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Now</p>
          <p className="text-sm font-bold leading-snug text-gray-900 dark:text-white">{experiences[0].company}</p>
          <p className="small-text text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{experiences[0].title}</p>
        </motion.div>

        {/* the line this site lives by */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
          className={`${tile} relative col-span-2 overflow-hidden`}
        >
          <span aria-hidden className={`absolute -top-4 left-2 text-7xl font-extrabold leading-none opacity-25 ${gradText}`}>
            &ldquo;
          </span>
          <p className="relative pt-4 text-[17px] font-semibold leading-snug text-gray-900 dark:text-white">
            Make it work, make it right, make it glow.
          </p>
          <p className="small-text relative mt-1.5 text-xs text-gray-500 dark:text-gray-400">— the build loop around here</p>
        </motion.div>

        {/* focus — wide tile */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
          className={`${tile} col-span-2`}
        >
          <p className={`text-base font-bold ${gradText}`}>AI/ML · Data Engineering · Cloud</p>
          <p className="body-text mt-1 text-sm text-gray-700 dark:text-gray-300">
            Python + C++ by day, new AI/ML use-cases by night — building tech with impact and mentoring peers along the way.
          </p>
        </motion.div>

        {/* socials — wide tile */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
          className={`${tile} col-span-2 flex items-center justify-around py-3`}
        >
          {socials.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors dark:bg-gray-800 dark:text-gray-200"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
