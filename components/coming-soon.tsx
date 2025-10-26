"use client"

import type { ReactElement } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type ComingSoonProps = {
  children: ReactElement
  message?: string
}

export function ComingSoon({ children, message = "Coming soon" }: ComingSoonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className="inline-flex w-full max-w-full cursor-not-allowed opacity-60 pointer-events-none"
          aria-disabled="true"
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="center" role="status">
        {message}
      </TooltipContent>
    </Tooltip>
  )
}
