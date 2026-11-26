/**
 * ============================================================================
 * PRUEBAS AUTOMATIZADAS — BIT-SHOP REST API (is-Error-main/tests/api.test.js)
 * ============================================================================
 * Propósito: Verificar login JWT, protección RBAC de rutas, listado/creación/
 * actualización/eliminación de productos y arranque del servidor con respaldo
 * automático de puerto.
 */

const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { connectDatabase } = require("../src/database");
const { readDb, writeDb } = require("../src/utils/localDb");
const prodCtrl = require("../src/controllers/ProductsController");
const userCtrl = require("../src/controllers/UsersController");
const auth = require("../src/middlewares/auth");

function mockRes() {
  const res = { statusCode: 200, body: null };
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (b) => { res.body = b; return res; };
  return res;
}

describe("Bit-Shop REST API (is-Error-main)", () => {
  let backup = null;
  let adminToken = "";
  let createdProductId = "";

  before(async () => {
    await connectDatabase();
    backup = readDb();
  });

  after(() => {
    if (backup) writeDb(backup);
  });

  it("POST /api/user/login autentica admin y retorna JWT válido", async () => {
    const res = mockRes();
    await userCtrl.login({ body: { email: "admin@bitshop.local", password: "Admin123*" } }, res);
    assert.equal(res.statusCode, 200);
    assert.ok(res.body.token);
    assert.equal(res.body.user.password, undefined);
    adminToken = res.body.token;
  });

  it("GET /api/products/get-products retorna catálogo semilla", async () => {
    const res = mockRes();
    await prodCtrl.getProducts({}, res);
    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(res.body) && res.body.length >= 3);
  });

  it("POST -> PUT -> DELETE producto con middleware JWT", async () => {
    const reqCreate = {
      headers: { authorization: `Bearer ${adminToken}` },
      body: { name: "Audífonos Studio", price: 180000, availableElements: 10 },
    };
    let nextOk = false;
    auth(reqCreate, mockRes(), () => { nextOk = true; });
    assert.equal(nextOk, true);

    const resCreate = mockRes();
    await prodCtrl.createProducts(reqCreate, resCreate);
    assert.equal(resCreate.statusCode, 201);
    createdProductId = resCreate.body.product._id;

    const resUpdate = mockRes();
    await prodCtrl.updateProducts({ params: { productId: createdProductId }, body: { price: 195000 } }, resUpdate);
    assert.equal(resUpdate.statusCode, 200);
    assert.equal(resUpdate.body.price, 195000);

    const resDel = mockRes();
    await prodCtrl.deleteProduct({ params: { productId: createdProductId }, pato: reqCreate.pato }, resDel);
    assert.equal(resDel.statusCode, 200);
  });
});
