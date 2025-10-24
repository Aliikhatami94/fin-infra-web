"use client"

import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ConfirmDialogProps {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: "default" | "destructive" | "secondary"
  onConfirm?: () => void
  onOpenChange?: (open: boolean) => void
  open?: boolean
  trigger?: ReactNode
  children?: ReactNode
}
export function ConfirmDialog({
  open: openProp,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "default",
  onConfirm,
  trigger,
  children,
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : internalOpen

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value)
    }
    onOpenChange?.(value)
  }

  const handleConfirm = () => {
    onConfirm?.()
    handleOpenChange(false)
  }

  const descriptionId = description ? "confirm-dialog-description" : undefined

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent aria-describedby={descriptionId} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription id={descriptionId}>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {children ? <div className="text-sm text-muted-foreground space-y-2">{children}</div> : null}
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
