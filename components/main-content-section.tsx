"use client"

import { motion } from "framer-motion"
import { MapPin, Mail, Phone, Github, Briefcase, Code, ExternalLink } from "lucide-react"
import Image from "next/image"

export default function MainContentSection() {
  const experiences = [
    {
      title: "Associate Data Scientist Intern",
      company: "V4C.ai",
      period: "Sept 2025 – Present",
      bullets: [
        "Built and maintained end-to-end ETL pipelines using PySpark, Delta Lake, and Auto Loader, implementing Medallion Architecture (Bronze–Silver–Gold) for scalable, production-grade analytics and ML workloads.",
        "Orchestrated and automated production pipelines using Databricks Jobs and Databricks Asset Bundles (DABs), with parameterization, scheduling, and environment-aware deployments aligned with CI/CD principles.",
        "Integrated MLflow for experiment tracking, model versioning, and reproducibility, supporting MLOps workflows and lifecycle management in cloud-based environments.",
        "Optimized data transformations, compute usage, and storage layouts to improve performance, reliability, and cost efficiency, enabling downstream BI reporting and ML-ready datasets.",
      ],
    },
    {
      title: "Gen AI Intern — CTO Office",
      company: "Persistent Systems",
      period: "Sept 2025 – Mar 2026",
      bullets: [
        "Designed and developed a full-stack AI email assistant (Email Digital Twin) using a custom Chrome Extension and Node.js/Express backend to automate hyper-personalized email drafting.",
        "Integrated Google Gemini (gemini-2.5-flash) to analyze users' sent emails, dynamically extracting communication patterns to build distinct, context-specific writing personas.",
        "Implemented Retrieval-Augmented Generation (RAG) with LanceDB vector database, enabling semantic search over past email threads for context-aware draft generation.",
        "Engineered a high-performance batch processing system using parallel fetching (10 concurrent requests), accelerating email analysis and persona generation by 5–7×.",
      ],
    },
    {
      title: "AI Research and Development Intern",
      company: "IS360 Technologies",
      period: "Jul 2024 – Dec 2024",
      bullets: [
        "Developed a machine learning pipeline using Linear Discriminant Analysis (LDA) to classify EEG signals from the Auditory Oddball paradigm, detecting event-related potentials like the P300 wave."
      ],
    },
    {
      title: "Vice President",
      company: "Cloud Computing Club",
      period: "Jul 2022 – Apr 2024",
      bullets: [
        "Led a 55‑member team delivering workshops, seminars, and hands‑on cloud‑training sessions.",
        "Grew a community of 600+ students, achieving 90% repeat‑engagement intent.",
        "Managed logistics, marketing, speakers, and budgets for large‑scale events, ensuring flawless execution."
      ],
    },
    {
      title: "Management Associate",
      company: "CodeChef Campus Chapter",
      period: "Jul 2023 – Present",
      bullets: [
        "Managed the chapter's annual calendar and budget, aligning eight coding events per semester with academic schedules.",
        "Organised & hosted monthly CodeChef challenge mirrors, boosting average participation from 120 → 350 students.",
        "Led cross‑functional sub‑teams (marketing, problem‑setting, tech) and produced run‑books that cut future planning time by 40%.",
        "Mentored a 10‑member junior committee through weekly stand‑ups and retrospectives, building a sustainable leadership pipeline."
      ],
    },
  ]

  const projects: {
    name: string
    period: string
    team: string
    github?: string
    live?: string
    highlight: string[]
  }[] = [
    {
      name: "Mini Task Tracker",
      period: "2025",
      team: "Next.js 15 · React 19 · TypeScript · Express · MongoDB · Redis",
      github: "https://github.com/GODOSTROYER/wldd-task-tracker",
      live: "https://wldd-task-tracker.arnavbule.me",
      highlight: [
        "Built a full-stack task tracker with Next.js 15 (React 19) frontend and Express + TypeScript REST API, including workspace-based task organization and multiple task views (Board/List/Table/Timeline).",
        "Implemented secure auth: email OTP verification (6-digit), JWT sessions (7-day expiry), bcrypt password hashing, and password reset via email token.",
        "Added a Redis caching layer for task listing with 5-minute TTL, plus automatic cache invalidation on task mutations and graceful cache-bypass if Redis is down.",
        "Built a drag-and-drop Kanban experience and persisted ordering using a batch update endpoint backed by MongoDB bulkWrite + a position sort field.",
      ],
    },
    {
      name: "Email Digital Twin",
      period: "2025",
      team: "Chrome Extension · Node.js · Express · Google Gemini · LanceDB · Gmail API · OAuth 2.0",
      highlight: [
        "Built an AI-powered Chrome Extension and Node.js backend that learns a user's unique writing style to generate hyper-personalized, context-aware email drafts using Google Gemini and LanceDB.",
        "Integrated Google Gemini's LLM via the API to analyze sent emails, dynamically extracting communication patterns and building distinct writing personas (professional, casual, etc.).",
        "Implemented RAG using LanceDB vector database for semantic search over past email threads, enabling the AI to understand ongoing conversation context for accurate draft generation.",
        "Integrated Gmail API with secure OAuth 2.0 flows within a privacy-first architecture where data processing stays local, and built an injected Gmail UI layer with keyboard shortcuts and a multi-persona editor.",
      ],
    },
    {
      name: "Sicklesense",
      period: "2025",
      team: "Python · TensorFlow · Keras · OpenCV · Streamlit · Docker · Hugging Face",
      github: "https://github.com/ArnavBule/Sickle-cell",
      live: "https://huggingface.co/spaces/GODOSTROYER/Sicklesense",
      highlight: [
        "Built a low-cost, AI-powered digital telepathology solution that detects sickle cells from blood smear images using a fine-tuned ResNet50 deep learning model, achieving >92% accuracy.",
        "Reduced early screening costs to approximately ₹75 per test — a 95% cost reduction compared to traditional laboratory methods.",
        "Developed an intuitive Streamlit web application providing actionable health guidelines, precautions, and emergency helpline contacts based on AI-generated results.",
        "Enabled telepathology and telemedicine support for frontline health workers in rural areas on low-power edge devices. Secured 3rd place ($1,000) at University of Miami Horizon AI Hackathon 2025 and recognized among Top 100 Startups at IIT Delhi Youth Ideathon.",
      ],
    },
    {
      name: "Road Extraction On Satellite Images",
      period: "Aug 2024 – Present",
      team: "SIH Project (No. of Group Members – 6)",
      highlight: [
        "Developing software for automated road extraction using CNNs on ISRO's Resourcesat images from the Boonidhi portal.",
        "Built a GUI for specifying areas of interest and generating geographically referenced shapefiles, with email alerts for road changes based on image comparisons.",
        "Optimized for efficient processing of large satellite datasets."
      ],
    },
    {
      name: "ERP Exerciser",
      period: "Aug 2024 – Present",
      team: "Industry Project (No. of Group Members – 3)",
      highlight: [
        "Developing ERP Exerciser, a Brain-Computer Interface (BCI) application that leverages Event-Related Potentials (ERPs) to deliver real-time cognitive training, enhancing memory, attention, and executive functions in patients with cognitive impairments."
      ],
    },
    {
      name: "Prisma",
      period: "Jan 2023 – Apr 2024",
      team: "SY Mini Project (No. of Group Members – 3)",
      highlight: [
        "Developed an extremely efficient machine-learning application for upscaling and colorizing images, with a model size of just 260 MB and achieving 89% color accuracy in standardized tests (using CNNs and DinkNet).",
        "Potential use cases include military applications, night-vision enhancement, and restoring old photographs."
      ],
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
    "Programming Languages": ["Python", "C++", "JavaScript", "TypeScript"],
    "Data Engineering": ["PySpark", "Delta Lake", "Databricks", "Auto Loader", "ETL Pipelines", "Medallion Architecture"],
    "AI/ML & Data Science": ["MLflow", "Scikit-learn", "Pandas", "NumPy", "NLP", "MLOps", "RAG", "Prompt Engineering"],
    "Web Development": ["React", "Next.js", "Node.js", "Express.js", "REST APIs", "Tailwind CSS", "Chrome Extensions"],
    "Cloud Computing": ["IAM", "Kubernetes", "VMs", "DBs", "Databricks Jobs", "DABs", "CI/CD", "Docker"],
    "Data & Databases": ["SQL", "BigQuery", "MongoDB", "Redis", "PostgreSQL", "LanceDB"],
    "Tools & Platforms": ["Google Gemini API", "OpenAI APIs", "DeepSeek", "AWS", "Google Cloud Platform", "GitHub", "MLflow", "Jest", "OAuth 2.0"],
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
    "Databricks Certified Data Engineer Associate",
    "Databricks Certified Data Analyst Associate",
    "Databricks Certified Generative AI Engineer Associate",
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
                className="w-48 h-48 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
              >
                <Image
                  src="/mypic.jpeg"
                  alt="Arnav Prashant Bule"
                  width={192}
                  height={192}
                  className="object-cover w-full h-full rounded-full"
                  priority
                />
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
                  { icon: Github, href: "https://github.com/GODOSTROYER/", text: "GODOSTROYER" },
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
                            color: "#0f172a",
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
                        <ul className="space-y-2">
                          {exp.bullets.map((bullet, bulletIndex) => (
                            <li
                              key={bulletIndex}
                              className="flex items-start text-gray-700 dark:text-gray-300 transition-colors duration-300"
                            >
                              <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0 transition-colors duration-300"></span>
                              <span className="body-text">{bullet}</span>
                            </li>
                          ))}
                        </ul>
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
                          <div className="flex items-center gap-3">
                            <h4 className="card-title text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                              {project.name}
                            </h4>
                            {project.github && (
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
                            {project.live && (
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
                          <span className="small-text text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                            {project.period}
                          </span>
                        </div>
                        <p className="small-text text-sm text-gray-600 dark:text-gray-400 mb-3 transition-colors duration-300">
                          {project.team}
                        </p>
                        <div className="body-text text-gray-700 dark:text-gray-300 transition-colors duration-300 space-y-2">
                          {project.highlight.map((line, idx) => (
                            <p key={idx} className="mb-0">{line}</p>
                          ))}
                        </div>
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
