"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  full_name?: string
  is_verified: boolean
  onboarding_completed?: boolean
  banking_providers?: Record<string, any>
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, fullName?: string) => Promise<void>
  refreshUser: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      // FIRST: Check if there's an OAuth token in the URL hash (from OAuth callback redirect)
      const hash = window.location.hash
      if (hash && hash.includes("access_token=")) {
        const params = new URLSearchParams(hash.substring(1))
        const hashToken = params.get("access_token")
        
        if (hashToken) {
          console.log("[Auth] Found OAuth token in URL hash, storing")
          localStorage.setItem("auth_token", hashToken)
          // Clear hash from URL
          window.history.replaceState(null, "", window.location.pathname + window.location.search)
        }
      }

      const token = localStorage.getItem("auth_token")
      
      // Try cookie-based auth first (for OAuth), then token-based auth
      const headers: Record<string, string> = {}
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }

      console.log("[Auth] Checking authentication, has token:", !!token)
      
      const response = await fetch(`${API_URL}/users/me`, {
        headers,
        credentials: "include", // Include cookies for OAuth authentication
      })

      console.log("[Auth] /users/me response:", response.status, response.ok)

      if (response.ok) {
        const userData = await response.json()
        console.log("[Auth] User authenticated:", userData.email)
        setUser(userData)
      } else {
        // Auth failed, clear token if present
        console.log("[Auth] Authentication failed, clearing state")
        if (token) {
          localStorage.removeItem("auth_token")
        }
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("auth_token")
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    const formData = new URLSearchParams()
    formData.append("username", email) // API expects 'username' field
    formData.append("password", password)

    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      credentials: "include", // Include cookies
      body: formData.toString(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Login failed")
    }

    const data = await response.json()
    const token = data.access_token

    // Store token
    localStorage.setItem("auth_token", token)

    // Get user info
    const userResponse = await fetch(`${API_URL}/users/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include", // Include cookies
    })

    if (userResponse.ok) {
      const userData = await userResponse.json()
      setUser(userData)
    }
  }

  async function register(email: string, password: string, fullName?: string) {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
      }),
    })

    if (!response.ok) {
      let errorDetail = "Registration failed"
      try {
        const error = await response.json()
        errorDetail = error.detail || errorDetail
        
        // Handle specific error cases
        if (response.status === 400 && errorDetail.toLowerCase().includes("already exists")) {
          errorDetail = "An account with this email already exists"
        } else if (response.status === 500) {
          errorDetail = "Server error during registration. Please try again."
        }
      } catch (e) {
        // If parsing fails, use generic message
        errorDetail = `Registration failed (${response.status})`
      }
      
      throw new Error(errorDetail)
    }

    // Registration successful - return without auto-login
    // User will be redirected to login page
  }

  async function logout() {
    // Call backend logout to clear cookies (for OAuth users)
    try {
      await fetch(`${API_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout request failed:", error)
    }
    
    localStorage.removeItem("auth_token")
    setUser(null)
    router.push("/sign-in")
  }

  async function refreshUser() {
    await checkAuth()
  }

  async function updateUser(updates: Partial<User>) {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      throw new Error("Not authenticated")
    }

    const response = await fetch(`${API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || "Failed to update user")
    }

    const updatedUser = await response.json()
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
