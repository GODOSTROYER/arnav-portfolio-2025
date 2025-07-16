"use client"

import { motion } from "framer-motion"

const education = [
  {
    course: "B.Tech Computer Science Engineering",
    school: "MIT Art, Design & Technology University",
    place: "Pune, India",
    period: "2022 – 2026",
    gpa: "CGPA 8.2 (expected May 2026)",
  },
  {
    course: "Grade 12 (HSC)",
    school: "J.K. College of Arts, Commerce & Science",
    place: "Pune, India",
    period: "2020 – 2022",
    gpa: "",
  },
  {
    course: "Grade 10 (CBSE)",
    school: "Amanora School",
    place: "Pune, India",
    period: "2020",
    gpa: "88.2%",
  },
]

export default function EducationSection() {
  return (
    <section id="education" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-4">Education</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Academic journey and educational background.</p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {education.map((edu, index) => (
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
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {edu.period}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-black mb-2">{edu.course}</h3>
                    <p className="text-gray-700 font-medium mb-1">{edu.school}</p>
                    <p className="text-gray-600 mb-2">{edu.place}</p>
                    {edu.gpa && <p className="text-blue-600 font-medium">{edu.gpa}</p>}
                  </div>
                </div>
                <div className="flex-1 hidden lg:block">
                  <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
