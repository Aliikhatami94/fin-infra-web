"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, CheckCircle2, Loader2, Building2, CreditCard } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const popularBanks = [
  { name: "Chase", type: "bank" },
  { name: "Bank of America", type: "bank" },
  { name: "Wells Fargo", type: "bank" },
  { name: "Citi", type: "bank" },
  { name: "Capital One", type: "bank" },
  { name: "US Bank", type: "bank" },
  { name: "PNC Bank", type: "bank" },
  { name: "TD Bank", type: "bank" },
  { name: "American Express", type: "card" },
  { name: "Discover", type: "card" },
]

interface PlaidLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlaidLinkDialog({ open, onOpenChange }: PlaidLinkDialogProps) {
  const [step, setStep] = useState<"search" | "credentials" | "connecting" | "success">("search")
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBanks = popularBanks.filter((bank) => bank.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleBankSelect = (bankName: string) => {
    setSelectedBank(bankName)
    setStep("credentials")
  }

  const handleConnect = () => {
    setStep("connecting")
    // Simulate connection
    setTimeout(() => {
      setStep("success")
      setTimeout(() => {
        onOpenChange(false)
        // Reset state
        setTimeout(() => {
          setStep("search")
          setSelectedBank(null)
          setSearchQuery("")
        }, 300)
      }, 2000)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {step === "search" && (
          <>
            <DialogHeader>
              <DialogTitle>Connect Your Bank Account</DialogTitle>
              <DialogDescription>Search for your bank or financial institution</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for your bank..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {filteredBanks.map((bank) => (
                    <button
                      key={bank.name}
                      onClick={() => handleBankSelect(bank.name)}
                      className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors text-left"
                    >
                      <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                        {bank.type === "bank" ? (
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <span className="font-medium text-sm">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </>
        )}

        {step === "credentials" && (
          <>
            <DialogHeader>
              <DialogTitle>Sign in to {selectedBank}</DialogTitle>
              <DialogDescription>Enter your online banking credentials</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Enter your username" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" />
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep("search")} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleConnect} className="flex-1">
                  Connect
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Your credentials are encrypted and securely transmitted through Plaid
              </p>
            </div>
          </>
        )}

        {step === "connecting" && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connecting to {selectedBank}</h3>
            <p className="text-sm text-muted-foreground">This may take a few moments...</p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Successfully Connected!</h3>
            <p className="text-sm text-muted-foreground">Your {selectedBank} account has been linked</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
