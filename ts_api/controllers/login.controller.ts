/**
 * ============================================================================
 * CONTROLADOR DE LOGIN (ts_api/controllers/login.controller.ts)
 * ============================================================================
 * Propósito: Validar que el cuerpo de la petición (`req.body`) contenga
 * `username`, `password` y `email` no vacíos.
 */

import Express from "express";

export const login = (req: Express.Request, res: Express.Response) => {
    const body = req.body;
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(401).json({
            msg: "Error de credencial o campos vacíos",
            body
        });
    } else {
        return res.status(200).json({
            msg: "Sesión Iniciada Correctamente",
            body
        });
    }
};
