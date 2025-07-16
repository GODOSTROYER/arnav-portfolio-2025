"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

const projects = [
  {
    id: 1,
    name: "ERP Exerciser",
    period: "Jan 2024 – Jun 2024",
    highlight: "Real-time BCI cognitive-training app leveraging ERP signals.",
    description:
      "Industry Project developed in a team of 3. Built a Brain-Computer-Interface application using Event-Related Potentials for real-time cognitive training. This innovative project combines neuroscience with technology to create an interactive training platform.",
    tags: ["Python", "BCI", "ERP", "Machine Learning", "Real-time Processing"],
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    name: "Prisma",
    period: "Jan 2023 – Apr 2024",
    highlight:
      "260 MB CNN model for upscaling & colorising images at 89% accuracy; potential night-vision & archival use-cases.",
    description:
      "Mini Project developed in a team of 3. Created a comprehensive CNN model for image enhancement including upscaling and colorization. The model achieved 89% accuracy and has potential applications in night-vision enhancement and archival image restoration.",
    tags: ["CNN", "Deep Learning", "Image Processing", "Python", "Computer Vision"],
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    name: "Road Extraction on Satellite Images",
    period: "SIH Project",
    highlight: "CNN pipeline on ISRO Resourcesat imagery; GUI outputs georeferenced shapefiles plus email alerts.",
    description:
      "Smart India Hackathon project developed in a team of 6. Built a CNN pipeline to extract road networks from ISRO Resourcesat satellite imagery. Features include a user-friendly GUI that outputs georeferenced shapefiles and automated email alert system.",
    tags: ["CNN", "Satellite Imagery", "ISRO", "GIS", "Python", "GUI Development"],
    image: "/placeholder.svg?height=400&width=600",
  },
]

export default function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-black mb-4">Selected Projects</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A collection of my recent work showcasing creativity and technical expertise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-48">
                <Image src={project.image || "/placeholder.svg"} alt={project.name} fill className="object-cover" />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    {project.period}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">{project.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{project.highlight}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{project.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{selectedProject?.name}</DialogTitle>
            </DialogHeader>
            {selectedProject && (
              <div className="space-y-4">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src={selectedProject.image || "/placeholder.svg"}
                    alt={selectedProject.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{selectedProject.period}</Badge>
                </div>
                <p className="text-gray-700">{selectedProject.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
