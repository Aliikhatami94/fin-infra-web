"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye } from "lucide-react"

const documents = [
  {
    name: "Chase Statement - December 2024",
    institution: "Chase",
    type: "Statement",
    date: "Dec 31, 2024",
    size: "1.2 MB",
  },
  {
    name: "Fidelity Tax Form 1099",
    institution: "Fidelity",
    type: "Tax Document",
    date: "Jan 15, 2025",
    size: "245 KB",
  },
  {
    name: "Annual Investment Report 2024",
    institution: "Fidelity",
    type: "Report",
    date: "Dec 31, 2024",
    size: "3.8 MB",
  },
  {
    name: "Chase Statement - November 2024",
    institution: "Chase",
    type: "Statement",
    date: "Nov 30, 2024",
    size: "1.1 MB",
  },
  {
    name: "Robinhood Trade Confirmation",
    institution: "Robinhood",
    type: "Confirmation",
    date: "Dec 15, 2024",
    size: "156 KB",
  },
  {
    name: "BofA Credit Card Statement",
    institution: "Bank of America",
    type: "Statement",
    date: "Dec 31, 2024",
    size: "890 KB",
  },
]

export function DocumentsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground line-clamp-2">{doc.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{doc.institution}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs">
                    {doc.type}
                  </Badge>
                  <p className="text-xs text-muted-foreground">{doc.date}</p>
                  <p className="text-xs text-muted-foreground">{doc.size}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
