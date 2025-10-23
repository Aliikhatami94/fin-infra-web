"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
  feature: string
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary] Failed to render ${this.props.feature}`, error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false })
    this.props.onReset?.()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Card role="alert" className="border-dashed border-border/50 bg-muted/20">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-1 rounded-full bg-destructive/10 p-2 text-destructive">
                <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">We couldn&apos;t load the {this.props.feature}.</p>
                <p className="text-sm text-muted-foreground">
                  Please try again. If the issue persists, refresh the page or check your connection.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={this.handleReset} className="gap-2">
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Retry section
            </Button>
          </div>
        </Card>
      )
    }

    return this.props.children
  }
}
