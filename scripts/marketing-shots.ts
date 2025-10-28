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

// Pages to capture
const PAGES = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/dashboard/portfolio", name: "Portfolio" },
  { path: "/dashboard/cash-flow", name: "Cash Flow" },
  { path: "/dashboard/budget", name: "Budget" },
  { path: "/dashboard/insights", name: "Insights" },
]

// Generate shots for all pages in all modes
const SHOTS: Shot[] = []

for (const page of PAGES) {
  const pageName = page.name.toLowerCase().replace(/\s+/g, "-")
  
  // Desktop - Light Mode
  SHOTS.push({
    name: `${page.name} - Desktop Light`,
    url: `${page.path}?marketing=1`,
    file: `${pageName}-desktop-light.png`,
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    fullPage: false,
    colorScheme: "light",
  })
  
  // Desktop - Dark Mode
  SHOTS.push({
    name: `${page.name} - Desktop Dark`,
    url: `${page.path}?marketing=1`,
    file: `${pageName}-desktop-dark.png`,
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    fullPage: false,
    colorScheme: "dark",
  })
  
  // Phone - Light Mode
  SHOTS.push({
    name: `${page.name} - Phone Light`,
    url: `${page.path}?marketing=1`,
    file: `${pageName}-phone-light.png`,
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    fullPage: false,
    emulate: "iPhone 13",
    colorScheme: "light",
  })
  
  // Phone - Dark Mode
  SHOTS.push({
    name: `${page.name} - Phone Dark`,
    url: `${page.path}?marketing=1`,
    file: `${pageName}-phone-dark.png`,
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    fullPage: false,
    emulate: "iPhone 13",
    colorScheme: "dark",
  })
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
