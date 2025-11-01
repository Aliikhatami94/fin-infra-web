const encoder = new TextEncoder()
const decoder = new TextDecoder()

function getCrypto(): Crypto | null {
  if (typeof globalThis.crypto !== "undefined") {
    return globalThis.crypto as Crypto
  }
  return null
}

function getSubtle(): SubtleCrypto | null {
  const crypto = getCrypto()
  return crypto?.subtle ?? null
}

const cryptoRef = getCrypto()
const subtle = getSubtle()

function base64ToArrayBuffer(base64: string) {
  const normalized = base64.replace(/\s+/g, "")
  const binary = typeof atob === "function" ? atob(normalized) : Buffer.from(normalized, "base64").toString("binary")
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ""

  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }

  return typeof btoa === "function" ? btoa(binary) : Buffer.from(binary, "binary").toString("base64")
}

async function importEncryptionKey(secret: string) {
  if (!subtle) {
    throw new Error("Web Crypto API not available - encryption requires HTTPS or localhost")
  }
  // Derive a stable 256-bit key from the provided secret string to satisfy AES-GCM key length.
  // This allows arbitrary strings (including base64-like tokens) to be used as secrets in tests and dev.
  const secretBytes = encoder.encode(secret)
  const hash = await subtle.digest("SHA-256", secretBytes)
  return subtle.importKey("raw", hash, "AES-GCM", false, ["encrypt", "decrypt"])
}

async function encryptValue(value: string, secret: string) {
  // Fallback to base64 encoding when crypto is not available (mobile HTTP)
  if (!subtle || !cryptoRef) {
    console.warn("Web Crypto API not available - using fallback encoding (not secure)")
    return `UNENCRYPTED:${btoa(value)}`
  }
  
  const key = await importEncryptionKey(secret)
  const iv = cryptoRef.getRandomValues(new Uint8Array(12))
  const encrypted = await subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(value))
  return `${arrayBufferToBase64(iv.buffer)}.${arrayBufferToBase64(encrypted)}`
}

async function decryptValue(payload: string, secret: string) {
  // Handle unencrypted fallback format
  if (payload.startsWith("UNENCRYPTED:")) {
    try {
      return atob(payload.slice(12))
    } catch {
      return null
    }
  }
  
  const [ivPart, cipherPart] = payload.split(".")
  if (!ivPart || !cipherPart) return null

  if (!subtle) {
    console.warn("Web Crypto API not available - cannot decrypt")
    return null
  }

  try {
    const key = await importEncryptionKey(secret)
    const decrypted = await subtle.decrypt(
      { name: "AES-GCM", iv: base64ToArrayBuffer(ivPart) },
      key,
      base64ToArrayBuffer(cipherPart),
    )
    return decoder.decode(decrypted)
  } catch {
    return null
  }
}

function resolveSecrets(secret: string, fallbackSecrets: string[] = []) {
  return [secret, ...fallbackSecrets].filter(Boolean)
}

export type SecureStorageDriver = {
  getItem: (key: string) => Promise<string | null>
  setItem: (key: string, value: string) => Promise<void>
  removeItem: (key: string) => Promise<void>
}

type SecureStorageOptions = {
  namespace: string
  secret: string
  fallbackSecrets?: string[]
  storage?: Pick<Storage, "getItem" | "setItem" | "removeItem">
}

export function namespacedKey(namespace: string, key: string) {
  return `${namespace}::${key}`
}

export function createSecureStorage(options: SecureStorageOptions): SecureStorageDriver {
  const { namespace, secret, fallbackSecrets = [], storage = globalThis.localStorage } = options

  if (!storage) {
    throw new Error("Secure storage requires a Storage implementation")
  }

  const secrets = resolveSecrets(secret, fallbackSecrets)

  return {
    async getItem(key) {
      try {
        const stored = storage.getItem(namespacedKey(namespace, key))
        if (!stored) return null

        for (const candidate of secrets) {
          const decrypted = await decryptValue(stored, candidate)
          if (decrypted != null) {
            return decrypted
          }
        }

        return null
      } catch (error) {
        console.error("Secure storage getItem failed:", error)
        return null
      }
    },
    async setItem(key, value) {
      try {
        const encrypted = await encryptValue(value, secret)
        storage.setItem(namespacedKey(namespace, key), encrypted)
      } catch (error) {
        console.error("Secure storage setItem failed:", error)
        throw error
      }
    },
    async removeItem(key) {
      try {
        storage.removeItem(namespacedKey(namespace, key))
      } catch (error) {
        console.error("Secure storage removeItem failed:", error)
      }
    },
  }
}

export async function verifySecretsAvailable(secret?: string) {
  if (!secret) {
    throw new Error("NEXT_PUBLIC_STORAGE_ENCRYPTION_KEY must be defined")
  }

  // Skip verification if crypto API is not available (will use fallback)
  if (!subtle || !cryptoRef) {
    console.warn("Web Crypto API not available - storage will use fallback encoding")
    return
  }

  const test = await encryptValue("test", secret)
  if (!test) {
    throw new Error("Failed to initialize secure storage encryption")
  }
}

export async function decryptWithFallbacks(payload: string, secrets: string[]) {
  for (const secret of secrets) {
    const value = await decryptValue(payload, secret)
    if (value != null) {
      return value
    }
  }

  return null
}
