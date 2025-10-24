"use client"

import { cloneElement, isValidElement, type ReactElement } from "react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type ComingSoonProps = {
  children: ReactElement
  message?: string
}

export function ComingSoon({ children, message = "Coming soon" }: ComingSoonProps) {
  if (!isValidElement(children)) {
    return children
  }

  const disabledChild = cloneElement(children, {
    disabled: true,
    tabIndex: -1,
    className: cn("pointer-events-none opacity-60", children.props.className),
    "aria-disabled": true,
  })

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex w-full max-w-full cursor-not-allowed">
          {disabledChild}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="center" role="status">
        {message}
      </TooltipContent>
    </Tooltip>
  )
}

