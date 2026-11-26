/**
 * ============================================================================
 * CONTROLADOR DE LOGIN (ts_api/controllers/login.controller.ts)
 * ============================================================================
 * Propósito: Validar que el cuerpo de la petición (`req.body`) contenga
 * `username`, `password` y `email` no vacíos sin exponer la contraseña en
 * la respuesta HTTP.
 */

import Express from "express";

interface LoginPayload {
  username?: string;
  password?: string;
  email?: string;
}

export const login = (req: Express.Request, res: Express.Response) => {
  const body = (req.body || {}) as LoginPayload;
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!username || !password || !email) {
    return res.status(400).json({
      ok: false,
      msg: "Error de credencial o campos vacíos (se requieren username, email y password)",
      user: { username, email },
    });
  }

  return res.status(200).json({
    ok: true,
    msg: "Sesión Iniciada Correctamente",
    user: { username, email },
  });
};
