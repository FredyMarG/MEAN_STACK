/**
 * ============================================================================
 * RUTAS DE AUTENTICACIÓN (ts_api/routes/login.routes.ts)
 * ============================================================================
 */
import { Router } from "express";
import Controllers from "../controllers/index";

const router = Router();

router.post("/login", Controllers.Login.login);

export default router;
