"use client"

import { useEffect, useState, useCallback } from "react"
import { usePlaidLink, PlaidLinkOnSuccess, PlaidLinkOnExit, PlaidLinkOptions } from "react-plaid-link"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface PlaidLinkButtonProps {
  onSuccess: (accessToken: string, itemId: string, institutionName: string) => void
  onExit?: () => void
  children?: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link"
}

export function PlaidLinkButton({
  onSuccess,
  onExit,
  children = "Connect Bank Account",
  className,
  variant = "default"
}: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const { toast } = useToast()

  // Fetch link token on demand (when button is clicked)
  const fetchLinkToken = useCallback(async () => {
    if (linkToken || initializing) return // Already have token or fetching
    
    setInitializing(true)
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw new Error("No auth token found")
      }

      const response = await fetch(`${API_URL}/banking/link`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: "current" }),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch link token: ${response.statusText}`)
      }

      const data = await response.json()
      setLinkToken(data.link_token)
    } catch (error) {
      console.error("Error fetching link token:", error)
      toast({
        title: "Connection Error",
        description: "Failed to initialize bank connection. Please try again.",
        variant: "destructive",
      })
      setInitializing(false)
    }
  }, [linkToken, initializing, toast])

  // Handle successful Plaid Link flow
  const handleOnSuccess: PlaidLinkOnSuccess = useCallback(
    async (public_token: string, metadata) => {
      setLoading(true)
      
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          throw new Error("No auth token found")
        }

        // Exchange public token for access token
        const exchangeResponse = await fetch(`${API_URL}/banking/exchange`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ public_token }),
        })

        if (!exchangeResponse.ok) {
          throw new Error(`Token exchange failed: ${exchangeResponse.statusText}`)
        }

        const exchangeData = await exchangeResponse.json()
        const { access_token, item_id } = exchangeData

        // Store access token via banking connection endpoint
        const storeResponse = await fetch(`${API_URL}/v0/banking-connection/plaid`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token,
            item_id,
            institution_name: metadata.institution?.name || "Unknown Bank",
          }),
        })

        if (!storeResponse.ok) {
          throw new Error(`Failed to store connection: ${storeResponse.statusText}`)
        }

        // Notify parent component with institution name
        onSuccess(access_token, item_id, metadata.institution?.name || "Bank Account")
      } catch (error) {
        console.error("Error completing Plaid Link:", error)
        toast({
          title: "Connection Failed",
          description: error instanceof Error ? error.message : "Failed to complete bank connection",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    },
    [onSuccess, toast]
  )

  // Handle user exiting Plaid Link flow
  const handleOnExit: PlaidLinkOnExit = useCallback(
    (error, metadata) => {
      if (error) {
        console.error("Plaid Link error:", error)
        toast({
          title: "Connection Cancelled",
          description: error.error_message || "Bank connection was cancelled",
          variant: "destructive",
        })
      }
      
      onExit?.()
    },
    [onExit, toast]
  )

  // Configure Plaid Link (only when we have a token)
  const config: PlaidLinkOptions = {
    token: linkToken,
    onSuccess: handleOnSuccess,
    onExit: handleOnExit,
  }

  const { open, ready } = usePlaidLink(config)

  // Handle button click - fetch token first if needed, then open Plaid Link
  const handleClick = async () => {
    if (!linkToken) {
      await fetchLinkToken()
    } else if (ready) {
      open()
    }
  }

  // Once link token is fetched and Plaid Link is ready, open it automatically
  useEffect(() => {
    if (linkToken && ready && initializing) {
      setInitializing(false)
      open()
    }
  }, [linkToken, ready, initializing, open])

  return (
    <Button
      onClick={handleClick}
      disabled={loading || initializing}
      className={className}
      variant={variant}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : initializing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Initializing...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
