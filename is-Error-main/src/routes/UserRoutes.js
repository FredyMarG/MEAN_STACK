/**
 * ============================================================================
 * ENRUTADOR DE USUARIOS (is-Error-main/src/routes/UserRoutes.js)
 * ============================================================================
 * Propósito: Definir los endpoints REST bajo `/api/user` para gestión de
 * usuarios y autenticación (`POST /api/user/login`).
 */

const express = require("express");
const router = express.Router();

const usersControllers = require("../controllers/UsersController");

router.get("/get-users", usersControllers.getUsers);
router.post("/create-user", usersControllers.createUsers);
router.put("/update-user/:userId", usersControllers.updateUsers);
router.get("/get-one-user/:userId", usersControllers.getOneUser);
router.delete("/delete-user/:userId", usersControllers.deleteUser);
router.post("/login", usersControllers.login);

module.exports = router;
