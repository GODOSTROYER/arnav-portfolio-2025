"use client";

import dynamic from 'next/dynamic';
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import Footer from "@/components/footer";

const PdfResumeViewer = dynamic(
  () => import('@/components/PdfResumeViewer'),
  { ssr: false }
);

export default function ResumePage() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col justify-between items-center transition-colors duration-300 bg-white dark:bg-black`}
      style={{
        position: "relative",
      }}
    >
      {/* Header */}
      <header className="w-full flex flex-col items-center py-8 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black z-10">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">My Resume</h1>
        <div className="flex gap-4">
          <a
            href="/Arnav - Resume.pdf"
            download
            className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
          >
            Download PDF
          </a>
          <Link
            href="/"
            className="px-6 py-2 rounded-full bg-gray-200 text-gray-900 font-semibold shadow hover:bg-gray-300 transition-colors dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* PDF Viewer with golden glow in dark mode */}
      <main className="flex-1 flex flex-col items-center justify-center w-full py-8">
        <div
          className="relative flex justify-center items-center"
          style={{ minHeight: 350 * 1.7 + 32 }}
        >
          {/* Golden glow in dark mode */}
          <div
            className="hidden dark:block absolute inset-0 z-0 pointer-events-none"
            style={{
              filter: "blur(32px)",
              background: "radial-gradient(circle, rgba(255,215,0,0.18) 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 rounded-2xl overflow-hidden bg-white dark:bg-black shadow-xl p-2">
            <PdfResumeViewer />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
} 