"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FileText, Download, CheckCircle2, AlertCircle, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

const documents = [
  { name: "1099-DIV Fidelity", year: 2024, size: "245 KB", status: "received" },
  { name: "1099-B Robinhood", year: 2024, size: "182 KB", status: "received" },
  { name: "1099-INT Chase", year: 2024, size: "0 KB", status: "expected" },
  { name: "1099-B Coinbase", year: 2024, size: "0 KB", status: "missing" },
  { name: "Tax Summary 2024", year: 2024, size: "98 KB", status: "received" },
]

export function TaxDocuments() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "received":
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      case "expected":
        return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      case "missing":
        return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "received":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
            Received
          </Badge>
        )
      case "expected":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
            Expected
          </Badge>
        )
      case "missing":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
            Missing - High Priority
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="card-standard card-lift">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tax Documents</CardTitle>
          <Link href="/documents">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View All Documents
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div
              key={index}
              className={`flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 ${
                doc.status === "missing" ? "bg-red-50/50 dark:bg-red-950/20 -mx-4 px-4 py-3 rounded-lg" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1">{getStatusIcon(doc.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {doc.year} {doc.size !== "0 KB" && `• ${doc.size}`}
                    </p>
                    {getStatusBadge(doc.status)}
                  </div>
                </div>
              </div>
              {doc.status === "received" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="inline-block">
                        <Button variant="outline" size="sm" className="gap-2" disabled>
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs px-1.5 py-1">
                      <p className="text-xs">Document downloads will be available once tax year closes and all forms are finalized</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
