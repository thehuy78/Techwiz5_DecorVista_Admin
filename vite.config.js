import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/techwiz_admin",
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
