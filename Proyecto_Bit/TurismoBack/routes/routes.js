/**
 * ============================================================================
 * ENRUTADOR PRINCIPAL DE LA API DE TURISMO (Proyecto_Bit/TurismoBack/routes/routes.js)
 * ============================================================================
 * Propósito: Definir los endpoints CRUD (`/api/destinos`) integrados con el
 * modelo Mongoose `Destino`.
 */

const express = require('express');
const router = express.Router();
const Destino = require('../models/Destino');

// GET /api/destinos — Obtener todos los destinos turísticos
router.get('/destinos', async (req, res) => {
    try {
        const destinos = await Destino.find().sort({ fechaCreacion: -1 });
        res.status(200).json({ ok: true, destinos });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al consultar los destinos', error });
    }
});

// POST /api/destinos — Crear un nuevo destino turístico
router.post('/destinos', async (req, res) => {
    try {
        const nuevoDestino = new Destino(req.body);
        const guardado = await nuevoDestino.save();
        res.status(201).json({ ok: true, msg: 'Destino registrado correctamente', data: guardado });
    } catch (error) {
        res.status(400).json({ ok: false, msg: 'Datos inválidos al registrar destino', error });
    }
});

// PUT /api/destinos/:id — Actualizar un destino turístico existente
router.put('/destinos/:id', async (req, res) => {
    try {
        const actualizado = await Destino.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!actualizado) {
            return res.status(404).json({ ok: false, msg: 'Destino no encontrado' });
        }
        res.status(200).json({ ok: true, msg: 'Destino actualizado', data: actualizado });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al actualizar el destino', error });
    }
});

// DELETE /api/destinos/:id — Eliminar un destino turístico por ID
router.delete('/destinos/:id', async (req, res) => {
    try {
        const eliminado = await Destino.findByIdAndDelete(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ ok: false, msg: 'Destino no encontrado' });
        }
        res.status(200).json({ ok: true, msg: 'Destino eliminado', id: req.params.id });
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'Error al eliminar el destino', error });
    }
});

module.exports = router;
