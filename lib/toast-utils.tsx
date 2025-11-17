"use client"

import { toast } from "sonner"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface ErrorToastOptions {
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Clipboard button component with icon transition
 */
function ClipboardButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 inline-flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity"
      aria-label="Copy error"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  )
}

/**
 * Show error toast with clipboard copy functionality
 */
export function showErrorToast(message: string, options?: ErrorToastOptions) {
  const errorText = options?.description 
    ? `${message}\n\n${options.description}` 
    : message

  toast.error(message, {
    description: options?.description,
    duration: options?.duration ?? 5000,
    unstyled: false,
    classNames: {
      toast: "relative pr-12",
    },
    action: <ClipboardButton text={errorText} />,
  })
}

/**
 * Show success toast (for consistency)
 */
export function showSuccessToast(message: string, options?: { description?: string; duration?: number }) {
  toast.success(message, {
    description: options?.description,
    duration: options?.duration ?? 3000,
  })
}

/**
 * Format error for display
 */
export function formatError(error: unknown): { message: string; details?: string } {
  if (error instanceof Error) {
    const message = error.message
    
    // Handle database transaction errors
    if (message.includes("InFailedSQLTransactionError") || message.includes("aborted")) {
      return {
        message: "Database transaction error",
        details: "A previous operation failed. Please refresh the page and try again.\n\nTechnical details: Transaction was aborted and requires rollback."
      }
    }
    
    // Extract SQL error details if present
    if (message.includes("SQL:")) {
      const sqlMatch = message.match(/\[SQL: ([^\]]+)\]/)
      const paramsMatch = message.match(/\[parameters: ([^\]]+)\]/)
      const errorClassMatch = message.match(/<class '([^']+)'>/)
      
      const details = [
        errorClassMatch ? `Error: ${errorClassMatch[1].split(".").pop()}` : null,
        sqlMatch ? `SQL: ${sqlMatch[1]}` : null,
        paramsMatch ? `Parameters: ${paramsMatch[1]}` : null,
      ].filter(Boolean).join("\n")
      
      return {
        message: "Database error occurred",
        details: details || undefined
      }
    }
    
    // Handle common user-facing errors
    if (message.toLowerCase().includes("already exists")) {
      return {
        message: "Account already exists",
        details: "An account with this email is already registered. Try signing in instead."
      }
    }
    
    if (message.toLowerCase().includes("not found")) {
      return {
        message: "Resource not found",
        details: message
      }
    }
    
    return {
      message: message || "An error occurred",
    }
  }
  
  if (typeof error === "string") {
    return { message: error }
  }
  
  return { message: "An unexpected error occurred" }
}
