/**
 * ============================================================================
 * SERVIDOR PRINCIPAL DE LA API REST BIT-SHOP (is-Error-main/src/app.js)
 * ============================================================================
 * Propósito: Configurar el servidor Express, cargar variables de entorno (.env),
 * inicializar la conexión a MongoDB Atlas, registrar middlewares globales
 * (Morgan para logs HTTP, CORS para permitir peticiones desde Angular en el
 * puerto 4200, y `express.json()` para parsear payloads JSON) y montar los
 * enrutadores de Productos y Usuarios.
 */

const express = require("express");
const env = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

// Cargar variables de entorno desde el archivo .env
env.config();

// Inicializar conexión a la base de datos MongoDB
require("./database");

const app = express();
const port = process.env.PORT || 5000;

// Middlewares globales
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: ["http://localhost:4200"] }));

// Rutas principales de la API
app.use("/api/products", require("./routes/ProductsRoutes"));
app.use("/api/user", require("./routes/UserRoutes"));

// Arranque del servidor
app.listen(port, () => console.log(`Ejecutando API Bit-Shop en el puerto ${port}`));
