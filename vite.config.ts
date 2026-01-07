import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "path"

export default defineConfig({
  //  base: "/",
  plugins: [react()],
  assetsInclude: ['**/*.xlsx'], // <--- Add this line
  resolve: {
    

    alias: {
      "@": resolve(__dirname, "src"),
      
    },
  },
})
