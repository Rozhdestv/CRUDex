Hallazgo: Uso de unsafe-inline y unsafe-eval en Content-Security-Policy (Puerto 5173).
Estado: Riesgo Aceptado / Limitación del Entorno de Desarrollo.
Justificación Técnica: Las directivas 'unsafe-inline' y 'unsafe-eval' son requeridas estrictamente por el servidor de desarrollo de Vite para habilitar las características de Hot Module Replacement (HMR) y el mapeo de errores en tiempo de ejecución (Source Maps).
Cabe destacar que esta configuración pertenece únicamente al entorno local de desarrollo. Al compilar la aplicación para producción (npm run build), estos parámetros de Vite dejan de existir, y la seguridad del contenido pasa a ser gobernada de forma estricta por el Backend (Express + Helmet), donde no se permiten scripts inseguros ni ejecuciones evaluadas.
