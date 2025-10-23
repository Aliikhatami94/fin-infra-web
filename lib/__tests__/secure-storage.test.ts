import { beforeAll, describe, expect, it } from "vitest"

import { createSecureStorage, decryptWithFallbacks, namespacedKey } from "@/lib/security/secure-storage"

const SECRET_PRIMARY = "bXktc2VjcmV0LWtleS1iYXNlNjQtLTIwMjQ="
const SECRET_ROTATED = "bXktbmV3LXNlY3JldC1iYXNlNjQtMjAyNQ=="

type MemoryStorageValue = Record<string, string>

class MemoryStorage {
  private store: MemoryStorageValue = {}

  getItem(key: string) {
    return this.store[key] ?? null
  }

  setItem(key: string, value: string) {
    this.store[key] = value
  }

  removeItem(key: string) {
    delete this.store[key]
  }
}

describe("secure storage", () => {
  beforeAll(() => {
    if (typeof globalThis.crypto === "undefined") {
      throw new Error("crypto not available in test environment")
    }
  })

  it("encrypts values before persisting and decrypts on read", async () => {
    const storage = new MemoryStorage()
    const driver = createSecureStorage({
      namespace: "test",
      secret: SECRET_PRIMARY,
      storage,
    })

    await driver.setItem("token", "super-secret")

    const rawStored = storage.getItem(namespacedKey("test", "token"))
    expect(rawStored).not.toBeNull()
    expect(rawStored).not.toBe("super-secret")

    const retrieved = await driver.getItem("token")
    expect(retrieved).toBe("super-secret")
  })

  it("supports key rotation using fallback secrets", async () => {
    const storage = new MemoryStorage()
    const writer = createSecureStorage({
      namespace: "test",
      secret: SECRET_PRIMARY,
      storage,
    })

    await writer.setItem("token", "rotatable")

    const reader = createSecureStorage({
      namespace: "test",
      secret: SECRET_ROTATED,
      fallbackSecrets: [SECRET_PRIMARY],
      storage,
    })

    const value = await reader.getItem("token")
    expect(value).toBe("rotatable")

    const stored = storage.getItem(namespacedKey("test", "token"))
    const decrypted = await decryptWithFallbacks(stored ?? "", [SECRET_PRIMARY, SECRET_ROTATED])
    expect(decrypted).toBe("rotatable")
  })
})
