"use client"

import { motion } from "framer-motion"
import { Mail, Linkedin, Phone, MapPin } from "lucide-react"

export default function ConnectSection() {
  return (
    <section id="connect" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-20 translate-y-20"></div>
            </div>

            <div className="relative z-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="section-heading text-3xl md:text-4xl text-white mb-6">
                    Let's Connect and Collaborate!
                  </h2>
                  <p className="body-text text-lg mb-6 text-blue-100">
                    I'm always excited to explore new opportunities, share knowledge, and collaborate on projects that
                    push the boundaries of technology. Whether you're interested in AI/ML, cloud computing, or
                    innovative tech solutions, I'd love to connect!
                  </p>
                  <p className="body-text text-blue-100 font-medium">Ready to build something amazing together?</p>
                </div>

                <div className="space-y-4">
                  <motion.a
                    href="https://www.linkedin.com/in/arnavbule/"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-full px-6 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
                    style={{ fontWeight: 600, letterSpacing: "0.01em" }}
                  >
                    <Linkedin className="w-5 h-5 mr-3" />
                    Connect on LinkedIn
                  </motion.a>

                  <motion.a
                    href="mailto:arnav.bule05@gmail.com"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-full px-6 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
                    style={{ fontWeight: 600, letterSpacing: "0.01em" }}
                  >
                    <Mail className="w-5 h-5 mr-3" />
                    Send an Email
                  </motion.a>

                  <div className="pt-4 space-y-3">
                    <div className="flex items-center text-blue-100">
                      <Phone className="w-5 h-5 mr-3" />
                      <span className="body-text">+91 87676 02012</span>
                    </div>
                    <div className="flex items-center text-blue-100">
                      <MapPin className="w-5 h-5 mr-3" />
                      <span className="body-text">Pune, Maharashtra</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
