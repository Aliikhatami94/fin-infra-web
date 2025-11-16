/**
 * Get current user ID from auth token
 * Returns null if not authenticated
 */
export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") {
    return null
  }

  const token = localStorage.getItem("auth_token")
  if (!token) {
    return null
  }

  try {
    // JWT tokens are in format: header.payload.signature
    const parts = token.split(".")
    if (parts.length !== 3) {
      return null
    }

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]))
    
    // The user ID is in the 'sub' (subject) claim
    return payload.sub || null
  } catch (error) {
    console.error("Failed to decode token:", error)
    return null
  }
}

/**
 * Get auth token for API requests
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null
  }
  return localStorage.getItem("auth_token")
}
