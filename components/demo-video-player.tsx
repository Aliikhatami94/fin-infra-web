"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, ExternalLink, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

interface DemoVideoPlayerProps {
  videoSrc: string
  posterSrc: string
  captionsSrc: string
}

export function DemoVideoPlayer({ videoSrc, posterSrc, captionsSrc }: DemoVideoPlayerProps) {
  const [videoError, setVideoError] = useState(false)
  const [emailModalOpen, setEmailModalOpen] = useState(false)

  const handleVideoError = () => {
    setVideoError(true)
  }

  const handleWatchLater = () => {
    // Stubbed functionality - would integrate with email capture service
    toast.success("Feature coming soon! We'll notify you when this is available.", {
      description: "For now, you can bookmark this page to watch later.",
    })
  }

  if (videoError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-border/30 bg-card/50 p-8 text-center shadow-[var(--shadow-soft)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">Video unavailable</h3>
          <p className="max-w-md text-sm text-muted-foreground">
            The video failed to load. Please try refreshing the page, or watch on our YouTube channel.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="focus-visible:ring-offset-2"
          >
            Refresh page
          </Button>
          <Button asChild variant="default" className="gap-2 focus-visible:ring-offset-2">
            <a
              href="https://youtube.com/@clarityledger"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Watch ClarityLedger demo on YouTube (opens in new tab)"
            >
              Watch on YouTube
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl border border-border/30 bg-card shadow-[var(--shadow-soft)]">
        <div className="aspect-video bg-muted">
          <video
            controls
            poster={posterSrc}
            className="h-full w-full"
            aria-describedby="demo-video-description"
            onError={handleVideoError}
          >
            <source src={videoSrc} type="video/mp4" />
            <track default kind="captions" src={captionsSrc} srcLang="en" label="English captions" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleWatchLater}
          className="gap-2 text-xs focus-visible:ring-offset-2"
        >
          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
          Email me this video
        </Button>
      </div>
    </div>
  )
}
