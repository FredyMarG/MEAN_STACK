/**
 * ============================================================================
 * SERVIDOR EXPRESS EN TYPESCRIPT (ts_api/app.ts)
 * ============================================================================
 * Propósito: Punto de entrada de la API construida con TypeScript y Express.
 * Configura el middleware `express.json()` y monta el enrutador modular
 * `ApiRoutes` bajo el prefijo `/api`.
 */

import express from "express";
import ApiRoutes from "./routes/index";

const app = express();
const port = 3000;

app.use(express.json());

// Importar y montar todas las rutas modulares bajo /api
app.use("/api", ApiRoutes);

app.listen(port, () => {
    console.log(`API Server en TypeScript ejecutándose en el puerto ${port}`);
});
