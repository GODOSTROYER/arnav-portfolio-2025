"use client"

import { motion } from "framer-motion"

const skillsData = {
  "Programming Languages": ["Python", "C++"],
  "Cloud Computing": ["IAM", "Kubernetes", "VMs", "DBs"],
  "Data & Databases": ["SQL", "BigQuery"],
  "Tools & Platforms": ["OpenAI APIs", "DeepSeek", "AWS", "Google Cloud Platform", "GitHub"],
  "Operating Systems": ["Linux", "Windows"],
  "Soft Skills": ["Project Management", "Communication", "Teamwork", "Leadership", "Collaboration", "Problem Solving"],
}

export default function SkillsSection() {
  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-4">Skills & Tools</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Technologies and tools I use to bring ideas to life.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {Object.entries(skillsData).map(([category, skills], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h3 className="text-xl font-bold text-black mb-4">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-center"
                  >
                    <span className="text-gray-800 font-medium">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
