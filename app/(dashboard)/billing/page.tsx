"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Download, Check } from "lucide-react"

export default function BillingPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
          <p className="text-muted-foreground mt-2">Manage your subscription and billing information</p>
        </div>

        <Card className="card-standard">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the Premium plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 border rounded-lg">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold">Premium Trader</h3>
                  <Badge>Active</Badge>
                </div>
                <p className="text-3xl font-bold font-mono">
                  $49.99<span className="text-base font-normal text-muted-foreground">/month</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">Next billing date: February 15, 2024</p>
              </div>
              <Button variant="outline">Change Plan</Button>
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
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded">
                  <CreditCard className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
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
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{invoice.date}</p>
                    <p className="text-sm text-muted-foreground">Premium Trader Plan</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-mono font-medium">{invoice.amount}</p>
                    <Badge variant="outline">{invoice.status}</Badge>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
