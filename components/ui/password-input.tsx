import * as React from "react"
import { CheckCircle2, Circle, Eye, EyeOff } from "lucide-react"

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
            className="absolute right-2 top-1/2 flex -translate-y-1/2 transform items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 touch-target touch-target-circle"
            aria-label={isVisible ? "Hide password" : "Show password"}
          >
            {isVisible ? <EyeOff aria-hidden="true" className="h-4 w-4" /> : <Eye aria-hidden="true" className="h-4 w-4" />}
          </button>
        </div>
        {showStrength ? (
          <div id={resolvedStrengthId} className="mt-2 space-y-2" aria-live="polite">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full transition-all duration-300 ease-out", strengthColorClasses[strength.level])}
                  style={{ width: `${strength.percentage}%` }}
                />
              </div>
              <span className="font-medium text-foreground">{strength.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">{strength.guidance}</p>
            <ul className="space-y-1.5">
              {strength.requirements.map((requirement) => (
                <li key={requirement.id} className="flex items-center gap-2 text-xs">
                  {requirement.met ? (
                    <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Circle aria-hidden="true" className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span className={requirement.met ? "text-foreground" : "text-muted-foreground"}>
                    {requirement.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    )
  },
)

PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
