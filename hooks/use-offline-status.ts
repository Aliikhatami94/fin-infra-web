"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { useSecureStorage } from "@/hooks/use-secure-storage"

const STORAGE_NAMESPACE = "connectivity"
const LAST_SYNC_KEY = "last-synced-at"

function getInitialOnlineState() {
  if (typeof window === "undefined") {
    return true
  }

  return window.navigator.onLine
}

function parseStoredDate(value: string | null) {
  if (!value) return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export type OfflineStatus = {
  isOnline: boolean
  isOffline: boolean
  status: "initializing" | "online" | "offline"
  lastSyncedAt: Date | null
  markSynced: (timestamp?: Date) => Promise<void>
}

export function useOfflineStatus(): OfflineStatus {
  const storage = useSecureStorage({ namespace: STORAGE_NAMESPACE })
  const [isOnline, setIsOnline] = useState<boolean>(getInitialOnlineState)
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)
  const [initializing, setInitializing] = useState(true)
  const [isDemoModeEnabled, setIsDemoModeEnabled] = useState(false)
  
  // Check if we're in local/dev environment by calling /v0/status
  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        const { getAPIStatus } = await import('@/lib/api/status')
        const data = await getAPIStatus()
        const env = data.env as string
        const isDev = env === 'local' || env === 'dev'
        setIsDemoModeEnabled(isDev)
        
        if (isDev) {
          console.log(`[Offline Demo] ✅ Running in ${env} mode - manual toggle enabled`)
          console.log('[Offline Demo] Press Cmd+Shift+O (Mac) or Ctrl+Shift+O (Windows/Linux) to toggle offline mode')
        } else {
          console.log(`[Offline Demo] Running in ${env} mode - manual toggle disabled for security`)
        }
      } catch (error) {
        console.log('[Offline Demo] Failed to check environment, demo mode disabled')
      }
    }
    
    checkEnvironment()
  }, [])
  
  // Temporary: Allow toggling offline mode with Cmd+Shift+O (Mac) or Ctrl+Shift+O (Windows/Linux) for demo
  // Only enabled in local/dev environments
  useEffect(() => {
    if (!isDemoModeEnabled) {
      return
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('[Offline Demo] Key pressed:', {
        key: e.key,
        metaKey: e.metaKey,
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        code: e.code
      })
      
      // Check for Cmd (Mac) or Ctrl (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'O' || e.key === 'o')) {
        console.log('[Offline Demo] ✅ Shortcut detected! Toggling...')
        e.preventDefault()
        setIsOnline(prev => {
          const newState = !prev
          console.log(`[Offline Demo] 🔄 Toggled to ${newState ? 'ONLINE ✅' : 'OFFLINE ⚠️'}`)
          return newState
        })
      } else {
        console.log('[Offline Demo] ❌ Not the right combo')
      }
    }
    
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown)
      console.log('[Offline Demo] 🎯 Keyboard listener attached!')
      console.log('[Offline Demo] Current state:', isOnline ? 'ONLINE' : 'OFFLINE')
    }
    
    return () => {
      if (typeof window !== "undefined") {
        console.log('[Offline Demo] 🔌 Keyboard listener detached')
        window.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [isOnline, isDemoModeEnabled])

  useEffect(() => {
    let active = true

    const readStoredSync = async () => {
      try {
        if (storage) {
          const stored = await storage.getItem(LAST_SYNC_KEY)
          if (!active) return
          setLastSyncedAt(parseStoredDate(stored))
        } else if (typeof window !== "undefined") {
          const raw = window.localStorage.getItem(`${STORAGE_NAMESPACE}::${LAST_SYNC_KEY}`)
          setLastSyncedAt(parseStoredDate(raw))
        }
      } finally {
        if (active) {
          setInitializing(false)
        }
      }
    }

    void readStoredSync()

    return () => {
      active = false
    }
  }, [storage])

  const persistSync = useCallback(
    async (timestamp: Date) => {
      const iso = timestamp.toISOString()

      if (storage) {
        await storage.setItem(LAST_SYNC_KEY, iso)
      } else if (typeof window !== "undefined") {
        window.localStorage.setItem(`${STORAGE_NAMESPACE}::${LAST_SYNC_KEY}`, iso)
      }

      setLastSyncedAt(timestamp)
    },
    [storage],
  )

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      void persistSync(new Date())
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [persistSync])

  useEffect(() => {
    if (!initializing && isOnline && !lastSyncedAt) {
      void persistSync(new Date())
    }
  }, [initializing, isOnline, lastSyncedAt, persistSync])

  const markSynced = useCallback(
    async (timestamp: Date = new Date()) => {
      await persistSync(timestamp)
      setIsOnline(getInitialOnlineState())
    },
    [persistSync],
  )

  const status = useMemo<OfflineStatus["status"]>(() => {
    if (initializing) return "initializing"
    return isOnline ? "online" : "offline"
  }, [initializing, isOnline])

  return {
    isOnline,
    isOffline: !isOnline,
    status,
    lastSyncedAt,
    markSynced,
  }
}
