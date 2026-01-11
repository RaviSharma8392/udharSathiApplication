import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";



export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt"],
      manifest: {
        name: "UdhaarSathi",
        short_name: "Udhaar",
        description: "Bharat ka apna Udhaar Management App",
        theme_color: "#DC2626",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/logo/udharSathiLogo.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo/udharSathiLogo.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),],
})
