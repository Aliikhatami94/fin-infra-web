"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SwitchField } from "@/components/ui/switch"
import { Play, Pause, Plus, TrendingUp, Shield, Zap } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useConnectivity } from "@/components/connectivity-provider"

const strategies = [
  {
    id: 1,
    name: "Momentum Trading",
    description: "Buy stocks with strong upward momentum",
    status: "active",
    profit: "+12.5%",
    trades: 24,
  },
  {
    id: 2,
    name: "Mean Reversion",
    description: "Buy oversold stocks, sell overbought",
    status: "active",
    profit: "+8.3%",
    trades: 18,
  },
  {
    id: 3,
    name: "Breakout Strategy",
    description: "Trade on price breakouts above resistance",
    status: "paused",
    profit: "+5.7%",
    trades: 12,
  },
]

const automationRules = [
  {
    id: 1,
    name: "Stop Loss Protection",
    description: "Automatically sell if loss exceeds 5%",
    enabled: true,
    icon: Shield,
  },
  {
    id: 2,
    name: "Take Profit",
    description: "Sell when profit reaches 15%",
    enabled: true,
    icon: TrendingUp,
  },
  {
    id: 3,
    name: "Portfolio Rebalancing",
    description: "Maintain target allocation ratios",
    enabled: false,
    icon: Zap,
  },
]

export function AutomationPanel() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    buyCondition: "",
    sellCondition: "",
    maxInvestment: "",
    stopLoss: "",
    takeProfit: "",
  })
  const { isOffline } = useConnectivity()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] New strategy created:", formData)
    // Reset form and close dialog
    setFormData({
      name: "",
      description: "",
      type: "",
      buyCondition: "",
      sellCondition: "",
      maxInvestment: "",
      stopLoss: "",
      takeProfit: "",
    })
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Trading Automation</h2>
          <p className="text-muted-foreground">
            Manage your automated trading strategies
            {isOffline ? " · Offline mode — automations paused" : ""}
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={isOffline} aria-disabled={isOffline} data-requires-online>
              <Plus className="h-4 w-4 mr-2" />
              New Strategy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Trading Strategy</DialogTitle>
              <DialogDescription>
                Set up an automated trading strategy with custom conditions and risk parameters
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Strategy Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Tech Stock Momentum"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your strategy..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Strategy Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select strategy type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="momentum">Momentum Trading</SelectItem>
                      <SelectItem value="mean-reversion">Mean Reversion</SelectItem>
                      <SelectItem value="breakout">Breakout Strategy</SelectItem>
                      <SelectItem value="swing">Swing Trading</SelectItem>
                      <SelectItem value="scalping">Scalping</SelectItem>
                      <SelectItem value="custom">Custom Strategy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="buyCondition">Buy Condition</Label>
                    <Input
                      id="buyCondition"
                      placeholder="e.g., RSI < 30"
                      value={formData.buyCondition}
                      onChange={(e) => setFormData({ ...formData, buyCondition: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellCondition">Sell Condition</Label>
                    <Input
                      id="sellCondition"
                      placeholder="e.g., RSI > 70"
                      value={formData.sellCondition}
                      onChange={(e) => setFormData({ ...formData, sellCondition: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxInvestment">Max Investment per Trade</Label>
                  <Input
                    id="maxInvestment"
                    type="number"
                    placeholder="1000"
                    value={formData.maxInvestment}
                    onChange={(e) => setFormData({ ...formData, maxInvestment: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                    <Input
                      id="stopLoss"
                      type="number"
                      placeholder="5"
                      value={formData.stopLoss}
                      onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="takeProfit">Take Profit (%)</Label>
                    <Input
                      id="takeProfit"
                      type="number"
                      placeholder="15"
                      value={formData.takeProfit}
                      onChange={(e) => setFormData({ ...formData, takeProfit: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Strategy</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Strategies</CardTitle>
            <CardDescription>Currently running</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-sm text-muted-foreground mt-1">+1 paused</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Profit</CardTitle>
            <CardDescription>From automation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">+$4,250</div>
            <p className="text-sm text-muted-foreground mt-1">+26.5% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Trades Executed</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">54</div>
            <p className="text-sm text-muted-foreground mt-1">89% success rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Strategies</CardTitle>
          <CardDescription>Your automated trading strategies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{strategy.name}</h3>
                  <Badge variant={strategy.status === "active" ? "default" : "secondary"}>{strategy.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{strategy.description}</p>
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-green-600 font-medium">{strategy.profit}</span>
                  <span className="text-muted-foreground">{strategy.trades} trades</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className={strategy.status === "active" ? "text-orange-600" : "text-green-600"}
                aria-label={strategy.status === "active" ? `Pause ${strategy.name}` : `Resume ${strategy.name}`}
                aria-pressed={strategy.status === "active"}
              >
                {strategy.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>Risk management and portfolio rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {automationRules.map((rule) => {
            const Icon = rule.icon
            return (
              <div
                key={rule.id}
                className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{rule.name}</h3>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                </div>
                <SwitchField
                  label="Enabled"
                  layout="inline"
                  defaultChecked={rule.enabled}
                  containerClassName="self-start text-sm text-muted-foreground md:self-center"
                />
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
