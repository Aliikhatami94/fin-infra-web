"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Info } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts"
import { AccessibleChart } from "@/components/accessible-chart"
import { describeTimeSeries, numberSummaryFormatter } from "@/lib/a11y"

interface RiskMetricModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  metric: "sharpe" | "beta" | "volatility" | null
}

const metricData = {
  sharpe: {
    title: "Sharpe Ratio",
    description:
      "The Sharpe Ratio measures risk-adjusted returns. It shows how much excess return you receive for the extra volatility you endure for holding a riskier asset.",
    yourValue: 1.85,
    benchmark: 1.2,
    interpretation: [
      { range: "< 1.0", meaning: "Sub-optimal", color: "text-red-600" },
      { range: "1.0 - 2.0", meaning: "Good", color: "text-yellow-600" },
      { range: "> 2.0", meaning: "Excellent", color: "text-green-600" },
    ],
    history: [
      { month: "Jan", value: 1.65, benchmark: 1.15 },
      { month: "Feb", value: 1.72, benchmark: 1.18 },
      { month: "Mar", value: 1.78, benchmark: 1.19 },
      { month: "Apr", value: 1.81, benchmark: 1.21 },
      { month: "May", value: 1.85, benchmark: 1.2 },
    ],
  },
  beta: {
    title: "Beta",
    description:
      "Beta measures your portfolio's volatility relative to the market (SPY). A beta of 1 means your portfolio moves with the market. Less than 1 means less volatile, greater than 1 means more volatile.",
    yourValue: 0.92,
    benchmark: 1.0,
    interpretation: [
      { range: "< 0.8", meaning: "Low volatility", color: "text-green-600" },
      { range: "0.8 - 1.2", meaning: "Market-like", color: "text-yellow-600" },
      { range: "> 1.2", meaning: "High volatility", color: "text-red-600" },
    ],
    history: [
      { month: "Jan", value: 0.98, benchmark: 1.0 },
      { month: "Feb", value: 0.95, benchmark: 1.0 },
      { month: "Mar", value: 0.93, benchmark: 1.0 },
      { month: "Apr", value: 0.91, benchmark: 1.0 },
      { month: "May", value: 0.92, benchmark: 1.0 },
    ],
  },
  volatility: {
    title: "Volatility (Standard Deviation)",
    description:
      "Volatility measures how much your portfolio's returns fluctuate over time. Lower volatility means more stable, predictable returns. Higher volatility means larger swings in value.",
    yourValue: 14.2,
    benchmark: 18.5,
    interpretation: [
      { range: "< 10%", meaning: "Low risk", color: "text-green-600" },
      { range: "10% - 20%", meaning: "Moderate risk", color: "text-yellow-600" },
      { range: "> 20%", meaning: "High risk", color: "text-red-600" },
    ],
    history: [
      { month: "Jan", value: 15.8, benchmark: 19.2 },
      { month: "Feb", value: 15.2, benchmark: 18.9 },
      { month: "Mar", value: 14.8, benchmark: 18.7 },
      { month: "Apr", value: 14.5, benchmark: 18.6 },
      { month: "May", value: 14.2, benchmark: 18.5 },
    ],
  },
}

export function RiskMetricModal({ open, onOpenChange, metric }: RiskMetricModalProps) {
  if (!metric) return null

  const data = metricData[metric]
  const chartSummary = describeTimeSeries({
    data: data.history,
    metric: `${data.title} history`,
    getLabel: (point) => point.month,
    getValue: (point) => point.value,
    formatValue: numberSummaryFormatter,
    includeEndValue: false,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            {data.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <Card className="card-standard">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground leading-relaxed">{data.description}</p>
            </CardContent>
          </Card>

          {/* Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Your Portfolio</p>
                <p className="text-3xl font-bold text-foreground" aria-label={`Your ${data.title} value ${data.yourValue}`}>
                  {data.yourValue}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">Above benchmark</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Market Benchmark (SPY)</p>
                <p className="text-3xl font-bold text-muted-foreground" aria-label={`Benchmark value ${data.benchmark}`}>
                  {data.benchmark}
                </p>
                <p className="text-xs text-muted-foreground mt-2">S&P 500 average</p>
              </CardContent>
            </Card>
          </div>

          {/* Historical Chart */}
          <div>
            <h3 className="text-sm font-medium mb-3">5-Month Trend</h3>
            <AccessibleChart
              title={`${data.title} trend`}
              description={chartSummary}
              className="h-64"
              contentClassName="h-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.history}>
                  <defs>
                    <linearGradient id="yourGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--foreground))" 
                    fontSize={12}
                    tick={{ fill: "hsl(var(--foreground))" }}
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                  />
                  <YAxis 
                    stroke="hsl(var(--foreground))" 
                    fontSize={12}
                    tick={{ fill: "hsl(var(--foreground))" }}
                    tickLine={true}
                    axisLine={true}
                    tickMargin={8}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-card p-3 shadow-sm">
                            <p className="text-xs text-muted-foreground mb-1">{payload[0].payload.month}</p>
                            <p className="text-sm font-medium">Your Portfolio: {payload[0].value}</p>
                            <p className="text-sm text-muted-foreground">Benchmark: {payload[1].value}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <ReferenceLine
                    y={data.benchmark}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="3 3"
                    label={{ value: "Benchmark", position: "right", fontSize: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2}
                    fill="url(#yourGradient)"
                    name="Your Portfolio"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </AccessibleChart>
          </div>

          {/* Interpretation Guide */}
          <div>
            <h3 className="text-sm font-medium mb-3">Interpretation Guide</h3>
            <div className="space-y-2">
              {data.interpretation.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-card p-3"
                >
                  <span className="text-sm font-mono">{item.range}</span>
                  <span className={`text-sm font-medium ${item.color}`}>{item.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
