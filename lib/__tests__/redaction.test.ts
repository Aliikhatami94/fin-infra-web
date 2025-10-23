import { describe, expect, it } from "vitest"

import { createRedactingLogger, redactValue } from "@/lib/security/redaction"

describe("redactValue", () => {
  it("redacts account numbers and SSNs", () => {
    const payload = {
      account: "Account 123456789012",
      ssn: "123-45-6789",
    }

    expect(redactValue(payload)).toEqual({
      account: "Account [REDACTED]",
      ssn: "[REDACTED]",
    })
  })

  it("redacts balances and emails in nested structures", () => {
    const payload = {
      message: "Balance is $12,345.67",
      nested: {
        email: "user@example.com",
        values: ["Call me at 555-123-4567", 12500],
      },
    }

    const result = redactValue(payload)

    expect(result.message).toBe("Balance is [REDACTED]")
    expect(result.nested.email).toBe("[REDACTED]")
    expect(result.nested.values[0]).toBe("Call me at [REDACTED]")
    expect(typeof result.nested.values[1]).toBe("string")
    expect(result.nested.values[1]).toContain("$")
  })
})

describe("createRedactingLogger", () => {
  it("redacts arguments before delegating to console", () => {
    const messages: unknown[][] = []
    const fakeConsole = {
      info: (...args: unknown[]) => {
        messages.push(args)
      },
      warn: () => {},
      error: () => {},
      debug: () => {},
    } as Console

    const logger = createRedactingLogger("test", fakeConsole)

    logger.info("Account 123456789", { balance: "$1,234.00" })

    expect(messages[0][0]).toBe("[test]")
    expect(messages[0][1]).toBe("Account [REDACTED]")
    expect(messages[0][2]).toEqual({ balance: "[REDACTED]" })
  })
})
