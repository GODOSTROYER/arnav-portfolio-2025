import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
})

const SITE_URL = "https://www.arnavbule.in"
const DESCRIPTION =
  "Portfolio of Arnav Prashant Bule — AI/ML developer and data science intern building production ETL pipelines, full-stack apps, and ML-powered tools."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Arnav Prashant Bule - Portfolio",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Arnav Bule",
    title: "Arnav Prashant Bule — AI/ML Developer",
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Arnav Bule — AI/ML Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arnav Prashant Bule — AI/ML Developer",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
}

/* JSON-LD Person schema for rich search results */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Arnav Prashant Bule",
  url: SITE_URL,
  jobTitle: "AI/ML Developer",
  sameAs: ["https://github.com/GODOSTROYER/", "https://www.linkedin.com/in/arnavbule/"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`scroll-smooth ${poppins.variable}`} suppressHydrationWarning>
      <body className={`${poppins.className} antialiased transition-colors duration-300`} suppressHydrationWarning>
        <ThemeProvider defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  )
}
