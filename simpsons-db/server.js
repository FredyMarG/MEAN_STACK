/**
 * ============================================================================
 * SERVIDOR Y API REST DE LOS SIMPSONS (simpsons-db/server.js)
 * ============================================================================
 * Propósito educativo (Curso MEAN Stack):
 * - Demostrar cómo servir un dataset NoSQL (`simpsons.json`, 50 personajes)
 *   mediante una API REST en Node.js puro (`http`), reutilizando la clase
 *   `LocalCollection` de `Mongo/run-mongo-demo.js`.
 * - Implementar filtros combinados (`?q=`, `genero`, `estado_vida`, `casado`),
 *   operaciones CRUD completas y restauración de datos semilla (`simpsons-seed.json`).
 */

const fs = require("fs");
const path = require("path");
const http = require("http");
const { LocalCollection } = require("../Mongo/run-mongo-demo");

const DATA_FILE = path.join(__dirname, "simpsons.json");
const SEED_FILE = path.join(__dirname, "simpsons-seed.json");
const PUBLIC_HTML = path.join(__dirname, "public", "index.html");

/**
 * Carga los personajes desde `simpsons.json` dentro de una instancia `LocalCollection`.
 * Si `simpsons.json` no existe aún, lo crea copiando `simpsons-seed.json`.
 * @returns {LocalCollection}
 */
function loadSimpsonsCollection() {
  if (!fs.existsSync(DATA_FILE) && fs.existsSync(SEED_FILE)) {
    fs.copyFileSync(SEED_FILE, DATA_FILE);
  }
  const docs = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  return new LocalCollection("simpsons", Array.isArray(docs) ? docs : []);
}

/**
 * Guarda el estado actual de la colección en `simpsons.json` con formato legible.
 * @param {LocalCollection} collection
 */
function saveSimpsonsCollection(collection) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(collection.find(), null, 2), "utf8");
}

/**
 * Normaliza un campo tipo lista (aceptando arreglo o texto separado por comas).
 * @param {string[]|string} value
 * @returns {string[]}
 */
function parseListField(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

/**
 * Lee y parsea de forma segura el cuerpo JSON de una petición HTTP entrante.
 * @param {http.IncomingMessage} req
 * @returns {Promise<object>}
 */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) reject(new Error("Cuerpo de petición demasiado grande"));
    });
    req.on("end", () => {
      if (!raw.trim()) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new Error("JSON inválido")); }
    });
    req.on("error", reject);
  });
}

/**
 * Envía una respuesta JSON estándar con cabeceras CORS básicas.
 * @param {http.ServerResponse} res
 * @param {number} statusCode
 * @param {object} payload
 */
function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(payload));
}

/**
 * Filtra los personajes usando `LocalCollection` + búsqueda textual (`?q=`).
 * @param {LocalCollection} collection
 * @param {URLSearchParams} searchParams
 * @returns {object[]}
 */
function queryCharacters(collection, searchParams) {
  const filter = {};
  const genero = searchParams.get("genero")?.trim();
  const estado = searchParams.get("estado_vida")?.trim();
  const casado = searchParams.get("casado")?.trim();
  const q = searchParams.get("q")?.trim().toLowerCase();

  if (genero) filter.genero = { $eq: genero };
  if (estado) filter.estado_vida = { $eq: estado };
  if (casado === "true" || casado === "false") filter.casado = casado === "true";

  let docs = collection.find(filter);
  if (q) {
    docs = docs.filter((c) =>
      String(c.nombre || "").toLowerCase().includes(q) ||
      String(c.empleo || "").toLowerCase().includes(q) ||
      String(c.residencia || "").toLowerCase().includes(q)
    );
  }
  return docs;
}

/**
 * Crea y arranca el servidor HTTP del Explorador de Los Simpsons.
 * @param {number} basePort - Puerto inicial (por defecto 3003 con fallback automático).
 */
function startSimpsonsServer(basePort = Number(process.env.PORT) || 3003) {
  loadSimpsonsCollection();

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    // 1. Interfaz visual en `/` y `/docs`
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/docs")) {
      const html = fs.readFileSync(PUBLIC_HTML, "utf8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(html);
    }

    // 2. Listar / filtrar personajes (GET /api/characters)
    if (req.method === "GET" && url.pathname === "/api/characters") {
      const col = loadSimpsonsCollection();
      const characters = queryCharacters(col, url.searchParams);
      return sendJson(res, 200, { ok: true, count: characters.length, characters });
    }

    // 3. Crear nuevo personaje (POST /api/characters)
    if (req.method === "POST" && url.pathname === "/api/characters") {
      try {
        const body = await readJsonBody(req);
        if (typeof body.nombre !== "string" || !body.nombre.trim()) {
          return sendJson(res, 400, { ok: false, msg: "El campo 'nombre' es obligatorio" });
        }
        const col = loadSimpsonsCollection();
        const result = col.insertOne({
          nombre: body.nombre.trim(),
          genero: String(body.genero || "otro").trim(),
          imagen: typeof body.imagen === "string" && /^https?:\/\//i.test(body.imagen.trim()) ? body.imagen.trim() : null,
          id_padres: parseListField(body.id_padres),
          mascotas: parseListField(body.mascotas),
          residencia: String(body.residencia || "Springfield").trim(),
          empleo: body.empleo ? String(body.empleo).trim() : null,
          casado: Boolean(body.casado),
          estado_vida: String(body.estado_vida || "Vivo").trim(),
        });
        saveSimpsonsCollection(col);
        return sendJson(res, 201, { ok: true, result });
      } catch (err) {
        return sendJson(res, 400, { ok: false, msg: err.message });
      }
    }

    // 4. Actualizar personaje por `_id` (PUT /api/characters/:id)
    if (req.method === "PUT" && url.pathname.startsWith("/api/characters/")) {
      try {
        const id = decodeURIComponent(url.pathname.replace("/api/characters/", ""));
        const body = await readJsonBody(req);
        const col = loadSimpsonsCollection();
        const $set = {};

        if (body.nombre !== undefined) $set.nombre = String(body.nombre).trim();
        if (body.genero !== undefined) $set.genero = String(body.genero).trim();
        if (body.imagen !== undefined) {
          $set.imagen = typeof body.imagen === "string" && /^https?:\/\//i.test(body.imagen.trim())
            ? body.imagen.trim()
            : null;
        }
        if (body.residencia !== undefined) $set.residencia = String(body.residencia).trim();
        if (body.empleo !== undefined) $set.empleo = body.empleo ? String(body.empleo).trim() : null;
        if (body.casado !== undefined) $set.casado = Boolean(body.casado);
        if (body.estado_vida !== undefined) $set.estado_vida = String(body.estado_vida).trim();
        if (body.id_padres !== undefined) $set.id_padres = parseListField(body.id_padres);
        if (body.mascotas !== undefined) $set.mascotas = parseListField(body.mascotas);

        const result = col.updateOne({ _id: id }, { $set });
        if (!result.matchedCount) return sendJson(res, 404, { ok: false, msg: "Personaje no encontrado" });
        saveSimpsonsCollection(col);
        return sendJson(res, 200, { ok: true, result });
      } catch (err) {
        return sendJson(res, 400, { ok: false, msg: err.message });
      }
    }

    // 5. Eliminar personaje por `_id` (DELETE /api/characters/:id)
    if (req.method === "DELETE" && url.pathname.startsWith("/api/characters/")) {
      const id = decodeURIComponent(url.pathname.replace("/api/characters/", ""));
      const col = loadSimpsonsCollection();
      const result = col.deleteOne({ _id: id });
      if (!result.deletedCount) return sendJson(res, 404, { ok: false, msg: "Personaje no encontrado" });
      saveSimpsonsCollection(col);
      return sendJson(res, 200, { ok: true, result });
    }

    // 6. Restaurar los 50 personajes originales desde la semilla
    if (req.method === "POST" && url.pathname === "/api/reset") {
      fs.copyFileSync(SEED_FILE, DATA_FILE);
      const col = loadSimpsonsCollection();
      return sendJson(res, 200, { ok: true, count: col.countDocuments() });
    }

    return sendJson(res, 404, { ok: false, msg: `Ruta no encontrada: ${req.method} ${url.pathname}` });
  });

  /** Abre el puerto y pasa al siguiente si está ocupado (`EADDRINUSE`). */
  function listen(port, attemptsLeft = 10) {
    return new Promise((resolve, reject) => {
      server.once("error", (err) => {
        if (err.code === "EADDRINUSE" && attemptsLeft > 0) {
          console.warn(`[Simpsons DB] Puerto ${port} ocupado. Probando puerto ${port + 1}...`);
          listen(port + 1, attemptsLeft - 1).then(resolve, reject);
        } else {
          reject(err);
        }
      });
      server.listen(port, () => {
        console.log(`[Simpsons DB] Explorador activo en http://localhost:${port}`);
        resolve(server);
      });
    });
  }

  return listen(basePort);
}

if (require.main === module) {
  startSimpsonsServer().catch((err) => {
    console.error("Error fatal en Simpsons DB:", err);
    process.exit(1);
  });
}

module.exports = { loadSimpsonsCollection, queryCharacters, startSimpsonsServer };
