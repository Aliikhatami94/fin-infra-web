"use client"

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:text-sm focus:font-medium focus:border focus:border-border focus:rounded-md focus:shadow-md focus:outline-none"
    >
      Skip to main content
    </a>
  )
}
