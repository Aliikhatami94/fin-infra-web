"use client"

import { useMemo, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SliderField } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MaskableValue } from "@/components/privacy-provider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatPercent } from "@/lib/format"

interface PlanAdjustModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const fundingSources = [
  { label: "High-yield savings", value: "hysa" },
  { label: "Checking (Everyday)", value: "checking" },
  { label: "Brokerage sweep", value: "brokerage" },
]

export function PlanAdjustModal({ open, onOpenChange }: PlanAdjustModalProps) {
  const [monthlyContribution, setMonthlyContribution] = useState<number[]>([1250])
  const [emergencyRunway, setEmergencyRunway] = useState<number[]>([6])
  const [selectedSource, setSelectedSource] = useState<string>(fundingSources[0]?.value ?? "hysa")

  const contributionValue = monthlyContribution[0] ?? 1250
  const runwayMonths = emergencyRunway[0] ?? 6

  const baselineRate = 62
  const projectedRate = useMemo(() => {
    const capped = Math.min(95, Math.round((contributionValue / 1600) * 100))
    return Math.max(capped, baselineRate)
  }, [contributionValue])

  const projectedAnnual = contributionValue * 12
  const catchUpContribution = Math.max(contributionValue - 1100, 0) * 12
  const autopilotTransfer = Math.round(contributionValue * 0.35)

  const handleSubmit = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adjust savings plan</DialogTitle>
          <DialogDescription>
            Tune recurring contributions and runway targets. Changes apply immediately to your automated rules.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 rounded-lg border border-border/60 bg-muted/20 p-4 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Projected annual savings</p>
              <p className="text-xl font-semibold text-foreground">
                <MaskableValue value={formatCurrency(projectedAnnual)} srLabel="Projected annual savings" />
              </p>
              <Badge variant="secondary">Auto-transfer {formatCurrency(autopilotTransfer)} / month</Badge>
            </div>
            <Separator className="hidden sm:block sm:h-full" orientation="vertical" />
            <div className="space-y-1 sm:col-span-2">
              <p className="text-xs font-medium text-muted-foreground">Savings rate outlook</p>
              <div className="flex items-baseline gap-2 text-foreground">
                <span className="text-2xl font-semibold">{formatPercent(projectedRate)}</span>
                <span className="text-sm text-muted-foreground">
                  {projectedRate === baselineRate
                    ? "Matches current automation"
                    : `${projectedRate - baselineRate}% faster toward emergency and investing goals`}
                </span>
              </div>
            </div>
          </div>

          <SliderField
            label="Monthly contribution"
            description="Set the combined amount that flows into your goals each month."
            value={monthlyContribution}
            onValueChange={setMonthlyContribution}
            min={600}
            max={2200}
            step={50}
            formatValue={(values) => formatCurrency(values[0] ?? contributionValue)}
            analyticsId="plan-adjust:contribution"
          />

          <SliderField
            label="Emergency runway target"
            description="How many months of expenses should stay liquid before investing the remainder."
            value={emergencyRunway}
            onValueChange={setEmergencyRunway}
            min={3}
            max={12}
            step={1}
            formatValue={(values) => `${values[0] ?? runwayMonths} months`}
            analyticsId="plan-adjust:runway"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="funding-source">Funding source</Label>
              <Select value={selectedSource} onValueChange={setSelectedSource}>
                <SelectTrigger id="funding-source" className="w-full">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {fundingSources.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Transfers post two business days after pay day from your {fundingSources.find((s) => s.value === selectedSource)?.label.toLowerCase()} account.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="catch-up">Optional catch-up</Label>
              <Input
                id="catch-up"
                type="text"
                value={formatCurrency(catchUpContribution)}
                readOnly
                aria-describedby="catch-up-help"
              />
              <p id="catch-up-help" className="text-xs text-muted-foreground">
                We’ll schedule a one-time top up next month to close the {formatCurrency(catchUpContribution)} gap.
              </p>
            </div>
          </div>

          <div className="rounded-md border border-border/50 bg-card/50 p-4">
            <p className="text-sm font-medium text-foreground">What happens next</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>• Automation updates will appear in Cash Flow under “Planned transfers”.</li>
              <li>• Notifications alert you two days before each transfer.</li>
              <li>• You can pause or edit this plan at any time without impacting past activity.</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save adjustments</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
