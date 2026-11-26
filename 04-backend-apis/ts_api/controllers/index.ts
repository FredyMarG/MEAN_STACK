/**
 * ============================================================================
 * BARREL FILE DE CONTROLADORES (ts_api/controllers/index.ts)
 * ============================================================================
 * Propósito: Centralizar y re-exportar todos los controladores de la API
 * (Math, Saludo, Operaciones, Login) bajo un único objeto por defecto.
 */

import * as Math from "./math.controller";
import * as Saludo from "./user.controller";
import * as Operaciones from "./operaciones.controller";
import * as Login from "./login.controller";

export default {
    Math,
    Saludo,
    Operaciones,
    Login
};
