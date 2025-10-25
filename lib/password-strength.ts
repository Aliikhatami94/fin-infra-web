export type PasswordStrengthLevel = "weak" | "fair" | "good" | "strong"

export interface PasswordRequirement {
  id: "length" | "number" | "symbol" | "case"
  label: string
  met: boolean
}

export interface PasswordStrengthResult {
  score: number
  percentage: number
  level: PasswordStrengthLevel
  label: string
  guidance: string
  requirements: PasswordRequirement[]
}

const guidanceByLevel: Record<PasswordStrengthLevel, string> = {
  weak: "Use at least eight characters with a mix of letters, numbers, and symbols.",
  fair: "Add more unique characters or a symbol to increase strength.",
  good: "Great! A few more characters or another symbol will make it even stronger.",
  strong: "Strong password. Keep it secret and don't reuse it elsewhere.",
}

const labelByLevel: Record<PasswordStrengthLevel, string> = {
  weak: "Weak",
  fair: "Fair",
  good: "Good",
  strong: "Strong",
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  let score = 0

  const hasMinLength = password.length >= 8
  const hasExtendedLength = password.length >= 12
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSymbol = /[^\w\s]/.test(password)

  // Award two points for extended length, one for minimum length
  score += hasExtendedLength ? 2 : hasMinLength ? 1 : 0

  if (hasMixedCase) {
    score += 1
  }

  if (hasNumber) {
    score += 1
  }

  if (hasSymbol) {
    score += 1
  }

  // Clamp to a maximum score of 4 for consistent meter display
  const clampedScore = Math.min(score, 4)

  let level: PasswordStrengthLevel
  if (clampedScore <= 1) {
    level = "weak"
  } else if (clampedScore === 2) {
    level = "fair"
  } else if (clampedScore === 3) {
    level = "good"
  } else {
    level = "strong"
  }

  return {
    score: clampedScore,
    percentage: (clampedScore / 4) * 100,
    level,
    label: labelByLevel[level],
    guidance: guidanceByLevel[level],
    requirements: [
      { id: "length", label: "At least 8 characters", met: hasMinLength },
      { id: "case", label: "Upper & lowercase letters", met: hasMixedCase },
      { id: "number", label: "Contains a number", met: hasNumber },
      { id: "symbol", label: "Contains a symbol", met: hasSymbol },
    ],
  }
}
