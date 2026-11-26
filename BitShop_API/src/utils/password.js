/**
 * ============================================================================
 * UTILIDAD DE HASHING DE CONTRASEÑAS (is-Error-main/src/utils/password.js)
 * ============================================================================
 * Propósito: Proveer funciones seguras de hash y verificación usando el módulo
 * nativo `crypto` de Node.js (`scryptSync` + `timingSafeEqual`), evitando
 * dependencias nativas externas y eliminando el almacenamiento en texto plano.
 */

const crypto = require("crypto");

const SCRYPT_PREFIX = "scrypt$";

/**
 * Genera un hash seguro con salt aleatorio de 16 bytes.
 * @param {string} plainPassword - Contraseña en texto plano.
 * @returns {string} Hash formateado como `scrypt$<salt>$<derivedKey>`.
 */
function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(String(plainPassword), salt, 64).toString("hex");
  return `${SCRYPT_PREFIX}${salt}$${derived}`;
}

/**
 * Verifica una contraseña contra el hash almacenado usando comparación en tiempo constante.
 * Soporta hashes `scrypt$` y, por compatibilidad con registros antiguos, texto plano.
 * @param {string} plainPassword - Contraseña ingresada por el usuario.
 * @param {string} storedPassword - Hash o contraseña almacenada en BD.
 * @returns {boolean} `true` si coincide, `false` en caso contrario.
 */
function verifyPassword(plainPassword, storedPassword) {
  if (!plainPassword || !storedPassword) return false;

  if (!storedPassword.startsWith(SCRYPT_PREFIX)) {
    return String(plainPassword) === String(storedPassword);
  }

  const parts = storedPassword.split("$");
  if (parts.length !== 3) return false;

  const [, salt, originalHex] = parts;
  const derivedBuffer = crypto.scryptSync(String(plainPassword), salt, 64);
  const originalBuffer = Buffer.from(originalHex, "hex");

  if (derivedBuffer.length !== originalBuffer.length) return false;
  return crypto.timingSafeEqual(derivedBuffer, originalBuffer);
}

module.exports = { hashPassword, verifyPassword };
