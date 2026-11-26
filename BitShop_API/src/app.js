/**
 * ============================================================================
 * SERVIDOR PRINCIPAL DE LA API REST BIT-SHOP (is-Error-main/src/app.js)
 * ============================================================================
 * Propósito: Configurar el servidor Express, cargar variables de entorno (.env),
 * inicializar la conexión a MongoDB (con respaldo automático local JSON si no
 * hay instancia Mongo disponible), registrar middlewares globales y montar los
 * enrutadores de Productos y Usuarios.
 */

const path = require("path");
const express = require("express");
const env = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

// Cargar .env usando ruta absoluta para funcionar desde cualquier directorio
env.config({ path: path.join(__dirname, "../.env") });

const { connectDatabase, isLocalDb } = require("./database");

const app = express();
const basePort = Number(process.env.PORT) || 5000;

// Middlewares globales
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// Interfaz visual interactiva de la API (Bit-Shop API Studio) disponible en `/` y `/docs`
const publicDir = path.join(__dirname, "../public");
app.use("/", express.static(publicDir));
app.use("/docs", express.static(publicDir));

// Healthcheck JSON con estado de base de datos y endpoints disponibles
app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "Bit-Shop REST API",
    docs: "/docs",
    databaseMode: isLocalDb() ? "local-json" : "mongodb",
    endpoints: {
      products: "/api/products/get-products",
      login: "/api/user/login",
      register: "/api/user/create-user",
    },
  });
});

// Rutas principales de la API
app.use("/api/products", require("./routes/ProductsRoutes"));
app.use("/api/user", require("./routes/UserRoutes"));

// Manejador 404 para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ ok: false, msj: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

/**
 * Abre el servidor HTTP en `port` y, si el puerto está ocupado (`EADDRINUSE`),
 * intenta automáticamente con el siguiente puerto disponible.
 * @param {number} port
 * @param {number} attemptsLeft
 */
function listenWithFallback(port, attemptsLeft = 10) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Ejecutando API Bit-Shop en http://localhost:${port}`);
      resolve(server);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE" && attemptsLeft > 0) {
        console.warn(`[Bit-Shop] Puerto ${port} ocupado. Probando puerto ${port + 1}...`);
        resolve(listenWithFallback(port + 1, attemptsLeft - 1));
      } else {
        reject(err);
      }
    });
  });
}

/** Arranque ordenado: primero conecta BD/local-fallback y luego abre el puerto. */
async function startServer() {
  await connectDatabase();
  return listenWithFallback(basePort);
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error("Error fatal al iniciar Bit-Shop API:", err);
    process.exit(1);
  });
}

module.exports = { app, startServer };
