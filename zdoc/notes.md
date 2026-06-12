proyecto/
├── frontend/
└── backend/ Debes instalar separado en cada uno.
cd backend
npm init -y
npm install express pg dotenv cors
npm install -D nodemon
eso crea:
backend/
├── node_modules/
├── package.json
├── package-lock.json
Frontend
cd ../frontend
npm create vite@latest .
npm install
frontend/
├── node_modules/
├── package.json
├── package-lock.json
├── src/
├── public/
---------------------esqueleto-----------------------------

start_js_auto/
│
├── node_modules/
├── public/
│ └── style.css
│
├── views/
│ └── index.html (form)
│
├── app.js (backend: get(index.html),post)
├── package.json (cambiar test a "scripts": { "dev": "nodemon app.js" })
└── .gitignore (.env, node_modules)

# crear los archivos (connectarlos,testearlos)

# modificar el post verificar tabla nombres etc

npm install dotenv contraseña entre ""

# reestructurar frontend backend

# frontend (public, views ) backend (config,controllers,node_modules,routes, +archivos)

# levantar frontend y backend

_NO documente el resto de mejoras pero son por ejemlpob headers
, consistencia, paginacion, quitar onlclick_

# ahora para testing instalo

npm install --save-dev jest supertest (en backend)
npm install --save-dev vitest happy-dom (en front)

## ETAPA DE SESIONES

# sesiones

npm install express-session connect-pg-simple bcrypt

# PARA TESTING

npm install --save-dev jest supertest (backend)
npm install --save-dev cross-env (windows)
