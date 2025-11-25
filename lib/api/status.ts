/**
 * Singleton for fetching API status to prevent duplicate calls
 */

let statusCache: {
  data: { env: string } | null
  promise: Promise<{ env: string }> | null
  timestamp: number
} = {
  data: null,
  promise: null,
  timestamp: 0,
}

const CACHE_TTL = 60000 // 1 minute

export async function getAPIStatus(): Promise<{ env: string }> {
  const now = Date.now()
  
  // Return cached data if still fresh
  if (statusCache.data && now - statusCache.timestamp < CACHE_TTL) {
    return statusCache.data
  }
  
  // Return existing promise if one is in flight
  if (statusCache.promise) {
    return statusCache.promise
  }
  
  // Make new request
  statusCache.promise = (async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) {
        throw new Error('No API URL configured')
      }
      
      const res = await fetch(`${apiUrl}/v0/status`)
      if (!res.ok) {
        throw new Error(`Status check failed: ${res.status}`)
      }
      
      const data = await res.json()
      statusCache.data = data
      statusCache.timestamp = Date.now()
      statusCache.promise = null
      
      return data
    } catch (error) {
      statusCache.promise = null
      // Default to prod if unable to fetch
      return { env: 'prod' }
    }
  })()
  
  return statusCache.promise
}

/**
 * Clear the status cache (useful for testing)
 */
export function clearStatusCache() {
  statusCache = {
    data: null,
    promise: null,
    timestamp: 0,
  }
}
