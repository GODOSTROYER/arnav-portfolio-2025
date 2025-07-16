"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

export default function CertificationsSection() {
  const certifications = [
    {
      name: "AWS Certified Solutions Architect - Associate",
      issuer: "Amazon Web Services",
      date: "March 2023",
      link: "#",
    },
    {
      name: "Google Cloud Professional Data Engineer",
      issuer: "Google Cloud",
      date: "January 2023",
      link: "#",
    },
    {
      name: "Machine Learning Engineer Nanodegree",
      issuer: "Udacity",
      date: "November 2022",
      link: "#",
    },
    {
      name: "Deep Learning Specialization",
      issuer: "Coursera (DeepLearning.AI)",
      date: "September 2022",
      link: "#",
    },
  ]

  return (
    <section id="certifications" className="py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-3xl md:text-4xl text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Certifications
          </h2>
          <p className="body-text text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            My professional certifications and achievements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-300"
            >
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{cert.name}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{cert.issuer}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{cert.date}</p>
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-2 inline-block"
                  >
                    View Credential
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
