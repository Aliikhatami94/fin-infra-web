"use client"

import type React from "react"

import Script from "next/script"
import { useCallback, useEffect, useRef, useState } from "react"

type VantaFogInstance = { destroy: () => void }

type VantaFogOptions = {
  el: HTMLElement
  mouseControls: boolean
  touchControls: boolean
  gyroControls: boolean
  minHeight: number
  minWidth: number
  highlightColor: number
  midtoneColor: number
  lowlightColor: number
  baseColor: number
  speed: number
}

interface VantaBackgroundProps {
  children?: React.ReactNode
}

export function VantaBackground({ children }: VantaBackgroundProps) {
  const isVantaEnabled = process.env.NEXT_PUBLIC_ENABLE_VANTA === "true"
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<VantaFogInstance | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isVantaReady, setIsVantaReady] = useState(false)

  const handleVantaReady = useCallback(() => {
    if (typeof window === "undefined") {
      return
    }

    if (window.VANTA?.FOG) {
      setIsVantaReady(true)
    }
  }, [])

  useEffect(() => {
    if (!isVantaEnabled || isVisible || !vantaRef.current) {
      return
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setIsVisible(true)
          obs.disconnect()
          break
        }
      }
    })

    observer.observe(vantaRef.current)

    return () => {
      observer.disconnect()
    }
  }, [isVantaEnabled, isVisible])

  useEffect(() => {
    const element = vantaRef.current

    if (!isVantaEnabled || !isVisible || !isVantaReady || !element) {
      return
    }

    if (vantaEffect.current || !window.VANTA?.FOG) {
      return
    }

    const options: VantaFogOptions = {
      el: element,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      highlightColor: 0xe0e5f0,
      midtoneColor: 0xd0d5e0,
      lowlightColor: 0xc0c5d0,
      baseColor: 0xf5f5f7,
      speed: 0.5,
    }

    vantaEffect.current = window.VANTA.FOG(options)

    return () => {
      vantaEffect.current?.destroy()
      vantaEffect.current = null
    }
  }, [isVantaEnabled, isVantaReady, isVisible])

  return (
    <>
      {isVantaEnabled ? (
        <>
          <Script
            src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
            strategy="afterInteractive"
          />
          <Script
            src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"
            strategy="afterInteractive"
            onLoad={handleVantaReady}
            onReady={handleVantaReady}
          />
        </>
      ) : null}
      <div ref={vantaRef} className="fixed inset-0 -z-10">
        {children}
      </div>
    </>
  )
}

declare global {
  interface Window {
    VANTA?: {
      FOG: (options: VantaFogOptions) => VantaFogInstance
    }
  }
}
