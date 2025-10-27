"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useMaskToggleDetails } from "@/components/privacy-provider"
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  ArrowLeftRight,
  PiggyBank,
  FileText,
  Lightbulb,
  FolderOpen,
  Settings,
} from "lucide-react"

const routes = [
  { label: "Overview", href: "/overview", icon: LayoutDashboard },
  { label: "Accounts", href: "/accounts", icon: Wallet },
  { label: "Portfolio", href: "/portfolio", icon: TrendingUp },
  { label: "Cash Flow", href: "/cash-flow", icon: ArrowLeftRight },
  { label: "Budget", href: "/budget", icon: PiggyBank },
  { label: "Taxes", href: "/taxes", icon: FileText },
  { label: "Insights", href: "/insights", icon: Lightbulb },
  { label: "Documents", href: "/documents", icon: FolderOpen },
  { label: "Settings", href: "/settings", icon: Settings },
]

interface CommandMenuProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CommandMenu({ open: controlledOpen, onOpenChange }: CommandMenuProps = {}) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [recent, setRecent] = React.useState<string[]>([])
  const router = useRouter()
  const pathname = usePathname()
  const { toggleMasked, label: maskLabel, Icon: MaskIcon } = useMaskToggleDetails()

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }, [isControlled, onOpenChange])

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        handleOpenChange(!open)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open, handleOpenChange])

  // Load recent queries from localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("cmdk-recent")
      if (raw) setRecent(JSON.parse(raw))
    } catch {}
  }, [])

  // Reset input on route change to avoid persistent queries across pages
  React.useEffect(() => {
    setQuery("")
  }, [pathname])

  const saveRecent = (q: string) => {
    const v = q.trim()
    if (!v) return
    const next = [v, ...recent.filter((r) => r.toLowerCase() !== v.toLowerCase())].slice(0, 7)
    setRecent(next)
    try {
      localStorage.setItem("cmdk-recent", JSON.stringify(next))
    } catch {}
  }

  const clearRecent = () => {
    setRecent([])
    try {
      localStorage.removeItem("cmdk-recent")
    } catch {}
  }

  const bestRouteFor = (q: string) => {
    const v = q.trim().toLowerCase()
    if (!v) return null
    const scored = routes
      .map((r) => ({
        r,
        score:
          r.label.toLowerCase() === v
            ? 100
            : r.label.toLowerCase().startsWith(v)
            ? 80
            : r.label.toLowerCase().includes(v)
            ? 60
            : 0,
      }))
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
    return scored[0]?.r ?? null
  }

  const navigate = (href: string) => {
    handleOpenChange(false)
    router.push(href)
  }

  const commitSearch = () => {
    const v = query.trim()
    if (!v) return
    saveRecent(v)
    const match = bestRouteFor(v)
    if (match) {
      navigate(match.href)
    } else {
      navigate(`/search?q=${encodeURIComponent(v)}`)
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      <CommandInput
        placeholder="Search or jump to..."
        value={query}
        onValueChange={setQuery}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            commitSearch()
          }
        }}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {recent.length > 0 && query.length === 0 && (
          <>
            <CommandGroup heading="Recent">
              {recent.map((q) => (
                <CommandItem key={q} onSelect={() => setQuery(q)}>
                  <span className="text-muted-foreground/70">{q}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}
        <CommandGroup heading="Navigation">
          {routes.map((r) => {
            const Icon = r.icon
            return (
              <CommandItem key={r.href} onSelect={() => navigate(r.href)}>
                <Icon className="h-4 w-4 text-muted-foreground/50" />
                <span>{r.label}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick actions">
          <CommandItem
            onSelect={() => {
              toggleMasked()
              handleOpenChange(false)
            }}
          >
            <MaskIcon className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
            <span className="flex-1">{maskLabel}</span>
            <CommandShortcut>H</CommandShortcut>
          </CommandItem>
          {recent.length > 0 && (
            <CommandItem onSelect={clearRecent}>
              <span className="text-muted-foreground">Clear recent</span>
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
