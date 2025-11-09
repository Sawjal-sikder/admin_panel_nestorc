import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "../build",
  },
  server: {
    host: "0.0.0.0",
    port: 14001,
    allowedHosts: ["nestorc.boltscootersllc.com"],
  },
});
