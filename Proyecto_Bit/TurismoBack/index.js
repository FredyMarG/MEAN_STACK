/**
 * ============================================================================
 * SERVIDOR BACKEND DE PROYECTO TURISMO (Proyecto_Bit/TurismoBack/index.js)
 * ============================================================================
 * Propósito: Punto de entrada del servidor Express para la plataforma de Turismo.
 * Inicializa la conexión a MongoDB (`conectarDB`), habilita CORS y JSON parsing,
 * y expone el enrutador REST bajo `/api` en el puerto 4000.
 */

const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

const app = express();

// Conectar a la base de datos MongoDB
conectarDB();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Montaje de rutas de la API de Turismo
app.use('/api', require('./routes/routes'));

// Ruta raíz de verificación de estado (Healthcheck)
app.get('/', (req, res) => {
    res.send('Servidor Backend de Turismo activo');
});

app.listen(4000, () => {
    console.log("El servidor está arriba en el puerto 4000");
});
