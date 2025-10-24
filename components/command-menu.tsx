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

const routes = [
  { label: "Overview", href: "/overview" },
  { label: "Accounts", href: "/accounts" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Cash Flow", href: "/cash-flow" },
  { label: "Budget", href: "/budget" },
  { label: "Taxes", href: "/taxes" },
  { label: "Insights", href: "/insights" },
  { label: "Documents", href: "/documents" },
  { label: "Settings", href: "/settings" },
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
      <CommandInput placeholder="Search or jump to…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {routes.map((r) => (
            <CommandItem key={r.href} onSelect={() => navigate(r.href)}>
              {r.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick actions">
          <CommandItem
            onSelect={() => {
              toggleMasked()
              setOpen(false)
            }}
          >
            <span className="mr-2 inline-flex h-5 w-5 items-center justify-center text-muted-foreground">
              <MaskIcon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="flex-1">{maskLabel}</span>
            <CommandShortcut>H</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
