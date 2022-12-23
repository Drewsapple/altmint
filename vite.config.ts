import react from "@vitejs/plugin-react";
import ReactInspector from "vite-plugin-react-inspector";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      process: "process/browser",
      util: "util",
    },
  },
  plugins: [
    // ReactInspector(), 
    react()
  ],
});
