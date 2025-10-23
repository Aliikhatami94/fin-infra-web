import { afterEach } from "vitest"

// Vitest setup for jsdom. Perform minimal cleanup between tests without relying on testing-library utilities.
afterEach(() => {
  document.body.innerHTML = ""
})
