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

/* Exported so the /dev mobile marquee renders the same stack at chip size. */
export const techStack = [
  { Icon: FaPython, label: "Python", color: "text-yellow-500" },
  { Icon: SiCplusplus, label: "C++", color: "text-blue-600" },
  { Icon: FaReact, label: "React", color: "text-blue-500" },
  { Icon: FaNodeJs, label: "Node.js", color: "text-green-600" },
  { Icon: SiTailwindcss, label: "Tailwind CSS", color: "text-teal-500" },
  { Icon: SiMongodb, label: "MongoDB", color: "text-green-700" },
  { Icon: SiMysql, label: "MySQL", color: "text-blue-700" },
  { Icon: SiTensorflow, label: "TensorFlow", color: "text-orange-500" },
  { Icon: SiOpencv, label: "OpenCV", color: "text-indigo-600" },
  { Icon: SiNumpy, label: "NumPy", color: "text-blue-400" },
  { Icon: FaAws, label: "AWS", color: "text-orange-600" },
  { Icon: SiGooglecloud, label: "Google Cloud", color: "text-blue-500" },
  { Icon: SiKubernetes, label: "Kubernetes", color: "text-blue-600" },
  { Icon: FaDocker, label: "Docker", color: "text-blue-500" },
  { Icon: FaLinux, label: "Linux", color: "text-gray-800 dark:text-gray-200" },
  { Icon: SiFlutter, label: "Flutter", color: "text-cyan-600" },
]

export default function TechnologiesSection() {
  return (
    <section id="technologies" className="py-20 transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-3xl md:text-4xl text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Technologies and Frameworks I Work With
          </h2>
          <p className="body-text text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            A comprehensive toolkit for building modern, scalable applications
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center gap-8">
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="relative flex flex-col items-center justify-center w-40 h-40 transition-all duration-300 group"
                style={{
                  animation: `float 6s ease-in-out infinite`,
                  animationDelay: `${index * 0.3}s`,
                }}
              >
                {/* The actual icon and label */}
                <div className={`flex items-center justify-center ${tech.color} transition-all duration-300`}>
                  <tech.Icon size={50} />
                </div>
                <span className="mt-3 small-text text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  {tech.label}
                </span>
              </motion.div>
            ))}
          </div>
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
