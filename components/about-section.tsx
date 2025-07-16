"use client"

import { motion } from "framer-motion"
import { Award, Briefcase, Lightbulb, Users } from "lucide-react"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-3xl md:text-4xl text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            About Me
          </h2>
          <p className="body-text text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            A brief overview of my journey, passions, and professional aspirations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6 text-gray-700 dark:text-gray-300"
          >
            <p className="body-text text-lg leading-relaxed">
              Hello! I'm Arnav, a passionate and driven AI/ML Developer with a strong foundation in building intelligent
              systems and scalable cloud solutions. My journey in technology began with a fascination for how machines
              can learn and adapt, leading me to dive deep into machine learning, deep learning, and natural language
              processing.
            </p>
            <p className="body-text text-lg leading-relaxed">
              I thrive on transforming complex problems into innovative, data-driven solutions. My expertise spans
              across various domains, including developing predictive models, optimizing algorithms, and deploying
              AI-powered applications on cloud platforms like AWS and Google Cloud. I'm always eager to learn new
              technologies and apply them to real-world challenges.
            </p>
            <p className="body-text text-lg leading-relaxed">
              Beyond coding, I'm a firm believer in continuous learning and community collaboration. I actively
              participate in tech forums, contribute to open-source projects, and mentor aspiring developers. When I'm
              not immersed in code, you can find me exploring new hiking trails or experimenting with smart home
              automation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm transition-colors duration-300">
              <Lightbulb className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Innovation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Driving new ideas</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm transition-colors duration-300">
              <Briefcase className="w-10 h-10 text-green-600 dark:text-green-400 mb-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Professionalism</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dedicated work ethic</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm transition-colors duration-300">
              <Users className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Collaboration</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Team-oriented approach</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm transition-colors duration-300">
              <Award className="w-10 h-10 text-yellow-600 dark:text-yellow-400 mb-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Excellence</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">High-quality results</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
