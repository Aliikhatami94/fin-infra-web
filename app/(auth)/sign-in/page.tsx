"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { BRAND } from "@/lib/brand"
import { PasswordInput } from "@/components/ui/password-input"
import { useAuth } from "@/lib/auth/context"
import { showErrorToast, showSuccessToast, formatError } from "@/lib/toast-utils"

export default function SignInPage() {
  const { login, user } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [touched, setTouched] = useState({ email: false, password: false })
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [providerError, setProviderError] = useState<string | null>(null)
  const [providerLoading, setProviderLoading] = useState<"google" | "github" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const emailErrorId = "sign-in-email-error"
  const passwordErrorId = "sign-in-password-error"
  const submitErrorId = "sign-in-submit-error"
  const providerErrorId = "sign-in-provider-error"

  const validateField = (field: "email" | "password", value: string) => {
    if (field === "email") {
      if (!value.trim()) {
        return "Email is required."
      }

      const emailPattern = /.+@.+\..+/
      if (!emailPattern.test(value)) {
        return "Enter a valid email address."
      }
    }

    if (field === "password") {
      if (!value.trim()) {
        return "Password is required."
      }

      if (value.length < 8) {
        return "Use at least 8 characters."
      }
    }

    return ""
  }

  const runValidation = (field: "email" | "password", value: string) => {
    const nextError = validateField(field, value)
    setErrors((prev) => ({ ...prev, [field]: nextError }))
    return nextError
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ email: true, password: true })

    const nextErrors = {
      email: validateField("email", email),
      password: validateField("password", password),
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      setSubmitError("Please correct the highlighted fields before continuing.")
      return
    }

    setSubmitError(null)
    setProviderError(null)
    setIsSubmitting(true)

    try {
      await login(email, password)
      
      // Success! Redirect to dashboard
      showSuccessToast("Welcome back!", {
        description: "You've been signed in successfully.",
      })
      router.push("/dashboard")
    } catch (error) {
      const { message, details } = formatError(error)
      
      setErrors((prev) => ({
        ...prev,
        password: "Those credentials didn't match our records.",
      }))
      setSubmitError("We couldn't sign you in with those credentials. Double-check your email and password and try again.")
      
      showErrorToast("Sign in failed", {
        description: details || message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOAuthSignIn = (provider: "google" | "github") => {
    // Redirect to backend OAuth authorization endpoint
    // Backend will handle the OAuth flow and redirect back with JWT token
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    window.location.href = `${apiUrl}/auth/oauth/${provider}/login`
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center border border-primary/20">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <span className="text-xl font-semibold">{BRAND.name}</span>
            </div>
          </Link>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to continue automating your financial clarity</p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 text-sm font-medium bg-transparent"
            onClick={() => handleOAuthSignIn("google")}
            aria-label="Continue with Google"
            disabled={providerLoading === "google"}
            aria-busy={providerLoading === "google"}
          >
            {providerLoading === "google" ? (
              <>
                <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" /> Connecting…
              </>
            ) : (
              <>
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 text-sm font-medium bg-transparent"
            onClick={() => handleOAuthSignIn("github")}
            aria-label="Continue with GitHub"
            disabled={providerLoading === "github"}
            aria-busy={providerLoading === "github"}
          >
            {providerLoading === "github" ? (
              <>
                <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" /> Connecting…
              </>
            ) : (
              <>
                <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                Continue with GitHub
              </>
            )}
          </Button>
        </div>

        {providerError ? (
          <div
            id={providerErrorId}
            role="alert"
            aria-live="assertive"
            tabIndex={-1}
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {providerError}
          </div>
        ) : null}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                const nextValue = e.target.value
                setEmail(nextValue)
                if (touched.email) {
                  runValidation("email", nextValue)
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, email: true }))
                runValidation("email", email)
              }}
              required
              className="h-11"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? emailErrorId : undefined}
              autoComplete="email"
            />
            {errors.email ? (
              <p
                id={emailErrorId}
                className="text-xs text-destructive"
                aria-live="polite"
              >
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                const nextValue = e.target.value
                setPassword(nextValue)
                if (touched.password) {
                  runValidation("password", nextValue)
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, password: true }))
                runValidation("password", password)
              }}
              required
              className="h-11"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? passwordErrorId : undefined}
              autoComplete="current-password"
            />
            {errors.password ? (
              <p
                id={passwordErrorId}
                className="text-xs text-destructive"
                aria-live="polite"
              >
                {errors.password}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-sm font-medium"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        {submitError ? (
          <div
            id={submitErrorId}
            role="alert"
            aria-live="polite"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {submitError}
          </div>
        ) : null}

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground">
          Don&#39;t have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
