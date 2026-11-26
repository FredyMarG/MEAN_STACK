/**
 * ============================================================================
 * PRUEBAS AUTOMATIZADAS — REPASO JS (repaso-js/tests/repaso.test.js)
 * ============================================================================
 * Propósito: Validar simetría de `rot13`, inmutabilidad y ordenamiento de
 * `bubbleSort`, y retorno de `salude`.
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { rot13 } = require("../for");
const { salude, bubbleSort } = require("../repasojs");

describe("Repaso de Algoritmos JS (repaso-js)", () => {
  it("rot13 cifra y descifra simétricamente respetando espacios y signos", () => {
    const original = "Hola Mundo MEAN 2026!";
    const cifrado = rot13(original);
    assert.notEqual(cifrado, original);
    assert.equal(rot13(cifrado), original);
  });

  it("bubbleSort ordena sin mutar el arreglo original", () => {
    const entrada = [64, 34, 25, 12, 22, 11, 90];
    const ordenado = bubbleSort(entrada);
    assert.deepEqual(ordenado, [11, 12, 22, 25, 34, 64, 90]);
    assert.deepEqual(entrada, [64, 34, 25, 12, 22, 11, 90]);
  });

  it("salude retorna mensaje formateado", () => {
    assert.equal(salude("MEAN"), "¡Hola, MEAN!");
  });
});
