"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { motion, AnimatePresence } from "framer-motion"

const allocationData = {
  assetClass: [
    { name: "Stocks", value: 65, color: "hsl(217, 91%, 60%)" },
    { name: "Bonds", value: 20, color: "hsl(142, 76%, 45%)" },
    { name: "Cash", value: 10, color: "hsl(24, 95%, 53%)" },
    { name: "Crypto", value: 5, color: "hsl(262, 83%, 58%)" },
  ],
  sector: [
    { name: "Technology", value: 35, color: "hsl(217, 91%, 60%)" },
    { name: "Healthcare", value: 25, color: "hsl(142, 76%, 45%)" },
    { name: "Finance", value: 20, color: "hsl(24, 95%, 53%)" },
    { name: "Consumer", value: 15, color: "hsl(262, 83%, 58%)" },
    { name: "Other", value: 5, color: "hsl(340, 82%, 52%)" },
  ],
  region: [
    { name: "North America", value: 50, color: "hsl(217, 91%, 60%)" },
    { name: "Europe", value: 25, color: "hsl(142, 76%, 45%)" },
    { name: "Asia Pacific", value: 20, color: "hsl(24, 95%, 53%)" },
    { name: "Emerging Markets", value: 5, color: "hsl(262, 83%, 58%)" },
  ],
}

interface AllocationChartProps {
  onFilterChange?: (filter: string | null) => void
  activeFilter?: string | null
}

export function AllocationChart({ onFilterChange, activeFilter }: AllocationChartProps) {
  const [view, setView] = useState<"assetClass" | "sector" | "region">("assetClass")
  const data = allocationData[view]

  const handleSegmentClick = (entry: any) => {
    if (onFilterChange) {
      onFilterChange(activeFilter === entry.name ? null : entry.name)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Portfolio Allocation</CardTitle>
          <Tabs value={view} onValueChange={(v) => setView(v as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="assetClass" className="text-xs">
                Asset Class
              </TabsTrigger>
              <TabsTrigger value="sector" className="text-xs">
                Sector
              </TabsTrigger>
              <TabsTrigger value="region" className="text-xs">
                Region
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {activeFilter && (
          <p className="text-xs text-muted-foreground mt-2">
            Filtering by: <span className="font-medium text-foreground">{activeFilter}</span>
            <button onClick={() => onFilterChange?.(null)} className="ml-2 text-primary hover:underline">
              Clear
            </button>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-6"
          >
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    onClick={handleSegmentClick}
                    className="cursor-pointer"
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={activeFilter && activeFilter !== entry.name ? 0.3 : 1}
                        className="transition-opacity hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-card p-2 shadow-sm">
                            <div className="text-sm font-medium">{payload[0].name}</div>
                            <div className="text-xs text-muted-foreground">{payload[0].value}%</div>
                            <div className="text-xs text-muted-foreground mt-1">Click to filter</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {data.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleSegmentClick(item)}
                  className="flex items-center justify-between text-sm w-full hover:bg-muted/50 p-1 rounded transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-sm transition-opacity"
                      style={{
                        backgroundColor: item.color,
                        opacity: activeFilter && activeFilter !== item.name ? 0.3 : 1,
                      }}
                    />
                    <span className={activeFilter === item.name ? "font-medium" : ""}>{item.name}</span>
                  </div>
                  <span className="font-mono font-medium">{item.value}%</span>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
