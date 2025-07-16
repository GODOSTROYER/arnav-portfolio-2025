"use client"

import { motion } from "framer-motion"
import { MapPin, Mail, Phone, Github, Briefcase, Code } from "lucide-react"

export default function MainContentSection() {
  const experiences = [
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
  ]

  const projects = [
    {
      name: "ERP Exerciser",
      period: "Jan 2024 – Jun 2024",
      highlight: "Real-time BCI cognitive-training app leveraging ERP signals.",
      team: "Industry Project, team of 3",
    },
    {
      name: "Prisma",
      period: "Jan 2023 – Apr 2024",
      highlight:
        "260 MB CNN model for upscaling & colorising images at 89% accuracy; potential night-vision & archival use-cases.",
      team: "Mini Project, team of 3",
    },
    {
      name: "Road Extraction on Satellite Images",
      period: "SIH Project",
      highlight: "CNN pipeline on ISRO Resourcesat imagery; GUI outputs georeferenced shapefiles plus email alerts.",
      team: "SIH, team of 6",
    },
  ]

  // Color sequence for timeline nodes
  const timelineColors = [
    "bg-purple-500",
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-gray-500",
  ]

  const skills = {
    "Programming Languages": ["Python", "C++"],
    "Cloud Computing": ["IAM", "Kubernetes", "VMs", "DBs"],
    "Data & Databases": ["SQL", "BigQuery"],
    "Tools & Platforms": ["OpenAI APIs", "DeepSeek", "AWS", "Google Cloud Platform", "GitHub"],
    "Operating Systems": ["Linux", "Windows"],
    "Soft Skills": [
      "Project Management",
      "Communication",
      "Teamwork",
      "Leadership",
      "Collaboration",
      "Problem Solving",
    ],
  }

  const certifications = [
    "Machine Learning Specialization — Coursera",
    "Google Project Management Professional Certificate",
    "Google Data Analytics Professional Certificate",
    "Networking Basics — Cisco Foundations",
    "DSA to Development — Geeks for Geeks (ongoing)",
    "Cloud Career Practitioner Certified — AWS & GCP",
  ]

  // Enhanced animation variants for smoother transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smooth easing
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  return (
    <section id="about" className="py-20 bg-white dark:bg-black scroll-section transition-colors duration-300">
      <div className="container mx-auto px-6">
        <motion.div
          className="grid lg:grid-cols-3 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Column - Profile & Summary */}
          <div className="lg:col-span-1">
            <motion.div variants={itemVariants} className="sticky top-8">
              {/* Profile Photo */}
              <motion.div
                className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-6xl font-bold shadow-2xl"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
              >
                <span style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>AB</span>
              </motion.div>

              {/* Name & Title */}
              <motion.div className="text-center mb-8" variants={itemVariants}>
                <h1
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300"
                  style={{ fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.2 }}
                >
                  Arnav Prashant Bule
                </h1>
                <p
                  className="text-lg text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300"
                  style={{ fontWeight: 500, letterSpacing: "0.02em" }}
                >
                  TECH ENTHUSIAST | AI/ML DEVELOPER
                </p>
              </motion.div>

              {/* Summary */}
              <motion.div className="mb-8" variants={itemVariants}>
                <p className="body-text text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">
                  Driven tech enthusiast with a knack for problem-solving and a passion for turning ideas into impactful
                  solutions.
                </p>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  {[
                    "Passionate about AI/ML, Cloud, and creative tech solutions",
                    "Blend of coding and creativity: Python + C++ or exploring new AI/ML use-cases",
                    "Loves building tech with impact and mentoring peers",
                    "Based in Pune, Maharashtra",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.1,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      viewport={{ once: true }}
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="body-text">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Contact Info */}
              <motion.div className="space-y-4 mb-8" variants={itemVariants}>
                {[
                  { icon: Mail, href: "mailto:arnav.bule05@gmail.com", text: "arnav.bule05@gmail.com" },
                  { icon: Github, href: "https://github.com/arnavbule", text: "arnavbule" },
                  { icon: Phone, href: "tel:+918767602012", text: "+91 87676 02012" },
                  { icon: MapPin, href: "#", text: "Pune, Maharashtra, India" },
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300"
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <contact.icon className="w-5 h-5 mr-3 text-blue-500" />
                    <a
                      href={contact.href}
                      className="body-text hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                    >
                      {contact.text}
                    </a>
                  </motion.div>
                ))}
              </motion.div>

              {/* Skills */}
              <motion.div className="mb-8" variants={itemVariants}>
                <h3 className="section-heading text-xl text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                  Skills
                </h3>
                {Object.entries(skills).map(([category, items], categoryIndex) => (
                  <motion.div
                    key={category}
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: categoryIndex * 0.1,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    viewport={{ once: true }}
                  >
                    <h4
                      className="font-semibold text-blue-600 dark:text-blue-400 mb-2 transition-colors duration-300"
                      style={{ fontWeight: 600, fontSize: "0.875rem", letterSpacing: "0.01em" }}
                    >
                      {category}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill, index) => (
                        <motion.span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full small-text text-xs transition-colors duration-300"
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: "#dbeafe",
                            transition: { duration: 0.2 },
                          }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Certifications */}
              <motion.div variants={itemVariants}>
                <h3 className="section-heading text-xl text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                  Certifications
                </h3>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.05,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      viewport={{ once: true }}
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="small-text text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        {cert}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Experience & Projects */}
          <div className="lg:col-span-2 space-y-16">
            {/* Experience Section */}
            <motion.div variants={itemVariants}>
              <h2 className="section-heading text-3xl text-gray-900 dark:text-white mb-8 transition-colors duration-300">
                Experience
              </h2>

              <div className="relative">
                {/* Vertical timeline line for experience */}
                <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transition-colors duration-300"></div>

                <div className="space-y-8">
                  {experiences.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.15,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="relative flex items-start"
                    >
                      {/* Timeline node with Briefcase icon */}
                      <motion.div
                        className={`absolute left-[11px] w-9 h-9 ${timelineColors[index % timelineColors.length]} rounded-full flex items-center justify-center shadow-lg z-10`}
                        whileHover={{
                          scale: 1.2,
                          transition: { duration: 0.3, ease: "easeOut" },
                        }}
                      >
                        <Briefcase className="w-5 h-5 text-white" />
                      </motion.div>

                      {/* Content */}
                      <motion.div
                        className="ml-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 w-full"
                        whileHover={{
                          y: -5,
                          transition: { duration: 0.3, ease: "easeOut" },
                        }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <h4 className="card-title text-xl text-gray-900 dark:text-white transition-colors duration-300">
                            {exp.title}
                          </h4>
                          <span className="small-text text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                            {exp.period}
                          </span>
                        </div>
                        <p
                          className="text-blue-600 dark:text-blue-400 font-semibold mb-4 transition-colors duration-300"
                          style={{ fontWeight: 600, letterSpacing: "0.01em" }}
                        >
                          {exp.company}
                        </p>
                        {exp.bullets.length > 0 && (
                          <ul className="space-y-2">
                            {exp.bullets.map((bullet, bulletIndex) => (
                              <li
                                key={bulletIndex}
                                className="flex items-start text-gray-700 dark:text-gray-300 transition-colors duration-300"
                              >
                                <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0 transition-colors duration-300"></span>
                                <span
                                  className="body-text"
                                  dangerouslySetInnerHTML={{
                                    __html: bullet.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                                  }}
                                />
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Projects Section */}
            <motion.div variants={itemVariants}>
              <h2 className="section-heading text-3xl text-gray-900 dark:text-white mb-8 transition-colors duration-300">
                Projects
              </h2>

              <div className="relative">
                {/* Vertical timeline line for projects */}
                <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 transition-colors duration-300"></div>

                <div className="space-y-8">
                  {projects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.15,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="relative flex items-start"
                    >
                      {/* Timeline node with Code icon */}
                      <motion.div
                        className={`absolute left-[11px] w-9 h-9 ${timelineColors[index % timelineColors.length]} rounded-full flex items-center justify-center shadow-lg z-10`}
                        whileHover={{
                          scale: 1.2,
                          transition: { duration: 0.3, ease: "easeOut" },
                        }}
                      >
                        <Code className="w-5 h-5 text-white" />
                      </motion.div>

                      {/* Content */}
                      <motion.div
                        className="ml-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 group w-full"
                        whileHover={{
                          y: -5,
                          transition: { duration: 0.3, ease: "easeOut" },
                        }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <h4 className="card-title text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {project.name}
                          </h4>
                          <span className="small-text text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                            {project.period}
                          </span>
                        </div>
                        <p className="small-text text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-300">
                          {project.team}
                        </p>
                        <p className="body-text text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          {project.highlight}
                        </p>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
