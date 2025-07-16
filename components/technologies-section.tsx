"use client"

import { motion } from "framer-motion"
import { FaReact, FaNodeJs, FaPython, FaAws, FaLinux, FaDocker } from "react-icons/fa"
import {
  SiTailwindcss,
  SiMongodb,
  SiTensorflow,
  SiNumpy,
  SiMysql,
  SiOpencv,
  SiKubernetes,
  SiFlutter,
  SiGooglecloud,
  SiCplusplus,
} from "react-icons/si"

export default function TechnologiesSection() {
  const techStack = [
    { icon: <FaPython size={50} />, label: "Python", color: "text-yellow-500" },
    { icon: <SiCplusplus size={50} />, label: "C++", color: "text-blue-600" },
    { icon: <FaReact size={50} />, label: "React", color: "text-blue-500" },
    { icon: <FaNodeJs size={50} />, label: "Node.js", color: "text-green-600" },
    { icon: <SiTailwindcss size={50} />, label: "Tailwind CSS", color: "text-teal-500" },
    { icon: <SiMongodb size={50} />, label: "MongoDB", color: "text-green-700" },
    { icon: <SiMysql size={50} />, label: "MySQL", color: "text-blue-700" },
    { icon: <SiTensorflow size={50} />, label: "TensorFlow", color: "text-orange-500" },
    { icon: <SiOpencv size={50} />, label: "OpenCV", color: "text-indigo-600" },
    { icon: <SiNumpy size={50} />, label: "NumPy", color: "text-blue-400" },
    { icon: <FaAws size={50} />, label: "AWS", color: "text-orange-600" },
    { icon: <SiGooglecloud size={50} />, label: "Google Cloud", color: "text-blue-500" },
    { icon: <SiKubernetes size={50} />, label: "Kubernetes", color: "text-blue-600" },
    { icon: <FaDocker size={50} />, label: "Docker", color: "text-blue-500" },
    { icon: <FaLinux size={50} />, label: "Linux", color: "text-gray-800 dark:text-gray-200" },
    { icon: <SiFlutter size={50} />, label: "Flutter", color: "text-cyan-600" },
  ]

  return (
    <section id="technologies" className="py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-3xl md:text-4xl text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Technologies and Frameworks I Work With
          </h2>
          <p className="body-text text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            A comprehensive toolkit for building modern, scalable applications
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1, y: -10 }}
              className="flex flex-col items-center justify-center p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              style={{
                animation: `float 6s ease-in-out infinite`,
                animationDelay: `${index * 0.3}s`,
              }}
            >
              <div className={`${tech.color} transition-all duration-300 group-hover:scale-110`}>{tech.icon}</div>
              <span className="mt-3 small-text text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                {tech.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  )
}
