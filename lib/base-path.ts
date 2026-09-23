/* Base path for the /dev preview build (NEXT_PUBLIC_BASE_PATH=/dev, served at
   www.arnavbule.in/dev through a vercel.json rewrite). Empty in production.
   next/link and _next assets pick basePath up automatically; plain asset URLs
   (public/ images, the resume PDF, the pdf.js worker) go through withBase. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
export const withBase = (path: string) => `${BASE_PATH}${path}`
