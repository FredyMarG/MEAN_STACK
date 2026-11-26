/**
 * ============================================================================
 * SERVIDOR BACKEND — TURISMO MEAN API (Turismo_MEAN/TurismoBack/index.js)
 * ============================================================================
 * Propósito: Punto de entrada principal del servidor Express.js para la
 * plataforma de gestión de destinos turísticos `Turismo_MEAN`.
 *
 * Responsabilidades:
 * 1. Inicializar la conexión a la base de datos (`conectarDB`), utilizando
 *    MongoDB si está disponible o activando el respaldo local JSON automático.
 * 2. Registrar middlewares globales (`cors` para peticiones desde Angular y
 *    `express.json()` para parsear cuerpos JSON).
 * 3. Montar el enrutador REST bajo el prefijo `/api`.
 * 4. Exponer un endpoint de diagnóstico (`GET /`) y un manejador 404 global.
 */

const express = require('express');
const cors = require('cors');
const { conectarDB, isLocalDb } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;

// ----------------------------------------------------------------------------
// Middlewares globales
// ----------------------------------------------------------------------------
// Habilita intercambio de recursos de origen cruzado (CORS) para el frontend Angular
app.use(cors());
// Parsea automáticamente payloads entrantes con Content-Type: application/json
app.use(express.json());

// ----------------------------------------------------------------------------
// Rutas de la API REST
// ----------------------------------------------------------------------------
app.use('/api', require('./routes/routes'));

/**
 * GET /
 * Endpoint de verificación de estado (Healthcheck).
 * Permite comprobar si el servidor está activo y qué motor de BD utiliza.
 */
app.get('/', (req, res) => {
    res.json({
        ok: true,
        service: 'Turismo_MEAN API',
        version: '2.0.0',
        databaseMode: isLocalDb() ? 'local-json' : 'mongodb',
        endpoints: [
            'GET /api/destinos',
            'GET /api/destinos/stats/resumen',
            'GET /api/destinos/:id',
            'POST /api/destinos',
            'PUT /api/destinos/:id',
            'DELETE /api/destinos/:id'
        ]
    });
});

// Manejador 404 para cualquier ruta no definida en la API
app.use((req, res) => {
    res.status(404).json({
        ok: false,
        msg: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
});

/**
 * Arranca el servidor HTTP únicamente después de inicializar la base de datos.
 */
async function startServer() {
    await conectarDB();
    app.listen(PORT, () => {
        console.log(`[Turismo_MEAN] Servidor API activo en http://localhost:${PORT}`);
    });
}

// Evita abrir el puerto automáticamente si el módulo es importado en pruebas
if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };
