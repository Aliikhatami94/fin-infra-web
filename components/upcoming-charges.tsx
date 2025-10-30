"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, AlertCircle, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { createStaggeredCardVariants } from "@/lib/motion-variants"

const upcomingCharges = [
  {
    name: "Amazon Prime",
    amount: 14.99,
    date: "Today",
    category: "Shopping",
    status: "due",
    autopay: true,
  },
  {
    name: "Electric Bill",
    amount: 120.0,
    date: "Tomorrow",
    category: "Utilities",
    status: "pending",
    autopay: true,
  },
  {
    name: "Netflix",
    amount: 15.99,
    date: "Jan 15",
    category: "Entertainment",
    status: "upcoming",
    autopay: true,
  },
  {
    name: "Spotify",
    amount: 9.99,
    date: "Jan 18",
    category: "Entertainment",
    status: "upcoming",
    autopay: true,
  },
  {
    name: "Adobe Creative Cloud",
    amount: 54.99,
    date: "Jan 25",
    category: "Software",
    status: "upcoming",
    autopay: false,
  },
]

const cardVariants = createStaggeredCardVariants(0)

export function UpcomingCharges() {
  const totalUpcoming = upcomingCharges.reduce((sum, charge) => sum + charge.amount, 0)
  const dueToday = upcomingCharges.filter((c) => c.status === "due")

  return (
    <motion.div variants={cardVariants} initial="initial" animate="animate">
      <Card className="card-standard card-lift overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
              <CardTitle className="truncate">Upcoming Charges</CardTitle>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {dueToday.length > 0 && (
                <Badge variant="destructive" className="text-xs px-2 py-0.5 whitespace-nowrap">
                  {dueToday.length} Due
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5 whitespace-nowrap">
                ${totalUpcoming.toFixed(2)}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Next 30 days of scheduled payments</p>
        </CardHeader>
        <CardContent className="pb-4 overflow-hidden">
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 -mr-1 scrollbar-thin">
            {upcomingCharges.map((charge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg border transition-colors overflow-hidden ${
                  charge.status === "due"
                    ? "bg-red-500/10 border-red-500/40"
                    : charge.status === "pending"
                      ? "bg-yellow-500/10 border-yellow-500/40"
                      : "border-border hover:bg-muted/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      charge.status === "due"
                        ? "bg-red-500/20"
                        : charge.status === "pending"
                          ? "bg-yellow-500/20"
                          : "bg-primary/10"
                    }`}
                  >
                    {charge.status === "due" ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Calendar className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{charge.name}</p>
                        {charge.autopay && (
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-500 whitespace-nowrap">Auto</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-semibold tabular-nums text-foreground flex-shrink-0">${charge.amount.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          {charge.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground truncate">{charge.date}</span>
                      </div>
                      {!charge.autopay && charge.status !== "due" && (
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2 flex-shrink-0">
                          Pay
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
