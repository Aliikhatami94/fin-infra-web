"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"

const data = [
  { category: "Housing", budget: 2200, actual: 2200 },
  { category: "Food", budget: 800, actual: 920 },
  { category: "Transport", budget: 450, actual: 380 },
  { category: "Entertainment", budget: 300, actual: 340 },
  { category: "Shopping", budget: 400, actual: 280 },
  { category: "Utilities", budget: 250, actual: 240 },
]

export function BudgetChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="category" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Legend />
            <Bar dataKey="budget" fill="oklch(0.4 0.1 250)" name="Budget" />
            <Bar dataKey="actual" fill="oklch(0.55 0.12 145)" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
