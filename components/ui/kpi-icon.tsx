"use client"

import type { HTMLAttributes } from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { getSemanticToneStyles, type SemanticTone } from "@/lib/color-utils"

type KPIIconSize = "sm" | "md" | "lg"

type KPIIconShape = "rounded" | "circle"

export interface KPIIconProps extends HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  tone?: SemanticTone
  size?: KPIIconSize
  shape?: KPIIconShape
  iconClassName?: string
}

const sizeClasses: Record<KPIIconSize, string> = {
  sm: "h-10 w-10",
  md: "h-11 w-11",
  lg: "h-12 w-12",
}

const shapeClasses: Record<KPIIconShape, string> = {
  rounded: "rounded-xl",
  circle: "rounded-full",
}

export function KPIIcon({
  icon: Icon,
  tone = "neutral",
  size = "sm",
  shape = "rounded",
  className,
  iconClassName,
  ...props
}: KPIIconProps) {
  const { surfaceClass, borderClass, iconClass } = getSemanticToneStyles(tone)
  const { ["aria-hidden"]: ariaHiddenProp, ...rest } = props
  const ariaHidden = ariaHiddenProp ?? true

  return (
    <div
      data-tone={tone}
      aria-hidden={ariaHidden}
      className={cn(
        "flex shrink-0 items-center justify-center border bg-card/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-sm transition-colors",
        sizeClasses[size],
        shapeClasses[shape],
        surfaceClass,
        borderClass,
        className,
      )}
      {...rest}
    >
      <Icon className={cn("h-5 w-5", iconClass, iconClassName)} aria-hidden="true" />
    </div>
  )
}
