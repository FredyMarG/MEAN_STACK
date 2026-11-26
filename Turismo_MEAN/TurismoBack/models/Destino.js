/**
 * ============================================================================
 * MODELO MONGOOSE: DESTINO TURÍSTICO (Turismo_MEAN/TurismoBack/models/Destino.js)
 * ============================================================================
 * Propósito: Definir la estructura, tipos de datos y reglas de validación para
 * cada documento de la colección `destinos` en MongoDB.
 */

const mongoose = require('mongoose');

const DestinoSchema = new mongoose.Schema(
    {
        /** Nombre comercial o atractivo principal del destino (obligatorio). */
        nombre: {
            type: String,
            required: [true, 'El nombre del destino es obligatorio'],
            trim: true
        },
        /** Ciudad, municipio o región geográfica donde se ubica (obligatorio). */
        ciudad: {
            type: String,
            required: [true, 'La ciudad o región es obligatoria'],
            trim: true
        },
        /** Descripción breve de la experiencia o plan turístico incluido. */
        descripcion: {
            type: String,
            default: 'Destino turístico destacado en Colombia',
            trim: true
        },
        /** Precio del paquete o plan en pesos colombianos (COP), mínimo 0. */
        precio: {
            type: Number,
            required: [true, 'El precio es obligatorio'],
            min: [0, 'El precio no puede ser negativo']
        },
        /** Calificación promedio del destino en escala de 1 a 5 estrellas. */
        calificacion: {
            type: Number,
            default: 5,
            min: [1, 'La calificación mínima es 1'],
            max: [5, 'La calificación máxima es 5']
        },
        /** Marca de tiempo de creación del registro en la base de datos. */
        fechaCreacion: {
            type: Date,
            default: Date.now
        }
    },
    {
        versionKey: false
    }
);

module.exports = mongoose.model('Destino', DestinoSchema);
