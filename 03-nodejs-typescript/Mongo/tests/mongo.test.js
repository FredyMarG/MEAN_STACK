/**
 * ============================================================================
 * PRUEBAS AUTOMATIZADAS — SIMULADOR MONGODB (Mongo/tests/mongo.test.js)
 * ============================================================================
 * Propósito: Validar operadores de consulta (`$eq`, `$ne`, `$gt`, `$gte`, `$lt`,
 * `$lte`, `$in`, `$or`), actualización (`$set`, `$inc`, `$unset`, `$push`),
 * conteo (`countDocuments`) y eliminación en `LocalCollection`.
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { LocalCollection } = require("../run-mongo-demo");

describe("Mongo LocalCollection (DBZ-V2)", () => {
  it("soporta insertOne, insertMany, findOne y countDocuments", () => {
    const col = new LocalCollection("characters");
    col.insertOne({ name: "Vegeta", species: "Saiyan", edad: 52, powerLevel: 950000 });
    col.insertMany([
      { name: "Piccolo", species: "Namekian", edad: 87, powerLevel: 790000 },
      { name: "Pan", species: "Saiyan", edad: 16, powerLevel: 320000 },
    ]);

    assert.equal(col.countDocuments(), 3);
    assert.equal(col.findOne({ name: "Piccolo" }).species, "Namekian");
  });

  it("evalúa correctamente $eq, $ne, $gte, $lt, $in y $or", () => {
    const col = new LocalCollection("characters", [
      { name: "Vegeta", species: "Saiyan", edad: 52, powerLevel: 950000 },
      { name: "Piccolo", species: "Namekian", edad: 87, powerLevel: 790000 },
      { name: "Pan", species: "Saiyan", edad: 16, powerLevel: 320000 },
    ]);

    assert.equal(col.countDocuments({ species: { $ne: "Saiyan" } }), 1);
    assert.equal(col.countDocuments({ powerLevel: { $gte: 790000 } }), 2);
    assert.equal(col.countDocuments({ edad: { $lt: 20 } }), 1);
    assert.equal(col.countDocuments({ name: { $in: ["Vegeta", "Pan"] } }), 2);
    assert.equal(col.countDocuments({ $or: [{ species: "Namekian" }, { edad: { $lt: 20 } }] }), 2);
  });

  it("aplica $set, $inc, $unset, $push y deleteOne/deleteMany", () => {
    const col = new LocalCollection("characters", [
      { _id: "1", name: "Vegeta", edad: 52, powerLevel: 950000, temp: true },
    ]);

    col.updateOne(
      { _id: "1" },
      { $set: { powerLevel: 1200000 }, $inc: { edad: 1 }, $unset: { temp: "" }, $push: { forms: "SSJ" } }
    );
    const updated = col.findOne({ _id: "1" });
    assert.equal(updated.powerLevel, 1200000);
    assert.equal(updated.edad, 53);
    assert.equal(updated.temp, undefined);
    assert.deepEqual(updated.forms, ["SSJ"]);

    const del = col.deleteOne({ _id: "1" });
    assert.equal(del.deletedCount, 1);
    assert.equal(col.countDocuments(), 0);
  });
});
