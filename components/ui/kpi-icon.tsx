"use client"

import type { HTMLAttributes } from "react"
import type { LucideIcon } from "lucide-react"
import type { IconComponent } from "@/types/domain"

import { cn } from "@/lib/utils"
import { getSemanticToneStyles, type SemanticTone } from "@/lib/color-utils"

type KPIIconSize = "sm" | "md" | "lg"

type KPIIconShape = "rounded" | "circle"

export interface KPIIconProps extends HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon | IconComponent
  tone?: SemanticTone
  size?: KPIIconSize
  shape?: KPIIconShape
  iconClassName?: string
}

const sizeClasses: Record<KPIIconSize, string> = {
  sm: "h-9 w-9 md:h-10 md:w-10",
  md: "h-10 w-10 md:h-11 md:w-11",
  lg: "h-11 w-11 md:h-12 md:w-12",
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
      <Icon className={cn("h-4 w-4 md:h-5 md:w-5", iconClass, iconClassName)} aria-hidden="true" />
    </div>
  )
}
