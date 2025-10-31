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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useRef, useEffect } from "react"
import { createStaggeredCardVariants, cardHoverVariants } from "@/lib/motion-variants"
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
  const [isActionsSheetOpen, setIsActionsSheetOpen] = useState(false)
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
      setDragOffset(-100)
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
      {/* Swipe Action Buttons (Mobile Only - Revealed on Swipe Left) */}
      {isMobile && (
        <div
          className="absolute inset-y-0 right-0 flex items-center gap-2 px-3 bg-gradient-to-l from-primary/20 to-primary/10 z-0 transition-opacity duration-150"
          style={{
            opacity: isSwipedLeft ? 1 : 0,
            pointerEvents: isSwipedLeft ? "auto" : "none",
          }}
        >
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 text-primary hover:bg-primary/20 active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation()
              setIsPreviewOpen(true)
              setIsSwipedLeft(false)
              setDragOffset(0)
            }}
          >
            <Eye className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 text-primary hover:bg-primary/20 active:scale-95 transition-transform"
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Main Card Content (Swipeable on Mobile) */}
      <motion.div
        {...createStaggeredCardVariants(index, 0)}
        {...(isMobile ? {} : cardHoverVariants)}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: -100, right: 0 }}
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
          !isMobile && "hover:shadow-md card-lift transition-all duration-300",
          isSelected ? "border-primary ring-2 ring-primary/20" : "border-border/30 hover:border-border/60"
        )}
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

        {/* More Menu - Top Right Corner (Desktop Only) */}
        {!isMobile && (
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
        )}

        {/* Actions Sheet Trigger - Mobile Only (Top Right) */}
        {isMobile && (
          <div className="absolute top-4 right-4 z-10">
            <Sheet open={isActionsSheetOpen} onOpenChange={setIsActionsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={`More actions for ${name}`}
                >
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto pb-safe">
                <SheetHeader className="text-left pb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="line-clamp-1">{name}</span>
                  </SheetTitle>
                  <p className="text-sm text-muted-foreground">{institution} • {date}</p>
                </SheetHeader>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => {
                      setIsPreviewOpen(true)
                      setIsActionsSheetOpen(false)
                    }}
                  >
                    <Eye className="h-5 w-5 text-primary" />
                    <span>View Document</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 h-12">
                    <Download className="h-5 w-5 text-primary" />
                    <span>Download</span>
                  </Button>
                  <div className="[&>div>button]:w-full [&>div>button]:justify-start [&>div>button]:h-12 [&>div>button]:gap-3 [&>div>button]:rounded-md [&>div>button]:px-4">
                    <AssignmentMenu
                      entityId={`document-${id}`}
                      entityType="document"
                      size="default"
                      variant="outline"
                      showLabel={true}
                    />
                  </div>
                  <div className="[&>div>button]:w-full [&>div>button]:justify-start [&>div>button]:h-12 [&>div>button]:gap-3 [&>div>button]:rounded-md [&>div>button]:px-4">
                    <CollaborationDrawer
                      entityId={`document-${id}`}
                      entityType="document"
                      entityName={name}
                      triggerLabel="Discuss"
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}

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
        <div className="flex items-center justify-between gap-3 mb-3 px-2">
          <Badge variant="outline" className={getTypeColor(type)}>
            {type}
          </Badge>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{date}</span>
            <span>•</span>
            <span>{size}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40 mb-3" />

        {/* Compact Actions Section - Desktop: Single row, Mobile: Hidden (use sheet/swipe) */}
        {!isMobile && (
          <div className="flex items-center gap-2 px-2">
            <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8 px-2">
                  <Eye className="h-3.5 w-3.5" />
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
            <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8 px-2">
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
            <AssignmentMenu
              entityId={`document-${id}`}
              entityType="document"
              size="sm"
              variant="ghost"
              showLabel={false}
            />
            <CollaborationDrawer
              entityId={`document-${id}`}
              entityType="document"
              entityName={name}
              triggerLabel=""
            />
            {activeCollaborators && activeCollaborators.length > 0 && (
              <div className="flex -space-x-2 ml-auto">
                {activeCollaborators.slice(0, 2).map((member) => (
                  <Avatar key={member!.id} className="h-6 w-6 border-2 border-background">
                    <AvatarFallback className="text-[10px]">{member!.avatarFallback}</AvatarFallback>
                  </Avatar>
                ))}
                {activeCollaborators.length > 2 && (
                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-[9px] font-medium text-muted-foreground">
                      +{activeCollaborators.length - 2}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mobile: Show collaborators and hint */}
        {isMobile && activeCollaborators && activeCollaborators.length > 0 && (
          <div className="flex items-center gap-2 px-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <div className="flex -space-x-2">
              {activeCollaborators.slice(0, 3).map((member) => (
                <Avatar key={member!.id} className="h-6 w-6 border-2 border-background">
                  <AvatarFallback className="text-[10px]">{member!.avatarFallback}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            {activeCollaborators.length > 3 && (
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground/80">
                +{activeCollaborators.length - 3}
              </span>
            )}
            <span className="ml-auto text-[10px] text-muted-foreground/60 italic">Swipe left for actions</span>
          </div>
        )}
      </motion.div>
    </div>
  )
}
