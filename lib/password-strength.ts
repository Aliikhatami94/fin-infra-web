export type PasswordStrengthLevel = "weak" | "fair" | "good" | "strong"

export interface PasswordStrengthResult {
  score: number
  percentage: number
  level: PasswordStrengthLevel
  label: string
  guidance: string
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

  const lengthScore = password.length >= 12 ? 2 : password.length >= 8 ? 1 : 0
  score += lengthScore

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1
  }

  if (/\d/.test(password)) {
    score += 1
  }

  if (/[^\w\s]/.test(password)) {
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
  }
}
