/**
 * ============================================================================
 * CONTROLADOR DE INSPECCIÓN DE PETICIÓN (ts_api/controllers/math.controller.ts)
 * ============================================================================
 * Propósito: Demostrar la captura tipada de `req.body`, `req.params` y `req.query`
 * en Express con TypeScript.
 */

import Express from "express";

export const suma = (req: Express.Request, res: Express.Response) => {
    const body = req.body;
    const params = req.params;
    const query = req.query;

    res.status(200).json({
        msg: "Controlador suma (inspección de request)",
        body,
        params,
        query
    });
};
