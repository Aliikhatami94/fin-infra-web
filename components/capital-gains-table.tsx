"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Clock, Scissors } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const gains = [
  {
    asset: "AAPL",
    type: "Long-term",
    gain: 4250,
    dateSold: "Dec 15, 2024",
    holdingPeriod: "18 months",
    monthsHeld: 18,
  },
  {
    asset: "MSFT",
    type: "Long-term",
    gain: 8200,
    dateSold: "Nov 22, 2024",
    holdingPeriod: "24 months",
    monthsHeld: 24,
  },
  {
    asset: "GOOGL",
    type: "Short-term",
    gain: -850,
    dateSold: "Dec 5, 2024",
    holdingPeriod: "8 months",
    monthsHeld: 8,
  },
  {
    asset: "TSLA",
    type: "Short-term",
    gain: 2100,
    dateSold: "Dec 1, 2024",
    holdingPeriod: "6 months",
    monthsHeld: 6,
  },
  {
    asset: "NVDA",
    type: "Approaching LT",
    gain: 1500,
    dateSold: "Dec 10, 2024",
    holdingPeriod: "11 months",
    monthsHeld: 11,
  },
  {
    asset: "AMD",
    type: "Approaching LT",
    gain: -320,
    dateSold: "Dec 8, 2024",
    holdingPeriod: "10 months",
    monthsHeld: 10,
  },
]

type SortField = "asset" | "gain" | "dateSold"
type SortOrder = "asc" | "desc"

interface CapitalGainsTableProps {
  initialFilter?: string | null
}

export function CapitalGainsTable({ initialFilter }: CapitalGainsTableProps) {
  const [sortField, setSortField] = useState<SortField>("dateSold")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [filter, setFilter] = useState("all")
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (initialFilter) {
      setFilter(initialFilter)
    }
  }, [initialFilter])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolled(e.currentTarget.scrollTop > 0)
  }

  const filteredGains = gains.filter((gain) => {
    if (filter === "losses-only") {
      return gain.gain < 0
    } else if (filter === "short-term-losses") {
      return gain.type === "Short-term" && gain.gain < 0
    } else if (filter === "long-term-gains") {
      return gain.type === "Long-term" && gain.gain > 0
    } else if (filter === "short-term") {
      return gain.type === "Short-term"
    } else if (filter === "long-term") {
      return gain.type === "Long-term"
    }
    return true
  })

  const sortedGains = [...filteredGains].sort((a, b) => {
    let comparison = 0
    if (sortField === "asset") {
      comparison = a.asset.localeCompare(b.asset)
    } else if (sortField === "gain") {
      comparison = a.gain - b.gain
    } else if (sortField === "dateSold") {
      comparison = new Date(a.dateSold).getTime() - new Date(b.dateSold).getTime()
    }
    return sortOrder === "asc" ? comparison : -comparison
  })

  const getHoldingPeriodBadge = (type: string, monthsHeld: number) => {
    if (type === "Long-term") {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
          Long-term
        </Badge>
      )
    } else if (type === "Approaching LT") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                <Clock className="h-3 w-3 mr-1" />
                Approaching LT
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Will qualify for long-term status in {12 - monthsHeld} month(s)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    } else {
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">
          Short-term
        </Badge>
      )
    }
  }

  return (
    <Card className="card-standard card-lift">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl font-semibold">Realized Gains & Losses</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filter === "all" ? "default" : "outline"}
              className="cursor-pointer transition-smooth hover:scale-105"
              onClick={() => setFilter("all")}
            >
              All Transactions
            </Badge>
            <Badge
              variant={filter === "losses-only" ? "default" : "outline"}
              className="cursor-pointer transition-smooth hover:scale-105"
              onClick={() => setFilter("losses-only")}
            >
              Losses Only
            </Badge>
            <Badge
              variant={filter === "short-term-losses" ? "default" : "outline"}
              className="cursor-pointer transition-smooth hover:scale-105"
              onClick={() => setFilter("short-term-losses")}
            >
              Short-Term Losses
            </Badge>
            <Badge
              variant={filter === "long-term-gains" ? "default" : "outline"}
              className="cursor-pointer transition-smooth hover:scale-105"
              onClick={() => setFilter("long-term-gains")}
            >
              Long-Term Gains
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto max-h-[520px] overflow-y-auto" onScroll={handleScroll}>
          <table className="w-full">
            <thead
              className={`sticky top-0 bg-background z-10 border-b transition-all duration-200 ${
                isScrolled ? "shadow-md" : "shadow-sm"
              }`}
            >
              <tr className="text-left text-sm text-muted-foreground">
                <th className="pb-3 pt-2 pl-6 font-medium w-[120px]">
                  <Button variant="ghost" size="sm" className="h-8 px-2 -ml-2" onClick={() => handleSort("asset")}>
                    Asset
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </th>
                <th className="pb-3 pt-2 font-medium w-[180px]">Type</th>
                <th className="pb-3 pt-2 font-medium text-right w-[140px]">
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => handleSort("gain")}>
                    Gain/Loss
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </th>
                <th className="pb-3 pt-2 font-medium w-[140px]">
                  <Button variant="ghost" size="sm" className="h-8 px-2 -ml-2" onClick={() => handleSort("dateSold")}>
                    Date Sold
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </th>
                <th className="pb-3 pt-2 font-medium w-[140px]">Holding Period</th>
                <th className="pb-3 pt-2 pr-6 font-medium w-[120px] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedGains.map((gain, index) => (
                <tr
                  key={index}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/40 transition-smooth"
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="py-4 pl-6 w-[120px]">
                    <p className="text-sm font-semibold text-foreground">{gain.asset}</p>
                  </td>
                  <td className="py-4 w-[180px]">{getHoldingPeriodBadge(gain.type, gain.monthsHeld)}</td>
                  <td className="py-4 text-right w-[140px]">
                    <p
                      className={`text-sm font-bold tabular-nums ${
                        gain.gain > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {gain.gain > 0 ? "+" : ""}$
                      {Math.abs(gain.gain).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </td>
                  <td className="py-4 w-[140px]">
                    <p className="text-sm text-muted-foreground">{gain.dateSold}</p>
                  </td>
                  <td className="py-4 w-[140px]">
                    <p className="text-sm text-muted-foreground">{gain.holdingPeriod}</p>
                  </td>
                  <td className="py-4 pr-6 text-right w-[120px]">
                    {gain.gain < 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950 transition-all duration-300 ${
                          hoveredRow === index ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                        }`}
                      >
                        <Scissors className="h-3 w-3" />
                        Harvest
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
