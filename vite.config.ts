import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

function runtimeErrorOverlay() {
  return {
    name: 'runtime-error-overlay',
    configureServer(server: any) {
      // Plugin implementation
    }
  };
}

function cartographer() {
  return {
    name: 'cartographer',
    configureServer(server: any) {
      // Plugin implementation  
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [cartographer()]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "frontend", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "frontend"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
    fs: {
      // https://github.com/vitejs/vite/issues/2541
      allow: [
        "backend/**/*",
        "frontend/**/*",
        "shared/**/*",
        "attached_assets/**/*",
      ],
      strict: true,
      deny: ["**/.*"],
    },
  },
});
