"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { BRAND } from "@/lib/brand"
import { PasswordInput } from "@/components/ui/password-input"
import { ComingSoon } from "@/components/coming-soon"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [submitError, setSubmitError] = useState<string | null>(null)

  const nameErrorId = "sign-up-name-error"
  const emailErrorId = "sign-up-email-error"
  const passwordErrorId = "sign-up-password-error"
  const confirmPasswordErrorId = "sign-up-confirm-password-error"
  const passwordStrengthId = "sign-up-password-strength"
  const submitErrorId = "sign-up-submit-error"

  const validateField = (
    field: "name" | "email" | "password" | "confirmPassword",
    value: string,
    options?: { passwordValue?: string },
  ) => {
    const passwordValue = options?.passwordValue ?? password

    switch (field) {
      case "name":
        if (!value.trim()) {
          return "Full name is required."
        }
        if (value.trim().length < 2) {
          return "Enter at least 2 characters."
        }
        return ""
      case "email":
        if (!value.trim()) {
          return "Email is required."
        }
        if (!/.+@.+\..+/.test(value)) {
          return "Enter a valid email address."
        }
        return ""
      case "password":
        if (!value.trim()) {
          return "Password is required."
        }
        if (value.length < 8) {
          return "Use at least 8 characters with a mix of letters, numbers, and symbols."
        }
        return ""
      case "confirmPassword":
        if (!value.trim()) {
          return "Confirm your password."
        }
        if (value !== passwordValue) {
          return "Passwords do not match. Make sure both fields are identical."
        }
        return ""
      default:
        return ""
    }
  }

  const runValidation = (
    field: "name" | "email" | "password" | "confirmPassword",
    value: string,
    options?: { passwordValue?: string },
  ) => {
    const nextError = validateField(field, value, options)
    setErrors((prev) => ({ ...prev, [field]: nextError }))
    return nextError
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true, confirmPassword: true })

    const nextErrors = {
      name: validateField("name", name),
      email: validateField("email", email),
      password: validateField("password", password),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      setSubmitError("Please correct the highlighted fields before continuing.")
      return
    }

    setSubmitError(null)
    // TODO: Implement registration logic
  }

  const handleOAuthSignUp = (_provider: "google" | "github") => {
    // TODO: Implement OAuth logic
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <span className="text-xl font-semibold">{BRAND.name}</span>
            </div>
          </Link>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Get started with your financial journey</p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <ComingSoon message="OAuth sign-up coming soon">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-sm font-medium bg-transparent"
              onClick={() => handleOAuthSignUp("google")}
              aria-label="Continue with Google"
            >
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
            </Button>
          </ComingSoon>

          <ComingSoon message="OAuth sign-up coming soon">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-sm font-medium bg-transparent"
              onClick={() => handleOAuthSignUp("github")}
              aria-label="Continue with GitHub"
            >
              <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Continue with GitHub
            </Button>
          </ComingSoon>
        </div>

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
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                const nextValue = e.target.value
                setName(nextValue)
                if (!touched.name) {
                  setTouched((prev) => ({ ...prev, name: true }))
                }
                runValidation("name", nextValue)
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, name: true }))
                runValidation("name", name)
              }}
              required
              className="h-11"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? nameErrorId : undefined}
              autoComplete="name"
            />
            {errors.name ? (
              <p
                id={nameErrorId}
                className="text-xs text-destructive"
                aria-live="polite"
              >
                {errors.name}
              </p>
            ) : null}
          </div>

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
                if (!touched.email) {
                  setTouched((prev) => ({ ...prev, email: true }))
                }
                runValidation("email", nextValue)
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
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <PasswordInput
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => {
                const nextValue = e.target.value
                setPassword(nextValue)
                if (!touched.password) {
                  setTouched((prev) => ({ ...prev, password: true }))
                }
                runValidation("password", nextValue)
                if (confirmPassword) {
                  runValidation("confirmPassword", confirmPassword, {
                    passwordValue: nextValue,
                  })
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, password: true }))
                runValidation("password", password)
              }}
              required
              className="h-11"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={[errors.password ? passwordErrorId : null, passwordStrengthId]
                .filter(Boolean)
                .join(" ") || undefined}
              autoComplete="new-password"
              showStrength
              strengthHintId={passwordStrengthId}
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                const nextValue = e.target.value
                setConfirmPassword(nextValue)
                if (!touched.confirmPassword) {
                  setTouched((prev) => ({ ...prev, confirmPassword: true }))
                }
                runValidation("confirmPassword", nextValue, { passwordValue: password })
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, confirmPassword: true }))
                runValidation("confirmPassword", confirmPassword, { passwordValue: password })
              }}
              required
              className="h-11"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? confirmPasswordErrorId : undefined}
              autoComplete="new-password"
            />
            {errors.confirmPassword ? (
              <p
                id={confirmPasswordErrorId}
                className="text-xs text-destructive"
                aria-live="polite"
              >
                {errors.confirmPassword}
              </p>
            ) : null}
          </div>

          <ComingSoon>
            <Button type="submit" className="w-full h-11 text-sm font-medium">
              Create account
            </Button>
          </ComingSoon>
        </form>

        {submitError ? (
          <div
            id={submitErrorId}
            role="alert"
            aria-live="assertive"
            className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {submitError}
          </div>
        ) : null}

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary hover:underline font-medium">
            Sign in
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
