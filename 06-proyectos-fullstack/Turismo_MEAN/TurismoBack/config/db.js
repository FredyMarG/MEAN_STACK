/**
 * ============================================================================
 * CONFIGURACIÓN DE BASE DE DATOS (Turismo_MEAN/TurismoBack/config/db.js)
 * ============================================================================
 * Propósito: Gestionar la conexión a MongoDB mediante Mongoose leyendo las
 * variables de entorno desde `config.env`.
 *
 * Estrategia de alta disponibilidad local:
 * - Si `USE_LOCAL_DB=true` o no existe una instancia de MongoDB alcanzable
 *   en 2.5 segundos, activa automáticamente el adaptador local persistente
 *   (`utils/localDb.js` -> `data/destinos.json`), evitando bloqueos por timeout
 *   de Mongoose y permitiendo probar el CRUD completo sin configuración previa.
 */

const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });
const { readDestinos, DB_FILE } = require('../utils/localDb');

// Bandera interna que indica si la API opera sobre JSON local
let localFallbackActive = false;

/**
 * Inicializa el motor de persistencia (MongoDB o respaldo local JSON).
 * @returns {Promise<{ mode: 'mongodb' | 'local-json' }>} Modo de base de datos activo.
 */
const conectarDB = async () => {
    const forceLocal = String(process.env.USE_LOCAL_DB || '').toLowerCase() === 'true';
    const uri = (process.env.DB_MONGO || '').trim();

    if (forceLocal || !uri) {
        localFallbackActive = true;
        readDestinos(); // Asegura la creación e inicialización del archivo semilla
        console.log(`[DB Turismo_MEAN] Modo local JSON activo -> ${DB_FILE}`);
        return { mode: 'local-json' };
    }

    try {
        // Timeout corto para no bloquear el arranque si MongoDB no está corriendo
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
        localFallbackActive = false;
        console.log('[DB Turismo_MEAN] Conexión a MongoDB exitosa');
        return { mode: 'mongodb' };
    } catch (error) {
        localFallbackActive = true;
        readDestinos();
        console.warn(`[DB Turismo_MEAN] MongoDB no disponible (${error.message}). Usando respaldo JSON -> ${DB_FILE}`);
        return { mode: 'local-json' };
    }
};

/**
 * Indica si las operaciones CRUD deben dirigirse al almacenamiento JSON local.
 * @returns {boolean}
 */
const isLocalDb = () => localFallbackActive || mongoose.connection.readyState !== 1;

module.exports = { conectarDB, isLocalDb, mongoose };
