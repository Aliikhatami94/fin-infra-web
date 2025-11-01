"use client"

import { motion } from "framer-motion"
import {
  Download,
  MoreVertical,
  FileText,
  FileSpreadsheet,
  Users,
  FileBarChart,
  FileCheck2,
  ReceiptText,
  UserPlus,
  MessageSquare,
  Check,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuPortal } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useRef, useEffect } from "react"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { AssignmentMenu } from "@/components/assignment-menu"
import { CollaborationDrawer } from "@/components/collaboration-drawer"
import { useWorkspace } from "@/components/workspace-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ShieldCheck } from "lucide-react"

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
  const [isDownloadConfirmOpen, setIsDownloadConfirmOpen] = useState(false)
  const [showCollaboration, setShowCollaboration] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { activeWorkspace, getThread, assignEntity, getAssignee } = useWorkspace()
  const thread = getThread("document", `document-${id}`)
  const assignee = getAssignee("document", `document-${id}`)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Check if document type is sensitive
  const isSensitiveDocument = (docType: string) => {
    const sensitive = docType.toLowerCase()
    return (
      sensitive.includes("tax") ||
      sensitive.includes("1099") ||
      sensitive.includes("w-2") ||
      sensitive.includes("statement") ||
      sensitive.includes("form")
    )
  }

  const handleDownload = () => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading document: ${name}`)
    // TODO: Implement actual download logic
    // This could include 2FA verification in the future
  }

  const activeCollaborators = (thread?.watchers ?? [])
    .map((watcherId) => activeWorkspace.members.find((member) => member.id === watcherId))
    .filter((member): member is typeof activeWorkspace.members[number] => Boolean(member))

  return (
    <motion.div
      {...createStaggeredCardVariants(index, 0)}
      className={cn(
        "group relative flex flex-col p-4 border rounded-xl bg-card shadow-sm card-standard",
        "h-full min-h-[220px]",
        !isMobile && "card-lift",
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border/30 hover:border-border/60"
      )}
      data-document-id={id}
    >
      {/* Top Row - Checkbox and Mobile Menu */}
      <div className="flex items-start justify-between my-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelectionChange?.(checked === true)}
          className="bg-card border-2"
          onClick={(e) => e.stopPropagation()}
        />
        {isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-4 -mr-1">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => {
                if (isSensitiveDocument(type)) {
                  setIsDownloadConfirmOpen(true)
                } else {
                  handleDownload()
                }
              }} className="text-sm py-1.5">
                <Download className="mr-2 h-3.5 w-3.5" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowCollaboration(true)} className="text-sm py-1.5">
                <MessageSquare className="mr-2 h-3.5 w-3.5" />
                Discuss
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="text-sm py-1.5">
                  <UserPlus className="mr-2 h-3.5 w-3.5" />
                  <span>Assign</span>
                  {assignee && <span className="ml-auto text-xs text-muted-foreground truncate max-w-[60px]">{assignee.name.split(" ")[0]}</span>}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-40">
                    <DropdownMenuLabel className="text-xs py-1">Assign to</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {activeWorkspace.members.map((member) => (
                      <DropdownMenuItem
                        key={member.id}
                        onClick={() => assignEntity("document", `document-${id}`, member.id)}
                        className="text-sm py-1.5"
                      >
                        <Avatar className="h-5 w-5 mr-2">
                          <AvatarFallback className="text-[10px]">{member.avatarFallback}</AvatarFallback>
                        </Avatar>
                        <span className="truncate">{member.name}</span>
                        {assignee?.id === member.id && <Check className="ml-auto h-3.5 w-3.5 shrink-0" />}
                      </DropdownMenuItem>
                    ))}
                    {assignee && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => assignEntity("document", `document-${id}`, null)} className="text-sm py-1.5">
                          <UserPlus className="mr-2 h-3.5 w-3.5" />
                          Unassign
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

        {/* Header - Icon and Title */}
        <div className="flex items-start gap-2.5 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4.5 w-4.5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug mb-0.5">{name}</h3>
            <p className="text-xs text-muted-foreground truncate">{institution}</p>
          </div>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={cn(getTypeColor(type), "text-[11px] px-2 py-0.5 font-medium")}>
            {type}
          </Badge>
          <span className="text-xs text-muted-foreground truncate flex-1">{account}</span>
        </div>

        {/* Date and Size Row */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <span>{date}</span>
          <span>•</span>
          <span>{size}</span>
        </div>

        {/* Divider - Desktop Only */}
        {!isMobile && <div className="border-t border-border/40 my-auto" />}

        {/* Actions Section - Desktop Only */}
        {!isMobile && (
          <div className="flex items-center gap-0.5">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-xs h-7 px-2 hover:bg-primary/10 hover:text-primary"
              onClick={() => {
                if (isSensitiveDocument(type)) {
                  setIsDownloadConfirmOpen(true)
                } else {
                  handleDownload()
                }
              }}
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
            <CollaborationDrawer
              entityId={`document-${id}`}
              entityType="document"
              entityName={name}
              triggerLabel=""
            />
            <AssignmentMenu
              entityId={`document-${id}`}
              entityType="document"
              size="sm"
              variant="ghost"
              showLabel={false}
            />
            {activeCollaborators && activeCollaborators.length > 0 && (
              <div className="flex -space-x-2 ml-auto">
                {activeCollaborators.slice(0, 2).map((member) => (
                  <Avatar key={member!.id} className="h-5 w-5 border-2 border-background">
                    <AvatarFallback className="text-[9px] font-medium">{member!.avatarFallback}</AvatarFallback>
                  </Avatar>
                ))}
                {activeCollaborators.length > 2 && (
                  <Avatar className="h-5 w-5 border-2 border-background">
                    <AvatarFallback className="text-[9px] font-medium bg-muted">
                      +{activeCollaborators.length - 2}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            )}
          </div>
        )}

      {/* Collaboration Drawer - accessible from mobile dropdown */}
      <CollaborationDrawer
        entityId={`document-${id}`}
        entityType="document"
        entityName={name}
        triggerLabel=""
        open={showCollaboration}
        onOpenChange={setShowCollaboration}
        hideTrigger={true}
      />

      {/* Download Confirmation Dialog */}
      <ConfirmDialog
        open={isDownloadConfirmOpen}
        onOpenChange={setIsDownloadConfirmOpen}
        title="Confirm Sensitive Document Download"
        description="You are about to download a sensitive financial document. This action will be logged for security purposes."
        confirmLabel="Download"
        cancelLabel="Cancel"
        confirmVariant="default"
        onConfirm={handleDownload}
      >
        <div className="space-y-3 py-2">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <ShieldCheck className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Security Notice</p>
              <p className="text-xs text-amber-800 dark:text-amber-200">
                This document contains sensitive financial information. Please ensure you're in a secure location before proceeding.
              </p>
            </div>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Document:</span>
              <span className="font-medium text-foreground">{name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium text-foreground">{type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Institution:</span>
              <span className="font-medium text-foreground">{institution}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Note: In a production environment, this action may require two-factor authentication (2FA) for additional security.
          </p>
        </div>
      </ConfirmDialog>
      </motion.div>
  )
}
