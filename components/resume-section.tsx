"use client"

import { motion } from "framer-motion"
import { Download, ExternalLink } from "lucide-react"

export default function ResumeSection() {
  return (
    <section id="resume" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center px-4 py-2 bg-cyan-100 text-cyan-600 rounded-full font-medium mb-6"
              style={{ fontWeight: 600, fontSize: "0.875rem", letterSpacing: "0.02em" }}
            >
              <Download className="w-4 h-4 mr-2" />
              CHECK OUT MY RESUME
            </div>
          </div>

          <div className="border-2 border-blue-700 rounded-3xl p-8 md:p-12 bg-gray-900 backdrop-blur-sm">
            <div className="text-center">
              <h2 className="section-heading text-3xl md:text-4xl text-gray-900 mb-6">Ready for New Opportunities</h2>
              <p className="body-text text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Download my comprehensive resume to learn more about my technical skills, project experience, and
                achievements in AI/ML and cloud computing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="https://drive.google.com/file/d/1sgoSLu_0F52J1yEhmpamVRQoGKx0e-wP/view?usp=sharing"
                  download
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
                  style={{ fontWeight: 600, letterSpacing: "0.01em" }}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Resume
                </motion.a>

                <motion.a
                  href="https://www.linkedin.com/in/arnavbule/"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-8 py-4 border-2 border-cyan-500 text-cyan-600 font-semibold rounded-full hover:bg-gray-700 transition-all duration-300"
                  style={{ fontWeight: 600, letterSpacing: "0.01em" }}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View LinkedIn
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
