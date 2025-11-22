"use client"

import Link from "next/link"
import { useState, useRef, useEffect, MouseEvent } from "react"
import { AllocationGrid } from "@/components/allocation-grid"
import { HoldingsTable } from "@/components/holdings-table"
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Play, ArrowUpRight, ArrowDownRight, Sparkles, ExternalLink } from "lucide-react"
import confetti from "canvas-confetti"
import { getMockKPIs, getMockAllocation, getMockHoldings } from "@/lib/services/portfolio"
import { BRAND } from "@/lib/brand"

function TiltCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string, delay?: number }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 })

  function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    x.set(clientX - left - width / 2)
    y.set(clientY - top - height / 2)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
  }

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["2.5deg", "-2.5deg"])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-2.5deg", "2.5deg"])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn("relative transition-all duration-200 ease-out", className)}
    >
      {children}
    </motion.div>
  )
}

function ParallaxCard({ 
  children, 
  className, 
  mouseX, 
  mouseY, 
  depth = 1,
  delay = 0,
  directionX = 1,
  directionY = 1
}: { 
  children: React.ReactNode
  className?: string
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  depth?: number
  delay?: number
  directionX?: number
  directionY?: number
}) {
  // Calculate movement based on depth
  // Higher depth = more movement
  const moveX = useTransform(mouseX, [0, 1], [-20 * depth * directionX, 20 * depth * directionX])
  const moveY = useTransform(mouseY, [0, 1], [-20 * depth * directionY, 20 * depth * directionY])
  
  const springX = useSpring(moveX, { stiffness: 40, damping: 30 })
  const springY = useSpring(moveY, { stiffness: 40, damping: 30 })

  // Add subtle rotation
  const rotateX = useTransform(mouseY, [0, 1], [5 * depth * directionY, -5 * depth * directionY])
  const rotateY = useTransform(mouseX, [0, 1], [-5 * depth * directionX, 5 * depth * directionX])
  const springRotateX = useSpring(rotateX, { stiffness: 40, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 40, damping: 30 })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      style={{ 
        x: springX, 
        y: springY,
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: "preserve-3d"
      }}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  )
}

function LandingStatCard({ label, value, change, positive }: { label: string, value: string, change: string, positive: boolean }) {
  return (
    <div className="flex flex-col justify-between p-5 rounded-xl bg-card/50 backdrop-blur-xl border border-[color:var(--table-divider)] shadow-xl hover:bg-card/60 transition-colors h-full min-h-[120px]">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className={cn(
          "flex items-center text-xs font-medium px-2 py-0.5 rounded-full",
          positive ? "text-emerald-500 bg-emerald-500/10" : "text-red-500 bg-red-500/10"
        )}>
          {positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {change}
        </div>
      </div>
      <div className="mt-2">
        <span className="text-3xl font-bold tracking-tight text-foreground block truncate" title={value}>{value}</span>
      </div>
    </div>
  )
}

export function FinanceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let animationFrameId: number
    
    const updateSize = () => {
      // We want the canvas to cover the full scrollable area if possible, 
      // but getBoundingClientRect returns viewport size if fixed, or element size if absolute.
      // Since we are switching to absolute positioning in a full-height container,
      // offsetWidth/Height should give us the full size.
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      
      // Update canvas resolution
      canvas.width = width
      canvas.height = height
    }

    // Initial size
    updateSize()

    // Use ResizeObserver to detect size changes (e.g. content expansion)
    const resizeObserver = new ResizeObserver(() => {
      updateSize()
    })
    resizeObserver.observe(canvas)

    // Also listen to window resize as backup
    window.addEventListener('resize', updateSize)

    const mouse = { x: width / 2, y: height / 2 }
    
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      // Adjust mouse coordinates to be relative to the canvas
      // Since canvas might be scrolled, we need to account for that if it's absolute.
      // e.clientX/Y are viewport coordinates.
      // If canvas is absolute and full page, we need page coordinates?
      // No, getBoundingClientRect().top gives position relative to viewport.
      // So e.clientY - rect.top is correct for mouse position on canvas.
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Particles representing "Transactions" or "Data"
    const particles: { x: number, y: number, vx: number, vy: number, size: number, life: number, color: string }[] = []
    
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      
      // Determine colors based on theme (simple check)
      const isDark = document.documentElement.classList.contains('dark')
      const gridColor = isDark ? '255, 255, 255' : '0, 0, 0'
      
      // Brand colors for particles
      const colors = [
        '59, 130, 246', // Blue
        '16, 185, 129', // Emerald
        '139, 92, 246', // Violet
      ]
      
      // 1. Draw Grid of Dots - Minimal & Spacious with Distortion
      const gridSize = 50 
      
      // Optimization: Only draw grid points that are visible in the viewport?
      // Or just draw all. If height is huge, drawing all might be slow.
      // Let's draw all for now, but if performance sucks we can optimize.
      // Actually, let's optimize to only draw visible grid points.
      // We can get the scroll position.
      const scrollY = window.scrollY
      const viewportHeight = window.innerHeight
      const startY = Math.floor(scrollY / gridSize) * gridSize - gridSize
      const endY = startY + viewportHeight + gridSize * 2

      for (let x = 0; x < width; x += gridSize) {
        for (let y = Math.max(0, startY); y < Math.min(height, endY); y += gridSize) {
          // Distance from mouse
          const dx = x - mouse.x
          const dy = y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const maxDist = 400 // Interaction radius
          
          // Base opacity - Very subtle
          let alpha = 0.02
          let size = 0.6
          
          let gx = x
          let gy = y

          // Mouse interaction (Distortion & Spotlight)
          if (dist < maxDist) {
            const intensity = Math.pow(1 - dist / maxDist, 2)
            alpha += intensity * 0.2
            size += intensity * 1.2
            
            // Slight repulsion effect
            const angle = Math.atan2(dy, dx)
            const move = intensity * 15
            gx += Math.cos(angle) * move
            gy += Math.sin(angle) * move
          }
          
          ctx.fillStyle = `rgba(${gridColor}, ${alpha})`
          ctx.beginPath()
          ctx.arc(gx, gy, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      
      // 2. Spawn Particles (Data Flow)
      // Spawn them near the bottom of the VIEWPORT, not the document
      if (particles.length < 15 && Math.random() > 0.97) {
        const spawnY = window.scrollY + window.innerHeight + 20
        particles.push({
          x: Math.random() * width,
          y: spawnY,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.5 - Math.random() * 1, // Upward movement
          size: Math.random() * 2 + 1,
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
      
      // 3. Update & Draw Particles
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.004
        
        if (p.life <= 0 || p.y < window.scrollY - 50) { // Kill if above viewport
          particles.splice(i, 1)
          return
        }
        
        ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.4})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Connect to nearby particles (Constellations)
        particles.slice(i + 1).forEach(p2 => {
            const dx = p.x - p2.x
            const dy = p.y - p2.y
            const dist = Math.sqrt(dx*dx + dy*dy)
            
            if (dist < 150) {
                ctx.strokeStyle = `rgba(${p.color}, ${Math.min(p.life, p2.life) * 0.15})`
                ctx.lineWidth = 0.5
                ctx.beginPath()
                ctx.moveTo(p.x, p.y)
                ctx.lineTo(p2.x, p2.y)
                ctx.stroke()
            }
        })
        
        // Connect to nearest grid point - Only when very close
        const gx = Math.round(p.x / gridSize) * gridSize
        const gy = Math.round(p.y / gridSize) * gridSize
        const dx = p.x - gx
        const dy = p.y - gy
        const dist = Math.sqrt(dx*dx + dy*dy)
        
        if (dist < gridSize) {
          ctx.strokeStyle = `rgba(${p.color}, ${p.life * 0.1})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(gx, gy)
          ctx.stroke()
        }
      })
      
      animationFrameId = requestAnimationFrame(draw)
    }
    
    draw()
    
    return () => {
      window.removeEventListener('resize', updateSize)
      window.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="absolute inset-0 -z-50 overflow-hidden pointer-events-none h-full w-full">
      {/* Subtle gradient backing */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-30" />
      
      {/* The Interactive Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}

export function LandingInteractiveDemo() {
  const [key, setKey] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [kpiData, setKpiData] = useState(getMockKPIs())
  
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect()
    mouseX.set((clientX - left) / width)
    mouseY.set((clientY - top) / height)
  }
  
  // Helper to add 'amount' to allocation data which is required by AllocationGrid types
  const enrichAllocation = (data: ReturnType<typeof getMockAllocation>) => {
    const enrich = (items: { name: string; value: number; color: string }[]) => 
      items.map(item => ({ ...item, amount: item.value * 1000 }))
    return {
      assetClass: enrich(data.assetClass),
      sector: enrich(data.sector),
      region: enrich(data.region)
    }
  }

  const [allocationData, setAllocationData] = useState(enrichAllocation(getMockAllocation()))
  const [holdingsData, setHoldingsData] = useState(getMockHoldings())

  const handleSimulate = () => {
    setIsAnimating(true)
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']
    })

    // Simulate network delay for effect
    setTimeout(() => {
      // Randomize data
      const randomize = (val: number) => val * (0.9 + Math.random() * 0.2)
      
      // Update KPIs
      const newKpis = getMockKPIs().map(kpi => {
        const numValue = parseFloat(kpi.value.replace(/[^0-9.-]+/g, ""))
        const newValue = randomize(numValue)
        return {
          ...kpi,
          value: kpi.value.includes("$") 
            ? `$${newValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : newValue.toFixed(2),
          change: `${(Math.random() * 10 - 2).toFixed(1)}%`,
          positive: Math.random() > 0.3
        }
      })
      setKpiData(newKpis)

      // Update Allocation (shuffle values slightly)
      const rawAllocation = getMockAllocation()
      const randomizedAllocation = {
        assetClass: rawAllocation.assetClass.map(item => ({ ...item, value: Math.max(1, Math.round(randomize(item.value))) })),
        sector: rawAllocation.sector.map(item => ({ ...item, value: Math.max(1, Math.round(randomize(item.value))) })),
        region: rawAllocation.region.map(item => ({ ...item, value: Math.max(1, Math.round(randomize(item.value))) })),
      }
      setAllocationData(enrichAllocation(randomizedAllocation))

      // Update Holdings
      const newHoldings = getMockHoldings().map(h => ({
        ...h,
        currentPrice: randomize(h.currentPrice),
        change: randomize(h.change),
      }))
      setHoldingsData(newHoldings)

      setKey(prev => prev + 1)
      setIsAnimating(false)
    }, 600)
  }

  return (
    <section 
      onMouseMove={onMouseMove}
      className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative overflow-visible"
    >
      {/* Hero Content & Floating KPIs */}
      <div className="relative z-10 mb-24">
        <div className="text-center max-w-4xl mx-auto relative">
          {/* Floating KPIs - Desktop */}
          <div className="hidden lg:block absolute top-28 -left-52 w-64 z-20">
            <ParallaxCard mouseX={mouseX} mouseY={mouseY} depth={1.5} delay={0.2} directionX={-1} directionY={1} className="scale-90 hover:scale-100 transition-transform">
              <LandingStatCard {...kpiData[0]} />
            </ParallaxCard>
          </div>
          <div className="hidden lg:block absolute top-96 -left-64 w-64 z-20">
            <ParallaxCard mouseX={mouseX} mouseY={mouseY} depth={2.5} delay={0.4} directionX={1} directionY={-1} className="scale-90 hover:scale-100 transition-transform">
              <LandingStatCard {...kpiData[1]} />
            </ParallaxCard>
          </div>
          <div className="hidden lg:block absolute top-16 -right-56 w-64 z-20">
            <ParallaxCard mouseX={mouseX} mouseY={mouseY} depth={1.2} delay={0.3} directionX={-1} directionY={-1} className="scale-90 hover:scale-100 transition-transform">
              <LandingStatCard {...kpiData[2]} />
            </ParallaxCard>
          </div>
          <div className="hidden lg:block absolute top-80 -right-40 w-64 z-20">
            <ParallaxCard mouseX={mouseX} mouseY={mouseY} depth={2.0} delay={0.5} directionX={1} directionY={1} className="scale-90 hover:scale-100 transition-transform">
              <LandingStatCard {...kpiData[3]} />
            </ParallaxCard>
          </div>

          {/* Mobile KPIs Grid (visible only on small screens) - REMOVED to move below text */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-30"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              <span>AI-powered financial intelligence</span>
            </div>
            
            <h1 className="mb-6 text-foreground text-[clamp(2.5rem,5.5vw,5rem)] font-bold tracking-tight leading-[1.1]">
              Financial clarity for
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                every decision
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Orchestrate portfolios, cash flow, and planning in one secure platform built to surface actionable insights
              the moment your finance team needs them.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row mb-12">
              <Button 
                size="lg" 
                onClick={handleSimulate}
                disabled={isAnimating}
                className="rounded-full h-12 px-8 text-base shadow-lg hover:shadow-primary/25 transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-primary to-primary/90"
              >
                <Play className={cn("mr-2 h-5 w-5 fill-current", isAnimating && "animate-pulse")} />
                {isAnimating ? "Simulating..." : "Simulate Market"}
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full px-8 text-base font-medium border-border/50 hover:border-border hover:bg-accent/5 backdrop-blur-sm"
              >
                <Link href="/demo" aria-label={`Watch a guided tour of the ${BRAND.name} financial platform`}>
                  Watch Demo
                </Link>
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 text-sm text-muted-foreground sm:flex-row">
              <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-border/30 bg-muted/30 px-5 py-2 backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground">Trusted by</span>
                <span className="text-xs font-semibold text-foreground">Fortress Bank</span>
                <span className="text-xs font-semibold text-foreground">Radial Ventures</span>
                <span className="text-xs font-semibold text-foreground">Northern Equity</span>
              </div>
            </div>

            {/* Mobile KPIs - Horizontal Scroll (visible only on small screens) */}
            <div className="lg:hidden w-full mt-12">
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory">
                {kpiData.slice(0, 3).map((kpi, i) => (
                  <div key={i} className="min-w-[260px] h-32 snap-center first:pl-2 last:pr-2">
                    <LandingStatCard {...kpi} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Allocation - Floating */}
        <div className="lg:col-span-4">
          <TiltCard delay={0.4} className="h-full">
            <AllocationGrid 
              key={key} 
              demoMode={true} 
              mockDataOverride={allocationData}
              className="h-full bg-card/50 backdrop-blur-xl border border-[color:var(--table-divider)] shadow-xl"
            />
          </TiltCard>
        </div>

        {/* Holdings - Floating */}
        <div className="lg:col-span-8">
          <TiltCard delay={0.5}>
            <HoldingsTable 
              key={key} 
              demoMode={true} 
              mockDataOverride={holdingsData}
              hideControls={true}
              className="bg-card/50 backdrop-blur-xl border-0 shadow-xl"
            />
          </TiltCard>
        </div>
      </div>
    </section>
  )
}
