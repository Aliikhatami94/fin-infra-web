'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'

type TooltipSide = React.ComponentProps<typeof TooltipPrimitive.Content>["side"]

interface TooltipContextValue {
  triggerRef: React.MutableRefObject<HTMLElement | null>
  open: boolean
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null)

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  onOpenChange,
  open: openProp,
  defaultOpen,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(
    defaultOpen ?? false,
  )
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange],
  )

  return (
    <TooltipProvider>
      <TooltipContext.Provider value={{ triggerRef, open: Boolean(open) }}>
        <TooltipPrimitive.Root
          data-slot="tooltip"
          open={openProp}
          defaultOpen={defaultOpen}
          onOpenChange={handleOpenChange}
          {...props}
        />
      </TooltipContext.Provider>
    </TooltipProvider>
  )
}

const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ ...props }, forwardedRef) => {
  const context = React.useContext(TooltipContext)

  const setRefs = React.useCallback(
    (node: React.ElementRef<typeof TooltipPrimitive.Trigger> | null) => {
      if (context) {
        context.triggerRef.current = node
      }

      if (typeof forwardedRef === 'function') {
        forwardedRef(node)
      } else if (forwardedRef) {
        forwardedRef.current = node
      }
    },
    [context, forwardedRef],
  )

  return (
    <TooltipPrimitive.Trigger
      ref={setRefs}
      data-slot="tooltip-trigger"
      {...props}
    />
  )
})
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, side, sideOffset = 8, children, collisionPadding, ...props }, ref) => {
  const context = React.useContext(TooltipContext)
  const [autoSide, setAutoSide] = React.useState<TooltipSide>('top')

  const triggerRef = context?.triggerRef

  React.useLayoutEffect(() => {
    if (!context?.open || side) {
      return
    }

    const trigger = triggerRef?.current
    if (!trigger) {
      return
    }

    const rect = trigger.getBoundingClientRect()
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight
    const spaceAbove = rect.top
    const spaceBelow = viewportHeight - rect.bottom

    setAutoSide(spaceBelow < spaceAbove ? 'top' : 'bottom')
  }, [context?.open, side, triggerRef])

  const resolvedSide = side ?? autoSide

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        data-slot="tooltip-content"
        side={resolvedSide}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding ?? 8}
        className={cn(
          'bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-center text-xs text-balance',
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
