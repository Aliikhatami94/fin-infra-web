/**
 * Example integration of marketing screenshot device frames
 * in your landing page hero section.
 *
 * Usage:
 * import { MarketingShowcase } from "@/components/marketing-showcase"
 *
 * <MarketingShowcase />
 */

import { DeviceFrame } from "@/components/device-frame"

export function MarketingShowcase() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">See it in action</h2>
        <p className="text-lg text-muted-foreground">
          Real screenshots from our dashboard in light and dark modes
        </p>
      </div>

      {/* Desktop Hero - Dark Mode */}
      <div className="mb-16">
        <DeviceFrame
          device="MacBook Pro"
          screenshot="/marketing/shots/dashboard-desktop-dark.png"
          colorScheme="dark"
          priority
          className="mx-auto max-w-6xl"
        />
      </div>

      {/* Mobile Grid - Light and Dark */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto mb-16">
        <div>
          <h3 className="text-sm font-medium mb-4 text-center text-muted-foreground">Light Mode</h3>
          <DeviceFrame
            device="iPhone 13"
            screenshot="/marketing/shots/dashboard-phone-light.png"
            colorScheme="light"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-4 text-center text-muted-foreground">Dark Mode</h3>
          <DeviceFrame
            device="iPhone 13"
            screenshot="/marketing/shots/dashboard-phone-dark.png"
            colorScheme="dark"
          />
        </div>
      </div>

      {/* Additional Desktop Screenshots */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <DeviceFrame
          device="MacBook Pro"
          screenshot="/marketing/shots/portfolio-desktop-light.png"
          colorScheme="light"
        />
        <DeviceFrame
          device="MacBook Pro"
          screenshot="/marketing/shots/cash-flow-desktop-dark.png"
          colorScheme="dark"
        />
      </div>
    </section>
  )
}

/**
 * Alternative: Minimal hero showcase
 */
export function MarketingShowcaseMinimal() {
  return (
    <div className="container mx-auto px-4 py-12">
      <DeviceFrame
        device="MacBook Pro"
        screenshot="/marketing/shots/dashboard-desktop-dark.png"
        colorScheme="dark"
        priority
        className="mx-auto"
      />
    </div>
  )
}

/**
 * Alternative: Feature comparison with screenshots
 */
export function MarketingShowcaseComparison() {
  const features = [
    {
      title: "Portfolio Management",
      description: "Track all your investments in one place",
      screenshot: "/marketing/shots/portfolio-desktop-dark.png",
      colorScheme: "dark" as const,
    },
    {
      title: "Cash Flow Analysis",
      description: "Understand where your money goes",
      screenshot: "/marketing/shots/cash-flow-desktop-light.png",
      colorScheme: "light" as const,
    },
    {
      title: "Budget Planning",
      description: "Set goals and stay on track",
      screenshot: "/marketing/shots/budget-desktop-dark.png",
      colorScheme: "dark" as const,
    },
  ]

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="space-y-24">
        {features.map((feature, idx) => (
          <div
            key={feature.title}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
              idx % 2 === 1 ? "lg:flex-row-reverse" : ""
            }`}
          >
            <div className={idx % 2 === 1 ? "lg:order-2" : ""}>
              <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
              <p className="text-lg text-muted-foreground">{feature.description}</p>
            </div>
            <div className={idx % 2 === 1 ? "lg:order-1" : ""}>
              <DeviceFrame
                device="MacBook Pro"
                screenshot={feature.screenshot}
                colorScheme={feature.colorScheme}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
