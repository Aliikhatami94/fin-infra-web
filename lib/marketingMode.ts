export function isMarketingMode(searchParams?: URLSearchParams): boolean {
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search).get("marketing") === "1"
  }
  return searchParams?.get("marketing") === "1"
}

export type MarketingOptions = {
  enabled: boolean
  chatOpen: boolean
  scenario?: string | null
  chatInput?: string | null
  autoplay?: boolean
}

/**
 * Parse marketing-related flags from the current URL or provided search params.
 * Supported params:
 * - marketing=1 → enables marketing mode
 * - chat=1|true|open → opens the AI chat sidebar automatically
 * - scenario|chatScenario=<name> → loads a predefined chat transcript
 * - chatInput=<text> → pre-fills the chat input box
 * - autoplay=1|true → simulates assistant typing/revealing preset messages
 */
export function parseMarketingOptions(searchParams?: URLSearchParams): MarketingOptions {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : searchParams
  const enabled = (params?.get("marketing") ?? "") === "1"
  const chatRaw = (params?.get("chat") ?? "").toLowerCase()
  const chatOpen = chatRaw === "1" || chatRaw === "true" || chatRaw === "open"
  const scenario = params?.get("scenario") ?? params?.get("chatScenario") ?? null
  const chatInput = params?.get("chatInput") ?? null
  const autoplayRaw = (params?.get("autoplay") ?? "").toLowerCase()
  const autoplay = autoplayRaw === "1" || autoplayRaw === "true"
  return { enabled, chatOpen, scenario, chatInput, autoplay }
}
