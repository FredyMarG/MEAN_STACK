/**
 * ============================================================================
 * ENRUTADOR DE USUARIOS (is-Error-main/src/routes/UserRoutes.js)
 * ============================================================================
 * Propósito: Definir los endpoints REST bajo `/api/user` para gestión de
 * usuarios y autenticación (`POST /api/user/login`).
 * Las rutas de consulta, actualización y eliminación requieren token JWT válido.
 */

const express = require("express");
const router = express.Router();

const usersControllers = require("../controllers/UsersController");
const auth = require("../middlewares/auth");

// Rutas públicas de autenticación y registro
router.post("/login", usersControllers.login);
router.post("/create-user", usersControllers.createUsers);

// Rutas protegidas por token JWT
router.get("/get-users", auth, usersControllers.getUsers);
router.get("/get-one-user/:userId", auth, usersControllers.getOneUser);
router.put("/update-user/:userId", auth, usersControllers.updateUsers);
router.delete("/delete-user/:userId", auth, usersControllers.deleteUser);

module.exports = router;
