import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/simplecalendar/', // Set base URL for GitHub Pages
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false // Disable the HMR overlay
    }
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
