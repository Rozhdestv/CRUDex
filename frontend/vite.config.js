import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    // 🛡️ Esto le inyecta las cabeceras de seguridad al servidor de desarrollo de Vite
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' http://localhost:3000 http://localhost:5173;",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
    },
  },
});
