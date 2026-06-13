# CRUDex - Backend + Frontend

Aplicación para CRUD con autenticación RBAC.

## Requisitos

- Node.js 20+
- PostgreSQL 14+
- npm o yarn

## Estructura del Proyecto

```text
APP2/
├── backend/           # API Express + PostgreSQL
├── frontend/          # Vite vanilla JS
└── docker-compose.yml
```

## Instalación y Ejecución (Desarrollo)

### 1. Clonar repositorio

```bash
git clone
cd APP2
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/` (puedes usar `.env.example` como base):

```env
# backend/.env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=plan2courseex
DB_USER=postgres
DB_PASSWORD=tu_password
SESSION_SECRET=un_secreto_muy_largo
SESSION_NAME=connect.sid

ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@yahoo.com
ADMIN_PASSWORD=contraseña
```

### 3. Base de datos

Ejecuta el script SQL `database/schema.sql` en tu gestor de PostgreSQL para crear las tablas (incluye autenticación, permisos y logs). Luego, ejecuta el siguiente comando para crear el usuario administrador inicial:

```bash
cd backend
node scripts/createAdmin.js
```

### 4. Backend

```bash
cd backend
npm install
npm run dev   # Servidor corriendo en http://localhost:3000
```

### 5. Frontend (Desarrollo)

```bash
cd frontend
npm install
npm run dev   # Cliente corriendo en http://localhost:5173
```

---

## Testing

Para ejecutar las pruebas unitarias (con Mocks) y de integración en el backend, utiliza los siguientes comandos dentro de la carpeta `backend/`:

```bash
cd backend
npm test               # Ejecuta los tests una vez
npm run test:watch     # Modo interactivo para desarrollo
npm run test:coverage  # Genera el reporte de cobertura de código
```

---

## Construcción para Producción

### Backend

```bash
cd backend
npm ci --only=production
```

### Frontend

```bash
cd frontend
npm run build   # Genera la carpeta dist/ lista para desplegar
```

> **Nota:** El backend sirve automáticamente los archivos estáticos de la carpeta `frontend/dist` si tienes configurado `express.static` en tu servidor Express.
