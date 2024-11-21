import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "pkg/main.ts"),
      name: "main",
      fileName: "main",
    },
    rollupOptions: {
      external: ["http"],
    },
  },
});
