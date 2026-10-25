/**
 * ============================================================================
 * MODELO MONGOOSE: DESTINO TURÍSTICO (Proyecto_Bit/TurismoBack/models/Destino.js)
 * ============================================================================
 * Propósito: Definir el esquema de datos para los destinos turísticos en
 * MongoDB (nombre, ciudad, descripcion, precio y calificacion).
 */

const mongoose = require('mongoose');

const DestinoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    ciudad: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        default: 'Destino turístico destacado en Colombia'
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    calificacion: {
        type: Number,
        default: 5,
        min: 1,
        max: 5
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Destino', DestinoSchema);
