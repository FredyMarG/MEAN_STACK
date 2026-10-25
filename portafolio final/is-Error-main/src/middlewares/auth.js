/**
 * ============================================================================
 * MIDDLEWARE DE VERIFICACIÓN DE TOKEN JWT (is-Error-main/src/middlewares/auth.js)
 * ============================================================================
 * Propósito: Interceptar peticiones a rutas protegidas, verificar la presencia
 * y validez de la cabecera `Authorization` mediante `jwt.verify()` y adjuntar
 * el payload decodificado al objeto `req.pato` para control de acceso basado
 * en roles (RBAC) en los controladores siguientes.
 */

const jwt = require("jsonwebtoken");
const env = require("dotenv");

env.config();

const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) throw "No puedes ingresar sin un token!";

    // Soporte tanto para token directo como para formato "Bearer <token>"
    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Se almacena la información del usuario autenticado en req.pato
    req.pato = decoded;

    return next();
  } catch (error) {
    res.status(401).json({ error });
  }
};

module.exports = verifyToken;
