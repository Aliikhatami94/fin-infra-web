"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  storageKey?: string
  className?: string
}

export function CollapsibleSection({
  title,
  children,
  defaultExpanded = true,
  storageKey,
  className = "",
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded)

  // Load saved state from localStorage
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey)
      if (saved !== null) {
        setIsOpen(saved === "true")
      }
    }
  }, [storageKey])

  // Save state to localStorage
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (storageKey) {
      localStorage.setItem(storageKey, String(open))
    }
  }

  return (
    <Collapsible open={isOpen} onOpenChange={handleOpenChange} className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <span className="text-sm">{isOpen ? "Collapse" : "Expand"}</span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}
