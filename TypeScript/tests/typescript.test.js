/**
 * ============================================================================
 * PRUEBAS AUTOMATIZADAS — FUNDAMENTOS TYPESCRIPT (TypeScript/tests/typescript.test.js)
 * ============================================================================
 * Propósito: Validar el código transpilado en `script.js` (`crearPerfil`,
 * `envolverRespuesta` y la clase `CursoModulo` con encapsulamiento).
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { crearPerfil, envolverRespuesta, CursoModulo } = require("../script");

describe("Fundamentos de TypeScript (script.js transpilado)", () => {
  it("crearPerfil construye un Developer tipado con stack MEAN completo", () => {
    const dev = crearPerfil(7, "  Laura Dev  ", "backend", "@laura");
    assert.equal(dev.id, 7);
    assert.equal(dev.name, "Laura Dev");
    assert.equal(dev.role, "backend");
    assert.equal(dev.github, "@laura");
    assert.deepEqual(dev.stack, ["MongoDB", "Express", "Angular", "Node.js"]);
  });

  it("envolverRespuesta<T> retorna estructura estándar ok + timestamp + data", () => {
    const res = envolverRespuesta({ curso: "MEAN", nivel: 1 });
    assert.equal(res.ok, true);
    assert.ok(res.timestamp);
    assert.equal(res.data.curso, "MEAN");
  });

  it("CursoModulo calcula porcentaje de progreso sin exceder 100%", () => {
    const mod = new CursoModulo("TS", 2);
    assert.equal(mod.progresoPorcentaje(), 0);
    assert.equal(mod.completarLeccion(), 50);
    assert.equal(mod.completarLeccion(), 100);
    assert.equal(mod.completarLeccion(), 100);
  });
});
