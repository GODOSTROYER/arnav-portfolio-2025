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
                  {tech.icon}
                </div>
                <span className="mt-3 small-text text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                  {tech.label}
                </span>

                {/* The bounding box with lightning effect */}
                <div className="absolute inset-0 rounded-2xl lightning-border-effect"></div>
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

        .lightning-border-effect {
          position: absolute;
          inset: 0;
          border-radius: 1rem; /* Matches rounded-2xl */
          border: 2px solid transparent; /* Initial transparent border */
          transition: border-color 0.3s ease-in-out;
          pointer-events: none; /* Allows interaction with content underneath */
          z-index: 1; /* Ensure it's above the icon but below other elements if any */
        }

        .group-hover .lightning-border-effect {
          border-color: #3b82f6; /* Blue-500 on hover */
        }

        .dark .group-hover .lightning-border-effect {
          border-color: #60a5fa; /* Blue-400 on hover in dark mode */
        }

        .lightning-border-effect::before {
          content: "";
          position: absolute;
          inset: -2px; /* Slightly larger to cover the border */
          border-radius: 1rem; /* Match parent border-radius */
          background: conic-gradient(
            from 0deg at 50% 50%,
            transparent 0%,
            transparent 30%,
            rgba(255, 255, 255, 0.8) 50%, /* Bright white for lightning */
            transparent 70%,
            transparent 100%
          );
          background-size: 200% 200%; /* Make the gradient larger to animate */
          animation: rotate-lightning 2s linear infinite; /* Animate rotation */
          opacity: 0; /* Hidden by default */
          transition: opacity 0.3s ease-in-out;
          z-index: 2; /* Above the border itself */
        }

        .group-hover .lightning-border-effect::before {
          opacity: 1; /* Show on hover */
        }

        @keyframes rotate-lightning {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  )
}
