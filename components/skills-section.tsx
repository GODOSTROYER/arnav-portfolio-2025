"use client"

import { motion } from "framer-motion"
import { Code, Database, Cloud, Brain, GitBranch, Server } from "lucide-react"

export default function SkillsSection() {
  const skills = [
    {
      category: "Programming Languages",
      icon: <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      items: ["Python", "C++", "JavaScript", "Go", "Java"],
    },
    {
      category: "AI/ML & Data Science",
      icon: <Brain className="w-6 h-6 text-green-600 dark:text-green-400" />,
      items: ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "OpenCV", "NLP"],
    },
    {
      category: "Cloud & DevOps",
      icon: <Cloud className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      items: ["AWS", "Google Cloud", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    },
    {
      category: "Databases",
      icon: <Database className="w-6 h-6 text-red-600 dark:text-red-400" />,
      items: ["MongoDB", "PostgreSQL", "MySQL", "Redis"],
    },
    {
      category: "Web Technologies",
      icon: <Server className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
      items: ["React", "Next.js", "Node.js", "Express.js", "Tailwind CSS"],
    },
    {
      category: "Version Control",
      icon: <GitBranch className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      items: ["Git", "GitHub", "GitLab"],
    },
  ]

  return (
    <section id="skills" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-3xl md:text-4xl text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            My Skillset
          </h2>
          <p className="body-text text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            A comprehensive overview of my technical proficiencies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skillCategory, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-300"
            >
              <div className="flex items-center mb-4">
                {skillCategory.icon}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">{skillCategory.category}</h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {skillCategory.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="px-4 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
