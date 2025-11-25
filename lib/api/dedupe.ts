/**
 * Request deduplication utility
 * Prevents duplicate API calls by caching in-flight requests
 */

type PendingRequest<T> = {
  promise: Promise<T>
  timestamp: number
}

const pendingRequests = new Map<string, PendingRequest<any>>()
const REQUEST_TIMEOUT = 5000 // 5 seconds

/**
 * Deduplicate API requests by caching in-flight requests
 * If the same request is made while one is already pending, return the existing promise
 */
export async function dedupeRequest<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now()
  
  // Check if we have a pending request for this key
  const pending = pendingRequests.get(key)
  
  if (pending) {
    // Check if the request hasn't timed out
    if (now - pending.timestamp < REQUEST_TIMEOUT) {
      // Return the existing promise
      return pending.promise
    } else {
      // Request timed out, clean it up
      pendingRequests.delete(key)
    }
  }
  
  // Create new request
  const promise = fetcher()
    .finally(() => {
      // Clean up after request completes
      pendingRequests.delete(key)
    })
  
  // Store the pending request
  pendingRequests.set(key, {
    promise,
    timestamp: now,
  })
  
  return promise
}

/**
 * Clear all pending requests (useful for testing)
 */
export function clearPendingRequests() {
  pendingRequests.clear()
}
