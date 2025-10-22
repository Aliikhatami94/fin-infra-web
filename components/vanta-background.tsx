"use client"

import type React from "react"

import { useEffect, useRef } from "react"

interface VantaBackgroundProps {
  children?: React.ReactNode
}

export function VantaBackground({ children }: VantaBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffect = useRef<any>(null)

  useEffect(() => {
    if (!vantaRef.current) return

    // Load Three.js
    const threeScript = document.createElement("script")
    threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
    threeScript.async = true

    threeScript.onload = () => {
      // Load Vanta FOG
      const vantaScript = document.createElement("script")
      vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"
      vantaScript.async = true

      vantaScript.onload = () => {
        if (window.VANTA && vantaRef.current) {
          vantaEffect.current = window.VANTA.FOG({
            el: vantaRef.current,
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
          })
        }
      }

      document.body.appendChild(vantaScript)
    }

    document.body.appendChild(threeScript)

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy()
      }
    }
  }, [])

  return (
    <div ref={vantaRef} className="fixed inset-0 -z-10">
      {children}
    </div>
  )
}

declare global {
  interface Window {
    VANTA: any
  }
}
