import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Global test settings
    globals: true,

    // Test environment
    environment: "node",

    // Test file patterns
    include: ["tests/**/*.test.ts"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/index.ts", "src/**/*.d.ts"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },

    // Type checking
    typecheck: {
      enabled: true,
    },
  },
});
