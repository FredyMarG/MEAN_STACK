/**
 * ============================================================================
 * CONTROLADOR DE SALUDOS DE USUARIO (ts_api/controllers/user.controller.ts)
 * ============================================================================
 * Propósito: Responder mensajes JSON de bienvenida y despedida en las rutas
 * `/api/saludo/hola`, `/api/saludo/saludo` y `/api/saludo/bye`.
 */

import Express from "express";

export const sayHi = (req: Express.Request, res: Express.Response) => {
    res.status(200).json({ msg: "Hola" });
};

export const saludo = (req: Express.Request, res: Express.Response) => {
    res.status(200).json({ msg: "¿Cómo estás?" });
};

export const sayBye = (req: Express.Request, res: Express.Response) => {
    res.status(200).json({ msg: "Adiós" });
};
