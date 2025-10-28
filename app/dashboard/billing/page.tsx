"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Download, Check } from "lucide-react"
import { motion } from "framer-motion"

export default function BillingPage() {
  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-foreground">Billing</h1>
              <p className="text-sm text-muted-foreground">Manage your subscription and billing</p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-6 space-y-6"
      >
        {/* Current Plan */}
        <Card className="card-standard">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>You are currently on the Premium plan</CardDescription>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Premium Trader</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">$49.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground">Next billing date: February 15, 2024</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium">Plan includes:</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {[
                  "Real-time market data",
                  "Advanced charting tools",
                  "Automated trading strategies",
                  "AI-powered insights",
                  "Priority customer support",
                  "API access",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline">Change Plan</Button>
              <Button variant="ghost">Cancel Subscription</Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="card-standard">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Visa •••• 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Default</Badge>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <CreditCard className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card className="card-standard">
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>Download your previous invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {[
                { date: "Jan 15, 2024", amount: "$49.99", status: "Paid" },
                { date: "Dec 15, 2023", amount: "$49.99", status: "Paid" },
                { date: "Nov 15, 2023", amount: "$49.99", status: "Paid" },
              ].map((invoice, i) => (
                <div key={i} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{invoice.date}</p>
                    <p className="text-xs text-muted-foreground">Premium Trader Plan</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{invoice.amount}</span>
                    <Badge variant="outline" className="text-xs">{invoice.status}</Badge>
                    <Button variant="ghost" size="icon" aria-label={`Download invoice from ${invoice.date}`}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
