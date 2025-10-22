"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts"

const assetClassData = [
  { name: "US Stocks", value: 48, amount: 89000, color: "hsl(217, 91%, 60%)" },
  { name: "International", value: 22, amount: 41000, color: "hsl(142, 76%, 45%)" },
  { name: "Bonds", value: 18, amount: 33500, color: "hsl(24, 95%, 53%)" },
  { name: "Cash", value: 8, amount: 15000, color: "hsl(262, 83%, 58%)" },
  { name: "Crypto", value: 4, amount: 7500, color: "hsl(340, 82%, 52%)" },
]

const sectorData = [
  { name: "Technology", value: 35, amount: 65000, color: "hsl(217, 91%, 60%)" },
  { name: "Healthcare", value: 18, amount: 33500, color: "hsl(142, 76%, 45%)" },
  { name: "Finance", value: 15, amount: 28000, color: "hsl(24, 95%, 53%)" },
  { name: "Consumer", value: 12, amount: 22500, color: "hsl(262, 83%, 58%)" },
  { name: "Energy", value: 10, amount: 18500, color: "hsl(340, 82%, 52%)" },
  { name: "Other", value: 10, amount: 18500, color: "hsl(45, 93%, 47%)" },
]

const regionData = [
  { name: "North America", value: 60, amount: 112000, color: "hsl(217, 91%, 60%)" },
  { name: "Europe", value: 20, amount: 37500, color: "hsl(142, 76%, 45%)" },
  { name: "Asia Pacific", value: 15, amount: 28000, color: "hsl(24, 95%, 53%)" },
  { name: "Emerging", value: 5, amount: 9500, color: "hsl(262, 83%, 58%)" },
]

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  )
}

interface AllocationGridProps {
  onFilterChange?: (filter: string | null) => void
}

export function AllocationGrid({ onFilterChange }: AllocationGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("asset-class")

  const handlePieClick = (data: any, index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null)
      onFilterChange?.(null)
    } else {
      setActiveIndex(index)
      onFilterChange?.(data.name)
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border bg-card p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{data.name}</p>
          <p className="text-lg font-bold text-foreground tabular-nums">${data.amount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{data.value}% of portfolio</p>
        </div>
      )
    }
    return null
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case "sector":
        return sectorData
      case "region":
        return regionData
      default:
        return assetClassData
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="asset-class"
          className="w-full"
          onValueChange={(v) => {
            setActiveTab(v)
            setActiveIndex(null)
            onFilterChange?.(null)
          }}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="asset-class">Asset Class</TabsTrigger>
            <TabsTrigger value="sector">Sector</TabsTrigger>
            <TabsTrigger value="region">Region</TabsTrigger>
          </TabsList>
          <TabsContent value="asset-class" className="mt-6">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={assetClassData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label
                    activeIndex={activeIndex ?? undefined}
                    activeShape={renderActiveShape}
                    onClick={handlePieClick}
                    style={{ cursor: "pointer" }}
                  >
                    {assetClassData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="sector" className="mt-6">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label
                    activeIndex={activeIndex ?? undefined}
                    activeShape={renderActiveShape}
                    onClick={handlePieClick}
                    style={{ cursor: "pointer" }}
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="region" className="mt-6">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="value"
                    label
                    activeIndex={activeIndex ?? undefined}
                    activeShape={renderActiveShape}
                    onClick={handlePieClick}
                    style={{ cursor: "pointer" }}
                  >
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
