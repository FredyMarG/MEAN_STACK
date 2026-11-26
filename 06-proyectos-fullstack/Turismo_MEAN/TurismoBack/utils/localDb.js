/**
 * ============================================================================
 * BASE DE DATOS LOCAL PERSISTENTE (Turismo_MEAN/TurismoBack/utils/localDb.js)
 * ============================================================================
 * Propósito: Proveer persistencia en disco (`data/destinos.json`) con datos
 * semilla de destinos colombianos cuando no hay servidor MongoDB disponible.
 *
 * Características:
 * - Genera IDs hexadecimales de 24 caracteres compatibles con MongoDB ObjectId.
 * - Realiza escrituras atómicas mediante archivo temporal + `renameSync` para
 *   evitar corrupción del JSON ante cierres inesperados.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'destinos.json');

/**
 * Genera un identificador hexadecimal de 24 caracteres equivalente a ObjectId.
 * @returns {string}
 */
function generateObjectId() {
    return crypto.randomBytes(12).toString('hex');
}

/**
 * Valida si una cadena cumple con el formato de ObjectId (24 dígitos hex).
 * @param {string} id
 * @returns {boolean}
 */
function isValidObjectId(id) {
    return typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
}

/**
 * Construye el catálogo inicial de destinos turísticos semilla.
 * @returns {Array<object>}
 */
function createSeedDestinos() {
    const now = new Date().toISOString();
    return [
        {
            _id: generateObjectId(),
            nombre: 'Ciudad Amurallada y Castillos',
            ciudad: 'Cartagena de Indias',
            descripcion: 'Recorrido histórico por el centro colonial, murallas y playas del Caribe.',
            precio: 1450000,
            calificacion: 5,
            fechaCreacion: now
        },
        {
            _id: generateObjectId(),
            nombre: 'Valle del Cocora y Salento',
            ciudad: 'Quindío (Eje Cafetero)',
            descripcion: 'Caminata entre palmas de cera y experiencia cafetera artesanal.',
            precio: 980000,
            calificacion: 5,
            fechaCreacion: now
        },
        {
            _id: generateObjectId(),
            nombre: 'Mar de los Siete Colores',
            ciudad: 'San Andrés Isla',
            descripcion: 'Tour náutico por Johnny Cay, Acuario y buceo en arrecifes.',
            precio: 1890000,
            calificacion: 4.8,
            fechaCreacion: now
        },
        {
            _id: generateObjectId(),
            nombre: 'Parque Nacional Tayrona',
            ciudad: 'Santa Marta',
            descripcion: 'Senderismo ecológico, Cabo San Juan y biodiversidad en la Sierra Nevada.',
            precio: 1120000,
            calificacion: 4.9,
            fechaCreacion: now
        }
    ];
}

/**
 * Lee los destinos desde `data/destinos.json`. Si el archivo no existe o está
 * corrupto, lo regenera automáticamente con los datos semilla.
 * @returns {Array<object>}
 */
function readDestinos() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
        const seed = createSeedDestinos();
        fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf8');
        return seed;
    }
    try {
        const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        const seed = createSeedDestinos();
        fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf8');
        return seed;
    }
}

/**
 * Persiste de forma atómica el arreglo completo de destinos en disco.
 * @param {Array<object>} destinos
 */
function writeDestinos(destinos) {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tmpFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(destinos, null, 2), 'utf8');
    fs.renameSync(tmpFile, DB_FILE);
}

module.exports = {
    DB_FILE,
    generateObjectId,
    isValidObjectId,
    readDestinos,
    writeDestinos
};
