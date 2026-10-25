/**
 * ============================================================================
 * MODELO MONGOOSE: PRODUCTO (is-Error-main/src/Models/Product.js)
 * ============================================================================
 * Propósito: Definir el esquema de datos para los productos de la tienda,
 * incluyendo validaciones de obligatoriedad (`required`), valores por defecto
 * (`default`) y marcas de tiempo automáticas (`timestamps: true`).
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    availableElemnts: { type: Number, required: true },
    description: {
      type: String,
      required: false,
      default: "El usuario no añadió una descripción",
    },
    image: { type: String, required: false, default: "Sin Imágenes" },
    tags: { type: Array, required: false, default: [] }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
