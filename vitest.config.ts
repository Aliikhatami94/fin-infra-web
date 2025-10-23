import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

const rootDir = fileURLToPath(new URL("./", import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@": rootDir,
    },
  },
  test: {
    include: ["**/__tests__/**/*.test.{ts,tsx}", "**/*.test.{ts,tsx}"],
    environment: "node",
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
})
