import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    target: "es2022",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor: Router (shared across all routes)
          "vendor-router": ["react-router-dom"],
          // Vendor: Framer Motion (heavy animation library)
          "vendor-motion": ["framer-motion"],
          // Vendor: Supabase client
          "vendor-supabase": ["@supabase/supabase-js"],
        },
      },
    },
  },
});
