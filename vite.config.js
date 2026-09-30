import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Bind on all interfaces so the dev server is reachable from a phone or
    // another device on the same network for responsive testing.
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
