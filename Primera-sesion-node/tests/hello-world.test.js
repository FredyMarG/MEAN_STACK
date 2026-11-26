/**
 * ============================================================================
 * PRUEBAS AUTOMATIZADAS — PRIMERA SESIÓN NODE (tests/hello-world.test.js)
 * ============================================================================
 * Propósito: Validar cada función exportada de `hello-world.js`, incluyendo
 * entradas válidas, casos límite (0, negativos) y valores no numéricos.
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  evaluarSigno,
  evaluarParidad,
  multiplosXD,
  dibujarCuadrado,
  tablaDelCinco,
  relojDigital,
  serieCien,
  primosHasta,
} = require("../hello-world");

describe("Primera Sesión de Node.js (hello-world.js)", () => {
  it("evaluarSigno clasifica positivo, negativo, cero e inválido", () => {
    assert.equal(evaluarSigno(10), "positivo");
    assert.equal(evaluarSigno(-5), "negativo");
    assert.equal(evaluarSigno(0), "cero");
    assert.equal(evaluarSigno("abc"), "invalido");
  });

  it("evaluarParidad detecta par, impar e inválido", () => {
    assert.equal(evaluarParidad(8), "par");
    assert.equal(evaluarParidad(7), "impar");
    assert.equal(evaluarParidad(NaN), "invalido");
  });

  it("multiplosXD aplica las reglas de divisibilidad por 3 y 5", () => {
    assert.equal(multiplosXD(15), "XD");
    assert.equal(multiplosXD(10), "D");
    assert.equal(multiplosXD(9), "X");
    assert.equal(multiplosXD(7), "7");
  });

  it("dibujarCuadrado, tablaDelCinco, relojDigital, serieCien y primosHasta generan resultados exactos", () => {
    const cuadrado = dibujarCuadrado(3);
    assert.equal(cuadrado.length, 4);
    assert.equal(cuadrado[0], "****");
    assert.equal(cuadrado[1], "*  *");

    assert.equal(tablaDelCinco().length, 11);
    assert.deepEqual(relojDigital(true), ["00:00", "06:00", "12:00", "18:00"]);
    assert.ok(serieCien().startsWith("0,1,2,") && serieCien().endsWith(",99,100"));
    assert.deepEqual(primosHasta(20), [2, 3, 5, 7, 11, 13, 17, 19]);
  });
});
