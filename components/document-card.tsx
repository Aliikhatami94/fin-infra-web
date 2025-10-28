"use client"

import { motion } from "framer-motion"
import {
  Eye,
  Download,
  MoreVertical,
  FileText,
  FileSpreadsheet,
  Users,
  FileBarChart,
  FileCheck2,
  ReceiptText,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"
import { AssignmentMenu } from "@/components/assignment-menu"
import { CollaborationDrawer } from "@/components/collaboration-drawer"
import { useWorkspace } from "@/components/workspace-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DocumentCardProps {
  id: number
  name: string
  institution: string
  type: string
  account: string
  date: string
  size: string
  index: number
  isSelected?: boolean
  onSelectionChange?: (selected: boolean) => void
}

const getDocumentIcon = (type: string) => {
  const normalized = type.toLowerCase()
  if (normalized.includes("tax") || normalized.includes("1099") || normalized.includes("form")) return FileSpreadsheet
  if (normalized.includes("statement")) return FileText
  if (normalized.includes("report")) return FileBarChart
  if (normalized.includes("confirmation")) return FileCheck2
  if (normalized.includes("receipt")) return ReceiptText
  return FileText
}

const getTypeColor = (type: string) => {
  const normalized = type.toLowerCase()
  if (normalized.includes("tax") || normalized.includes("1099") || normalized.includes("form"))
    return "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
  if (normalized.includes("statement"))
    return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30"
  if (normalized.includes("report"))
    return "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30"
  if (normalized.includes("confirmation"))
    return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
  if (normalized.includes("receipt"))
    return "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30"
  return "bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30"
}

export function DocumentCard({
  id,
  name,
  institution,
  type,
  account,
  date,
  size,
  index,
  isSelected = false,
  onSelectionChange,
}: DocumentCardProps) {
  const Icon = getDocumentIcon(type)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const { activeWorkspace, getThread } = useWorkspace()
  const thread = getThread("document", `document-${id}`)

  const activeCollaborators = (thread?.watchers ?? [])
    .map((watcherId) => activeWorkspace.members.find((member) => member.id === watcherId))
    .filter((member): member is typeof activeWorkspace.members[number] => Boolean(member))

  return (
    <motion.div
      {...createStaggeredCardVariants(index, 0)}
      {...cardHoverVariants}
      className={`group relative flex flex-col p-5 border rounded-xl bg-card shadow-sm hover:shadow-md transition-all duration-300 card-standard card-lift ${
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border/30 hover:border-border/60"
      }`}
      data-document-id={id}
    >
      {/* Checkbox - Top Left Corner */}
      <div className="absolute top-4 left-4 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelectionChange?.(checked === true)}
          className="bg-card border-2"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* More Menu - Top Right Corner */}
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label={`More actions for ${name}`}
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

      {/* Main Content - Icon and Document Info */}
      <div className="flex items-start gap-3 mb-4 pr-8 pl-8">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">{name}</h3>
          <p className="text-xs text-muted-foreground">{institution}</p>
          <p className="text-xs text-muted-foreground/70">{account}</p>
        </div>
      </div>

      {/* Document Metadata - Type Badge, Date, Size */}
      <div className="flex items-center justify-between gap-3 mb-4 px-2">
        <Badge variant="outline" className={getTypeColor(type)}>
          {type}
        </Badge>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{date}</span>
          <span>•</span>
          <span>{size}</span>
        </div>
      </div>

      {/* Action Buttons - View and Download */}
      <div className="flex items-center gap-2 mb-4 px-2">
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 gap-2">
              <Eye className="h-4 w-4" />
              View
            </Button>
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
                <Button size="sm" variant="outline" className="ml-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </DialogHeader>
            <div className="flex-1 bg-muted/30 rounded-md flex items-center justify-center mt-4 overflow-hidden">
              <div className="text-center space-y-2 p-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Document Preview</p>
                <p className="text-xs text-muted-foreground/70 max-w-md">
                  In a production environment, this would display the actual document content using a PDF viewer or
                  image preview component.
                </p>
                <div className="pt-4 space-y-2 text-left max-w-md mx-auto">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Document Type:</span>
                    <span className="font-medium">{type}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Institution:</span>
                    <span className="font-medium">{institution}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{date}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">File Size:</span>
                    <span className="font-medium">{size}</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="outline" size="sm" className="flex-1 gap-2">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>

      {/* Divider */}
      <div className="border-t border-border/40 mb-4" />

      {/* Collaboration Section - Footer */}
      <div className="flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
          <Users className="h-3.5 w-3.5 shrink-0" />
          {activeCollaborators && activeCollaborators.length > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {activeCollaborators.slice(0, 3).map((member) => (
                  <Avatar key={member!.id} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback>{member!.avatarFallback}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              {activeCollaborators.length > 3 && (
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground/80">
                  +{activeCollaborators.length - 3}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs">No collaborators</span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <AssignmentMenu entityId={`document-${id}`} entityType="document" />
          <CollaborationDrawer entityId={`document-${id}`} entityType="document" entityName={name} />
        </div>
      </div>
    </motion.div>
  )
}
