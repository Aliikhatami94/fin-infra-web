"use client"

import { useState } from "react"
import type { TooltipContentProps } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Landmark, Building2, Globe2 } from "lucide-react"
import { cn } from "@/lib/utils"

type AllocationView = "assetClass" | "sector" | "region"

interface AllocationDataPoint extends Record<string, unknown> {
  name: string
  value: number
  color: string
}

const allocationData: Record<AllocationView, AllocationDataPoint[]> = {
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

export interface AllocationChartProps {
  onFilterChange?: (filter: string | null) => void
  activeFilter?: string | null
}

const isAllocationView = (value: string): value is AllocationView => {
  return value === "assetClass" || value === "sector" || value === "region"
}

const renderTooltip = ({ active, payload }: TooltipContentProps<number, string>) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0]?.payload as AllocationDataPoint | undefined
    if (!dataPoint) {
      return null
    }

    return (
      <div className="rounded-lg border bg-card p-2 shadow-sm">
        <div className="text-sm font-medium">{dataPoint.name}</div>
        <div className="text-xs text-muted-foreground">{dataPoint.value}%</div>
        <div className="text-xs text-muted-foreground mt-1">Click to filter</div>
      </div>
    )
  }
  return null
}

export function AllocationChart({ onFilterChange, activeFilter }: AllocationChartProps) {
  const [view, setView] = useState<AllocationView>("assetClass")
  const data = allocationData[view]

  const handleSegmentClick = (entry: AllocationDataPoint) => {
    if (onFilterChange) {
      onFilterChange(activeFilter === entry.name ? null : entry.name)
    }
  }

  const handleViewChange = (value: string) => {
    if (isAllocationView(value)) {
      setView(value)
    }
  }

  return (
    <Card className="card-standard">
      <CardHeader>
        <div className="flex flex-col gap-3">
          <CardTitle>Portfolio Allocation</CardTitle>
          <Tabs value={view} onValueChange={handleViewChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assetClass" className="flex items-center gap-1.5">
                <Landmark className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Asset Class</span>
                <span className="sm:hidden">Assets</span>
              </TabsTrigger>
              <TabsTrigger value="sector" className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                <span>Sector</span>
              </TabsTrigger>
              <TabsTrigger value="region" className="flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5" />
                <span>Region</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {activeFilter && (
          <p className="text-xs text-muted-foreground mt-2">
            Filtering by: <span className="font-medium text-foreground">{activeFilter}</span>
            <button 
              onClick={() => onFilterChange?.(null)} 
              className="ml-2 text-primary hover:underline"
            >
              Clear
            </button>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex w-full flex-col items-center gap-6">
          {/* Chart */}
          <div className="h-40 w-40 sm:h-48 sm:w-48 shrink-0">
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
                  onClick={(_, index) => handleSegmentClick(data[index])}
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
                <Tooltip content={renderTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Minimal, modern legend */}
          <div className="w-full space-y-1.5">
            {data.map((item) => (
              <button
                key={item.name}
                onClick={() => handleSegmentClick(item)}
                className={cn(
                  "flex items-center justify-between w-full rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/50 group",
                  activeFilter === item.name && "bg-muted"
                )}
                style={{
                  opacity: activeFilter && activeFilter !== item.name ? 0.4 : 1,
                }}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="h-3 w-3 rounded-sm shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className={cn(
                    "truncate",
                    activeFilter === item.name ? "font-semibold" : "font-medium"
                  )}>
                    {item.name}
                  </span>
                </div>
                <span className="font-mono text-sm font-semibold ml-2 shrink-0">
                  {item.value}%
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
