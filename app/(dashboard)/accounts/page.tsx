import AccountsPageClient from "@/components/accounts-page.client"

export default function AccountsPage() {
  const totalCash = 12450.32 + 45230.0 + 32000.0
  const totalCreditDebt = 2340.12 + 1234.56
  const totalInvestments = 187650.45

  return (
    <AccountsPageClient
      totalCash={totalCash}
      totalCreditDebt={totalCreditDebt}
      totalInvestments={totalInvestments}
    />
  )
}
