'use client'

import { Linkedin } from 'react-feather'

export default function ConnectSection() {
  return (
    <section className="mt-16 px-4" id="contact">
      <article
        style={{ background: 'linear-gradient(45deg, #0037ff, #0088ff)' }}
        className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-10 rounded-3xl text-white shadow-2xl"
      >
        <div className="md:w-2/3">
          <p className="mb-6 text-3xl md:text-4xl font-bold leading-tight">
            Let's Connect and Collaborate!
          </p>
          <p className="text-base md:text-lg leading-relaxed">
            As an AI and Machine Learning enthusiast, I'm always excited to explore new ideas, share
            knowledge, and collaborate on projects that push the boundaries of technology. I’m not
            looking for a role, but I’d love to connect with others who share the same passion for
            AI, data science, and the endless possibilities they offer.
          </p>
          <p className="mt-3 text-base md:text-lg">Interested or want to get to know me a bit better?</p>
        </div>

        <div className="mt-6 md:mt-0 md:ml-8 md:w-1/3 flex flex-col items-start">
          <a
            href="https://www.linkedin.com/in/madhurpatil/"
            className="inline-flex items-center px-5 py-3 mb-4 text-base font-semibold text-black bg-white rounded-lg hover:opacity-90 transform hover:-translate-y-1 transition-all"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Linkedin size={20} />
            <span className="ml-2">Get in Touch</span>
          </a>
          <p className="text-sm md:text-base">
            Prefer email?
            <br />
            You can reach out to me at{' '}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=arnav.bule05@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white"
            >
              arnav.bule05@gmail.com
            </a>
          </p>
        </div>
      </article>
    </section>
  )
}
