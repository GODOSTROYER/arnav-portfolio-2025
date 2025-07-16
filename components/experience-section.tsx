"use client"

import { motion } from "framer-motion"
import { Calendar, MapPin } from "lucide-react"

export default function ExperienceSection() {
  const experiences = [
    {
      title: "AI/ML Engineer",
      company: "Tech Solutions Inc.",
      duration: "June 2023 - Present",
      location: "Bengaluru, India",
      description: [
        "Developed and deployed machine learning models for predictive analytics, improving forecast accuracy by 15%.",
        "Implemented deep learning solutions for natural language processing tasks, enhancing sentiment analysis capabilities.",
        "Collaborated with cross-functional teams to integrate AI solutions into existing product lines.",
        "Optimized model performance and scalability on AWS cloud infrastructure.",
      ],
    },
    {
      title: "Software Development Intern",
      company: "Innovate Corp.",
      duration: "Jan 2023 - May 2023",
      location: "Pune, India",
      description: [
        "Assisted in the development of a real-time data processing pipeline using Apache Kafka.",
        "Contributed to the front-end development of a data visualization dashboard using React.",
        "Participated in code reviews and agile development sprints.",
      ],
    },
  ]

  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-3xl md:text-4xl text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Work Experience
          </h2>
          <p className="body-text text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            My professional journey and key roles.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          {experiences.map((exp, index) => (
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
                {index < experiences.length - 1 && (
                  <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-700 mt-2"></div>
                )}
              </div>
              <div className="flex-1 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-300">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{exp.title}</h3>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{exp.company}</p>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{exp.duration}</span>
                  <MapPin className="w-4 h-4 ml-4 mr-2" />
                  <span>{exp.location}</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                  {exp.description.map((detail, i) => (
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
