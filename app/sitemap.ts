import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.arnavbule.in", changeFrequency: "monthly", priority: 1 },
    { url: "https://www.arnavbule.in/resume", changeFrequency: "monthly", priority: 0.8 },
  ]
}
