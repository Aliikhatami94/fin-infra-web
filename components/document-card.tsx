"use client"

import { motion } from "framer-motion"
import { Eye, Download, MoreVertical, FileText, File, FileSpreadsheet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"

interface DocumentCardProps {
  name: string
  institution: string
  type: string
  date: string
  size: string
  index: number
}

const getDocumentIcon = (type: string) => {
  if (type.toLowerCase().includes("tax")) return FileSpreadsheet
  if (type.toLowerCase().includes("statement")) return File
  return FileText
}

const getTypeColor = (type: string) => {
  if (type.toLowerCase().includes("tax"))
    return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
  if (type.toLowerCase().includes("statement"))
    return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30"
  return "bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30"
}

export function DocumentCard({ name, institution, type, date, size, index }: DocumentCardProps) {
  const Icon = getDocumentIcon(type)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  return (
    <motion.div
      {...createStaggeredCardVariants(index, 0)}
      {...cardHoverVariants}
      className="group relative p-6 border border-border/30 rounded-xl bg-card shadow-sm hover:shadow-md hover:border-border/60 transition-all duration-300 card-standard card-lift"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1">{name}</h3>
            <p className="text-xs text-muted-foreground">{institution}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsPreviewOpen(true)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex justify-between items-center text-xs">
        <Badge variant="outline" className={getTypeColor(type)}>
          {type}
        </Badge>
        <div className="flex items-center gap-3 text-muted-foreground">
          <span>{date}</span>
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <button className="opacity-70 hover:opacity-100 transition-smooth" aria-label="View document">
                <Eye className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[85vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  {name}
                </DialogTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{institution}</span>
                  <span>•</span>
                  <span>{date}</span>
                  <span>•</span>
                  <span>{size}</span>
                </div>
              </DialogHeader>
              <div className="flex-1 bg-muted/30 rounded-md flex items-center justify-center mt-4">
                <div className="text-center space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">Document preview</p>
                  <p className="text-xs text-muted-foreground/70">PDF viewer would be integrated here</p>
                  <Button size="sm" variant="outline" className="mt-4 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <button className="opacity-70 hover:opacity-100 transition-smooth" aria-label="Download document">
            <Download className="h-4 w-4" />
          </button>
          <span className="text-muted-foreground/70">{size}</span>
        </div>
      </div>
    </motion.div>
  )
}
