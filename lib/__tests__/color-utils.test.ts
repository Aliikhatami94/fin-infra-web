import { describe, expect, it } from "vitest"

import {
  getValueBgColor,
  getValueBorderColor,
  getValueColor,
} from "@/lib/color-utils"

describe("color utils", () => {
  describe("getValueColor", () => {
    it("returns positive color for positive values", () => {
      expect(getValueColor(10)).toBe("text-[var(--color-positive)]")
    })

    it("returns negative color for negative values", () => {
      expect(getValueColor(-5)).toBe("text-[var(--color-negative)]")
    })

    it("returns muted color for zero", () => {
      expect(getValueColor(0)).toBe("text-muted-foreground")
    })

    it("returns muted color when neutral flag provided", () => {
      expect(getValueColor(42, true)).toBe("text-muted-foreground")
    })
  })

  describe("getValueBgColor", () => {
    it("returns positive bg for positive values", () => {
      expect(getValueBgColor(8)).toBe("bg-[var(--semantic-positive-surface)]")
    })

    it("returns negative bg for negative values", () => {
      expect(getValueBgColor(-2)).toBe("bg-[var(--semantic-negative-surface)]")
    })

    it("returns muted bg for zero or neutral", () => {
      expect(getValueBgColor(0)).toBe("bg-muted")
      expect(getValueBgColor(3, true)).toBe("bg-muted")
    })
  })

  describe("getValueBorderColor", () => {
    it("returns positive border for positive values", () => {
      expect(getValueBorderColor(1)).toBe("border-[var(--semantic-positive-border)]")
    })

    it("returns negative border for negative values", () => {
      expect(getValueBorderColor(-1)).toBe("border-[var(--semantic-negative-border)]")
    })

    it("returns neutral border for zero or neutral", () => {
      expect(getValueBorderColor(0)).toBe("border-border")
      expect(getValueBorderColor(5, true)).toBe("border-border")
    })
  })
})
