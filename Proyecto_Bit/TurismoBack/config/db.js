/**
 * ============================================================================
 * CONFIGURACIÓN DE CONEXIÓN A MONGODB (Proyecto_Bit/TurismoBack/config/db.js)
 * ============================================================================
 * Propósito: Conectar el backend de Turismo a MongoDB usando Mongoose y las
 * variables de entorno definidas en `config.env`.
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: 'config.env' });

const conectarDB = async () => {
    try {
        const uri = process.env.DB_MONGO || 'mongodb://127.0.0.1:27017/turismo';
        await mongoose.connect(uri);
        console.log('Base de datos de Turismo conectada correctamente');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

module.exports = conectarDB;
