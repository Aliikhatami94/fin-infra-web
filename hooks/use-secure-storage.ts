"use client"

import { useMemo } from "react"

import { createSecureStorage, type SecureStorageDriver } from "@/lib/security/secure-storage"

const primarySecret = process.env.NEXT_PUBLIC_STORAGE_ENCRYPTION_KEY ?? ""
const fallbackSecrets = (process.env.NEXT_PUBLIC_STORAGE_ENCRYPTION_FALLBACKS ?? "")
  .split(",")
  .map((secret) => secret.trim())
  .filter(Boolean)

export type UseSecureStorageOptions = {
  namespace: string
}

export function useSecureStorage(options: UseSecureStorageOptions): SecureStorageDriver | null {
  const { namespace } = options

  return useMemo(() => {
    if (typeof window === "undefined") {
      return null
    }

    if (!primarySecret) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console -- developers should be informed when secure storage is unavailable
        console.warn("Secure storage secret is not configured; falling back to in-memory state.")
      }
      return null
    }

    return createSecureStorage({
      namespace,
      secret: primarySecret,
      fallbackSecrets,
      storage: window.localStorage,
    })
  }, [namespace])
}
