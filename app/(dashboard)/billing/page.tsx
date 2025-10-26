"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Download, Check } from "lucide-react"
import { motion } from "framer-motion"

export default function BillingPage() {
  return (
    <div className="">
      {/* Header: match Settings page style */}
      <div className="sticky top-0 z-10 bg-card/90 backdrop-blur-md border-b">
        <div className="mx-auto p-4 flex justify-between items-center max-w-[1200px] px-4 sm:px-6 lg:px-10 z-[99]">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Billing</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your subscription and billing</p>
          </div>
          <Badge variant="outline" className="text-xs px-3">Subscriptions</Badge>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-6 space-y-6">

      <Card className="card-standard">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are currently on the Premium plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border p-6">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-2xl font-bold">Premium Trader</h3>
                <Badge>Active</Badge>
              </div>
              <p className="text-3xl font-bold font-mono">
                $49.99<span className="text-base font-normal text-muted-foreground">/month</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">Next billing date: February 15, 2024</p>
            </div>
            <Button variant="outline" className="bg-transparent">Change Plan</Button>
          </div>

          <div className="mt-6 space-y-3">
            <p className="font-medium">Plan includes:</p>
            <ul className="space-y-2">
              {[
                "Real-time market data",
                "Advanced charting tools",
                "Automated trading strategies",
                "AI-powered insights",
                "Priority customer support",
                "API access",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-success" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="card-standard">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <div className="rounded bg-muted p-2">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="bg-transparent">
              Edit
            </Button>
          </div>
          <Button variant="outline" className="w-full bg-transparent">
            Add Payment Method
          </Button>
        </CardContent>
      </Card>

      <Card className="card-standard">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Download your previous invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "Jan 15, 2024", amount: "$49.99", status: "Paid" },
              { date: "Dec 15, 2023", amount: "$49.99", status: "Paid" },
              { date: "Nov 15, 2023", amount: "$49.99", status: "Paid" },
            ].map((invoice, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{invoice.date}</p>
                  <p className="text-sm text-muted-foreground">Premium Trader Plan</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-mono font-medium">{invoice.amount}</p>
                  <Badge variant="outline">{invoice.status}</Badge>
                  <Button variant="ghost" size="icon" aria-label={`Download invoice from ${invoice.date}`}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </div>
      </motion.div>
    </div>
  )
}
