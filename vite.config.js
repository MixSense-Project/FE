import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const target = (env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

  if (!target) {
    console.warn(
      "[vite proxy] VITE_API_BASE_URL is empty. Check your .env.local"
    );
  } else {
    console.log("[vite proxy] target =", target);
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              proxyReq.setHeader("ngrok-skip-browser-warning", "true");
            });
          },
        },
      },
    },
  };
});