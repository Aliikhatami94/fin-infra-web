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
      <Card className="card-standard card-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Upcoming Charges</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {dueToday.length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {dueToday.length} Due Today
                </Badge>
              )}
              <Badge variant="secondary" className="text-sm font-bold px-3 py-1">
                ${totalUpcoming.toFixed(2)}
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Next 30 days of scheduled payments</p>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 -mr-1 scrollbar-thin">
            {upcomingCharges.map((charge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  charge.status === "due"
                    ? "bg-red-500/10 border-red-500/40"
                    : charge.status === "pending"
                      ? "bg-yellow-500/10 border-yellow-500/40"
                      : "border-border hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
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
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground truncate">{charge.name}</p>
                      {charge.autopay && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-500">Auto-pay</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs px-1.5 py-0">
                        {charge.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{charge.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-2">
                  <p className="text-sm font-semibold tabular-nums text-foreground">${charge.amount.toFixed(2)}</p>
                  {!charge.autopay && charge.status !== "due" && (
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Pay Now
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
