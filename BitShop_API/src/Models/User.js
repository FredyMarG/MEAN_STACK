/**
 * ============================================================================
 * MODELO MONGOOSE: USUARIO (is-Error-main/src/Models/User.js)
 * ============================================================================
 * Propósito: Definir la estructura de un usuario en MongoDB incluyendo correo
 * único, contraseña hasheada (oculta al serializar a JSON) y el subdocumento
 * `Permissions` (`admin`, `client`, `verified`) para control de acceso RBAC.
 */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    Permissions: {
      admin: { type: Boolean, default: false },
      client: { type: Boolean, default: true },
      verified: { type: Boolean, default: false },
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("User", userSchema);
