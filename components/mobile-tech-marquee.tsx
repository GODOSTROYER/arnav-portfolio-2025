"use client"

/* /dev mobile technologies: the tall tile grid becomes two counter-scrolling
   infinite marquee rows of chips — self-animating, ~1/5 the height. Content
   comes from the same techStack the desktop grid renders. */

import { techStack } from "./technologies-section"

const rowA = techStack.filter((_, i) => i % 2 === 0)
const rowB = techStack.filter((_, i) => i % 2 === 1)

function Row({ items, reverse }: { items: typeof techStack; reverse?: boolean }) {
  return (
    <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div
        className="flex w-max gap-3 pr-3 motion-reduce:[animation-play-state:paused]"
        style={{ animation: `dev-marquee ${reverse ? 34 : 27}s linear infinite ${reverse ? "reverse" : "normal"}` }}
      >
        {/* second copy exists only for the seamless loop — hidden from AT so
            no technology is announced twice */}
        {[0, 1].map((copy) => (
          <span key={copy} aria-hidden={copy === 1 || undefined} className="flex gap-3">
            {items.map((t) => (
              <span
                key={t.label}
                className="flex shrink-0 items-center gap-2 rounded-full border border-gray-200/70 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80"
              >
                <t.Icon size={18} className={t.color} />
                <span className="small-text text-sm text-gray-700 dark:text-gray-300">{t.label}</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function MobileTechMarquee() {
  return (
    <section id="technologies" className="relative flex min-h-[85svh] flex-col justify-center py-14">
      <div className="mb-8 px-6 text-center">
        <h2 className="section-heading text-2xl text-gray-900 dark:text-white transition-colors duration-300">Technologies</h2>
        <p className="small-text mt-1 text-sm text-gray-500 dark:text-gray-400">The toolkit, in motion</p>
      </div>
      <div className="space-y-3">
        <Row items={rowA} />
        <Row items={rowB} reverse />
      </div>
    </section>
  )
}
