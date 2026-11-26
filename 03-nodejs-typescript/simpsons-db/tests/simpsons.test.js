/**
 * ============================================================================
 * PRUEBAS AUTOMATIZADAS — SIMPSONS DB (simpsons-db/tests/simpsons.test.js)
 * ============================================================================
 * Propósito: Validar la carga del dataset de 50 personajes y los filtros
 * combinados (`genero`, `estado_vida`, `casado` y búsqueda `?q=`).
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { loadSimpsonsCollection, queryCharacters } = require("../server");

describe("Simpsons DB Explorer (simpsons-db)", () => {
  it("carga exactamente 50 personajes con _id asignado", () => {
    const col = loadSimpsonsCollection();
    const docs = col.find();
    assert.equal(docs.length, 50);
    assert.ok(docs[0]._id);
  });

  it("filtra por genero, estado_vida, casado y texto ?q=", () => {
    const col = loadSimpsonsCollection();

    const homero = queryCharacters(col, new URLSearchParams({ q: "Homer", genero: "hombre" }));
    assert.ok(homero.some((c) => c.nombre === "Homer Simpson"));

    const fallecidos = queryCharacters(col, new URLSearchParams({ estado_vida: "Fallecido" }));
    assert.ok(fallecidos.length >= 1);
    assert.ok(fallecidos.every((c) => c.estado_vida === "Fallecido"));

    const casados = queryCharacters(col, new URLSearchParams({ casado: "true" }));
    assert.ok(casados.every((c) => c.casado === true));
  });
});
