import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // Replace with your repository name
  build: {
    outDir: "../build",
  },
  server: {
    host: "0.0.0.0",
    port: 14001,
    // Allow the external host for development access
    // Add additional hosts here if needed
    allowedHosts: ["nestoc.dsrt321.online"],
  },
});
