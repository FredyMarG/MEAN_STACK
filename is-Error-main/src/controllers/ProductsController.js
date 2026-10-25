/**
 * ============================================================================
 * CONTROLADOR DE PRODUCTOS (is-Error-main/src/controllers/ProductsController.js)
 * ============================================================================
 * Propósito: Gestionar las operaciones CRUD sobre el modelo `Product` en MongoDB:
 * - `getProducts`: Lista todos los productos disponibles.
 * - `getOneProduct`: Consulta un producto específico por su `_id`.
 * - `createProducts`: Crea un nuevo producto individual.
 * - `manyProducts`: Inserción por lotes de múltiples productos.
 * - `updateProducts`: Actualiza parcialmente un producto por `_id`.
 * - `deleteProduct`: Elimina un producto verificando primero si el usuario
 *   autenticado (decodificado en `req.pato` por el middleware JWT) posee rol `admin`.
 */

const Product = require("../Models/Product");

/**
 * Obtiene todos los productos almacenados en la base de datos.
 */
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ msj: "Error al obtener los productos", error });
  }
};

/**
 * Obtiene un único producto a partir del parámetro de ruta `:productId`.
 */
const getOneProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    const product = await Product.findById(id);
    res.status(product ? 200 : 404).json(product ? product : { msj: "El producto no existe" });
  } catch (error) {
    res.status(400).json({ msj: "Error al consultar el id", error });
  }
};

/**
 * Crea un nuevo producto en la base de datos.
 */
const createProducts = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ status: "Producto creado correctamente", product });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "Producto no creado correctamente", error });
  }
};

/**
 * Actualiza un producto existente por su ID devolviendo el documento actualizado (`{ new: true }`).
 */
const updateProducts = async (req, res) => {
  try {
    const id = req.params.productId;
    const updated = await Product.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ msj: "Actualización fallida", error });
  }
};

/**
 * Elimina un producto únicamente si el token JWT incluye permisos de administrador (`permissions.admin`).
 */
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    const permissions = req.pato && req.pato.permissions;

    if (permissions && permissions.admin) {
      await Product.findByIdAndDelete(id);
      res.status(200).json({ msj: "Producto eliminado", user: req.pato });
    } else {
      res.status(403).json({ msj: "No tienes permiso de administrador para hacer esta acción" });
    }
  } catch (error) {
    res.status(500).json({ msj: "Error al eliminar el producto", error });
  }
};

/**
 * Inserta múltiples productos enviados en un arreglo dentro de `req.body`.
 */
const manyProducts = async (req, res) => {
  try {
    for (let product of req.body) {
      const insertion = new Product(product);
      await insertion.save();
    }
    res.status(201).json({ msj: "Elementos creados correctamente" });
  } catch (error) {
    res.status(400).json({ error });
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
