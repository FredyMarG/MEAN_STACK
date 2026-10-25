/**
 * ============================================================================
 * RUTAS DE SALUDO DE USUARIO (ts_api/routes/user.routes.ts)
 * ============================================================================
 */
import { Router } from "express";
import Controllers from "../controllers/index";

const router = Router();

router.get("/hola", Controllers.Saludo.sayHi);
router.get("/saludo", Controllers.Saludo.saludo);
router.get("/bye", Controllers.Saludo.sayBye);

export default router;
