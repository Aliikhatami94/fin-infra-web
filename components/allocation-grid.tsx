"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import type { TooltipContentProps } from "recharts"
import { Landmark, Building2, Globe2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { PIE_CHART_COLORS, CHART_STYLES } from "@/lib/chart-colors"
import { isMarketingMode } from "@/lib/marketingMode"
import { getPortfolioAllocation } from "@/lib/services/portfolio"

type AllocationView = "assetClass" | "sector" | "region"

interface AllocationSlice extends Record<string, unknown> {
  name: string
  value: number
  amount: number
  color: string
}

// Mock data fallback
const mockAllocationData: Record<AllocationView, AllocationSlice[]> = {
  assetClass: [
    { name: "US Stocks", value: 48, amount: 89000, color: PIE_CHART_COLORS[0] },
    { name: "International", value: 22, amount: 41000, color: PIE_CHART_COLORS[1] },
    { name: "Bonds", value: 18, amount: 33500, color: PIE_CHART_COLORS[2] },
    { name: "Cash", value: 8, amount: 15000, color: PIE_CHART_COLORS[3] },
    { name: "Crypto", value: 4, amount: 7500, color: PIE_CHART_COLORS[4] },
  ],
  sector: [
    { name: "Technology", value: 35, amount: 65000, color: PIE_CHART_COLORS[0] },
    { name: "Healthcare", value: 18, amount: 33500, color: PIE_CHART_COLORS[1] },
    { name: "Finance", value: 15, amount: 28000, color: PIE_CHART_COLORS[2] },
    { name: "Consumer", value: 12, amount: 22500, color: PIE_CHART_COLORS[3] },
    { name: "Energy", value: 10, amount: 18500, color: PIE_CHART_COLORS[4] },
    { name: "Other", value: 10, amount: 18500, color: PIE_CHART_COLORS[5] },
  ],
  region: [
    { name: "North America", value: 60, amount: 112000, color: PIE_CHART_COLORS[0] },
    { name: "Europe", value: 20, amount: 37500, color: PIE_CHART_COLORS[1] },
    { name: "Asia Pacific", value: 15, amount: 28000, color: PIE_CHART_COLORS[2] },
    { name: "Emerging", value: 5, amount: 9500, color: PIE_CHART_COLORS[3] },
  ],
}

export interface AllocationGridProps {
  onFilterChange?: (filter: string | null) => void
}

const isAllocationView = (value: string): value is AllocationView => {
  return value === "assetClass" || value === "sector" || value === "region"
}

// Format asset class names from API
const formatAssetClassName = (name: string): string => {
  const mapping: Record<string, string> = {
    'stocks': 'Stocks',
    'bonds': 'Bonds',
    'cash': 'Cash',
    'crypto': 'Crypto',
    'real_estate': 'Real Estate',
    'other': 'Other',
  }
  return mapping[name.toLowerCase()] || name
}

const renderTooltip = ({ active, payload }: TooltipContentProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload as AllocationSlice | undefined
    if (!data) {
      return null
    }

    return (
      <div className="rounded-lg border bg-card p-2 shadow-sm">
        <div className="text-sm font-medium">{data.name}</div>
        <div className="text-lg font-semibold font-mono tabular-nums">${data.amount.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground">{data.value}% of portfolio</div>
        <div className="text-xs text-muted-foreground mt-1">Click to filter</div>
      </div>
    )
  }
  return null
}

export function AllocationGrid({ onFilterChange }: AllocationGridProps) {
  const [view, setView] = useState<AllocationView>("assetClass")
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [allocationData, setAllocationData] = useState<Record<AllocationView, AllocationSlice[]>>({
    assetClass: [],
    sector: [],
    region: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Fetch real allocation data
  useEffect(() => {
    console.log('[AllocationGrid] Component mounted, loading allocation data...')
    async function loadAllocation() {
      try {
        setIsLoading(true)
        console.log('[AllocationGrid] Calling getPortfolioAllocation()...')
        const data = await getPortfolioAllocation()
        console.log('[FRONTEND_ALLOCATION] ========================================')
        console.log('[FRONTEND_ALLOCATION] Asset Class breakdown:')
        data.assetClass.forEach(item => {
          console.log(`[FRONTEND_ALLOCATION]   ${item.name}=${item.value}%`)
        })
        console.log('[FRONTEND_ALLOCATION] Sector breakdown:')
        data.sector.forEach(item => {
          console.log(`[FRONTEND_ALLOCATION]   ${item.name}=${item.value}%`)
        })
        console.log('[FRONTEND_ALLOCATION] Region breakdown:')
        data.region.forEach(item => {
          console.log(`[FRONTEND_ALLOCATION]   ${item.name}=${item.value}%`)
        })
        console.log('[FRONTEND_ALLOCATION] ========================================')
        console.log('[AllocationGrid] Received allocation data:', data)
        
        // Transform to the format expected by this component
        const assetClass: AllocationSlice[] = data.assetClass.map((item) => ({
          name: item.name,
          value: item.value,
          amount: 0, // Backend doesn't provide dollar amounts yet
          color: item.color,
        }))
        
        const sector: AllocationSlice[] = data.sector.map((item) => ({
          name: item.name,
          value: item.value,
          amount: 0,
          color: item.color,
        }))
        
        const region: AllocationSlice[] = data.region.map((item) => ({
          name: item.name,
          value: item.value,
          amount: 0,
          color: item.color,
        }))
        
        setAllocationData({ assetClass, sector, region })
        console.log('[AllocationGrid] Allocation data set successfully')
      } catch (error) {
        console.error('[AllocationGrid] Failed to fetch allocation data:', error)
        // Fallback to mock data on error
        setAllocationData(mockAllocationData)
      } finally {
        setIsLoading(false)
        console.log('[AllocationGrid] Loading complete')
      }
    }

    loadAllocation()
  }, [])

  const data = allocationData[view]

  const handleSliceClick = (slice: AllocationSlice) => {
    if (selectedSlice === slice.name) {
      setSelectedSlice(null)
      onFilterChange?.(null)
    } else {
      setSelectedSlice(slice.name)
      onFilterChange?.(slice.name)
    }
  }

  const handleViewChange = (value: string) => {
    if (isAllocationView(value)) {
      setView(value)
      setSelectedSlice(null)
      onFilterChange?.(null)
    }
  }

  // Debounced hover handlers to prevent glitchy transitions
  const handleMouseEnter = useCallback((name: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredItem(name)
    }, 50)
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
        <Tabs value={view} onValueChange={handleViewChange} className="sm:flex sm:justify-center">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex">
            <TabsTrigger value="assetClass">
              <Landmark className="h-4 w-4" />
              <span className="hidden sm:inline">Assets</span>
            </TabsTrigger>
            <TabsTrigger value="sector">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Sector</span>
            </TabsTrigger>
            <TabsTrigger value="region">
              <Globe2 className="h-4 w-4" />
              <span className="hidden sm:inline">Region</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {selectedSlice && (
          <p className="text-xs text-muted-foreground">
            Filtering by: <span className="font-medium text-foreground">{selectedSlice}</span>
            <button 
              onClick={() => {
                setSelectedSlice(null)
                onFilterChange?.(null)
              }} 
              className="ml-2 text-primary hover:underline"
            >
              Clear
            </button>
          </p>
        )}
      </CardHeader>
      <CardContent className="flex items-center justify-center min-h-[320px]">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="h-48 w-48 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-4 w-40 bg-muted animate-pulse rounded" />
              <div className="h-4 w-36 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p>No allocation data available</p>
          </div>
        ) : (
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
                  paddingAngle={CHART_STYLES.pie.paddingAngle}
                  dataKey="value"
                  stroke="transparent"
                  strokeWidth={CHART_STYLES.pie.strokeWidth}
                  onClick={(_, index) => handleSliceClick(data[index])}
                  className="cursor-pointer"
                  onMouseEnter={(_, index) => handleMouseEnter(data[index].name)}
                  onMouseLeave={handleMouseLeave}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={
                        (selectedSlice && selectedSlice !== entry.name) ||
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
                onClick={() => handleSliceClick(item)}
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
                className={cn(
                  "flex items-center justify-between w-full rounded-md px-3 py-2 text-left transition-all duration-200",
                  "hover:bg-accent/50",
                  selectedSlice === item.name && "bg-accent",
                  (selectedSlice && selectedSlice !== item.name) && "opacity-50",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold font-mono tabular-nums">
                    {item.value}%
                  </span>
                  <span className="text-xs text-muted-foreground font-mono tabular-nums">
                    ${item.amount.toLocaleString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
