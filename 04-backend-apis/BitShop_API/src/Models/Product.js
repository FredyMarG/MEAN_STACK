/**
 * ============================================================================
 * MODELO MONGOOSE: PRODUCTO (is-Error-main/src/Models/Product.js)
 * ============================================================================
 * Propósito: Definir el esquema de datos para los productos de la tienda,
 * incluyendo validaciones de obligatoriedad (`required`), rangos numéricos,
 * valores por defecto y marcas de tiempo automáticas (`timestamps: true`).
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    availableElements: { type: Number, required: true, min: 0 },
    description: {
      type: String,
      required: false,
      default: "El usuario no añadió una descripción",
      trim: true,
    },
    image: { type: String, required: false, default: "Sin Imágenes" },
    tags: { type: [String], required: false, default: [] },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
