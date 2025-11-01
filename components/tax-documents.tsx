"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, CheckCircle2, AlertCircle, ArrowRight, TrendingDown } from "lucide-react"
import Link from "next/link"

const documents = [
  { name: "1099-DIV Fidelity", year: 2024, size: "245 KB", status: "received" },
  { name: "1099-B Robinhood", year: 2024, size: "182 KB", status: "received" },
  { name: "1099-INT Chase", year: 2024, size: "0 KB", status: "expected" },
  { name: "1099-B Coinbase", year: 2024, size: "0 KB", status: "missing" },
  { name: "Tax Summary 2024", year: 2024, size: "98 KB", status: "received" },
]

export function TaxDocuments() {
  const totalDocuments = documents.length
  const receivedDocuments = documents.filter(doc => doc.status === "received").length
  const missingDocuments = documents.filter(doc => doc.status === "missing").length
  const documentProgress = Math.round((receivedDocuments / totalDocuments) * 100)

  // Calculate harvest readiness based on various factors
  const harvestReadiness = 68 // Mock percentage - would be calculated from actual data
  const unrealizedLosses = -12400 // Mock amount
  const eligiblePositions = 8 // Mock count

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Documents Summary Card */}
      <Card className="card-standard card-lift">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Tax Documents Status</CardTitle>
            </div>
            {missingDocuments > 0 && (
              <Badge variant="destructive" className="shrink-0">
                {missingDocuments} Missing
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Document Collection</span>
              <span className="font-medium">{receivedDocuments} of {totalDocuments} received</span>
            </div>
            <Progress value={documentProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {documentProgress}% complete
            </p>
          </div>

          {missingDocuments > 0 && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 p-3 border border-red-200 dark:border-red-900">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  {missingDocuments} document{missingDocuments > 1 ? 's' : ''} still needed
                </p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  Follow up with issuers to avoid filing delays
                </p>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button asChild variant="outline" className="w-full gap-2">
              <Link href="/dashboard/documents">
                View All Documents
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center pt-2">
            See detailed status in{" "}
            <Link href="#ai-insights" className="text-primary hover:underline font-medium">
              AI Insights
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Tax-Loss Harvesting Readiness Card */}
      <Card className="card-standard card-lift">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <CardTitle>Harvest Readiness</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 shrink-0">
              {harvestReadiness}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Portfolio Analysis</span>
              <span className="font-medium">{eligiblePositions} positions eligible</span>
            </div>
            <Progress value={harvestReadiness} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {harvestReadiness >= 70 ? 'High' : harvestReadiness >= 40 ? 'Moderate' : 'Low'} harvest potential
            </p>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-muted/30 p-3 border border-border">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                ${Math.abs(unrealizedLosses).toLocaleString()} in unrealized losses
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Could offset capital gains or reduce taxable income
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Wash sale compliance</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Year-end timing optimized</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="pt-2">
            <Button variant="default" className="w-full gap-2 bg-orange-600 hover:bg-orange-700">
              <TrendingDown className="h-4 w-4" />
              Review Positions
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center pt-2">
            Detailed opportunities in{" "}
            <Link href="#ai-insights" className="text-primary hover:underline font-medium">
              AI Insights
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
