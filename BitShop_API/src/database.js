/**
 * ============================================================================
 * CONEXIÓN A BASE DE DATOS (is-Error-main/src/database.js)
 * ============================================================================
 * Propósito: Conectar con MongoDB (Atlas o local) mediante Mongoose si está
 * disponible y configurado. Si la conexión falla o `USE_LOCAL_DB=true`,
 * activa automáticamente el adaptador local persistente (`data/db.json`) para
 * garantizar que la API funcione al 100% sin dependencias externas.
 */

const path = require("path");
const env = require("dotenv");
const mongoose = require("mongoose");
const { readDb, DB_FILE } = require("./utils/localDb");

env.config({ path: path.join(__dirname, "../.env") });

let localFallbackActive = false;

/**
 * Inicializa la conexión a MongoDB o activa la base de datos JSON local.
 * @returns {Promise<{ mode: 'mongodb' | 'local-json' }>}
 */
async function connectDatabase() {
  const forceLocal = String(process.env.USE_LOCAL_DB || "").toLowerCase() === "true";
  const uri = process.env.MONGO_URI || process.env.MONGO_ATLAS;

  if (forceLocal || !uri) {
    localFallbackActive = true;
    readDb();
    console.log(`[DB] Modo local JSON activo -> ${DB_FILE}`);
    return { mode: "local-json" };
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    localFallbackActive = false;
    console.log("[DB] Conexión a MongoDB exitosa");
    return { mode: "mongodb" };
  } catch (err) {
    localFallbackActive = true;
    readDb();
    console.warn(`[DB] MongoDB no disponible (${err.message}). Activando respaldo local JSON -> ${DB_FILE}`);
    return { mode: "local-json" };
  }
}

/**
 * Indica si la API está operando sobre el almacenamiento local JSON.
 * @returns {boolean}
 */
function isLocalDb() {
  return localFallbackActive || mongoose.connection.readyState !== 1;
}

module.exports = {
  mongoose,
  connectDatabase,
  isLocalDb,
};
