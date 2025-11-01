"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, CreditCard, Landmark, Plus, RefreshCw, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PlaidLinkDialog } from "@/components/plaid-link-dialog"

const connectedAccounts = [
  {
    id: 1,
    name: "Chase Checking",
    type: "Checking",
    institution: "Chase Bank",
    balance: "$12,450.78",
    lastSync: "2 hours ago",
    icon: Building2,
    status: "connected",
  },
  {
    id: 2,
    name: "Chase Savings",
    type: "Savings",
    institution: "Chase Bank",
    balance: "$45,000.00",
    lastSync: "2 hours ago",
    icon: Landmark,
    status: "connected",
  },
  {
    id: 3,
    name: "Amex Gold Card",
    type: "Credit Card",
    institution: "American Express",
    balance: "-$2,345.67",
    lastSync: "1 day ago",
    icon: CreditCard,
    status: "needs_update",
  },
  {
    id: 4,
    name: "Capital One 360",
    type: "Savings",
    institution: "Capital One",
    balance: "$32,000.00",
    lastSync: "5 hours ago",
    icon: Building2,
    status: "connected",
  },
]

export function ConnectedAccounts() {
  const [isPlaidOpen, setIsPlaidOpen] = useState(false)

  return (
    <>
      <Card className="card-standard">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>Manage your linked bank accounts and credit cards</CardDescription>
            </div>
            <Button size="sm" className="gap-2" onClick={() => setIsPlaidOpen(true)}>
              <Plus className="h-4 w-4" />
              Connect Account
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {connectedAccounts.map((account) => {
              const Icon = account.icon
              return (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold">{account.name}</p>
                        {account.status === "needs_update" && (
                          <Badge variant="outline" className="text-xs h-5 border-destructive/50 text-destructive">
                            Update Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {account.institution} • {account.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className="text-base font-semibold font-mono tabular-nums">{account.balance}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Manage ${account.name}`}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Transactions</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Disconnect</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <PlaidLinkDialog open={isPlaidOpen} onOpenChange={setIsPlaidOpen} />
    </>
  )
}
