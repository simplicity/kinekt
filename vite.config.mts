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

    // TODO make configurable - or should it be the default?
    minify: false,
    sourcemap: true,
  },
});
