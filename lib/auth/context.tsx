"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  full_name?: string
  is_verified: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, fullName?: string) => Promise<void>
  refreshUser: () => Promise<void>
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
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // Token is invalid, clear it
        localStorage.removeItem("auth_token")
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
    localStorage.removeItem("auth_token")
    setUser(null)
    router.push("/sign-in")
  }

  async function refreshUser() {
    await checkAuth()
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
