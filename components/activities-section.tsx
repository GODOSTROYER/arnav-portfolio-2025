"use client"

import { motion } from "framer-motion"
import { Calendar, Code, Globe, Heart } from "lucide-react"

export default function ActivitiesSection() {
  const activities = [
    {
      icon: <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Open Source Contributions",
      description: "Actively contribute to various open-source projects on GitHub, focusing on AI/ML libraries.",
    },
    {
      icon: <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />,
      title: "Tech Community Engagement",
      description: "Participate in local tech meetups and online forums, sharing knowledge and insights.",
    },
    {
      icon: <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: "Hackathons & Competitions",
      description: "Regularly join hackathons and coding competitions to challenge myself and learn new skills.",
    },
    {
      icon: <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />,
      title: "Mentorship & Teaching",
      description: "Mentor aspiring developers and conduct workshops on AI/ML fundamentals.",
    },
  ]

  return (
    <section id="activities" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-3xl md:text-4xl text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Beyond the Code
          </h2>
          <p className="body-text text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            My passions and engagements outside of professional work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-300"
            >
              <div className="mb-4">{activity.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{activity.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{activity.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
