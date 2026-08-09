import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    preset: "netlify",
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
