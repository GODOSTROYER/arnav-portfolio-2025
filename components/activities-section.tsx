"use client"

import { motion } from "framer-motion"
import { Trophy, Award, Star } from "lucide-react"

const activities = [
  {
    title: "Top 25 nationally at College Youth Ideathon",
    organization: "IIT Delhi",
    icon: Trophy,
    type: "Competition",
  },
  {
    title: "5-time Google Arcade Winner",
    organization: "Google",
    icon: Star,
    type: "Achievement",
  },
  {
    title: "Won $1,000 at Horizon AI Hackathon",
    organization: "University of Miami, USA",
    icon: Award,
    type: "Hackathon",
  },
]

export default function ActivitiesSection() {
  return (
    <section id="activities" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-4">Activities & Awards</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Recognition and achievements in competitions and hackathons.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-yellow-200"></div>
            {activities.map((activity, index) => {
              const IconComponent = activity.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex items-start mb-8"
                >
                  <div className="absolute left-2 w-4 h-4 bg-yellow-500 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                    <IconComponent className="w-2 h-2 text-white" />
                  </div>
                  <div className="ml-12 bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        {activity.type}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-black mb-1">{activity.title}</h3>
                    <p className="text-gray-700 font-medium">{activity.organization}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
