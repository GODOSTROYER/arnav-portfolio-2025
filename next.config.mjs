/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
        port: "",
        pathname: "/git-blob/**",
      },
    ],
    // you already disabled Next‑image optimisation, so a static export is fine
    unoptimized: true,
  },

  /** ▼ this is the only new line ▼ **/
  output: "export",          // tells Next.js to write the /out folder
};

export default nextConfig;
