"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const assetClassData = [
  { name: "US Stocks", value: 48, color: "hsl(217, 91%, 60%)" },
  { name: "International", value: 22, color: "hsl(142, 76%, 45%)" },
  { name: "Bonds", value: 18, color: "hsl(24, 95%, 53%)" },
  { name: "Cash", value: 8, color: "hsl(262, 83%, 58%)" },
  { name: "Crypto", value: 4, color: "hsl(340, 82%, 52%)" },
]

const sectorData = [
  { name: "Technology", value: 35, color: "hsl(217, 91%, 60%)" },
  { name: "Healthcare", value: 18, color: "hsl(142, 76%, 45%)" },
  { name: "Finance", value: 15, color: "hsl(24, 95%, 53%)" },
  { name: "Consumer", value: 12, color: "hsl(262, 83%, 58%)" },
  { name: "Energy", value: 10, color: "hsl(340, 82%, 52%)" },
  { name: "Other", value: 10, color: "hsl(45, 93%, 47%)" },
]

const regionData = [
  { name: "North America", value: 60, color: "hsl(217, 91%, 60%)" },
  { name: "Europe", value: 20, color: "hsl(142, 76%, 45%)" },
  { name: "Asia Pacific", value: 15, color: "hsl(24, 95%, 53%)" },
  { name: "Emerging", value: 5, color: "hsl(262, 83%, 58%)" },
]

export function AllocationGrid() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="asset-class" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="asset-class">Asset Class</TabsTrigger>
            <TabsTrigger value="sector">Sector</TabsTrigger>
            <TabsTrigger value="region">Region</TabsTrigger>
          </TabsList>
          <TabsContent value="asset-class" className="mt-6">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={assetClassData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                    {assetClassData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="sector" className="mt-6">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={sectorData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="region" className="mt-6">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={regionData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                    {regionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
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
