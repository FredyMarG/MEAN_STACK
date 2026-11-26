/**
 * ============================================================================
 * CONTROLADOR DE PRODUCTOS (is-Error-main/src/controllers/ProductsController.js)
 * ============================================================================
 * Propósito: Gestionar el CRUD completo de productos soportando tanto MongoDB
 * (Mongoose) como el respaldo local persistente (`data/db.json`).
 * Incluye validación de entrada, prevención de asignación masiva y control
 * de permisos `admin` para operaciones de eliminación.
 */

const Product = require("../Models/Product");
const { isLocalDb, mongoose } = require("../database");
const { readDb, writeDb, generateObjectId, isValidObjectId } = require("../utils/localDb");

/**
 * Extrae y valida los campos permitidos de un producto desde el body.
 * Acepta `availableElements` y el alias legado `availableElemnts`.
 * @param {object} body
 * @param {boolean} isPartial - `true` para actualizaciones parciales (PUT).
 */
function sanitizeProductPayload(body = {}, isPartial = false) {
  const errors = [];
  const clean = {};

  if (!isPartial || body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      errors.push("El campo 'name' es obligatorio");
    } else {
      clean.name = body.name.trim();
    }
  }

  if (!isPartial || body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      errors.push("El campo 'price' debe ser un número mayor o igual a 0");
    } else {
      clean.price = price;
    }
  }

  const rawStock = body.availableElements !== undefined ? body.availableElements : body.availableElemnts;
  if (!isPartial || rawStock !== undefined) {
    const stock = Number(rawStock);
    if (!Number.isFinite(stock) || stock < 0) {
      errors.push("El campo 'availableElements' debe ser un número mayor o igual a 0");
    } else {
      clean.availableElements = Math.floor(stock);
    }
  }

  if (body.description !== undefined) {
    clean.description = String(body.description).trim() || "El usuario no añadió una descripción";
  } else if (!isPartial) {
    clean.description = "El usuario no añadió una descripción";
  }

  if (body.image !== undefined) {
    clean.image = String(body.image).trim() || "Sin Imágenes";
  } else if (!isPartial) {
    clean.image = "Sin Imágenes";
  }

  if (body.tags !== undefined) {
    clean.tags = Array.isArray(body.tags) ? body.tags.map((t) => String(t).trim()).filter(Boolean) : [];
  } else if (!isPartial) {
    clean.tags = [];
  }

  return { clean, errors };
}

/**
 * Verifica validez de ID según el motor de base de datos activo.
 */
function checkId(id) {
  return isLocalDb() ? isValidObjectId(id) : mongoose.Types.ObjectId.isValid(id);
}

/**
 * GET /api/products/get-products
 * Lista los productos disponibles. Soporta filtro opcional `?q=` por nombre,
 * descripción o etiquetas (`tags`) tanto en MongoDB como en modo local JSON.
 */
const getProducts = async (req, res) => {
  try {
    const q = typeof req.query?.q === "string" ? req.query.q.trim() : "";

    if (isLocalDb()) {
      let products = readDb().products;
      if (q) {
        const term = q.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            (p.description || "").toLowerCase().includes(term) ||
            (Array.isArray(p.tags) && p.tags.some((t) => String(t).toLowerCase().includes(term)))
        );
      }
      return res.status(200).json(products);
    }

    // En MongoDB construimos filtro $or seguro escapando caracteres especiales de regex
    const filter = {};
    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filter.$or = [{ name: regex }, { description: regex }, { tags: regex }];
    }
    const products = await Product.find(filter).lean();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ msj: "Error al obtener los productos", error: error.message });
  }
};

/**
 * GET /api/products/get-one-product/:productId
 * Consulta un producto específico por su `_id`.
 */
const getOneProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    if (!checkId(id)) {
      return res.status(400).json({ msj: "ID de producto inválido" });
    }

    const product = isLocalDb()
      ? readDb().products.find((p) => p._id === id)
      : await Product.findById(id);

    if (!product) {
      return res.status(404).json({ msj: "El producto no existe" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(400).json({ msj: "Error al consultar el id", error: error.message });
  }
};

/**
 * POST /api/products/create-product
 * Crea un nuevo producto individual.
 */
const createProducts = async (req, res) => {
  try {
    const { clean, errors } = sanitizeProductPayload(req.body, false);
    if (errors.length) {
      return res.status(400).json({ status: "Datos inválidos", errors });
    }

    if (isLocalDb()) {
      const db = readDb();
      const now = new Date().toISOString();
      const product = { _id: generateObjectId(), ...clean, createdAt: now, updatedAt: now };
      db.products.push(product);
      writeDb(db);
      return res.status(201).json({ status: "Producto creado correctamente", product });
    }

    const product = new Product(clean);
    await product.save();
    return res.status(201).json({ status: "Producto creado correctamente", product });
  } catch (error) {
    return res.status(400).json({ status: "Producto no creado correctamente", error: error.message });
  }
};

/**
 * POST /api/products/create-many-products
 * Inserción por lotes de múltiples productos enviados en un arreglo.
 */
const manyProducts = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({ msj: "Se esperaba un arreglo no vacío de productos" });
    }

    const sanitizedList = [];
    for (let i = 0; i < req.body.length; i++) {
      const { clean, errors } = sanitizeProductPayload(req.body[i], false);
      if (errors.length) {
        return res.status(400).json({ msj: `Producto inválido en índice ${i}`, errors });
      }
      sanitizedList.push(clean);
    }

    if (isLocalDb()) {
      const db = readDb();
      const now = new Date().toISOString();
      const inserted = sanitizedList.map((item) => ({
        _id: generateObjectId(),
        ...item,
        createdAt: now,
        updatedAt: now,
      }));
      db.products.push(...inserted);
      writeDb(db);
      return res.status(201).json({ msj: "Elementos creados correctamente", count: inserted.length, products: inserted });
    }

    const inserted = await Product.insertMany(sanitizedList);
    return res.status(201).json({ msj: "Elementos creados correctamente", count: inserted.length, products: inserted });
  } catch (error) {
    return res.status(400).json({ msj: "Error en inserción por lotes", error: error.message });
  }
};

/**
 * PUT /api/products/update-product/:productId
 * Actualiza parcialmente un producto por `_id` con validaciones activas.
 */
const updateProducts = async (req, res) => {
  try {
    const id = req.params.productId;
    if (!checkId(id)) {
      return res.status(400).json({ msj: "ID de producto inválido" });
    }

    const { clean, errors } = sanitizeProductPayload(req.body, true);
    if (errors.length) {
      return res.status(400).json({ msj: "Datos inválidos", errors });
    }
    if (Object.keys(clean).length === 0) {
      return res.status(400).json({ msj: "No se enviaron campos válidos para actualizar" });
    }

    if (isLocalDb()) {
      const db = readDb();
      const index = db.products.findIndex((p) => p._id === id);
      if (index === -1) {
        return res.status(404).json({ msj: "El producto no existe" });
      }
      db.products[index] = {
        ...db.products[index],
        ...clean,
        updatedAt: new Date().toISOString(),
      };
      writeDb(db);
      return res.status(200).json(db.products[index]);
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: clean },
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ msj: "El producto no existe" });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ msj: "Actualización fallida", error: error.message });
  }
};

/**
 * DELETE /api/products/delete-product/:productId
 * Elimina un producto únicamente si el usuario autenticado posee rol `admin`.
 */
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    if (!checkId(id)) {
      return res.status(400).json({ msj: "ID de producto inválido" });
    }

    const permissions = req.pato && req.pato.permissions;
    if (!permissions || !permissions.admin) {
      return res.status(403).json({ msj: "No tienes permiso de administrador para hacer esta acción" });
    }

    if (isLocalDb()) {
      const db = readDb();
      const index = db.products.findIndex((p) => p._id === id);
      if (index === -1) {
        return res.status(404).json({ msj: "El producto no existe" });
      }
      const [removed] = db.products.splice(index, 1);
      writeDb(db);
      return res.status(200).json({ msj: "Producto eliminado", product: removed });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ msj: "El producto no existe" });
    }
    return res.status(200).json({ msj: "Producto eliminado", product: deleted });
  } catch (error) {
    return res.status(500).json({ msj: "Error al eliminar el producto", error: error.message });
  }
};

module.exports = {
  getProducts,
  createProducts,
  updateProducts,
  getOneProduct,
  deleteProduct,
  manyProducts,
};
