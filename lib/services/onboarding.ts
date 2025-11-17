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
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

  if (!token) {
    // Fallback to mock data if not authenticated
    await delay(200)
    return moneyGraph
  }

  try {
    // Fetch real account data from connected Plaid accounts
    const response = await fetch(`${API_URL}/v0/banking-connection/accounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.warn("[MoneyGraph] Failed to fetch accounts, using mock data")
      await delay(200)
      return moneyGraph
    }

    const data = await response.json()
    const accounts = data.accounts || []

    // Transform Plaid accounts into MoneyGraph format
    const graphAccounts: MoneyGraph["accounts"] = accounts.map((acc: any, idx: number) => ({
      id: `plaid-${acc.account_id}`,
      accountId: idx + 1,
      name: acc.name,
      institution: acc.institution_name || "Bank",
      type: acc.type || "depository",
      balance: acc.balances?.current || 0,
      intentTags: deriveIntentTags(acc.type, acc.subtype),
      supportsGoals: [1], // Default to supporting goal 1
    }))

    // Return Money Graph with real accounts but mock goals/transactions for now
    return {
      accounts: graphAccounts,
      transactions: [],
      goals: moneyGraph.goals,
      edges: [],
      personaSignals: moneyGraph.personaSignals,
      lastSynced: new Date().toISOString(),
    }
  } catch (error) {
    console.error("[MoneyGraph] Error fetching real data:", error)
    await delay(200)
    return moneyGraph
  }
}

function deriveIntentTags(type: string, subtype?: string): string[] {
  const tags: string[] = []
  
  if (type === "depository") {
    if (subtype === "checking") {
      tags.push("daily_spend", "bill_pay")
    } else if (subtype === "savings") {
      tags.push("emergency_fund", "savings")
    }
  } else if (type === "credit") {
    tags.push("credit", "spending")
  } else if (type === "investment") {
    tags.push("wealth_building", "retirement")
  } else if (type === "loan") {
    tags.push("debt_paydown")
  }
  
  return tags.length > 0 ? tags : ["general"]
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
