[PROMPT DE TRABAJO DE TESTING]

1. OBJETIVO: Probar el endpoint [Nombre del endpoint / funcionalidad].
2. ANTES DE EMPEZAR:
   - ¿Mi entorno está en NODE_ENV=test?
   - ¿La base de datos de pruebas está limpia?
3. CASOS DE PRUEBA EXIGIDOS:
   - Caso Exitoso (Camino feliz): Datos válidos -> Respuesta esperada (200/201).
   - Caso Fallido por Validación: Datos incompletos -> Respuesta esperada (400 Bad Request).
   - Caso Fallido por Seguridad: Sin token/sesión -> Respuesta esperada (401 Unauthorized).
4. CIERRE:
   - ¿Limpié los datos creados en este test para no ensuciar el siguiente?
   - ¿Cerré las conexiones a la base de datos?

-----====================================================
createdb -U postgres plan2courseex_test

# 2. Ejecuta el mismo esquema que en desarrollo

psql -U postgres -d plan2courseex_test -f schema.sql

# 3. Crea archivo .env.test

DB_NAME=plan2courseex_test
DB_USER=postgres
DB_PASSWORD=tu_password
NODE_ENV=test
SESSION_SECRET=test_secret

# 4. Modifica package.json

"scripts": {
"test": "cross-env NODE_ENV=test jest --runInBand --setupFilesAfterEnv ./tests/setup.js"
}
