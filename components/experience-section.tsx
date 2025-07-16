"use client"

import { motion } from "framer-motion"

const experience = [
  {
    title: "Web Dev & AI/ML Intern",
    company: "Cyberlytics Technologies",
    period: "Jan 2024 – Jun 2024",
    bullets: [
      "Built **ERP Exerciser**, a Brain-Computer-Interface app using Event-Related Potentials for real-time cognitive training.",
      "Tuned autoregressive models to forecast business metrics, boosting sequential-data accuracy.",
    ],
  },
  {
    title: "Vice President",
    company: "Cloud Computing Club, MIT ADT",
    period: "Aug 2024 – Present",
    bullets: ["Led 55 member core team; organised workshops & seminars for 600+ students (90% retention interest)."],
  },
  {
    title: "Campus Ambassador",
    company: "Viral Fission",
    period: "Aug 2024 – Present",
    bullets: [],
  },
  {
    title: "Management Executive",
    company: "CodeChef MITADT",
    period: "Jul 2022 – Apr 2024",
    bullets: [],
  },
  {
    title: "Technical Team Member",
    company: "Synapse AI Club MITADT",
    period: "",
    bullets: [],
  },
]

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-4">Experience</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Professional experience and leadership roles.</p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      {exp.period && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {exp.period}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-black mb-2">{exp.title}</h3>
                    <p className="text-gray-700 font-medium mb-4">{exp.company}</p>
                    {exp.bullets.length > 0 && (
                      <ul className="space-y-2">
                        {exp.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="text-gray-600 flex items-start">
                            <span className="text-blue-500 mr-2 mt-1">•</span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: bullet.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex-1 hidden lg:block">
                  <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
