/**
 * ============================================================================
 * UTILIDAD JWT NATIVA CON CRYPTO (is-Error-main/src/utils/jwt.js)
 * ============================================================================
 * Propósito: Firmar y verificar JSON Web Tokens (HS256) usando exclusivamente
 * el módulo nativo `crypto` de Node.js, garantizando compatibilidad total con
 * Node.js v25+ (donde `SlowBuffer` fue removido y rompe paquetes antiguos).
 */

const crypto = require("crypto");

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str) {
  const pad = 4 - (str.length % 4);
  const normalized = str.replace(/-/g, "+").replace(/_/g, "/") + (pad < 4 ? "=".repeat(pad) : "");
  return Buffer.from(normalized, "base64").toString("utf8");
}

/**
 * Firma un payload como JWT HS256.
 * @param {object} payload
 * @param {string} secret
 * @param {{ expiresInSeconds?: number }} options
 */
function sign(payload, secret, options = {}) {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + (options.expiresInSeconds || 7200); // 2h por defecto
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify({ ...payload, iat: now, exp }));
  const signature = base64UrlEncode(
    crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest()
  );
  return `${header}.${body}.${signature}`;
}

/**
 * Verifica la firma HS256 y expiración de un JWT.
 * @param {string} token
 * @param {string} secret
 * @returns {object} Payload decodificado.
 */
function verify(token, secret) {
  if (!token || typeof token !== "string") {
    throw new Error("Token ausente o inválido");
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Formato de JWT inválido");
  }
  const [header, body, sig] = parts;
  const expectedSig = base64UrlEncode(
    crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest()
  );
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    throw new Error("Firma de token inválida");
  }
  const decoded = JSON.parse(base64UrlDecode(body));
  if (decoded.exp && Math.floor(Date.now() / 1000) > decoded.exp) {
    throw new Error("Token expirado");
  }
  return decoded;
}

module.exports = { sign, verify };
