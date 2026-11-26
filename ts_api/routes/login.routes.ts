/**
 * ============================================================================
 * RUTAS DE AUTENTICACIÓN (ts_api/routes/login.routes.ts)
 * ============================================================================
 * Propósito: Exponer el endpoint `POST /api/login` delegando en `Controllers.Login.login`.
 */

import { Router } from "express";
import Controllers from "../controllers/index";

const router = Router();

router.post("/", Controllers.Login.login);

export default router;
