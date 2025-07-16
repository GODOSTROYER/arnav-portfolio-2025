"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin } from "lucide-react"

export default function EducationSection() {
  const education = [
    {
      degree: "Master of Technology in Computer Science",
      institution: "Indian Institute of Technology Bombay",
      duration: "2021 - 2023",
      location: "Mumbai, India",
      details: [
        "Specialized in Artificial Intelligence and Machine Learning.",
        "Thesis: 'Deep Reinforcement Learning for Autonomous Navigation'.",
        "Relevant Courses: Advanced Machine Learning, Deep Learning, Natural Language Processing, Computer Vision.",
      ],
    },
    {
      degree: "Bachelor of Engineering in Information Technology",
      institution: "Pune Institute of Computer Technology",
      duration: "2017 - 2021",
      location: "Pune, India",
      details: [
        "Graduated with First Class Honors.",
        "Capstone Project: 'Sentiment Analysis of Social Media Data'.",
        "Relevant Courses: Data Structures & Algorithms, Database Management Systems, Operating Systems.",
      ],
    },
  ]

  return (
    <section id="education" className="py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-3xl md:text-4xl text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Education
          </h2>
          <p className="body-text text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            My academic journey and qualifications.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="mb-12 last:mb-0 flex items-start"
            >
              <div className="flex flex-col items-center mr-6">
                <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full z-10"></div>
                {index < education.length - 1 && <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-700 mt-2"></div>}
              </div>
              <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-300">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{edu.degree}</h3>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{edu.institution}</p>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{edu.duration}</span>
                  <MapPin className="w-4 h-4 ml-4 mr-2" />
                  <span>{edu.location}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  {edu.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
