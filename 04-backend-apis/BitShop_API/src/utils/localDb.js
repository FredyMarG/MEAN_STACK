/**
 * ============================================================================
 * BASE DE DATOS LOCAL PERSISTENTE EN JSON (is-Error-main/src/utils/localDb.js)
 * ============================================================================
 * Propósito: Actuar como respaldo automático cuando MongoDB Atlas/local no
 * está disponible. Persiste colecciones `products` y `users` en `data/db.json`
 * con datos semilla iniciales, IDs compatibles con ObjectId (24 hex) y
 * validaciones equivalentes a Mongoose.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { hashPassword } = require("./password");

const DATA_DIR = path.join(__dirname, "../../data");
const DB_FILE = path.join(DATA_DIR, "db.json");

/**
 * Genera un identificador hexadecimal de 24 caracteres compatible con ObjectId.
 * @returns {string}
 */
function generateObjectId() {
  return crypto.randomBytes(12).toString("hex");
}

/**
 * Valida si un string tiene formato de ObjectId de 24 caracteres hexadecimales.
 * @param {string} id
 * @returns {boolean}
 */
function isValidObjectId(id) {
  return typeof id === "string" && /^[a-fA-F0-9]{24}$/.test(id);
}

/**
 * Crea el estado inicial de la base de datos con productos y usuarios semilla.
 * @returns {{ products: Array, users: Array }}
 */
function createSeedData() {
  const now = new Date().toISOString();
  return {
    products: [
      {
        _id: generateObjectId(),
        name: "Teclado Mecánico RGB 65%",
        price: 249900,
        availableElements: 18,
        description: "Teclado mecánico compacto con switches rojos silenciosos.",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
        tags: ["perifericos", "teclado", "gaming"],
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: generateObjectId(),
        name: "Mouse Inalámbrico Ergonómico",
        price: 139900,
        availableElements: 25,
        description: "Sensor óptico de alta precisión y batería recargable USB-C.",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
        tags: ["perifericos", "mouse", "oficina"],
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: generateObjectId(),
        name: "Monitor 27\" QHD IPS 144Hz",
        price: 1299000,
        availableElements: 7,
        description: "Panel IPS con calibración sRGB 99% ideal para desarrollo y diseño.",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600",
        tags: ["monitores", "hardware"],
        createdAt: now,
        updatedAt: now,
      },
    ],
    users: [
      {
        _id: generateObjectId(),
        username: "admin_bitshop",
        email: "admin@bitshop.local",
        password: hashPassword("Admin123*"),
        phone: "+57 300 000 0001",
        Permissions: { admin: true, client: true, verified: true },
        createdAt: now,
        updatedAt: now,
      },
      {
        _id: generateObjectId(),
        username: "cliente_demo",
        email: "cliente@bitshop.local",
        password: hashPassword("Cliente123*"),
        phone: "+57 300 000 0002",
        Permissions: { admin: false, client: true, verified: true },
        createdAt: now,
        updatedAt: now,
      },
    ],
  };
}

/**
 * Asegura que el directorio y archivo JSON existan y retorna los datos parseados.
 * @returns {{ products: Array, users: Array }}
 */
function readDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const seed = createSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return {
      products: Array.isArray(parsed.products) ? parsed.products : [],
      users: Array.isArray(parsed.users) ? parsed.users : [],
    };
  } catch {
    const seed = createSeedData();
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
}

/**
 * Escribe de forma atómica el estado completo de la base de datos local.
 * @param {{ products: Array, users: Array }} data
 */
function writeDb(data) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmpFile, DB_FILE);
}

module.exports = {
  DB_FILE,
  generateObjectId,
  isValidObjectId,
  readDb,
  writeDb,
};
