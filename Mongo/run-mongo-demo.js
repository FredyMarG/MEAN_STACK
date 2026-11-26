/**
 * ============================================================================
 * EJECUTOR Y PLAYGROUND NODE.JS PARA MONGODB (Mongo/run-mongo-demo.js)
 * ============================================================================
 * Propósito:
 * 1. Simular una colección MongoDB (`LocalCollection`) con operadores de consulta
 *    (`$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`, `$or`, `$and`),
 *    actualización (`$set`, `$inc`, `$unset`, `$push`) y conteo (`countDocuments`).
 * 2. Ejecutar la práctica CRUD DBZ-V2 y persistir el resultado en `dbz-v2.json`.
 * 3. Levantar un Playground Web interactivo con `http` nativo de Node.js en el
 *    puerto 3002 (con respaldo automático si está ocupado).
 */

const fs = require("fs");
const path = require("path");
const http = require("http");
const crypto = require("crypto");

const OUT_FILE = path.join(__dirname, "dbz-v2.json");
const PUBLIC_HTML = path.join(__dirname, "public", "index.html");

/**
 * Simulador en memoria de una colección estilo MongoDB/mongosh.
 */
class LocalCollection {
  /**
   * Inicializa la colección con su nombre y un arreglo opcional de documentos.
   * @param {string} name
   * @param {object[]} initialDocs
   */
  constructor(name, initialDocs = []) {
    this.name = name;
    this.docs = initialDocs.map((d) => ({ ...d }));
  }

  /**
   * Inserta un único documento generando automáticamente su `_id` hexadecimal.
   * @param {object} doc
   * @returns {{ acknowledged: boolean, insertedId: string }}
   */
  insertOne(doc) {
    const record = { _id: doc._id || crypto.randomBytes(12).toString("hex"), ...doc };
    this.docs.push(record);
    return { acknowledged: true, insertedId: record._id };
  }

  /**
   * Inserta múltiples documentos de forma secuencial.
   * @param {object[]} list
   * @returns {{ acknowledged: boolean, insertedCount: number, insertedIds: Record<number, string> }}
   */
  insertMany(list) {
    const insertedIds = {};
    list.forEach((doc, idx) => {
      const res = this.insertOne(doc);
      insertedIds[idx] = res.insertedId;
    });
    return { acknowledged: true, insertedCount: list.length, insertedIds };
  }

  /**
   * Evalúa si un documento cumple un filtro con operadores MongoDB.
   * - Soporta operadores lógicos de nivel raíz: `$or` (al menos uno) y `$and` (todos).
   * - Soporta operadores de comparación por campo: `$eq`, `$ne`, `$gt`, `$gte`,
   *   `$lt`, `$lte`, `$in`, `$nin`.
   * - Si el valor es primitivo (string/number/boolean), compara igualdad directa.
   * @param {object} doc
   * @param {object} filter
   * @returns {boolean}
   */
  _matches(doc, filter = {}) {
    return Object.entries(filter).every(([key, cond]) => {
      // Operador lógico $or: basta con que un subfiltro coincida
      if (key === "$or" && Array.isArray(cond)) {
        return cond.some((sub) => this._matches(doc, sub));
      }
      // Operador lógico $and: todos los subfiltros deben coincidir
      if (key === "$and" && Array.isArray(cond)) {
        return cond.every((sub) => this._matches(doc, sub));
      }

      // Si la condición es un objeto de operadores (ej. { $gte: 500000 })
      if (cond && typeof cond === "object" && !Array.isArray(cond)) {
        const val = doc[key];
        for (const [op, target] of Object.entries(cond)) {
          if (op === "$eq" && val !== target) return false;          // Igual exacto
          else if (op === "$ne" && val === target) return false;     // Distinto de
          else if (op === "$gt" && !(val > target)) return false;    // Mayor que
          else if (op === "$gte" && !(val >= target)) return false;  // Mayor o igual
          else if (op === "$lt" && !(val < target)) return false;    // Menor que
          else if (op === "$lte" && !(val <= target)) return false;  // Menor o igual
          else if (op === "$in" && (!Array.isArray(target) || !target.includes(val))) return false;   // Contenido en lista
          else if (op === "$nin" && Array.isArray(target) && target.includes(val)) return false;       // No contenido en lista
          else if (!["$eq", "$ne", "$gt", "$gte", "$lt", "$lte", "$in", "$nin"].includes(op)) return false;
        }
        return true;
      }

      // Igualdad simple cuando no se usan operadores (ej. { species: "Saiyan" })
      return doc[key] === cond;
    });
  }

  /**
   * Busca todos los documentos que coinciden con `filter`, con soporte opcional de orden y límite.
   * @param {object} filter
   * @param {{ sort?: Record<string, 1|-1>, limit?: number }} options
   * @returns {object[]}
   */
  find(filter = {}, options = {}) {
    let results = this.docs.filter((doc) => this._matches(doc, filter));

    if (options.sort && typeof options.sort === "object") {
      const [[field, dir]] = Object.entries(options.sort);
      results = [...results].sort((a, b) => (a[field] > b[field] ? 1 : -1) * (dir < 0 ? -1 : 1));
    }

    if (typeof options.limit === "number" && options.limit >= 0) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * Devuelve el primer documento que cumple el filtro, o `null` si no existe.
   * @param {object} filter
   * @returns {object|null}
   */
  findOne(filter = {}) {
    return this.docs.find((doc) => this._matches(doc, filter)) || null;
  }

  /**
   * Cuenta la cantidad de documentos que cumplen `filter`.
   * @param {object} filter
   * @returns {number}
   */
  countDocuments(filter = {}) {
    return this.find(filter).length;
  }

  /**
   * Aplica operadores de actualización estilo MongoDB sobre un documento existente:
   * - `$set`: asigna o sobrescribe campos específicos sin borrar el resto del documento.
   * - `$inc`: suma (o resta con negativos) un valor numérico al campo actual.
   * - `$unset`: elimina por completo una propiedad del documento.
   * - `$push`: agrega un elemento al final de un arreglo (creándolo si no existía).
   * @param {object} doc
   * @param {object} update
   */
  _applyUpdate(doc, update = {}) {
    if (update.$set) {
      Object.assign(doc, update.$set);
    }
    if (update.$inc) {
      for (const [k, delta] of Object.entries(update.$inc)) {
        doc[k] = (Number(doc[k]) || 0) + Number(delta);
      }
    }
    if (update.$unset) {
      for (const k of Object.keys(update.$unset)) {
        delete doc[k];
      }
    }
    if (update.$push) {
      for (const [k, item] of Object.entries(update.$push)) {
        if (!Array.isArray(doc[k])) doc[k] = [];
        doc[k].push(item);
      }
    }
  }

  /**
   * Actualiza el primer documento que cumpla `filter`.
   * @param {object} filter
   * @param {object} update
   */
  updateOne(filter, update) {
    const target = this.docs.find((doc) => this._matches(doc, filter));
    if (!target) return { matchedCount: 0, modifiedCount: 0 };
    this._applyUpdate(target, update);
    return { matchedCount: 1, modifiedCount: 1 };
  }

  /**
   * Actualiza todos los documentos que cumplan `filter`.
   * @param {object} filter
   * @param {object} update
   */
  updateMany(filter, update) {
    let count = 0;
    for (const doc of this.docs) {
      if (this._matches(doc, filter)) {
        this._applyUpdate(doc, update);
        count++;
      }
    }
    return { matchedCount: count, modifiedCount: count };
  }

  /**
   * Elimina el primer documento que cumpla `filter`.
   * @param {object} filter
   */
  deleteOne(filter) {
    const idx = this.docs.findIndex((doc) => this._matches(doc, filter));
    if (idx === -1) return { deletedCount: 0 };
    this.docs.splice(idx, 1);
    return { deletedCount: 1 };
  }

  /**
   * Elimina todos los documentos que cumplan `filter`.
   * @param {object} filter
   */
  deleteMany(filter) {
    const before = this.docs.length;
    this.docs = this.docs.filter((doc) => !this._matches(doc, filter));
    return { deletedCount: before - this.docs.length };
  }
}

/**
 * Lee la colección persistida en `dbz-v2.json` o la inicializa con `runDemo()`.
 * @returns {LocalCollection}
 */
function loadCollection() {
  if (!fs.existsSync(OUT_FILE)) {
    return runDemo(false);
  }
  const raw = JSON.parse(fs.readFileSync(OUT_FILE, "utf8"));
  return new LocalCollection("characters", Array.isArray(raw.characters) ? raw.characters : []);
}

/**
 * Persiste los documentos de la colección en `dbz-v2.json`.
 * @param {LocalCollection} collection
 */
function saveCollection(collection) {
  fs.writeFileSync(
    OUT_FILE,
    JSON.stringify({ database: "DBZ-V2", characters: collection.find() }, null, 2),
    "utf8"
  );
}

/**
 * Ejecuta la secuencia CRUD inicial de Dragon Ball Z (`DBZ-V2`) y guarda el JSON.
 * @param {boolean} verbose - Muestra logs detallados en consola.
 * @returns {LocalCollection}
 */
function runDemo(verbose = true) {
  const characters = new LocalCollection("characters");

  characters.insertOne({ name: "Vegeta", species: "Saiyan", edad: 52, gender: "Male", powerLevel: 950000 });
  characters.insertMany([
    { name: "Son Gohan", species: "Saiyan", edad: 23, gender: "Male", powerLevel: 880000 },
    { name: "Pan", species: "Saiyan", edad: 16, gender: "Female", powerLevel: 320000 },
    { name: "Piccolo", species: "Namekian", edad: 87, gender: "Male", powerLevel: 790000 },
  ]);

  if (verbose) {
    console.log("=== Ejecutando práctica CRUD MongoDB (DBZ-V2) ===");
    console.log("Namekians ($eq):", characters.find({ species: { $eq: "Namekian" } }));
    console.log("Saiyans > 20 ($gt):", characters.find({ species: "Saiyan", edad: { $gt: 20 } }));
  }

  characters.updateOne({ name: "Vegeta" }, { $set: { powerLevel: 1200000 }, $inc: { edad: 1 } });
  characters.updateMany({}, { $set: { universe: 7 } });
  characters.deleteOne({ name: "Pan" });
  characters.deleteMany({ edad: { $gt: 100 } });

  saveCollection(characters);
  if (verbose) {
    console.log(`Estado final guardado en ${OUT_FILE} (${characters.countDocuments()} personajes).`);
  }
  return characters;
}

/** Lee y parsea el cuerpo JSON de una petición HTTP entrante. */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) reject(new Error("Payload demasiado grande"));
    });
    req.on("end", () => {
      if (!raw.trim()) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new Error("JSON inválido")); }
    });
    req.on("error", reject);
  });
}

/** Envía una respuesta JSON con cabeceras CORS básicas. */
function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(payload));
}

/**
 * Crea el servidor HTTP del Playground Web para interactuar con `DBZ-V2`.
 * @param {number} basePort
 */
function startPlaygroundServer(basePort = Number(process.env.PORT) || 3002) {
  loadCollection();

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

    // Interfaz visual en `/` y `/docs`
    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/docs")) {
      const html = fs.readFileSync(PUBLIC_HTML, "utf8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(html);
    }

    // Listar / filtrar personajes usando LocalCollection
    if (req.method === "GET" && url.pathname === "/api/characters") {
      const col = loadCollection();
      const filter = {};
      const species = url.searchParams.get("species")?.trim();
      const minPower = url.searchParams.get("minPower");
      const q = url.searchParams.get("q")?.trim().toLowerCase();

      if (species) filter.species = { $eq: species };
      if (minPower !== null && minPower !== "" && !Number.isNaN(Number(minPower))) {
        filter.powerLevel = { $gte: Number(minPower) };
      }

      let docs = col.find(filter, { sort: { powerLevel: -1 } });
      if (q) {
        docs = docs.filter((d) =>
          String(d.name || "").toLowerCase().includes(q) ||
          String(d.species || "").toLowerCase().includes(q)
        );
      }
      return sendJson(res, 200, { ok: true, count: docs.length, characters: docs });
    }

    // Insertar nuevo personaje (insertOne)
    if (req.method === "POST" && url.pathname === "/api/characters") {
      try {
        const body = await readJsonBody(req);
        if (!body.name || !body.species) {
          return sendJson(res, 400, { ok: false, msg: "Los campos 'name' y 'species' son obligatorios" });
        }
        const col = loadCollection();
        const result = col.insertOne({
          name: String(body.name).trim(),
          species: String(body.species).trim(),
          edad: Number(body.edad) || 20,
          gender: String(body.gender || "Male").trim(),
          powerLevel: Number(body.powerLevel) || 100000,
          universe: Number(body.universe) || 7,
        });
        saveCollection(col);
        return sendJson(res, 201, { ok: true, result, characters: col.find() });
      } catch (err) {
        return sendJson(res, 400, { ok: false, msg: err.message });
      }
    }

    // Actualizar personaje por `_id` (updateOne)
    if (req.method === "PUT" && url.pathname.startsWith("/api/characters/")) {
      try {
        const id = decodeURIComponent(url.pathname.replace("/api/characters/", ""));
        const body = await readJsonBody(req);
        const col = loadCollection();
        const $set = {};
        if (body.name !== undefined) $set.name = String(body.name).trim();
        if (body.species !== undefined) $set.species = String(body.species).trim();
        if (body.edad !== undefined) $set.edad = Number(body.edad);
        if (body.powerLevel !== undefined) $set.powerLevel = Number(body.powerLevel);

        const result = col.updateOne({ _id: id }, { $set });
        if (!result.matchedCount) return sendJson(res, 404, { ok: false, msg: "Personaje no encontrado" });
        saveCollection(col);
        return sendJson(res, 200, { ok: true, result });
      } catch (err) {
        return sendJson(res, 400, { ok: false, msg: err.message });
      }
    }

    // Eliminar personaje por `_id` (deleteOne)
    if (req.method === "DELETE" && url.pathname.startsWith("/api/characters/")) {
      const id = decodeURIComponent(url.pathname.replace("/api/characters/", ""));
      const col = loadCollection();
      const result = col.deleteOne({ _id: id });
      if (!result.deletedCount) return sendJson(res, 404, { ok: false, msg: "Personaje no encontrado" });
      saveCollection(col);
      return sendJson(res, 200, { ok: true, result });
    }

    // Restaurar datos semilla DBZ-V2
    if (req.method === "POST" && url.pathname === "/api/reset") {
      const col = runDemo(false);
      return sendJson(res, 200, { ok: true, count: col.countDocuments(), characters: col.find() });
    }

    return sendJson(res, 404, { ok: false, msg: `Ruta no encontrada: ${req.method} ${url.pathname}` });
  });

  /** Intenta abrir el servidor y pasa al siguiente puerto si `EADDRINUSE`. */
  function listen(port, attemptsLeft = 10) {
    return new Promise((resolve, reject) => {
      server.once("error", (err) => {
        if (err.code === "EADDRINUSE" && attemptsLeft > 0) {
          console.warn(`[Mongo Playground] Puerto ${port} ocupado. Probando puerto ${port + 1}...`);
          listen(port + 1, attemptsLeft - 1).then(resolve, reject);
        } else {
          reject(err);
        }
      });
      server.listen(port, () => {
        console.log(`[Mongo Playground] DBZ-V2 activo en http://localhost:${port}`);
        resolve(server);
      });
    });
  }

  return listen(basePort);
}

if (require.main === module) {
  if (process.argv.includes("--demo")) {
    runDemo(true);
  } else {
    startPlaygroundServer().catch((err) => {
      console.error("Error fatal en Mongo Playground:", err);
      process.exit(1);
    });
  }
}

module.exports = { LocalCollection, runDemo, startPlaygroundServer };
