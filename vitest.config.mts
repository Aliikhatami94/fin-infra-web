import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

const rootDir = fileURLToPath(new URL("./", import.meta.url))

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react",
  },
  resolve: {
    alias: {
      "@": rootDir,
    },
  },
  test: {
    include: ["**/__tests__/**/*.test.{ts,tsx}", "**/*.test.{ts,tsx}"],
    environment: "jsdom",
    coverage: {
      reporter: ["text", "lcov"],
    },
    setupFiles: ["./vitest.setup.ts"],
  },
})
