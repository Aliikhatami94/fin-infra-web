import { describe, expect, it } from "vitest"

import { isActiveRoute, normalizePath } from "@/lib/navigation"

describe("navigation helpers", () => {
  describe("normalizePath", () => {
    it("returns root for empty values", () => {
      expect(normalizePath("")).toBe("/")
      expect(normalizePath(undefined)).toBe("/")
      expect(normalizePath(null)).toBe("/")
    })

    it("strips query strings and hashes", () => {
      expect(normalizePath("/accounts?tab=all")).toBe("/accounts")
      expect(normalizePath("/goals#overview")).toBe("/goals")
    })

    it("removes trailing slashes for non-root paths", () => {
      expect(normalizePath("/accounts/")).toBe("/accounts")
      expect(normalizePath("/accounts//")).toBe("/accounts")
    })
  })

  describe("isActiveRoute", () => {
    it("matches root only when both paths are root", () => {
      expect(isActiveRoute("/", "/")).toBe(true)
      expect(isActiveRoute("/overview", "/")).toBe(false)
    })

    it("matches exact href", () => {
      expect(isActiveRoute("/accounts", "/accounts")).toBe(true)
    })

    it("matches nested routes", () => {
      expect(isActiveRoute("/accounts/123", "/accounts")).toBe(true)
      expect(isActiveRoute("/accounts/123/details", "/accounts")).toBe(true)
    })

    it("supports exact matching for selected routes", () => {
      expect(isActiveRoute("/settings", "/settings", { exact: true })).toBe(true)
      expect(isActiveRoute("/settings/security", "/settings", { exact: true })).toBe(false)
    })

    it("does not match when prefix differs", () => {
      expect(isActiveRoute("/accounting", "/accounts")).toBe(false)
      expect(isActiveRoute("/portfolio-2024", "/portfolio")).toBe(false)
    })

    it("handles trailing slash and query combinations", () => {
      expect(isActiveRoute("/portfolio/positions/1/", "/portfolio")).toBe(true)
      expect(isActiveRoute("/portfolio?tab=open", "/portfolio")).toBe(true)
    })
  })
})
