/**
 * ============================================================================
 * SERVIDOR EXPRESS EN TYPESCRIPT (ts_api/app.ts)
 * ============================================================================
 * Propósito: Punto de entrada de la API construida con TypeScript y Express.
 * Configura middlewares globales, sirve la interfaz visual (`ts_api Studio`) en
 * `/` y `/docs`, expone diagnóstico JSON en `/api/health`, monta el enrutador
 * modular `ApiRoutes` bajo `/api` y arranca con respaldo automático de puerto.
 */

import fs from "fs";
import path from "path";
import express from "express";
import ApiRoutes from "./routes/index";

const app = express();
const basePort = Number(process.env.PORT) || 3000;

// Middlewares globales
app.use(express.json());

// Resolver carpeta `public` tanto en ejecución `ts-node` como compilada en `dist/`
const publicDir = fs.existsSync(path.join(__dirname, "public"))
  ? path.join(__dirname, "public")
  : path.join(__dirname, "../public");

// Servir interfaz visual interactiva (Login-first) en `/` y `/docs`
app.use("/", express.static(publicDir));
app.use("/docs", express.static(publicDir));

// Healthcheck JSON con el listado de endpoints disponibles
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "ts_api",
    docs: "/",
    endpoints: [
      "GET /api/math/suma/:num1/:num2",
      "GET /api/saludo/hola",
      "GET /api/operaciones/suma/:num1/:num2",
      "POST /api/login",
    ],
  });
});

// Montar todas las rutas modulares bajo /api
app.use("/api", ApiRoutes);

// Manejador 404 para rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ ok: false, msg: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

/**
 * Inicia el servidor HTTP en `port` y, si está ocupado (`EADDRINUSE`),
 * prueba automáticamente con el siguiente puerto disponible.
 */
function listenWithFallback(port: number, attemptsLeft = 10): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`API Server en TypeScript ejecutándose en http://localhost:${port}`);
      resolve();
    });

    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE" && attemptsLeft > 0) {
        console.warn(`[ts_api] Puerto ${port} ocupado. Probando puerto ${port + 1}...`);
        listenWithFallback(port + 1, attemptsLeft - 1).then(resolve, reject);
      } else {
        reject(err);
      }
    });
  });
}

if (require.main === module) {
  listenWithFallback(basePort).catch((err) => {
    console.error("Error fatal al iniciar ts_api:", err);
    process.exit(1);
  });
}

export default app;
