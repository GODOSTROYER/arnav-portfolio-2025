"use client"

import { motion } from "framer-motion"
import { Github, ExternalLink } from "lucide-react"
import Image from "next/image"

export default function ProjectsSection() {
  const projects = [
    {
      title: "Mini Task Tracker",
      description: "Full-stack task management app with JWT auth + OTP email verification, Redis-cached drag-and-drop Kanban workspaces.",
      bullets: [
        "Built a full-stack task tracker with Next.js 15 (React 19) frontend and Express + TypeScript REST API, including workspace-based task organization and multiple task views (Board/List/Table/Timeline).",
        "Implemented secure auth: email OTP verification (6-digit), JWT sessions (7-day expiry), bcrypt password hashing, and password reset via email token.",
        "Added a Redis caching layer for task listing with 5-minute TTL, plus automatic cache invalidation on task mutations and graceful cache-bypass if Redis is down.",
        "Built a drag-and-drop Kanban experience and persisted ordering using a batch update endpoint backed by MongoDB bulkWrite + a position sort field.",
      ],
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Next.js 15", "React 19", "TypeScript", "Express", "MongoDB", "Redis"],
      github: "https://github.com/GODOSTROYER/wldd-task-tracker",
      live: "https://wldd-task-tracker.arnavbule.me",
    },
    {
      title: "Sicklesense",
      description:
        "AI-driven healthcare screening solution for early sickle-cell detection in underserved areas. 3rd Place at University of Miami Horizon AI Hackathon 2025 & Top 100 Startup at IIT Delhi Youth Ideathon.",
      bullets: [
        "Built a low-cost, AI-powered digital telepathology solution that detects sickle cells from blood smear images using a fine-tuned ResNet50 deep learning model, achieving >92% accuracy.",
        "Reduced early screening costs to approximately ₹75 per test — a 95% cost reduction compared to traditional laboratory methods.",
        "Developed an intuitive Streamlit web application providing actionable health guidelines, precautions, and emergency helpline contacts based on AI-generated results.",
        "Enabled telepathology and telemedicine support, allowing frontline health workers in rural areas to administer tests and receive immediate automated medical guidance on low-power edge devices.",
      ],
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Python", "TensorFlow", "Keras", "OpenCV", "Streamlit", "Docker", "Hugging Face"],
      github: "https://github.com/ArnavBule/Sickle-cell",
      live: "https://huggingface.co/spaces/GODOSTROYER/Sicklesense",
    },
    {
      title: "AI-Powered Chatbot",
      description:
        "Developed a conversational AI chatbot using natural language processing (NLP) and deep learning techniques.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Python", "TensorFlow", "NLP", "Flask"],
      github: "#",
      live: "#",
    },
    {
      title: "E-commerce Recommendation System",
      description:
        "Built a personalized product recommendation system using collaborative filtering and matrix factorization.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Python", "Pandas", "Scikit-learn", "Django"],
      github: "#",
      live: "#",
    },
    {
      title: "Cloud-Native Microservices",
      description: "Designed and implemented a scalable microservices architecture deployed on Kubernetes with AWS.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["Go", "Docker", "Kubernetes", "AWS"],
      github: "#",
      live: "#",
    },
    {
      title: "Real-time Data Dashboard",
      description: "Created a real-time data visualization dashboard using React and WebSockets for live updates.",
      image: "/placeholder.svg?height=400&width=600",
      tags: ["React", "Node.js", "WebSockets", "MongoDB"],
      github: "#",
      live: "#",
    },
  ]

  return (
    <section id="projects" className="py-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="section-heading text-3xl md:text-4xl text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            Featured Projects
          </h2>
          <p className="body-text text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            A showcase of my recent work and personal projects.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-colors duration-300 group"
            >
              <div className="relative w-full h-56 overflow-hidden">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
                  {project.github && project.github !== "#" && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                      title="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.live && project.live !== "#" && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-base mb-4">{project.description}</p>
                {"bullets" in project && (project as any).bullets && (
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm mb-4">
                    {(project as any).bullets.map((bullet: string, i: number) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 text-sm font-medium"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

