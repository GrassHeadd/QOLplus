import { defineConfig } from "vite";

export default defineConfig({
  root: ".",  // Root directory of the project
  build: {
    outDir: "dist",  // Directory for the production build
  },
  publicDir: "public",  // Folder where static assets (e.g., CSS, JS) are located
  server: {
    port: 3000,  // Default development server port
  },
}); 