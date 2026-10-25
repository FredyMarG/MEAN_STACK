/**
 * ============================================================================
 * ENRUTADOR PRINCIPAL DE LA API (ts_api/routes/index.ts)
 * ============================================================================
 * Propósito: Agrupar y separar por módulos todas las rutas existentes de la API.
 */

import { Router } from "express";
import Math from "./math.routes";
import Saludo from "./user.routes";
import Operaciones from "./operaciones.routes";
import Login from "./login.routes";

const router = Router();

router.use("/math", Math);
router.use("/saludo", Saludo);
router.use("/operaciones", Operaciones);
router.use("/login", Login);

export default router;
