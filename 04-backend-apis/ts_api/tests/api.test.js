/**
 * ============================================================================
 * PRUEBAS AUTOMATIZADAS — TS_API (ts_api/tests/api.test.js)
 * ============================================================================
 * Propósito: Validar los controladores compilados en `dist/` (`login`,
 * `operaciones` y `math`) asegurando códigos HTTP, validaciones de entrada y
 * ausencia de campos sensibles en las respuestas.
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { login } = require("../dist/controllers/login.controller");
const { suma, division } = require("../dist/controllers/operaciones.controller");
const { suma: mathInspect } = require("../dist/controllers/math.controller");
const { sayHi } = require("../dist/controllers/user.controller");

/** Crea un objeto `res` simulado para capturar status HTTP y cuerpo JSON. */
function mockRes() {
  const res = { statusCode: 200, body: null };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (payload) => { res.body = payload; return res; };
  return res;
}

describe("ts_api (TypeScript + Express)", () => {
  it("POST /api/login rechaza campos vacíos con 400", () => {
    const res = mockRes();
    login({ body: { username: "demo", email: "", password: "" } }, res);
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.ok, false);
  });

  it("POST /api/login autentica con 200 sin exponer password", () => {
    const res = mockRes();
    login({ body: { username: "demo_dev", email: "demo@tsapi.local", password: "Demo123*" } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.user.password, undefined);
  });

  it("GET /api/operaciones/suma y division validan parámetros y división por cero", () => {
    const resOk = mockRes();
    suma({ params: { num1: "10", num2: "5" } }, resOk);
    assert.equal(resOk.statusCode, 200);
    assert.equal(resOk.body.resultado, 15);

    const resZero = mockRes();
    division({ params: { num1: "10", num2: "0" } }, resZero);
    assert.equal(resZero.statusCode, 400);

    const resNan = mockRes();
    suma({ params: { num1: "abc", num2: "5" } }, resNan);
    assert.equal(resNan.statusCode, 400);
  });

  it("GET /api/math/suma y /api/saludo/hola responden correctamente", () => {
    const resMath = mockRes();
    mathInspect({ body: {}, params: { num1: "4", num2: "8" }, query: { origen: "test" } }, resMath);
    assert.equal(resMath.statusCode, 200);
    assert.equal(resMath.body.params.num1, "4");

    const resHi = mockRes();
    sayHi({}, resHi);
    assert.equal(resHi.statusCode, 200);
    assert.equal(resHi.body.msg, "Hola");
  });
});
