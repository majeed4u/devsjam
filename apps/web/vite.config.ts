import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Stub workspace packages for standalone dev server
      "@devjams/api/routers/index": path.resolve(__dirname, "./src/stubs/api-routers.ts"),
      "@devjams/api": path.resolve(__dirname, "./src/stubs/api-routers.ts"),
    },
  },
  server: {
    port: 3001,
  },
});
