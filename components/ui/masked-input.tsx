"use client"

import * as React from "react"
import { Eye, EyeOff, ShieldAlert, ShieldCheck } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { Input } from "./input"

type MaskedInputProps = React.ComponentProps<typeof Input> & {
  mask?: (value: string) => string
  status?: "verified" | "unverified"
  statusLabel?: string
  containerClassName?: string
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  (
    {
      className,
      value,
      mask = maskEmail,
      status = "verified",
      statusLabel,
      containerClassName,
      onChange,
      type,
      ...props
    },
    forwardedRef,
  ) => {
    const [isRevealed, setIsRevealed] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement | null>(null)

    const assignRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof forwardedRef === "function") {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
      },
      [forwardedRef],
    )

    const stringValue = typeof value === "string" ? value : value?.toString() ?? ""
    const maskedValue = mask(stringValue)
    const displayValue = isRevealed ? stringValue : maskedValue
    const resolvedStatusLabel = statusLabel ?? (status === "unverified" ? "Unverified" : "Verified")

    const handleToggle = () => {
      setIsRevealed((previous) => {
        const next = !previous
        if (typeof window !== "undefined") {
          window.requestAnimationFrame(() => {
            if (next) {
              inputRef.current?.focus()
            }
          })
        }
        return next
      })
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isRevealed) {
        event.preventDefault()
        return
      }

      onChange?.(event)
    }

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        <div className="relative">
          <Input
            {...props}
            ref={assignRef}
            type={type ?? "text"}
            value={displayValue}
            onChange={handleChange}
            readOnly={!isRevealed}
            className={cn("pr-24 font-mono text-sm", className)}
            aria-live="polite"
          />
          <button
            type="button"
            onClick={handleToggle}
            className="absolute inset-y-0 right-2 inline-flex items-center gap-1 rounded-md px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            aria-pressed={isRevealed}
            aria-label={isRevealed ? "Hide contact" : "Reveal contact"}
          >
            {isRevealed ? (
              <EyeOff aria-hidden className="h-3.5 w-3.5" />
            ) : (
              <Eye aria-hidden className="h-3.5 w-3.5" />
            )}
            {isRevealed ? "Hide" : "Reveal"}
          </button>
        </div>
        <div
          className="flex items-center justify-between text-[11px] font-medium uppercase text-muted-foreground"
          aria-live="polite"
        >
          <span>{isRevealed ? "Visible" : "Masked"}</span>
          {stringValue ? (
            <Badge
              variant="outline"
              className={cn(
                "inline-flex items-center gap-1 border border-current px-2 py-0.5 text-[10px] font-semibold",
                status === "unverified"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400",
              )}
            >
              {status === "unverified" ? (
                <ShieldAlert aria-hidden className="h-3 w-3" />
              ) : (
                <ShieldCheck aria-hidden className="h-3 w-3" />
              )}
              {resolvedStatusLabel}
            </Badge>
          ) : (
            <span className="text-muted-foreground/70">No contact added</span>
          )}
        </div>
      </div>
    )
  },
)

MaskedInput.displayName = "MaskedInput"

function maskEmail(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return ""
  }

  if (!trimmed.includes("@")) {
    return "••••••"
  }

  const [localPart, domainPart] = trimmed.split("@")
  const visibleLocal = localPart.slice(0, Math.min(localPart.length, 2))
  const maskedLocal = `${visibleLocal}${"•".repeat(Math.max(localPart.length - visibleLocal.length, 3))}`

  const domainSections = domainPart.split(".")
  const maskedDomain = domainSections
    .map((section, index) => {
      if (index === domainSections.length - 1) {
        return section
      }

      if (section.length <= 2) {
        return `${section[0] ?? ""}•`
      }

      return `${section.slice(0, 1)}${"•".repeat(section.length - 1)}`
    })
    .join(".")

  return `${maskedLocal}@${maskedDomain}`
}

function maskPhone(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    return ""
  }

  // Extract only digits
  const digits = trimmed.replace(/\D/g, "")
  if (digits.length === 0) {
    return "••••"
  }

  // Show last 4 digits
  const visiblePart = digits.slice(-4)
  return `••••-${visiblePart}`
}

export { MaskedInput, maskEmail, maskPhone }
