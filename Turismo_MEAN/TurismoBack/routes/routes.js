/**
 * ============================================================================
 * ENRUTADOR DE LA API REST — TURISMO MEAN (Turismo_MEAN/TurismoBack/routes/routes.js)
 * ============================================================================
 * Propósito: Exponer las operaciones CRUD y de analítica sobre destinos
 * turísticos (`/api/destinos`).
 *
 * Arquitectura híbrida optimizada:
 * - Modo MongoDB: Delega filtros (`$or`, `$gte`, `$lte`), ordenamiento (`sort`)
 *   y agregación de estadísticas (`$group`) directamente al motor MongoDB,
 *   usando `.lean()` para devolver objetos planos sin sobrecarga de Mongoose.
 * - Modo Local JSON: Si MongoDB no está disponible, opera sobre el archivo
 *   persistente `data/destinos.json` con exactamente la misma semántica y
 *   códigos de estado HTTP.
 */

const express = require('express');
const router = express.Router();
const Destino = require('../models/Destino');
const { isLocalDb, mongoose } = require('../config/db');
const { readDestinos, writeDestinos, generateObjectId, isValidObjectId } = require('../utils/localDb');

/**
 * Valida si un parámetro `:id` tiene formato válido de ObjectId (24 hex)
 * según el motor de persistencia activo.
 * @param {string} id - Identificador recibido en `req.params.id`.
 * @returns {boolean} `true` si el formato es válido.
 */
function checkId(id) {
    return isLocalDb() ? isValidObjectId(id) : mongoose.Types.ObjectId.isValid(id);
}

/**
 * Sanitiza y valida los campos permitidos de un destino turístico.
 * Evita vulnerabilidades de asignación masiva (mass assignment) al copiar
 * únicamente las propiedades esperadas por el esquema.
 *
 * @param {object} body - Cuerpo de la petición HTTP (`req.body`).
 * @param {boolean} isPartial - `false` en POST (campos obligatorios); `true` en PUT (actualización parcial).
 * @returns {{ clean: object, errors: string[] }} Objeto limpio y lista de errores de validación.
 */
function sanitizeDestino(body = {}, isPartial = false) {
    const errors = [];
    const clean = {};

    // Validación de nombre (obligatorio al crear o si se envía al actualizar)
    if (!isPartial || body.nombre !== undefined) {
        if (typeof body.nombre !== 'string' || !body.nombre.trim()) {
            errors.push("El campo 'nombre' es obligatorio");
        } else {
            clean.nombre = body.nombre.trim();
        }
    }

    // Validación de ciudad/región
    if (!isPartial || body.ciudad !== undefined) {
        if (typeof body.ciudad !== 'string' || !body.ciudad.trim()) {
            errors.push("El campo 'ciudad' es obligatorio");
        } else {
            clean.ciudad = body.ciudad.trim();
        }
    }

    // Descripción opcional con valor por defecto en creación
    if (body.descripcion !== undefined) {
        clean.descripcion = String(body.descripcion).trim() || 'Destino turístico destacado en Colombia';
    } else if (!isPartial) {
        clean.descripcion = 'Destino turístico destacado en Colombia';
    }

    // Validación de precio numérico no negativo
    if (!isPartial || body.precio !== undefined) {
        const precio = Number(body.precio);
        if (!Number.isFinite(precio) || precio < 0) {
            errors.push("El campo 'precio' debe ser un número mayor o igual a 0");
        } else {
            clean.precio = precio;
        }
    }

    // Validación de calificación en rango [1, 5] redondeada a 1 decimal
    if (body.calificacion !== undefined) {
        const cal = Number(body.calificacion);
        if (!Number.isFinite(cal) || cal < 1 || cal > 5) {
            errors.push("El campo 'calificacion' debe estar entre 1 y 5");
        } else {
            clean.calificacion = Number(cal.toFixed(1));
        }
    } else if (!isPartial) {
        clean.calificacion = 5;
    }

    return { clean, errors };
}

/**
 * Construye el objeto `filter` y `sort` nativos para consultas Mongoose.
 * Escapa caracteres especiales en expresiones regulares para evitar errores
 * de sintaxis o ataques ReDoS cuando el usuario busca texto libre.
 *
 * @param {object} query - Parámetros de consulta (`req.query`).
 * @returns {{ filter: object, sort: object }}
 */
function buildMongoQuery(query = {}) {
    const filter = {};

    // Búsqueda de texto libre en nombre, ciudad o descripción
    if (query.q) {
        const escaped = String(query.q).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');
        filter.$or = [{ nombre: regex }, { ciudad: regex }, { descripcion: regex }];
    }

    // Filtro específico por ciudad
    if (query.ciudad) {
        const escapedCity = String(query.ciudad).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.ciudad = new RegExp(escapedCity, 'i');
    }

    // Rango de precios ($gte / $lte)
    if (query.minPrecio !== undefined && query.minPrecio !== '') {
        const min = Number(query.minPrecio);
        if (Number.isFinite(min)) filter.precio = { ...(filter.precio || {}), $gte: min };
    }
    if (query.maxPrecio !== undefined && query.maxPrecio !== '') {
        const max = Number(query.maxPrecio);
        if (Number.isFinite(max)) filter.precio = { ...(filter.precio || {}), $lte: max };
    }

    // Mapeo de criterio de ordenamiento
    const sortMap = {
        precio_asc: { precio: 1 },
        precio_desc: { precio: -1 },
        calificacion: { calificacion: -1 }
    };
    const sort = sortMap[query.sort] || { fechaCreacion: -1 };
    return { filter, sort };
}

/**
 * Aplica los mismos filtros y ordenamiento en memoria cuando el servidor
 * opera con el respaldo local JSON (`isLocalDb() === true`).
 *
 * @param {Array<object>} list - Lista completa leída desde `destinos.json`.
 * @param {object} query - Parámetros de consulta (`req.query`).
 * @returns {Array<object>} Lista filtrada y ordenada.
 */
function applyLocalFilters(list, query = {}) {
    let result = [...list];

    if (query.q) {
        const term = String(query.q).trim().toLowerCase();
        result = result.filter(
            (d) =>
                d.nombre.toLowerCase().includes(term) ||
                d.ciudad.toLowerCase().includes(term) ||
                (d.descripcion || '').toLowerCase().includes(term)
        );
    }

    if (query.ciudad) {
        const city = String(query.ciudad).trim().toLowerCase();
        result = result.filter((d) => d.ciudad.toLowerCase().includes(city));
    }

    if (query.minPrecio !== undefined && query.minPrecio !== '') {
        const min = Number(query.minPrecio);
        if (Number.isFinite(min)) result = result.filter((d) => d.precio >= min);
    }

    if (query.maxPrecio !== undefined && query.maxPrecio !== '') {
        const max = Number(query.maxPrecio);
        if (Number.isFinite(max)) result = result.filter((d) => d.precio <= max);
    }

    switch (query.sort) {
        case 'precio_asc':
            result.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio_desc':
            result.sort((a, b) => b.precio - a.precio);
            break;
        case 'calificacion':
            result.sort((a, b) => b.calificacion - a.calificacion);
            break;
        default:
            result.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
            break;
    }

    return result;
}

// ============================================================================
// ENDPOINTS REST
// ============================================================================

/**
 * GET /api/destinos/stats/resumen
 * Nota: Se declara ANTES de `/destinos/:id` para que Express no interprete
 * `"stats"` como un parámetro `:id`.
 */
router.get('/destinos/stats/resumen', async (req, res) => {
    try {
        if (!isLocalDb()) {
            // Agregación nativa en MongoDB para calcular métricas sin traer documentos completos
            const [agg] = await Destino.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        precioPromedio: { $avg: '$precio' },
                        calificacionPromedio: { $avg: '$calificacion' },
                        ciudades: { $addToSet: { $toLower: '$ciudad' } }
                    }
                }
            ]);
            const resumen = agg
                ? {
                    total: agg.total,
                    precioPromedio: Math.round(agg.precioPromedio || 0),
                    calificacionPromedio: Number((agg.calificacionPromedio || 0).toFixed(2)),
                    ciudadesUnicas: agg.ciudades.length
                }
                : { total: 0, precioPromedio: 0, calificacionPromedio: 0, ciudadesUnicas: 0 };
            return res.status(200).json({ ok: true, resumen });
        }

        // Cálculo equivalente en modo local JSON
        const destinos = readDestinos();
        const total = destinos.length;
        const precioPromedio = total
            ? Math.round(destinos.reduce((acc, d) => acc + Number(d.precio || 0), 0) / total)
            : 0;
        const calificacionPromedio = total
            ? Number((destinos.reduce((acc, d) => acc + Number(d.calificacion || 0), 0) / total).toFixed(2))
            : 0;
        const ciudadesUnicas = new Set(destinos.map((d) => String(d.ciudad).trim().toLowerCase())).size;

        return res.status(200).json({
            ok: true,
            resumen: { total, precioPromedio, calificacionPromedio, ciudadesUnicas }
        });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: 'Error al calcular estadísticas', error: error.message });
    }
});

/**
 * GET /api/destinos
 * Lista los destinos aplicando filtros opcionales (`q`, `ciudad`, `minPrecio`,
 * `maxPrecio`) y criterio de ordenamiento (`sort`).
 */
router.get('/destinos', async (req, res) => {
    try {
        let destinos;
        if (isLocalDb()) {
            destinos = applyLocalFilters(readDestinos(), req.query || {});
        } else {
            const { filter, sort } = buildMongoQuery(req.query || {});
            destinos = await Destino.find(filter).sort(sort).lean();
        }
        return res.status(200).json({ ok: true, count: destinos.length, destinos });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: 'Error al consultar los destinos', error: error.message });
    }
});

/**
 * GET /api/destinos/:id
 * Obtiene un único destino por su ID. Retorna 400 si el ID es inválido y 404 si no existe.
 */
router.get('/destinos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!checkId(id)) {
            return res.status(400).json({ ok: false, msg: 'ID de destino inválido' });
        }

        const destino = isLocalDb()
            ? readDestinos().find((d) => d._id === id)
            : await Destino.findById(id).lean();

        if (!destino) {
            return res.status(404).json({ ok: false, msg: 'Destino no encontrado' });
        }
        return res.status(200).json({ ok: true, data: destino });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: 'Error al consultar el destino', error: error.message });
    }
});

/**
 * POST /api/destinos
 * Valida, sanitiza y persiste un nuevo destino turístico (HTTP 201 Created).
 */
router.post('/destinos', async (req, res) => {
    try {
        const { clean, errors } = sanitizeDestino(req.body, false);
        if (errors.length) {
            return res.status(400).json({ ok: false, msg: 'Datos inválidos al registrar destino', errors });
        }

        if (isLocalDb()) {
            const destinos = readDestinos();
            const nuevo = {
                _id: generateObjectId(),
                ...clean,
                fechaCreacion: new Date().toISOString()
            };
            destinos.unshift(nuevo);
            writeDestinos(destinos);
            return res.status(201).json({ ok: true, msg: 'Destino registrado correctamente', data: nuevo });
        }

        const nuevoDestino = new Destino(clean);
        const guardado = await nuevoDestino.save();
        return res.status(201).json({ ok: true, msg: 'Destino registrado correctamente', data: guardado });
    } catch (error) {
        return res.status(400).json({ ok: false, msg: 'Datos inválidos al registrar destino', error: error.message });
    }
});

/**
 * PUT /api/destinos/:id
 * Actualiza parcialmente un destino existente aplicando validadores de esquema.
 */
router.put('/destinos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!checkId(id)) {
            return res.status(400).json({ ok: false, msg: 'ID de destino inválido' });
        }

        const { clean, errors } = sanitizeDestino(req.body, true);
        if (errors.length) {
            return res.status(400).json({ ok: false, msg: 'Datos inválidos al actualizar destino', errors });
        }
        if (Object.keys(clean).length === 0) {
            return res.status(400).json({ ok: false, msg: 'No se enviaron campos válidos para actualizar' });
        }

        if (isLocalDb()) {
            const destinos = readDestinos();
            const index = destinos.findIndex((d) => d._id === id);
            if (index === -1) {
                return res.status(404).json({ ok: false, msg: 'Destino no encontrado' });
            }
            destinos[index] = { ...destinos[index], ...clean };
            writeDestinos(destinos);
            return res.status(200).json({ ok: true, msg: 'Destino actualizado', data: destinos[index] });
        }

        const actualizado = await Destino.findByIdAndUpdate(id, clean, { new: true, runValidators: true });
        if (!actualizado) {
            return res.status(404).json({ ok: false, msg: 'Destino no encontrado' });
        }
        return res.status(200).json({ ok: true, msg: 'Destino actualizado', data: actualizado });
    } catch (error) {
        return res.status(400).json({ ok: false, msg: 'Error al actualizar el destino', error: error.message });
    }
});

/**
 * DELETE /api/destinos/:id
 * Elimina un destino por su ID; devuelve 404 si no existe.
 */
router.delete('/destinos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!checkId(id)) {
            return res.status(400).json({ ok: false, msg: 'ID de destino inválido' });
        }

        if (isLocalDb()) {
            const destinos = readDestinos();
            const index = destinos.findIndex((d) => d._id === id);
            if (index === -1) {
                return res.status(404).json({ ok: false, msg: 'Destino no encontrado' });
            }
            destinos.splice(index, 1);
            writeDestinos(destinos);
            return res.status(200).json({ ok: true, msg: 'Destino eliminado', id });
        }

        const eliminado = await Destino.findByIdAndDelete(id);
        if (!eliminado) {
            return res.status(404).json({ ok: false, msg: 'Destino no encontrado' });
        }
        return res.status(200).json({ ok: true, msg: 'Destino eliminado', id });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: 'Error al eliminar el destino', error: error.message });
    }
});

module.exports = router;
