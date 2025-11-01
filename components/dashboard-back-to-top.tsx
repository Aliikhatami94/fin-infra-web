"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DashboardBackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const mainContent = document.getElementById("main-content")
    if (!mainContent) return

    const toggleVisibility = () => {
      // Show button when scrolled down more than 300px
      if (mainContent.scrollTop > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    mainContent.addEventListener("scroll", toggleVisibility)

    return () => {
      mainContent.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    const mainContent = document.getElementById("main-content")
    if (mainContent) {
      mainContent.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      scrollToTop()
    }
  }

  return (
    <div className="md:hidden">
      <Button
        onClick={scrollToTop}
        onKeyDown={handleKeyDown}
        size="icon"
        aria-label="Back to top"
        className={cn(
          // Mobile only, positioned above chat button
          "fixed bottom-20 right-4 z-[100] h-12 w-12 rounded-full shadow-lg transition-all duration-300",
          "hover:shadow-xl hover:-translate-y-1",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          isVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        <ArrowUp className="h-6 w-6" aria-hidden="true" />
      </Button>
    </div>
  )
}
