/**
 * ============================================================================
 * SUITE DE PRUEBAS AUTOMATIZADAS — TURISMO BACK (tests/destinos.test.js)
 * ============================================================================
 * Propósito: Verificar de forma automática el funcionamiento completo de la
 * API REST (`/api/destinos`) usando el runner nativo `node:test` de Node.js.
 *
 * Estrategia de aislamiento:
 * - Antes de ejecutar las pruebas (`before`), guarda una copia de seguridad de
 *   `data/destinos.json`.
 * - Al finalizar (`after`), restaura exactamente los datos originales para que
 *   los tests no dejen registros residuales.
 * - Ejecuta los handlers de Express en proceso mediante `mockRes()` para no
 *   depender de puertos de red abiertos.
 */

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { conectarDB } = require('../config/db');
const { readDestinos, writeDestinos } = require('../utils/localDb');
const router = require('../routes/routes');

/**
 * Crea un objeto Response simulado compatible con `res.status().json()`.
 * @returns {{ statusCode: number, body: any, status: Function, json: Function }}
 */
function mockRes() {
    const res = { statusCode: 200, body: null };
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (payload) => {
        res.body = payload;
        return res;
    };
    return res;
}

/**
 * Extrae el controlador registrado en el Router de Express para un método y ruta dados.
 * @param {'get'|'post'|'put'|'delete'} method
 * @param {string} routePath
 */
function getHandler(method, routePath) {
    const layer = router.stack.find(
        (l) => l.route && l.route.path === routePath && l.route.methods[method]
    );
    assert.ok(layer, `No se encontró la ruta ${method.toUpperCase()} ${routePath}`);
    return layer.route.stack[0].handle;
}

describe('TurismoBack REST API (/api/destinos)', () => {
    let backup = [];
    let createdId = null;

    // Inicializa la BD y respalda el estado previo
    before(async () => {
        await conectarDB();
        backup = readDestinos();
    });

    // Restaura el archivo JSON original al terminar todas las pruebas
    after(() => {
        writeDestinos(backup);
    });

    it('GET /destinos lista y ordena destinos por precio ascendente', async () => {
        const res = mockRes();
        await getHandler('get', '/destinos')({ query: { sort: 'precio_asc' } }, res);
        assert.equal(res.statusCode, 200);
        assert.equal(res.body.ok, true);
        assert.ok(res.body.destinos.length >= 1);

        // Verifica que cada precio sea menor o igual al siguiente
        for (let i = 1; i < res.body.destinos.length; i++) {
            assert.ok(res.body.destinos[i - 1].precio <= res.body.destinos[i].precio);
        }
    });

    it('GET /destinos/stats/resumen retorna métricas agregadas válidas', async () => {
        const res = mockRes();
        await getHandler('get', '/destinos/stats/resumen')({}, res);
        assert.equal(res.statusCode, 200);
        assert.equal(res.body.ok, true);
        assert.equal(typeof res.body.resumen.total, 'number');
        assert.equal(typeof res.body.resumen.precioPromedio, 'number');
    });

    it('POST /destinos rechaza payload inválido con HTTP 400', async () => {
        const res = mockRes();
        await getHandler('post', '/destinos')({ body: { nombre: '', precio: -10 } }, res);
        assert.equal(res.statusCode, 400);
        assert.equal(res.body.ok, false);
    });

    it('POST -> GET -> PUT -> DELETE ejecuta el flujo CRUD completo', async () => {
        // 1. Crear un nuevo destino
        const createRes = mockRes();
        await getHandler('post', '/destinos')(
            { body: { nombre: 'Caño Cristales', ciudad: 'La Macarena', precio: 1650000, calificacion: 5 } },
            createRes
        );
        assert.equal(createRes.statusCode, 201);
        createdId = createRes.body.data._id;
        assert.ok(createdId);

        // 2. Consultar el destino recién creado por su ID
        const getOneRes = mockRes();
        await getHandler('get', '/destinos/:id')({ params: { id: createdId } }, getOneRes);
        assert.equal(getOneRes.statusCode, 200);
        assert.equal(getOneRes.body.data.nombre, 'Caño Cristales');

        // 3. Actualizar el precio mediante PUT
        const putRes = mockRes();
        await getHandler('put', '/destinos/:id')(
            { params: { id: createdId }, body: { precio: 1700000 } },
            putRes
        );
        assert.equal(putRes.statusCode, 200);
        assert.equal(putRes.body.data.precio, 1700000);

        // 4. Eliminar el destino mediante DELETE
        const delRes = mockRes();
        await getHandler('delete', '/destinos/:id')({ params: { id: createdId } }, delRes);
        assert.equal(delRes.statusCode, 200);

        // 5. Confirmar que tras eliminarlo devuelve HTTP 404
        const notFoundRes = mockRes();
        await getHandler('get', '/destinos/:id')({ params: { id: createdId } }, notFoundRes);
        assert.equal(notFoundRes.statusCode, 404);
    });
});
