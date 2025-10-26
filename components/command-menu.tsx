"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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

export function CommandMenu() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { toggleMasked, label: maskLabel, Icon: MaskIcon } = useMaskToggleDetails()

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const navigate = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search or jump to..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
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
              setOpen(false)
            }}
          >
            <MaskIcon className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
            <span className="flex-1">{maskLabel}</span>
            <CommandShortcut>H</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
