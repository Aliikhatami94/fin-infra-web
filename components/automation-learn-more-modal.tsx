"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bell, FileText, Zap, Mail, MessageSquare, Calendar } from "lucide-react"

const automationFeatures = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Slack & Email Alerts",
    description: "Get instant notifications when thresholds are exceeded, approvals are needed, or anomalies are detected.",
    example: "Example: 'Portfolio allocation drift detected: Tech sector now 42% (target: 35%)'",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: "API & CSV Sync",
    description: "Bi-directional data sync with accounting platforms, ERPs, and internal tools via REST API or scheduled file transfers.",
    example: "Example: Auto-export monthly P&L to Google Sheets every 1st of the month",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Smart Transaction Rules",
    description: "Automatically categorize, tag, and route transactions based on merchant, amount, account, or custom criteria.",
    example: "Example: Tag all Amazon transactions as 'Office Supplies' and route for CFO approval if over $500",
  },
  {
    icon: <Bell className="h-5 w-5" />,
    title: "Threshold Monitoring",
    description: "Set up watchers for cash balances, runway, concentration risk, or any custom metric with configurable alert channels.",
    example: "Example: Alert treasury team via Slack if cash runway drops below 6 months",
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    title: "Scheduled Reports",
    description: "Auto-generate and distribute reports to stakeholders on daily, weekly, or monthly schedules.",
    example: "Example: Email board packet with performance summary every Friday at 5pm",
  },
  {
    icon: <Mail className="h-5 w-5" />,
    title: "Approval Workflows",
    description: "Route transactions, rebalancing proposals, or budget changes through customizable approval chains.",
    example: "Example: Require VP approval for any transaction over $10k before posting",
  },
]

export function AutomationLearnMoreModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 h-9 rounded-full"
          aria-label="Learn more about automation features"
        >
          Learn More About Automation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Automate Tedious Workflows</DialogTitle>
          <DialogDescription>
            Save hours every week with intelligent automation. Here's what you can automate with our platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {automationFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-border/40 bg-card/50 p-4 space-y-2"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground italic border border-border/30">
                    {feature.example}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-primary/5 p-4 border border-primary/20">
          <p className="text-sm text-foreground font-medium mb-2">
            Ready to automate your workflow?
          </p>
          <p className="text-sm text-muted-foreground mb-3">
            Create your account to start building custom automation rules tailored to your finance operations.
          </p>
          <Button asChild size="sm" className="rounded-full">
            <a href="/sign-up">Get Started Free</a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
