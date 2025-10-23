"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

export type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, ...props }, ref) => {
    return (
      <SwitchPrimitive.Root
        ref={ref}
        data-slot="switch"
        className={cn(
          "inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all",
          "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
          "focus-visible:outline-hidden focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
            "bg-background data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0",
            "dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground",
          )}
        />
      </SwitchPrimitive.Root>
    )
  },
)
Switch.displayName = SwitchPrimitive.Root.displayName

interface SwitchFieldProps extends SwitchProps {
  label: React.ReactNode
  description?: React.ReactNode
  layout?: "split" | "inline"
  containerClassName?: string
}

export const SwitchField = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchFieldProps>(
  ({ label, description, layout = "split", containerClassName, className, ...props }, ref) => {
    const generatedId = React.useId()
    const fieldId = props.id ?? generatedId
    const labelId = `${fieldId}-label`
    const descriptionId = description ? `${fieldId}-description` : undefined

    if (layout === "inline") {
      return (
        <div className={cn("flex items-center gap-2 text-sm", containerClassName)}>
          <Switch ref={ref} id={fieldId} aria-labelledby={labelId} aria-describedby={descriptionId} className={className} {...props} />
          <span id={labelId} className="text-foreground">
            {label}
          </span>
          {description ? (
            <p id={descriptionId} className="sr-only">
              {description}
            </p>
          ) : null}
        </div>
      )
    }

    return (
      <div className={cn("flex w-full items-start justify-between gap-4", containerClassName)}>
        <div className="space-y-1">
          <span id={labelId} className="text-sm font-medium text-foreground">
            {label}
          </span>
          {description ? (
            <p id={descriptionId} className="text-xs text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <Switch
          ref={ref}
          id={fieldId}
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
          className={className}
          {...props}
        />
      </div>
    )
  },
)
SwitchField.displayName = "SwitchField"

export { Switch }
