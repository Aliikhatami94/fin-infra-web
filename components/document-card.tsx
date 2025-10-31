"use client"

import { motion, PanInfo } from "framer-motion"
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
  UserPlus,
  MessageSquare,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useRef, useEffect } from "react"
import { createStaggeredCardVariants } from "@/lib/motion-variants"
import { AssignmentMenu } from "@/components/assignment-menu"
import { CollaborationDrawer } from "@/components/collaboration-drawer"
import { useWorkspace } from "@/components/workspace-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

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
  const [isMobile, setIsMobile] = useState(false)
  const { activeWorkspace, getThread } = useWorkspace()
  const thread = getThread("document", `document-${id}`)

  // Swipe gesture state
  const [isSwipedLeft, setIsSwipedLeft] = useState(false)
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [dragOffset, setDragOffset] = useState(0)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle swipe gesture with instant detection
  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipeThreshold = -50
    const velocity = info.velocity.x
    
    if (info.offset.x < swipeThreshold || velocity < -400) {
      setIsSwipedLeft(true)
      setDragOffset(-160)
    } else {
      setIsSwipedLeft(false)
      setDragOffset(0)
    }
  }

  // Reset swipe when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node) && isSwipedLeft) {
        setIsSwipedLeft(false)
        setDragOffset(0)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isSwipedLeft])

  const activeCollaborators = (thread?.watchers ?? [])
    .map((watcherId) => activeWorkspace.members.find((member) => member.id === watcherId))
    .filter((member): member is typeof activeWorkspace.members[number] => Boolean(member))

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-xl"
      data-document-id={id}
    >
      {/* Swipe Action Buttons (Mobile Only - Revealed on Swipe Left or 3-Dot Click) */}
      {isMobile && (
        <div
          className="absolute top-0 bottom-0 right-0 flex items-center gap-1.5 px-2 bg-gradient-to-l from-primary/20 to-primary/10 z-0 transition-opacity duration-150 rounded-xl"
          style={{
            opacity: isSwipedLeft ? 1 : 0,
            pointerEvents: isSwipedLeft ? "auto" : "none",
          }}
        >
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-primary hover:bg-primary/30 active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation()
              setIsPreviewOpen(true)
              setIsSwipedLeft(false)
              setDragOffset(0)
            }}
            aria-label="View document"
          >
            <Eye className="h-4.5 w-4.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-primary hover:bg-primary/20 active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation()
            }}
            aria-label="Download document"
          >
            <Download className="h-4.5 w-4.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-primary hover:bg-primary/20 active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation()
            }}
            aria-label="Discuss document"
          >
            <MessageSquare className="h-4.5 w-4.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 text-primary hover:bg-primary/20 active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation()
            }}
            aria-label="Assign document"
          >
            <UserPlus className="h-4.5 w-4.5" />
          </Button>
        </div>
      )}

      {/* Main Card Content (Swipeable on Mobile) */}
      <motion.div
        {...createStaggeredCardVariants(index, 0)}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: -160, right: 0 }}
        dragElastic={0.02}
        dragMomentum={false}
        dragTransition={{ power: 0, timeConstant: 200 }}
        onDragEnd={isMobile ? handleDragEnd : undefined}
        style={
          isMobile
            ? {
                transform: `translateX(${dragOffset}px)`,
                transition: "transform 0.15s ease-out",
                touchAction: "pan-y",
              }
            : undefined
        }
        className={cn(
          "group relative flex flex-col p-5 border rounded-xl bg-card shadow-sm card-standard z-10",
          "h-full min-h-[240px]",
          !isMobile && "card-lift",
          isSelected ? "border-primary ring-2 ring-primary/20" : "border-border/30 hover:border-border/60"
        )}
      >
        {/* Top Row - Checkbox and More Menu */}
        <div className="flex items-start justify-between mb-3 -mt-1">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelectionChange?.(checked === true)}
            className="bg-card border-2"
            onClick={(e) => e.stopPropagation()}
          />
          
          {/* More Menu (Desktop Only) */}
          {!isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
          )}
        </div>

        {/* 3-Dot Menu - Mobile Only (Triggers Swipe Left) */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              setIsSwipedLeft(!isSwipedLeft)
              setDragOffset(isSwipedLeft ? 0 : -160)
            }}
            aria-label={`Actions for ${name}`}
          >
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}

        {/* Header - Icon and Title */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="text-base font-semibold text-foreground line-clamp-2 leading-tight mb-1">{name}</h3>
            <p className="text-sm text-muted-foreground">{institution}</p>
          </div>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className={cn(getTypeColor(type), "text-xs px-2.5 py-0.5 font-medium")}>
            {type}
          </Badge>
          <span className="text-xs text-muted-foreground truncate flex-1">{account}</span>
        </div>

        {/* Date and Size Row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <span>{date}</span>
          <span>•</span>
          <span>{size}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 my-auto" />

        {/* Actions Section - Desktop: Icon buttons, Mobile: Hidden (use sheet/swipe) */}
        {!isMobile && (
          <div className="flex items-center gap-1 mt-4">
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8 px-3 hover:bg-primary/10 hover:text-primary">
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
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8 px-3 hover:bg-primary/10 hover:text-primary">
              <Download className="h-4 w-4" />
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
                  <Avatar key={member!.id} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-[10px] font-medium">{member!.avatarFallback}</AvatarFallback>
                  </Avatar>
                ))}
                {activeCollaborators.length > 2 && (
                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-[9px] font-semibold text-muted-foreground">
                      +{activeCollaborators.length - 2}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
