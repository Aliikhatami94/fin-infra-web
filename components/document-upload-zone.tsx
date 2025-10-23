"use client"

import { useCallback, useRef, useState, useId, type DragEventHandler, type KeyboardEvent } from "react"
import { UploadCloud, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { trackDocumentUpload } from "@/lib/analytics/events"

interface DocumentUploadZoneProps {
  id?: string
  onUploadComplete?: (files: File[]) => void
}

interface UploadItem {
  id: string
  name: string
  status: "pending" | "uploading" | "success" | "error"
  progress: number
}

export function DocumentUploadZone({ id, onUploadComplete }: DocumentUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const descriptionId = useId()

  const beginUpload = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) {
        return
      }

      const fileArray = Array.from(files)
      let processed = 0
      const successful: File[] = []

      fileArray.forEach((file) => {
        const id = `${file.name}-${file.lastModified}`
        const nextItem: UploadItem = { id, name: file.name, status: "uploading", progress: 0 }

        setUploads((prev) => [...prev, nextItem])

        const start = performance.now()
        const duration = Math.max(1200, Math.min(4000, file.size / 50))

        const step = () => {
          setUploads((prev) =>
            prev.map((item) =>
              item.id === id
                ? {
                    ...item,
                    progress: Math.min(100, Math.round(((performance.now() - start) / duration) * 100)),
                  }
                : item,
            ),
          )

          if (performance.now() - start >= duration) {
            const shouldFail = file.size > 15_000_000

            setUploads((prev) =>
              prev.map((item) =>
                item.id === id
                  ? {
                      ...item,
                      status: shouldFail ? "error" : "success",
                      progress: 100,
                    }
                  : item,
              ),
            )

            if (shouldFail) {
              toast.error(`Upload failed for ${file.name}`, {
                description: "Files larger than 15MB must be uploaded via secure desktop",
              })
              trackDocumentUpload({
                fileName: file.name,
                status: "error",
                size: file.size,
              })
            } else {
              toast.success(`${file.name} uploaded`, {
                description: "You can now tag and share this document",
              })
              trackDocumentUpload({
                fileName: file.name,
                status: "success",
                size: file.size,
              })
              successful.push(file)
            }

            processed += 1
            if (processed === fileArray.length && successful.length > 0) {
              onUploadComplete?.([...successful])
            }
          } else {
            requestAnimationFrame(step)
          }
        }

        requestAnimationFrame(step)
      })
    },
    [onUploadComplete],
  )

  const handleDrop = useCallback<DragEventHandler<HTMLDivElement>>(
    (event) => {
      event.preventDefault()
      setIsDragging(false)
      beginUpload(event.dataTransfer?.files ?? null)
    },
    [beginUpload],
  )

  const handleDragOver = useCallback<DragEventHandler<HTMLDivElement>>(
    (event) => {
      event.preventDefault()
      if (!isDragging) {
        setIsDragging(true)
      }
    },
    [isDragging],
  )

  const handleDragLeave = useCallback<DragEventHandler<HTMLDivElement>>((event) => {
    event.preventDefault()
    setIsDragging(false)
  }, [])

  const handleBrowse = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        handleBrowse()
      }
    },
    [handleBrowse],
  )

  return (
    <section
      id={id}
      aria-label="Upload documents"
      aria-describedby={descriptionId}
      className="rounded-3xl border border-dashed border-border/50 bg-muted/10 shadow-[var(--shadow-soft)] focus-within:border-primary/70"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 px-8 py-12 text-center transition-colors",
          isDragging ? "bg-primary/5 border-primary/60 shadow-[var(--shadow-bold)]" : "bg-transparent",
        )}
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          onChange={(event) => beginUpload(event.target.files)}
          aria-hidden
        />
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[var(--shadow-soft)]">
          <UploadCloud className="h-8 w-8" aria-hidden="true" />
        </div>
        <div className="space-y-3 max-w-xl">
          <p className="text-base font-semibold text-foreground">Drop statements, receipts, and disclosures</p>
          <p id={descriptionId} className="text-sm text-muted-foreground">
            Secure uploads stay encrypted end-to-end. We redact sensitive numbers automatically and only surface summaries in
            insights.
          </p>
          <ul className="mx-auto flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground/90">
            <li className="rounded-full border border-border/60 bg-card/80 px-3 py-1">PDF (statements & reports)</li>
            <li className="rounded-full border border-border/60 bg-card/80 px-3 py-1">JPG / PNG (receipts)</li>
            <li className="rounded-full border border-border/60 bg-card/80 px-3 py-1">CSV ≤ 15MB (exports)</li>
          </ul>
        </div>
        <Button
          size="lg"
          className="mt-4 rounded-full px-7 text-sm font-semibold shadow-[var(--shadow-soft)] focus-visible:ring-offset-2"
          onClick={handleBrowse}
          data-loading={isDragging}
        >
          Browse secure vault
        </Button>
      </div>

      {uploads.length > 0 ? (
        <div className="space-y-2 border-t border-border/40 bg-card/60 p-4" aria-live="polite">
          {uploads.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/80 p-3 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                {item.status === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                ) : item.status === "error" ? (
                  <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden="true" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <span className="text-xs text-muted-foreground">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" aria-label={`${item.name} upload progress`} />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}
