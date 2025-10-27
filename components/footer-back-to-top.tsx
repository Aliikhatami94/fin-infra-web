"use client"

import { ArrowUp } from "lucide-react"

export function FooterBackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center gap-2 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
      aria-label="Scroll back to top of page"
    >
      <ArrowUp className="h-4 w-4" aria-hidden="true" />
      Back to top
    </button>
  )
}
