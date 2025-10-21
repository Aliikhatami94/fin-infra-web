"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useState } from "react"

const incomeData = [
  { name: "Salary", value: 7500, color: "oklch(0.4 0.1 250)" },
  { name: "Investments", value: 850, color: "oklch(0.55 0.12 145)" },
  { name: "Freelance", value: 450, color: "oklch(0.58 0.18 25)" },
]

const expenseData = [
  { name: "Housing", value: 2200, color: "oklch(0.4 0.1 250)" },
  { name: "Food", value: 850, color: "oklch(0.55 0.12 145)" },
  { name: "Transportation", value: 450, color: "oklch(0.58 0.18 25)" },
  { name: "Entertainment", value: 320, color: "oklch(0.5 0 0)" },
  { name: "Utilities", value: 280, color: "oklch(0.6 0 0)" },
  { name: "Other", value: 400, color: "oklch(0.7 0 0)" },
]

export function CategoriesChart() {
  const [view, setView] = useState("income")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categories</CardTitle>
        <Tabs value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={view === "income" ? incomeData : expenseData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              label
            >
              {(view === "income" ? incomeData : expenseData).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
