import { afterEach } from "vitest"

// Vitest setup for jsdom. Perform minimal cleanup between tests without relying on testing-library utilities.
afterEach(() => {
  document.body.innerHTML = ""
})

// Ensure React knows this environment supports act()
;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true

// Polyfill ResizeObserver for Radix UI hooks in jsdom
if (!(globalThis as any).ResizeObserver) {
  class ResizeObserverPolyfill {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  ;(globalThis as any).ResizeObserver = ResizeObserverPolyfill
}

// Stub canvas getContext to avoid jsdom not-implemented errors in components that touch canvas
;(HTMLCanvasElement.prototype as any).getContext = () => ({})
