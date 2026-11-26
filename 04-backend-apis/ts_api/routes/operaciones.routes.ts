/**
 * ============================================================================
 * RUTAS DE OPERACIONES ARITMÉTICAS (ts_api/routes/operaciones.routes.ts)
 * ============================================================================
 */
import { Router } from "express";
import Controllers from "../controllers/index";

const router = Router();

router.get("/suma/:num1/:num2", Controllers.Operaciones.suma);
router.get("/resta/:num1/:num2", Controllers.Operaciones.resta);
router.get("/multiplicacion/:num1/:num2", Controllers.Operaciones.multiplicacion);
router.get("/division/:num1/:num2", Controllers.Operaciones.division);

export default router;
