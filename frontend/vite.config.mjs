import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: ".",  // Root directory of the project
  build: {
    outDir: "../vercel/public",  // Directory for the production build
  },
  plugins: [
    tailwindcss(),  // Tailwind CSS plugin for Vite
  ],
  server: {
    port: 3000,  // Default development server port
  },
}); 