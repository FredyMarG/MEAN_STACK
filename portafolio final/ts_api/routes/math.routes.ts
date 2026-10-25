/**
 * ============================================================================
 * RUTAS DE PRUEBA MATEMÁTICA (ts_api/routes/math.routes.ts)
 * ============================================================================
 */
import { Router } from "express";
import Controllers from "../controllers/index";

const router = Router();

router.get("/suma/:num1/:num2", Controllers.Math.suma);

export default router;
