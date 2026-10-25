/**
 * ============================================================================
 * ENRUTADOR DE PRODUCTOS (is-Error-main/src/routes/ProductsRoutes.js)
 * ============================================================================
 * Propósito: Mapear los endpoints REST de `/api/products` hacia las funciones
 * del controlador `ProductsController`, protegiendo las rutas de escritura y
 * eliminación con el middleware `auth` (verificación de JWT).
 */

const express = require("express");
const router = express.Router();

const productsControllers = require("../controllers/ProductsController");
const auth = require("../middlewares/auth");

// Consulta pública de catálogo
router.get("/get-products", productsControllers.getProducts);

// Rutas protegidas por token JWT
router.post("/create-product", auth, productsControllers.createProducts);
router.post("/create-many-products", auth, productsControllers.manyProducts);
router.put("/update-product/:productId", auth, productsControllers.updateProducts);
router.get("/get-one-product/:productId", auth, productsControllers.getOneProduct);
router.delete("/delete-product/:productId", auth, productsControllers.deleteProduct);

module.exports = router;
