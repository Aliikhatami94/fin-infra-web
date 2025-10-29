"use client"

import { useState, useCallback, useRef } from "react"
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
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

  // Debounced hover handlers to prevent glitchy transitions
  const handleMouseEnter = useCallback((name: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(name)
    }, 50) // Small delay to smooth transitions
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null)
    }, 100)
  }, [])

  return (
    <Card className="card-standard">
      <CardHeader className="space-y-4">
        <CardTitle className="text-base sm:text-lg">Portfolio Allocation</CardTitle>
        
        {/* Tabs below title, above chart */}
        <Tabs value={view} onValueChange={handleViewChange}>
          <TabsList className="grid grid-cols-3 sm:inline-flex h-auto">
            <TabsTrigger value="assetClass" className="gap-1.5">
              <Landmark className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline text-xs md:text-sm">Assets</span>
            </TabsTrigger>
            <TabsTrigger value="sector" className="gap-1.5">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline text-xs md:text-sm">Sector</span>
            </TabsTrigger>
            <TabsTrigger value="region" className="gap-1.5">
              <Globe2 className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline text-xs md:text-sm">Region</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeFilter && (
          <p className="text-xs text-muted-foreground">
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
      <CardContent className="flex items-center justify-center min-h-[320px]">
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
          {/* Chart - centered and compact */}
          <div className="h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  onClick={(_, index) => handleSegmentClick(data[index])}
                  className="cursor-pointer"
                  onMouseEnter={(_, index) => handleMouseEnter(data[index].name)}
                  onMouseLeave={handleMouseLeave}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={
                        (activeFilter && activeFilter !== entry.name) ||
                        (hoveredItem && hoveredItem !== entry.name)
                          ? 0.3
                          : 1
                      }
                      className="transition-opacity duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip content={renderTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Minimal, modern legend - always compact */}
          <div className="w-full space-y-1.5">
            {data.map((item) => (
              <button
                key={item.name}
                onClick={() => handleSegmentClick(item)}
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
                className={cn(
                  "flex items-center justify-between w-full rounded-md px-3 py-2 text-left transition-all duration-200",
                  "hover:bg-accent/50",
                  activeFilter === item.name && "bg-accent",
                  (activeFilter && activeFilter !== item.name) && "opacity-50",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-sm font-semibold font-mono tabular-nums">
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
