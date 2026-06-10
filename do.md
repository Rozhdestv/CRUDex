1. Pero aún no piensas en:

consistencia
versionado
naming
contratos
escalabilidad

2. aplicar middleware ejempplos
   Luego:

error middleware centralizado
logs
trazabilidad
errores custom
observabilidad
const express = require('express');
const app = express(); 3. Estado asíncrono REAL

Usas async/await.

3. Pero todavía no entiendes profundamente:

event loop
non-blocking I/O
promesas internamente
concurrency
race conditions

4. Testing

Todavía no sabes:

unit testing
integration testing
mocks
testing APIs
// ---------------------------------------------------------
// 1. MIDDLEWARES GLOBALES (Se ejecutan para TODO de arriba a abajo)
// ---------------------------------------------------------

// Middleware Nativo: Parsea el cuerpo del JSON (Modifica req.body)
app.use(express.json());

// Middleware Personalizado Global: Registra las visitas (Logger)
app.use((req, res, next) => {
console.log(`[LOG] Petición entrante: ${req.method} a la ruta ${req.url}`);
next(); // Fundamental. Si quitas esto, el servidor se congela aquí.
});

// ---------------------------------------------------------
// 2. MIDDLEWARES LOCALES (Uso quirúrgico por ruta)
// ---------------------------------------------------------

// Middleware de Autenticación (Inyecta datos en req.usuario)
const comprobarPremium = (req, res, next) => {
const token = req.headers['authorization'];

if (!token) {
return res.status(401).json({ error: 'No autorizado' }); // Corta el flujo, no llama a next()
}

// Simulamos que verificamos el token y descubrimos quién es el usuario
req.usuario = { id: 101, plan: 'premium', nombre: 'Carlos' }; // Modificación de req
next(); // Pasa al siguiente eslabón
};

// Middleware de Autorización/Negocio (Lee lo que inyectó el middleware anterior)
const requerirSuscripciónActiva = (req, res, next) => {
// Gracias al middleware anterior, ya tenemos req.usuario poblado
if (req.usuario.plan !== 'premium') {
return res.status(403).json({ error: 'Debes pagar para ver esto' });
}
next();
};

// ---------------------------------------------------------
// APLICACIÓN DE LAS RUTAS
// ---------------------------------------------------------

// Ruta Pública (Solo pasa por los dos globales de arriba)
app.get('/api/v1/productos', (req, res) => {
res.json({ productos: ['Laptop', 'Mouse'] });
});

// Ruta Protegida por Capas (Pasa por: Globales -> comprobarPremium -> requerirSuscripciónActiva -> Controlador)
app.get('/api/v1/peliculas-4k', [comprobarPremium, requerirSuscripciónActiva], (req, res) => {
// El controlador final se beneficia de toda la información inyectada previamente
res.json({
mensaje: `Bienvenido ${req.usuario.nombre}, aquí tienes tus películas Ultra HD.`
});
});

// ---------------------------------------------------------
// 3. MIDDLEWARE DE MANEJO DE ERRORES (El caso de uso especial)
// ---------------------------------------------------------
// Se distingue porque recibe 4 parámetros en lugar de 3: (err, req, res, next)
// Express sabe automáticamente que si alguien llama a next(error), debe saltar aquí.

app.get('/api/v1/error-forzado', (req, res, next) => {
try {
throw new Error('La base de datos explotó internamente');
} catch (err) {
next(err); // Enviamos el error al manejador centralizado
}
});

app.use((err, req, res, next) => {
console.error('[MANEJADOR CENTRAL DE ERRORES]:', err.message);
res.status(500).json({
success: false,
error: 'Algo salió muy mal en el servidor, estamos revisando.'
});
});

app.listen(3000, () => console.log('Servidor en marcha'));
