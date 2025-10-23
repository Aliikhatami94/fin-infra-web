export interface ActivationCohortPoint {
  month: string
  started: number
  completed: number
  linked: number
  automations: number
}

export interface RetentionCohortPoint {
  cohort: string
  month1: number
  month3: number
  month6: number
}

export interface AutomationAdoptionPoint {
  week: string
  suggestionsViewed: number
  suggestionsAccepted: number
  automationsScheduled: number
  feedbackResponseRate: number
}

export interface OnboardingDropoffPoint {
  stepId: string
  label: string
  started: number
  completed: number
}

export const activationCohorts: ActivationCohortPoint[] = [
  { month: "Jan", started: 820, completed: 612, linked: 498, automations: 142 },
  { month: "Feb", started: 910, completed: 688, linked: 552, automations: 168 },
  { month: "Mar", started: 978, completed: 742, linked: 601, automations: 191 },
  { month: "Apr", started: 1056, completed: 806, linked: 665, automations: 214 },
  { month: "May", started: 1174, completed: 904, linked: 732, automations: 236 },
  { month: "Jun", started: 1238, completed: 956, linked: 781, automations: 255 },
]

export const retentionCohorts: RetentionCohortPoint[] = [
  { cohort: "2023 Q4", month1: 82, month3: 74, month6: 68 },
  { cohort: "2024 Q1", month1: 84, month3: 77, month6: 71 },
  { cohort: "2024 Q2", month1: 87, month3: 79, month6: 0 },
]

export const automationAdoption: AutomationAdoptionPoint[] = [
  { week: "2024-05-06", suggestionsViewed: 432, suggestionsAccepted: 218, automationsScheduled: 176, feedbackResponseRate: 42 },
  { week: "2024-05-13", suggestionsViewed: 458, suggestionsAccepted: 237, automationsScheduled: 189, feedbackResponseRate: 44 },
  { week: "2024-05-20", suggestionsViewed: 486, suggestionsAccepted: 251, automationsScheduled: 203, feedbackResponseRate: 46 },
  { week: "2024-05-27", suggestionsViewed: 512, suggestionsAccepted: 266, automationsScheduled: 217, feedbackResponseRate: 47 },
  { week: "2024-06-03", suggestionsViewed: 541, suggestionsAccepted: 284, automationsScheduled: 233, feedbackResponseRate: 49 },
  { week: "2024-06-10", suggestionsViewed: 568, suggestionsAccepted: 301, automationsScheduled: 248, feedbackResponseRate: 51 },
]

export const onboardingDropoff: OnboardingDropoffPoint[] = [
  { stepId: "profile", label: "Persona setup", started: 1000, completed: 874 },
  { stepId: "connect", label: "Institution linking", started: 874, completed: 712 },
  { stepId: "personalize", label: "Money graph preview", started: 712, completed: 642 },
]
