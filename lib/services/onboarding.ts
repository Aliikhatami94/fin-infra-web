import { moneyGraph } from "@/lib/mock"
import type {
  LinkedInstitution,
  LinkedInstitutionAccount,
  MoneyGraph,
  OnboardingGoalFocus,
  OnboardingPersona,
} from "@/types/domain"

const INSTITUTION_ACCOUNTS: Record<string, LinkedInstitutionAccount[]> = {
  chase: [
    { id: "chase-checking", name: "Chase Total Checking", type: "Checking", mask: "5234", balance: 12450.32 },
    { id: "chase-savings", name: "Chase Savings", type: "Savings", mask: "8841", balance: 45230 },
  ],
  fidelity: [
    { id: "fidelity-brokerage", name: "Fidelity Brokerage", type: "Investment", mask: "7712", balance: 187650.45 },
  ],
  amex: [
    { id: "amex-gold", name: "Amex Gold", type: "Credit Card", mask: "1029", balance: -1234.56 },
  ],
  capitalone: [
    { id: "capitalone-360", name: "Capital One 360", type: "Savings", mask: "4410", balance: 0 },
  ],
}

export type InstitutionDefinition = {
  id: keyof typeof INSTITUTION_ACCOUNTS
  name: string
  description: string
  color: string
}

const INSTITUTIONS: InstitutionDefinition[] = [
  { id: "chase", name: "Chase", description: "Checking, savings, and credit", color: "bg-blue-500/10" },
  { id: "fidelity", name: "Fidelity", description: "Investments & retirement", color: "bg-emerald-500/10" },
  { id: "amex", name: "American Express", description: "Charge & credit cards", color: "bg-indigo-500/10" },
  { id: "capitalone", name: "Capital One", description: "Savings & credit", color: "bg-purple-500/10" },
]

const LINK_DELAY_MS = 900
const ERROR_INSTITUTION = "amex"

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function listLinkableInstitutions(): InstitutionDefinition[] {
  return INSTITUTIONS
}

export async function simulateInstitutionLink(
  institutionId: InstitutionDefinition["id"],
): Promise<LinkedInstitution> {
  await delay(LINK_DELAY_MS)
  const accounts = INSTITUTION_ACCOUNTS[institutionId]
  if (!accounts) {
    throw new Error("Institution not supported")
  }

  if (institutionId === ERROR_INSTITUTION && Math.random() < 0.5) {
    const error = new Error("We couldn't verify your credentials. Please try again.")
    ;(error as Error & { code?: string }).code = "LINK_FAILED"
    throw error
  }

  return {
    id: institutionId,
    name: INSTITUTIONS.find((institution) => institution.id === institutionId)?.name ?? institutionId,
    status: "connected",
    accounts,
    lastLinkedAt: new Date().toISOString(),
  }
}

export async function fetchMoneyGraph(): Promise<MoneyGraph> {
  await delay(200)
  return moneyGraph
}

export function derivePersonaFromGraph(graph: MoneyGraph): OnboardingPersona {
  return graph.personaSignals
}

export function buildPersonaSummary(persona: OnboardingPersona) {
  const goalCopy: Record<OnboardingGoalFocus, string> = {
    wealth_building: "Accelerate wealth building",
    debt_paydown: "Attack high-interest debt",
    financial_stability: "Protect short-term stability",
  }

  return {
    headline: goalCopy[persona.goalsFocus],
    detail: `Risk appetite: ${persona.riskTolerance}, Budgeting style: ${persona.budgetingStyle}.`,
  }
}
