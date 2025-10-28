"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { DeviceFrameset } from "react-device-frameset"
import "react-device-frameset/styles/marvel-devices.min.css"

type DeviceType = "iPhone 13" | "MacBook Pro" | "iPad"
type ColorScheme = "light" | "dark"

type DeviceFrameProps = {
  device: DeviceType
  screenshot: string // path to screenshot
  colorScheme?: ColorScheme // optional theme indicator
  className?: string
  priority?: boolean
}

/**
 * Wraps a screenshot in a device frame for marketing pages.
 * Uses react-device-frameset for the device chrome.
 */
export function DeviceFrame({ device, screenshot, colorScheme, className, priority }: DeviceFrameProps) {
  // Map our simplified device names to react-device-frameset device codes
  const deviceMap: Record<
    DeviceType,
    | "iPhone X"
    | "iPhone 8"
    | "iPhone 8 Plus"
    | "iPhone 5s"
    | "iPhone 4s"
    | "MacBook Pro"
    | "iPad Mini"
    | "Galaxy Note 8"
    | "Nexus 5"
    | "Lumia 920"
    | "Samsung Galaxy S5"
    | "HTC One"
  > = {
    "iPhone 13": "iPhone X", // iPhone X is the closest modern iPhone
    "MacBook Pro": "MacBook Pro",
    iPad: "iPad Mini",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      <DeviceFrameset device={deviceMap[device]} color="black" zoom={1}>
        <Image
          src={screenshot}
          alt={`${device} screenshot`}
          width={device === "iPhone 13" ? 390 : 1440}
          height={device === "iPhone 13" ? 844 : 900}
          priority={priority}
          quality={95}
          className="h-full w-full object-cover"
        />
      </DeviceFrameset>
    </motion.div>
  )
}
