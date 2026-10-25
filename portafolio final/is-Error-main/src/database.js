/**
 * ============================================================================
 * CONEXIÓN A MONGODB ATLAS CON MONGOOSE (is-Error-main/src/database.js)
 * ============================================================================
 * Propósito: Establecer la conexión con el clúster de MongoDB utilizando la
 * cadena de conexión definida en `process.env.MONGO_ATLAS`.
 */

const env = require("dotenv");
const mongoose = require("mongoose");
env.config();

const uri = process.env.MONGO_ATLAS;

mongoose.connect(uri, { useUnifiedTopology: true })
    .then(() => console.log("Conexión a MongoDB exitosa"))
    .catch((err) => console.error("Error al conectar a MongoDB:", err));

module.exports = mongoose;
