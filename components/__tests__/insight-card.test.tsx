import React, { type ReactElement } from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { describe, expect, it, vi } from "vitest"

import { InsightCard } from "@/components/insights/InsightCard"
import { PrivacyProvider } from "@/components/privacy-provider"
import type { InsightDefinition } from "@/lib/insights/definitions"

const TestIcon = ({ className }: { className?: string }) => (
  <svg data-testid="test-icon" className={className} />
)

const createInsight = (overrides: Partial<InsightDefinition> = {}): InsightDefinition => ({
  id: "test-insight",
  title: "Test Insight",
  body: "A detailed recommendation to improve finances.",
  category: "spending",
  topic: "Spending Trends",
  surfaces: ["insights"],
  icon: TestIcon,
  accent: "emerald",
  actions: [
    {
      id: "cta",
      label: "Take action",
    },
  ],
  metrics: [
    {
      id: "current",
      label: "Current",
      value: "$500",
      srLabel: "Current value",
      highlight: true,
    },
    {
      id: "target",
      label: "Target",
      value: "$450",
      delta: "-10%",
      trend: "down",
    },
  ],
  explanation: "We detected higher than normal discretionary spending this week.",
  progress: { value: 62, label: "Progress" },
  pinned: false,
  priority: "medium",
  ...overrides,
})

const render = (ui: ReactElement) => {
  const container = document.createElement("div")
  document.body.appendChild(container)
  const root = createRoot(container)

  act(() => {
    root.render(<PrivacyProvider>{ui}</PrivacyProvider>)
  })

  return {
    container,
    unmount: () => {
      act(() => {
        root.unmount()
      })
      container.remove()
    },
  }
}


describe("InsightCard", () => {
  it("renders insight content, metrics, and progress", () => {
  const { container, unmount } = render(<InsightCard insight={createInsight()} />)

    try {
      expect(container.querySelector("h3")?.textContent).toContain("Test Insight")
      expect(container.querySelector("p")?.textContent).toContain("detailed recommendation")

      const metricLabels = Array.from(container.querySelectorAll("span.text-xs")).map((node) => node.textContent)
      expect(metricLabels).toContain("Current")
      expect(metricLabels).toContain("Target")

      const progressLabel = container.querySelector("div.flex.items-center.justify-between span.font-medium")
      expect(progressLabel?.textContent).toBe("62%")
    } finally {
      unmount()
    }
  })

  it("invokes onAction when the CTA button is clicked", () => {
    const onAction = vi.fn()
    const insight = createInsight()
    const { container, unmount } = render(
      <InsightCard
        insight={insight}
        onAction={({ action, insight: rendered }: { action: unknown; insight: InsightDefinition }) =>
          onAction({ action, insight: rendered })
        }
      />,
    )

    try {
      const buttons = Array.from(container.querySelectorAll("button"))
      const ctaButton = buttons.find((btn) => btn.textContent?.trim() === "Take action")
      expect(ctaButton).toBeDefined()

      act(() => {
        ctaButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
      })

      expect(onAction).toHaveBeenCalledTimes(1)
      expect(onAction.mock.calls[0][0].insight.id).toBe(insight.id)
      expect(onAction.mock.calls[0][0].action.id).toBe("cta")
    } finally {
      unmount()
    }
  })

  it("toggles explanation visibility via the Why button", () => {
  const { container, unmount } = render(<InsightCard insight={createInsight()} />)

    try {
      const buttons = Array.from(container.querySelectorAll("button"))
      const whyButton = buttons.find((btn) => btn.textContent?.includes("Why"))
      expect(whyButton).toBeDefined()

      expect(whyButton?.getAttribute("aria-expanded")).toBe("false")

      act(() => {
        whyButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
      })

      expect(whyButton?.getAttribute("aria-expanded")).toBe("true")

  const explanationId = whyButton?.getAttribute("aria-controls")
  expect(explanationId).toBeTruthy()
  const explanation = explanationId ? container.querySelector(`[id="${explanationId}"]`) : null
      expect(explanation?.textContent).toContain("higher than normal discretionary spending")
    } finally {
      unmount()
    }
  })
})
