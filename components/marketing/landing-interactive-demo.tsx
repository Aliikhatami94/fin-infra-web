"use client"

import { useState, MouseEvent } from "react"
import { AllocationGrid } from "@/components/allocation-grid"
import { HoldingsTable } from "@/components/holdings-table"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Play, ArrowUpRight, ArrowDownRight } from "lucide-react"
import confetti from "canvas-confetti"
import { getMockKPIs, getMockAllocation, getMockHoldings } from "@/lib/services/portfolio"

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

function LandingStatCard({ label, value, change, positive }: { label: string, value: string, change: string, positive: boolean }) {
  return (
    <div className="flex flex-col p-6 rounded-2xl bg-card/50 border border-white/10 shadow-xl backdrop-blur-md hover:bg-card/60 transition-colors h-full">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</span>
      <div className="flex items-end justify-between mt-auto">
        <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
        <div className={cn(
          "flex items-center text-xs font-medium px-2 py-1 rounded-full",
          positive ? "text-emerald-500 bg-emerald-500/10" : "text-red-500 bg-red-500/10"
        )}>
          {positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {change}
        </div>
      </div>
    </div>
  )
}

export function LandingInteractiveDemo() {
  const [key, setKey] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [kpiData, setKpiData] = useState(getMockKPIs())
  
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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative overflow-visible">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header Section */}
      <div className="text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Experience the <span className="text-primary">Power</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            See how your portfolio comes to life with real-time updates and interactive analytics.
          </p>
          
          <Button 
            size="lg" 
            onClick={handleSimulate}
            disabled={isAnimating}
            className="rounded-full h-12 px-8 text-base shadow-lg hover:shadow-primary/25 transition-all hover:scale-105 active:scale-95"
          >
            <Play className={cn("mr-2 h-5 w-5 fill-current", isAnimating && "animate-pulse")} />
            {isAnimating ? "Simulating Market..." : "Simulate Market Move"}
          </Button>
        </motion.div>
      </div>

      {/* Floating Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
        {kpiData.map((kpi, i) => (
          <TiltCard key={i} delay={i * 0.1} className="h-full">
            <LandingStatCard {...kpi} />
          </TiltCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Allocation - Floating */}
        <div className="lg:col-span-4">
          <TiltCard delay={0.4} className="h-full">
            <AllocationGrid 
              key={key} 
              demoMode={true} 
              mockDataOverride={allocationData}
              className="h-full bg-card/50 backdrop-blur-xl border-white/10 shadow-xl"
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
