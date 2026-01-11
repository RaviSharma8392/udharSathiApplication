import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",

      //  VERY IMPORTANT
      devOptions: {
        enabled: false, // disable SW in dev
      },

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
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      //  SAFE CACHING RULES
      workbox: {
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Cache images only
            urlPattern: ({ request }) =>
              request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
});
