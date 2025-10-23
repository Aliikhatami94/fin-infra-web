import React from "react"
import { afterEach, describe, expect, it } from "vitest"
import { createRoot } from "react-dom/client"
import { act } from "react"
import axeCore from "axe-core"

import { InsightCard } from "@/components/insights/InsightCard"
import type { InsightDefinition } from "@/lib/insights/definitions"
import { Slider, SliderField } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { DollarSign } from "lucide-react"
import { PrivacyProvider } from "@/components/privacy-provider"

type AxeResults = import("axe-core").AxeResults

afterEach(() => {
  document.body.innerHTML = ""
})

async function runAxe(container: HTMLElement) {
  const results: AxeResults = await new Promise((resolve, reject) => {
    axeCore.run(container, { reporter: "v2" }, (error: any, axeResults: any) => {
      if (error) {
        reject(error)
      } else {
        resolve(axeResults as AxeResults)
      }
    })
  })

  const serious = (results.violations as any[]).filter((v: any) =>
    ["serious", "critical"].includes(v.impact as string),
  )
  if (serious.length > 0) {
    // Log minimal rule info for debugging in CI when a11y fails
    // This helps us tune or suppress specific false positives in jsdom.
    // eslint-disable-next-line no-console
    console.warn(
      "Axe serious violations:",
      serious.map((v: any) => ({ id: v.id, impact: v.impact, nodes: v.nodes?.length })),
    )
  }
  expect(serious).toHaveLength(0)
}

async function renderWithAxe(node: React.ReactElement) {
  const container = document.createElement("div")
  document.body.appendChild(container)
  const root = createRoot(container)

  await act(async () => {
    root.render(<PrivacyProvider>{node}</PrivacyProvider>)
  })

  await runAxe(container)
  root.unmount()
  container.remove()
}

describe("component accessibility", () => {
  it("renders InsightCard without axe violations", async () => {
    const testInsight: InsightDefinition = {
      id: "accessibility-test",
      title: "Reduce dining spend",
      body: "Your dining expenses are 18% above average this month.",
      category: "spending",
      topic: "Spending Trends",
      surfaces: ["insights"],
      icon: DollarSign,
      accent: "emerald",
      actions: [],
      metrics: [
        { id: "current", label: "Current", value: "$480", srLabel: "Current value", highlight: true },
        { id: "target", label: "Target", value: "$400" },
      ],
      explanation: "We compared your spend over the last 90 days to households with similar income levels.",
      pinned: false,
      priority: "medium",
    }

    await renderWithAxe(<InsightCard insight={testInsight} />)
  })

  it("renders Slider without axe violations", async () => {
    await renderWithAxe(
      <div className="p-4">
        <SliderField label="Adjust marginal rate" defaultValue={[32]} min={0} max={100} />
      </div>,
    )
  })

  it("renders Switch without axe violations", async () => {
    await renderWithAxe(
      <div className="p-4">
        <label htmlFor="alert-switch" className="text-sm font-medium">
          Enable trade alerts
        </label>
        <Switch id="alert-switch" aria-label="Enable trade alerts" />
      </div>,
    )
  })
})
