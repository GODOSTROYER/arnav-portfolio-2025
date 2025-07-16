"use client"

import { motion } from "framer-motion"

const certifications = [
  "Machine Learning Specialization — Coursera",
  "Google Project Management Professional Certificate",
  "Google Data Analytics Professional Certificate",
  "Networking Basics — Cisco Foundations",
  "DSA to Development — Geeks for Geeks (ongoing)",
  "Cloud Career Practitioner Certified — AWS & GCP",
]

export default function CertificationsSection() {
  return (
    <section id="certifications" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-4">Certifications</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Professional certifications and continuous learning achievements.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex items-start mb-8"
              >
                <div className="absolute left-2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-md"></div>
                <div className="ml-12 bg-gray-50 p-6 rounded-lg shadow-sm">
                  <p className="text-gray-800 font-medium">{cert}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
