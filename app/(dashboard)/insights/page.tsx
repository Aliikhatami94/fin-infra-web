"use client"
import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { InsightsFeed } from "@/components/insights-feed"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { ErrorBoundary } from "@/components/error-boundary"
import { SwitchField } from "@/components/ui/switch"
import { useInsightPreferences } from "@/hooks/use-insight-preferences"

type InsightFilter = "all" | "spending" | "investment" | "goals"

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<InsightFilter>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [timeRange, setTimeRange] = useState("30d")
  const [isTabLoading, setIsTabLoading] = useState(false)
  const { hideResolved, setHideResolved } = useInsightPreferences()

  const tabs: ReadonlyArray<{ value: InsightFilter; label: string }> = [
    { value: "all", label: "All Insights" },
    { value: "spending", label: "Spending Trends" },
    { value: "investment", label: "Investment Health" },
    { value: "goals", label: "Goals Forecast" },
  ]

  const activeTabId = useMemo(() => `insights-tab-${activeTab}`, [activeTab])

  return (
    <>
      <div className="sticky top-0 z-20 bg-card border-b">
        <div className="mx-auto p-4 max-w-[1200px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Insights</h1>
            <p className="text-sm text-muted-foreground mt-1">Personalized financial insights and recommendations</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-card border-border/40"
                aria-label="Filter insights by keyword"
              />
            </div>

            {/* Time Range Filter */}
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 h-9 bg-card border-border/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
            <SwitchField
              layout="inline"
              label="Hide resolved insights"
              checked={hideResolved}
              onCheckedChange={(next) => setHideResolved(Boolean(next))}
              className="data-[state=checked]:bg-primary/80"
              containerClassName="justify-end"
            />
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10 py-6 space-y-6">
        <div className="relative">
          <div
            className="flex items-center gap-2 overflow-x-auto rounded-full bg-muted/30 p-1"
            role="tablist"
            aria-label="Insight categories"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value
              const tabId = `insights-tab-${tab.value}`
              return (
                <button
                  key={tab.value}
                  id={tabId}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="insights-tabpanel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => {
                    setIsTabLoading(true)
                    setActiveTab(tab.value)
                    // Reset loading after animation completes
                    setTimeout(() => setIsTabLoading(false), 250)
                  }}
                  className={
                    "relative inline-flex items-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
                  }
                  data-state={isActive ? "active" : "inactive"}
                >
                  <span className="relative z-10">{tab.label}</span>
                  {isActive ? (
                    <motion.span
                      layoutId="insights-tab-highlight"
                      className="absolute inset-0 rounded-full bg-card shadow-sm"
                      transition={{ type: "spring", stiffness: 360, damping: 28 }}
                    />
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="tabpanel"
            id="insights-tabpanel"
            aria-labelledby={activeTabId}
          >
            <ErrorBoundary feature="Insights feed">
              {isTabLoading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 md:gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="rounded-lg border border-border bg-card p-6 animate-pulse">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="h-11 w-11 rounded-xl bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="flex gap-2">
                            <div className="h-5 w-16 bg-muted rounded" />
                            <div className="h-5 w-20 bg-muted rounded" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted rounded w-full" />
                        <div className="h-3 bg-muted rounded w-5/6" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <div className="h-8 w-24 bg-muted rounded" />
                        <div className="h-8 w-20 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <InsightsFeed
                  filter={activeTab}
                  searchQuery={searchQuery}
                  timeRange={timeRange}
                  hideResolved={hideResolved}
                />
              )}
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}
