"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { InsightsFeed } from "@/components/insights-feed"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-background/90 backdrop-blur-md border-b border-border/20 mb-6">
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
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-background border-border/40"
              />
            </div>

            {/* Time Range Filter */}
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 h-9 bg-background border-border/40">
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
        </div>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <div className="flex gap-8 border-b border-border/30 overflow-x-auto">
            {[
              { value: "all", label: "All Insights" },
              { value: "spending", label: "Spending Trends" },
              { value: "investment", label: "Investment Health" },
              { value: "goals", label: "Goals Forecast" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`relative px-1 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.value ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.value && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <InsightsFeed filter={activeTab as any} searchQuery={searchQuery} timeRange={timeRange} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
