"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Github, Phone, MapPin } from "lucide-react"

export default function ContactSection() {
  const contactInfo = [
    {
      label: "Email",
      value: "arnav.bule05@gmail.com",
      href: "mailto:arnav.bule05@gmail.com",
      icon: Mail,
    },
    {
      label: "GitHub",
      value: "arnavbule",
      href: "https://github.com/arnavbule",
      icon: Github,
    },
    {
      label: "Phone",
      value: "+91 87676 02012",
      href: "tel:+918767602012",
      icon: Phone,
    },
    {
      label: "Location",
      value: "Pune, Maharashtra, India",
      href: "#",
      icon: MapPin,
    },
  ]

  return (
    <section id="contact" className="py-20 bg-black text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Let's Create Together</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Have a project in mind? I'd love to hear about it and discuss how we can bring your vision to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
            <div className="space-y-4">
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-gray-300 text-sm">{contact.label}</p>
                      <a
                        href={contact.href}
                        className="text-white hover:text-blue-400 transition-colors"
                        target={contact.label === "GitHub" ? "_blank" : undefined}
                        rel={contact.label === "GitHub" ? "noopener noreferrer" : undefined}
                      >
                        {contact.value}
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Your Name"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
                <Input
                  type="email"
                  placeholder="Your Email"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <Input placeholder="Subject" className="bg-gray-800 border-gray-700 text-white placeholder-gray-400" />
              <Textarea
                placeholder="Your Message"
                rows={5}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Send Message</Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
