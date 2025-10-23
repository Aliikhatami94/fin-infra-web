import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { evaluatePasswordStrength } from "@/lib/password-strength"
import { cn } from "@/lib/utils"
import { Input } from "./input"

type PasswordInputProps = React.ComponentProps<typeof Input> & {
  showStrength?: boolean
  strengthHintId?: string
}

const strengthColorClasses = {
  weak: "bg-destructive",
  fair: "bg-amber-500",
  good: "bg-blue-500",
  strong: "bg-emerald-500",
} as const

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, value, showStrength = false, strengthHintId, "aria-describedby": ariaDescribedBy, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)
    const internalStrengthId = React.useId()
    const resolvedStrengthId = showStrength ? strengthHintId ?? internalStrengthId : undefined
    const passwordValue = typeof value === "string" ? value : value?.toString() ?? ""
    const strength = React.useMemo(() => evaluatePasswordStrength(passwordValue), [passwordValue])

    const combinedDescribedBy = [ariaDescribedBy, resolvedStrengthId].filter(Boolean).join(" ") || undefined

    return (
      <div>
        <div className="relative">
          <Input
            ref={ref}
            type={isVisible ? "text" : "password"}
            value={value}
            className={cn("pr-10", className)}
            aria-describedby={combinedDescribedBy}
            {...props}
          />
          <button
            type="button"
            onClick={() => setIsVisible((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center rounded-md px-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            aria-label={isVisible ? "Hide password" : "Show password"}
          >
            {isVisible ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
          </button>
        </div>
        {showStrength ? (
          <div
            id={resolvedStrengthId}
            className="mt-2 space-y-1.5 text-xs text-muted-foreground"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full transition-all duration-300 ease-out", strengthColorClasses[strength.level])}
                  style={{ width: `${strength.percentage}%` }}
                />
              </div>
              <span className="font-medium text-foreground">{strength.label}</span>
            </div>
            <p>{strength.guidance}</p>
          </div>
        ) : null}
      </div>
    )
  },
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
