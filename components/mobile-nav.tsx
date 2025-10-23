"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { DASHBOARD_NAVIGATION } from "@/lib/navigation/routes"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 shadow-lg md:hidden"
      aria-label="Primary"
    >
      <ul className="flex items-stretch justify-between gap-1 overflow-x-auto px-1">
        {DASHBOARD_NAVIGATION.slice(0, 6).map((item) => {
          const active = pathname ? pathname.startsWith(item.href) : false

          return (
            <li key={item.name} className="flex-1 min-w-[70px]">
              <Link
                href={item.href}
                className={cn(
                  "flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
                aria-current={active ? "page" : undefined}
              >
                <item.icon className="h-5 w-5" aria-hidden />
                <span className="sr-only sm:not-sr-only">{item.name}</span>
                {item.badge ? (
                  <Badge
                    variant="secondary"
                    className="mt-1 min-h-4 min-w-4 px-1 text-[10px] leading-none"
                    aria-hidden
                  >
                    {item.badge}
                  </Badge>
                ) : null}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
