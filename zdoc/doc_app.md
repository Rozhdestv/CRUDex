# Notas:

# APP

-Distribucion de responsabilidades
-Estructura mínima:

backend/
|
├── .env
├── .gitignore
├── scripts/ ->bd
├── **src**/ -> codigo fuente
│ ├── config/
│ │ └── db.js # Conexión a la base de datos (ej. pg, mysql2)
│ ├── **controllers**/ # llama repositories y responde cliente http
│ │ └── authController.js
│ ├── **middlewares** / # autenticación, autorización,logs,error-managment
│ │ ├── authMiddleware.js
│ │ └── checkPermiso.js
│ ├── **repositories**/ -> QUERIES AQUI
│ │ └── usuarioRepository.js
│ ├── **routes**/ # Endpoints de la API
│ │ └── v1/
│ │ ├── auth.js
│ │ └── planificaciones.js (ejemplo)
│ ├── **services**/ # logica sin HTTP
│ │ └── authService.js
│ ├── **models**/ # Definición de entidades o esquemas de datos
│ └── app.js
└── server.js
|
frontend/
|
├── .env
├── .gitignore
├── public/ -> imagenes
├── **src**/ -> codigo fuente
│ ├── **api**/ # Peticiones fetch/axios (authAPI.js, etc.)
│ │ └── authAPI.js
│ │ └── planificacionesAPI.js
│ ├── **assets**/ -> imagenes proyecto etc.
│ ├── **components**/ # Componentes globales reutilizables (Botones, Modales, Navbar)
│ │ └── renderPlanificaciones.js
│ ├── main.js # Punto de entrada único
└── index.html
README.md

-Middlewares
-RBAC, LDAP un usuario puede tener varios roles (viceversa) y tambien hay excepcione sdondeun mismo usuario puede tener permisos directamente (usuario -> tiene ->roles ->tiene->permisos->usuario {6 tablas})

# BOTH

Hacer una consulta a la base de datos en cada petición HTTP puede ralentizar tu servidor si tienes miles de usuarios concurrentes, por ello consultar **1 sola vez** y guardar en req.session.permisos o dentro del payload JWT así valida en memoria server node.js sin tocar BD cada segundo.

# BD

-Normalizar min(3FN)
-Tablas auditoria created_at, updated_at.

- **Stored Procedures** (SP) log _automatic, triggers actualiza permisos admin automaticamente triggers. importante tener SP (\*\*\_un admin puede entrar por consola y js no ejecutaría insert en logs peeero los SP de la BD si, en cambio usar insert de logs para cuando son cosa que la bd no detecta como errores frontend,intento de acceso no autorizado etc._\*\*)

# Tests

# hacer crud desde cero paso a paso linea a linea no bloques

# build -> github -> triggers -> unit testing -> Cloud deploy ->Ci/CD -> all automated (qa auto) -> branch ORM
