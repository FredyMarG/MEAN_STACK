/**
 * ============================================================================
 * MIDDLEWARE DE VERIFICACIÓN DE TOKEN JWT (is-Error-main/src/middlewares/auth.js)
 * ============================================================================
 * Propósito: Interceptar peticiones a rutas protegidas, verificar la presencia
 * y validez de la cabecera `Authorization` mediante `jwt.verify()` y adjuntar
 * el payload decodificado al objeto `req.pato` para control de acceso basado
 * en roles (RBAC) en los controladores siguientes.
 */

const path = require("path");
const jwt = require("../utils/jwt");
const env = require("dotenv");

env.config({ path: path.join(__dirname, "../../.env") });

const JWT_SECRET = process.env.JWT_SECRET_KEY || "bitshop_dev_secret_change_in_prod";

const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "No puedes ingresar sin un token!" });
    }

    // Soporte tanto para token directo como para formato "Bearer <token>"
    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.pato = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({ error: error.message || "Token inválido o expirado" });
  }
};

module.exports = verifyToken;
