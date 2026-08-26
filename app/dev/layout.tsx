import type { Metadata } from "next"
import type { ReactNode } from "react"

/* /dev is the mobile-experience preview — never indexed */
export const metadata: Metadata = {
  title: "Mobile Preview — Arnav Bule",
  robots: { index: false, follow: false },
}

export default function DevLayout({ children }: { children: ReactNode }) {
  return children
}
