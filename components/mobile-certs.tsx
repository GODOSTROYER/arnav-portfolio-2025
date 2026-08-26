"use client"

/* /dev mobile certifications: a honeycomb of hexagonal badges — one hex per
   cert, wearing its issuer's brand icon and color. Tap (or focus + Enter) a
   badge and it lights up with a beam-gradient rim + the site's gold/magenta
   bloom, and the full certification title appears in the caption below.

   Geometry: pointy-top hexagons (clip-path), rows of 3-2-3-1 nested by a
   negative vertical margin (rows overlap by 25% of hex height minus the gap).
   clip-path clips box-shadows, so glows are drop-shadow filters on an
   unclipped wrapper. Cert titles come from the same certifications[] array
   the desktop column renders. */

import { motion } from "framer-motion"
import { Award } from "lucide-react"
import { useState } from "react"
import { FaAws } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { SiCisco, SiCoursera, SiDatabricks, SiGeeksforgeeks } from "react-icons/si"
import type { IconType } from "react-icons"

import { certifications } from "./main-content-section"

const W = 96
const H = 111 // pointy-top: height = width * 2/√3

/* issuer icon + brand color + short label, index-paired with certifications[].
   FcGoogle is the multicolor "G" — it paints its own fills, color is unused. */
const BADGE_META: { Icon: IconType; color: string; short: string }[] = [
  { Icon: SiDatabricks, color: "#FF3621", short: "Data Eng Pro" },
  { Icon: SiDatabricks, color: "#FF3621", short: "Data Analyst" },
  { Icon: SiDatabricks, color: "#FF3621", short: "Gen AI" },
  { Icon: SiDatabricks, color: "#FF3621", short: "ML Pro" },
  { Icon: SiCoursera, color: "#0056D2", short: "ML Spec" },
  { Icon: FcGoogle, color: "#4285F4", short: "Project Mgmt" },
  { Icon: FcGoogle, color: "#4285F4", short: "Data Analytics" },
  { Icon: SiCisco, color: "#1BA0D7", short: "Networking" },
  { Icon: SiGeeksforgeeks, color: "#2F8D46", short: "DSA to Dev" },
  { Icon: FaAws, color: "#FF9900", short: "Solutions Arch" },
  { Icon: FaAws, color: "#FF9900", short: "ML Associate" },
  { Icon: FaAws, color: "#FF9900", short: "AWS · GCP" },
]

const badges = certifications.map((name, i) => ({
  name,
  ...(BADGE_META[i] ?? { Icon: Award as unknown as IconType, color: "#6344F5", short: "Certified" }),
}))

/* honeycomb rows: 2-3-2-3-2 — alternating widths nest without any manual
   offset (each centered 2-row sits in the valleys of its 3-row neighbors) */
const ROWS: number[][] = [[0, 1], [2, 3, 4], [5, 6], [7, 8, 9], [10, 11]].map((row) =>
  row.filter((i) => i < badges.length)
)

export default function MobileCerts() {
  const [sel, setSel] = useState<number | null>(null)

  return (
    <section id="certs" className="relative flex min-h-[90svh] flex-col justify-center overflow-hidden px-4 py-14">
      <div className="mb-8 text-center">
        <h2 className="section-heading text-2xl text-gray-900 dark:text-white transition-colors duration-300">
          Certifications
        </h2>
        <p className="small-text mt-1 text-sm text-gray-500 dark:text-gray-400">{badges.length} and counting</p>
      </div>

      {/* scaled down a notch on very narrow phones so a 3-hex row never clips */}
      <div className="flex flex-col items-center max-[359px]:origin-top max-[359px]:scale-[0.82]">
        {ROWS.map((row, r) => (
          <div key={r} className={`flex gap-1.5 ${r > 0 ? "-mt-[22px]" : ""}`}>
            {row.map((i) => {
              const b = badges[i]
              const active = sel === i
              return (
                /* filter lives on this unclipped wrapper (clip-path would cut
                   the glow off); the button itself is hex-clipped so taps
                   hit-test the hexagon, not the bounding rectangle — rows
                   overlap vertically and rectangles would steal each other's
                   corner taps */
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ type: "spring", stiffness: 320, damping: 24, delay: i * 0.05 }}
                  className="block"
                  style={{
                    width: W,
                    height: H,
                    filter: active
                      ? "drop-shadow(0 0 12px rgba(253,224,71,0.4)) drop-shadow(0 0 18px rgba(217,70,239,0.45))"
                      : "drop-shadow(0 4px 10px rgba(0,0,0,0.22))",
                  }}
                >
                  <motion.button
                    onClick={() => setSel(active ? null : i)}
                    aria-label={b.name}
                    aria-pressed={active}
                    whileTap={{ scale: 0.93 }}
                    className="group relative h-full w-full [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)] focus-visible:outline-none"
                  >
                    {/* rim: gray at rest, beam gradient when lit or focused */}
                    <span
                      aria-hidden
                      className={`absolute left-0 top-0 h-full w-full ${
                        active
                          ? "bg-gradient-to-br from-[#18CCFC] via-[#6344F5] to-[#AE48FF]"
                          : "bg-gray-300/90 group-focus-visible:bg-gradient-to-br group-focus-visible:from-[#18CCFC] group-focus-visible:via-[#6344F5] group-focus-visible:to-[#AE48FF] dark:bg-gray-700"
                      }`}
                    />
                    {/* face */}
                    <span
                      aria-hidden
                      className="absolute flex flex-col items-center justify-center gap-1.5 bg-white/95 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)] dark:bg-gray-900/95"
                      style={{ left: 2, top: 2, width: W - 4, height: H - 4 }}
                    >
                      <b.Icon size={28} color={b.color} />
                      <span className="small-text px-2 text-center text-[10px] font-semibold leading-tight text-gray-700 dark:text-gray-300">
                        {b.short}
                      </span>
                    </span>
                  </motion.button>
                </motion.span>
              )
            })}
          </div>
        ))}
      </div>

      {/* the full title of whichever badge is lit */}
      <p aria-live="polite" className="mx-auto mt-6 min-h-10 max-w-[320px] text-center text-sm font-medium text-gray-700 dark:text-gray-300">
        {sel !== null ? badges[sel].name : <span className="text-gray-500 dark:text-gray-400">Tap a badge for the full title</span>}
      </p>
    </section>
  )
}
