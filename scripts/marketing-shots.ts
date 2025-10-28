import { chromium, devices } from "@playwright/test"
import path from "node:path"
import fs from "node:fs/promises"

type Shot = {
  name: string
  url: string // absolute or relative
  file: string // output filename (no path)
  viewport: { width: number; height: number }
  deviceScaleFactor?: number // retina-like sharpness
  fullPage?: boolean
  emulate?: keyof typeof devices
  colorScheme?: "light" | "dark"
}

const BASE_URL = process.env.MARKETING_BASE_URL ?? "http://localhost:3000"

// Pages to capture (expanded to cover dashboard sections)
const PAGES: Array<{ path: string; name: string }> = [
  { path: "/dashboard", name: "Overview" },
  { path: "/dashboard/portfolio", name: "Portfolio" },
  { path: "/dashboard/budget", name: "Budget" },
  { path: "/dashboard/cash-flow", name: "Cash Flow" },
  { path: "/dashboard/crypto", name: "Crypto" },
  { path: "/dashboard/insights", name: "Insights" },
  { path: "/dashboard/accounts", name: "Accounts" },
  { path: "/dashboard/transactions", name: "Transactions" },
  { path: "/dashboard/net-worth-detail", name: "Net Worth" },
  { path: "/dashboard/goals", name: "Goals" },
  { path: "/dashboard/growth", name: "Growth" },
  { path: "/dashboard/documents", name: "Documents" },
  { path: "/dashboard/taxes", name: "Taxes" },
  { path: "/dashboard/billing", name: "Billing" },
  { path: "/dashboard/profile", name: "Profile" },
  { path: "/dashboard/settings", name: "Settings" },
]

// Map each page to the most relevant chat scenario for marketing
function scenarioForPath(pathname: string): string {
  if (pathname.includes("/portfolio")) return "portfolio"
  if (pathname.includes("/budget")) return "budget"
  if (pathname.includes("/crypto")) return "crypto"
  // Default scenario works well across the rest
  return "default"
}

// Generate shots for all pages in all modes
const SHOTS: Shot[] = []

for (const page of PAGES) {
  const pageSlug = page.name.toLowerCase().replace(/\s+/g, "-")
  const baseUrl = `${page.path}?marketing=1`
  const chatScenario = scenarioForPath(page.path)
  const chatUrl = `${baseUrl}&chat=open&scenario=${encodeURIComponent(chatScenario)}`

  const variants: Array<{
    label: string
    url: string
    fileSuffix: string
    viewport: { width: number; height: number }
    deviceScaleFactor: number
    emulate?: keyof typeof devices
    colorScheme: "light" | "dark"
  }> = [
    {
      label: "Desktop Light",
      url: baseUrl,
      fileSuffix: "desktop-light",
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: "light",
    },
    {
      label: "Desktop Dark",
      url: baseUrl,
      fileSuffix: "desktop-dark",
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: "dark",
    },
    {
      label: "Phone Light",
      url: baseUrl,
      fileSuffix: "phone-light",
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      emulate: "iPhone 13",
      colorScheme: "light",
    },
    {
      label: "Phone Dark",
      url: baseUrl,
      fileSuffix: "phone-dark",
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      emulate: "iPhone 13",
      colorScheme: "dark",
    },
    // Chat-open variants alongside the corresponding page
    {
      label: "Desktop Light (Chat)",
      url: chatUrl,
      fileSuffix: "desktop-light-chat",
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: "light",
    },
    {
      label: "Desktop Dark (Chat)",
      url: chatUrl,
      fileSuffix: "desktop-dark-chat",
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
      colorScheme: "dark",
    },
    {
      label: "Phone Light (Chat)",
      url: chatUrl,
      fileSuffix: "phone-light-chat",
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      emulate: "iPhone 13",
      colorScheme: "light",
    },
    {
      label: "Phone Dark (Chat)",
      url: chatUrl,
      fileSuffix: "phone-dark-chat",
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      emulate: "iPhone 13",
      colorScheme: "dark",
    },
  ]

  for (const v of variants) {
    SHOTS.push({
      name: `${page.name} - ${v.label}`,
      url: v.url,
      file: `${pageSlug}-${v.fileSuffix}.png`,
      viewport: v.viewport,
      deviceScaleFactor: v.deviceScaleFactor,
      fullPage: false,
      emulate: v.emulate,
      colorScheme: v.colorScheme,
    })
  }
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true })
}

async function main() {
  const outDir = path.resolve("public/marketing/shots")
  await ensureDir(outDir)

  const browser = await chromium.launch()

  for (const shot of SHOTS) {
    // Create context with appropriate color scheme and device emulation
    const contextOptions: any = {
      deviceScaleFactor: shot.deviceScaleFactor || 2,
      colorScheme: shot.colorScheme || "dark",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
    }

    const ctx = shot.emulate
      ? await browser.newContext({ ...devices[shot.emulate], ...contextOptions })
      : await browser.newContext(contextOptions)

    const page = await ctx.newPage()

    // reduce layout jitter and hide scrollbars
    await page.addStyleTag({
      content: `
        * { caret-color: transparent !important; }
        ::-webkit-scrollbar { display: none; }
      `,
    })

    await page.setViewportSize(shot.viewport)
    const url = shot.url.startsWith("http") ? shot.url : `${BASE_URL}${shot.url}`
    await page.goto(url, { waitUntil: "networkidle" })

    // small settle for fonts/CLS
    await page.waitForTimeout(500)

    const outputPath = path.join(outDir, shot.file)
    await page.screenshot({
      path: outputPath,
      fullPage: !!shot.fullPage,
      type: "png",
    })

    console.log(`✅ ${shot.name} -> ${outputPath}`)
    await page.close()
    await ctx.close()
  }

  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
