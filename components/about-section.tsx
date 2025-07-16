"use client"

import { motion } from "framer-motion"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed text-left">
            Driven tech enthusiast with a knack for problem-solving and a passion for turning ideas into impactful
            solutions. I've led a 600-student cloud community, organised workshops, and built projects from satellite
            road-extraction to cognitive-training apps. I love blending tech with creativity—coding in C++ & Python or
            exploring new AI/ML use-cases—always curious and eager to learn more!
          </p>
        </motion.div>
      </div>
    </section>
  )
}
