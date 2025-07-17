"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="text-gray-700 bg-white w-full border-t border-gray-200">
      <div className="container mx-auto px-6 py-8 flex flex-col items-center sm:flex-row">
        <Link
          href="/"
          className="flex items-center justify-center font-medium text-gray-900 title-font md:justify-start hover:text-blue-500"
        >
          <span className="ml-3 text-xl font-bold">Arnav Bule</span>
        </Link>

        <p className="mt-4 text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l sm:border-gray-300 sm:py-2 sm:mt-0">
          {new Date().getFullYear()} —{" "}
          <a
            className="ml-1 text-gray-600 transition-colors hover:text-blue-500"
            href="https://linkedin.com/in/arnavbule/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @arnavbule
          </a>
        </p>

        <span className="inline-flex justify-center mt-4 sm:ml-auto sm:mt-0 sm:justify-start gap-x-5">
          <motion.a
            href="https://github.com/arnavbule"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-500 transition-colors hover:text-blue-500"
          >
            <Github size={20} />
            <span className="sr-only">Go to GitHub profile</span>
          </motion.a>

          <motion.a
            href="mailto:arnav.bule05@gmail.com"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-500 transition-colors hover:text-blue-500"
          >
            <Mail size={20} />
            <span className="sr-only">Send an Email</span>
          </motion.a>

          <motion.a
            href="https://linkedin.com/in/arnavbule/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-500 transition-colors hover:text-blue-500"
          >
            <Linkedin size={20} />
            <span className="sr-only">Go to LinkedIn profile</span>
          </motion.a>
        </span>
      </div>
    </footer>
  )
}
