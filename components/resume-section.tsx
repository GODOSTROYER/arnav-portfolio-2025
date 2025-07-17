"use client"

import { Download } from "react-feather";
import Link from "next/link";

export default function ResumeSection() {
  return (
    <section id="resume" className="pt-40 pb-20 bg-white dark:bg-black transition-colors duration-300">
      <div className="container">
        <div className="max-w-4xl mx-auto px-8 pb-8 border-2 border-blue-500 dark:border-blue-400 rounded-3xl bg-white dark:bg-black transition-colors duration-300 shadow-lg shadow-[0_0_24px_0_rgba(59,130,246,0.35)] dark:shadow-[0_0_24px_0_rgba(59,130,246,0.4)]">
          <p className="inline-flex items-center px-4 text-lg font-bold -translate-y-4 bg-white dark:bg-black text-blue-600 dark:text-blue-400 transform-gpu transition-colors duration-300">
            <Download size={24} className="mr-2" />
            Check Out My Resume
          </p>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">Get to Know More About Me</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">Click below to view or download my latest resume in PDF format from Google Drive.</p>
            <Link
              href="/resume"
              className="px-8 py-2 text-sm text-center text-white transition-colors border rounded-full bg-blue-600 dark:bg-black border-blue-500 dark:border-blue-400 shadow-[0_0_12px_0_rgba(59,130,246,0.35)] dark:shadow-[0_0_12px_0_rgba(59,130,246,0.4)] hover:border-blue-700 dark:hover:border-blue-500 hover:bg-blue-700 dark:hover:bg-black font-semibold"
            >
              View Resume
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
