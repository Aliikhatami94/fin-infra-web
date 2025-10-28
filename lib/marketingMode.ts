export function isMarketingMode(searchParams?: URLSearchParams): boolean {
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search).get("marketing") === "1"
  }
  return searchParams?.get("marketing") === "1"
}
