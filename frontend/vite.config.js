import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config — sets up React plugin and proxy for API calls
// The proxy forwards /api requests to the backend during development
// This avoids CORS issues when running frontend on :5173 and backend on :5000
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
