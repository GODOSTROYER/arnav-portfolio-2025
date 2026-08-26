"use client"

/* /dev mobile tail: Connect, Resume, and Footer rebuilt in the same dark-glass
   tile vocabulary as the bento and decks, so the page ends in the language it
   opened with. The shared desktop components are untouched — these render only
   on the /dev mobile branch.

   Copy leads with the collaboration ask (the work just sold the visitor;
   this is where the page says what it wants), with the "not job hunting"
   honesty kept, lower down. */

import { motion } from "framer-motion"
import { Download, FileText, Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

const tile =
  "rounded-3xl border border-gray-200/70 bg-white/85 shadow-lg backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/85"

/* white on #6344F5 ≈ 5.5:1 — the beam's violet carries the primary actions */
const primaryBtn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#6344F5] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_18px_rgba(99,68,245,0.45)]"
const secondaryBtn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-200"

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const },
}

export function MobileConnect() {
  return (
    <section id="contact" className="flex min-h-[70svh] flex-col justify-center px-4 py-14">
      <motion.article {...reveal} className={`${tile} mx-auto w-full max-w-[420px] p-6`}>
        <h2 className="section-heading text-2xl text-gray-900 dark:text-white transition-colors duration-300">
          Let&apos;s build something.
        </h2>
        <p className="body-text mt-3 text-[15px] text-gray-700 dark:text-gray-300">
          Always up for talking AI/ML, data engineering, and ambitious ideas — if you&apos;re building
          something interesting, I want to hear about it.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="https://www.linkedin.com/in/arnavbule/"
            target="_blank"
            rel="noopener noreferrer"
            className={primaryBtn}
          >
            <Linkedin className="h-4 w-4" /> Get in touch
          </a>
          <a href="mailto:arnav.bule05@gmail.com" className={secondaryBtn}>
            <Mail className="h-4 w-4" /> Email me
          </a>
        </div>
        <p className="small-text mt-4 text-xs text-gray-500 dark:text-gray-400">
          Not job hunting — just love the craft and the people who share it.
        </p>
      </motion.article>
    </section>
  )
}

export function MobileResume() {
  return (
    <section id="resume" className="px-4 py-14">
      <motion.article {...reveal} className={`${tile} mx-auto flex w-full max-w-[420px] flex-col items-start gap-4 p-6`}>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#18CCFC] to-[#6344F5] shadow-lg">
            <FileText className="h-5 w-5 text-white" />
          </span>
          <div>
            <h2 className="section-heading text-xl text-gray-900 dark:text-white transition-colors duration-300">Resume</h2>
            <p className="small-text text-xs text-gray-500 dark:text-gray-400">The full story, one PDF</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/resume" className={primaryBtn}>
            View resume
          </Link>
          <a href="/Arnav - Resume.pdf" download className={secondaryBtn}>
            <Download className="h-4 w-4" /> Download PDF
          </a>
        </div>
      </motion.article>
    </section>
  )
}

export function MobileFooter() {
  return (
    <footer className="border-t border-gray-200 px-6 py-8 dark:border-gray-800">
      <div className="mx-auto flex w-full max-w-[420px] items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">Arnav Bule</p>
          <p className="small-text text-xs text-gray-500 dark:text-gray-400">{new Date().getFullYear()} · Pune, India</p>
        </div>
        <div className="flex">
          {[
            { Icon: Github, href: "https://github.com/GODOSTROYER/", label: "GitHub" },
            { Icon: Linkedin, href: "https://www.linkedin.com/in/arnavbule/", label: "LinkedIn" },
            { Icon: Mail, href: "mailto:arnav.bule05@gmail.com", label: "Email" },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="flex h-11 w-11 items-center justify-center rounded-full text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
