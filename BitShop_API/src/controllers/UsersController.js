/**
 * ============================================================================
 * CONTROLADOR DE USUARIOS Y AUTENTICACIÓN JWT (UsersController.js)
 * ============================================================================
 * Propósito: Gestionar el CRUD de usuarios y el inicio de sesión (`login`)
 * generando un JSON Web Token (JWT) válido por 2 horas.
 * Mejoras aplicadas:
 * - Hashing seguro de contraseñas con `scrypt` (nunca se retorna `password`).
 * - Prevención de escalada de privilegios (mass assignment en `Permissions`).
 * - Soporte transparente para MongoDB (Mongoose) y respaldo local JSON.
 */

const jwt = require("../utils/jwt");
const User = require("../Models/User");
const { isLocalDb, mongoose } = require("../database");
const { readDb, writeDb, generateObjectId, isValidObjectId } = require("../utils/localDb");
const { hashPassword, verifyPassword } = require("../utils/password");

const JWT_SECRET = process.env.JWT_SECRET_KEY || "bitshop_dev_secret_change_in_prod";

/**
 * Elimina el campo sensible `password` antes de serializar un usuario.
 * @param {object} userDoc
 */
function toSafeUser(userDoc) {
  if (!userDoc) return null;
  const obj = typeof userDoc.toObject === "function" ? userDoc.toObject() : { ...userDoc };
  delete obj.password;
  return obj;
}

function checkId(id) {
  return isLocalDb() ? isValidObjectId(id) : mongoose.Types.ObjectId.isValid(id);
}

/**
 * GET /api/user/get-users (Protegido)
 * Lista todos los usuarios registrados sin exponer contraseñas.
 */
const getUsers = async (req, res) => {
  try {
    if (isLocalDb()) {
      const users = readDb().users.map(toSafeUser);
      return res.status(200).json(users);
    }
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ msj: "Error al obtener usuarios", error: error.message });
  }
};

/**
 * GET /api/user/get-one-user/:userId (Protegido)
 * Consulta un usuario específico por `:userId` sin exponer su contraseña.
 */
const getOneUser = async (req, res) => {
  try {
    const id = req.params.userId;
    if (!checkId(id)) {
      return res.status(400).json({ msj: "ID de usuario inválido" });
    }

    const user = isLocalDb()
      ? toSafeUser(readDb().users.find((u) => u._id === id))
      : await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ msj: "El usuario no existe" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ msj: "Error al consultar el id", error: error.message });
  }
};

/**
 * POST /api/user/create-user (Registro público)
 * Registra un nuevo usuario con contraseña hasheada. Por seguridad, fuerza
 * `Permissions.admin = false` en registros públicos para evitar escalada de privilegios.
 */
const createUsers = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body || {};

    if (!username || !email || !password || !phone) {
      return res.status(400).json({
        status: "Datos incompletos",
        msj: "Los campos username, email, password y phone son obligatorios",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const safePermissions = {
      admin: false,
      client: true,
      verified: false,
    };

    if (isLocalDb()) {
      const db = readDb();
      if (db.users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
        return res.status(409).json({ status: "El correo ya está registrado" });
      }
      const now = new Date().toISOString();
      const newUser = {
        _id: generateObjectId(),
        username: String(username).trim(),
        email: normalizedEmail,
        password: hashPassword(password),
        phone: String(phone).trim(),
        Permissions: safePermissions,
        createdAt: now,
        updatedAt: now,
      };
      db.users.push(newUser);
      writeDb(db);
      return res.status(201).json({ status: "Usuario creado correctamente", user: toSafeUser(newUser) });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({ status: "El correo ya está registrado" });
    }

    const user = new User({
      username: String(username).trim(),
      email: normalizedEmail,
      password: hashPassword(password),
      phone: String(phone).trim(),
      Permissions: safePermissions,
    });
    await user.save();
    return res.status(201).json({ status: "Usuario creado correctamente", user: toSafeUser(user) });
  } catch (error) {
    return res.status(400).json({ status: "Usuario no creado correctamente", error: error.message });
  }
};

/**
 * PUT /api/user/update-user/:userId (Protegido)
 * Actualiza datos permitidos de un usuario. Solo un `admin` puede modificar `Permissions`.
 */
const updateUsers = async (req, res) => {
  try {
    const id = req.params.userId;
    if (!checkId(id)) {
      return res.status(400).json({ msj: "ID de usuario inválido" });
    }

    const isAdmin = Boolean(req.pato && req.pato.permissions && req.pato.permissions.admin);
    const isSelf = req.pato && String(req.pato.user_id) === String(id);
    if (!isAdmin && !isSelf) {
      return res.status(403).json({ msj: "No tienes permisos para modificar este usuario" });
    }

    const { username, email, password, phone, Permissions } = req.body || {};
    const updates = {};
    if (username !== undefined) updates.username = String(username).trim();
    if (email !== undefined) updates.email = String(email).trim().toLowerCase();
    if (phone !== undefined) updates.phone = String(phone).trim();
    if (password !== undefined && String(password).length > 0) {
      updates.password = hashPassword(password);
    }
    if (Permissions !== undefined && isAdmin) {
      updates.Permissions = {
        admin: Boolean(Permissions.admin),
        client: Permissions.client !== undefined ? Boolean(Permissions.client) : true,
        verified: Boolean(Permissions.verified),
      };
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ msj: "No se enviaron campos válidos para actualizar" });
    }

    if (isLocalDb()) {
      const db = readDb();
      const index = db.users.findIndex((u) => u._id === id);
      if (index === -1) {
        return res.status(404).json({ msj: "El usuario no existe" });
      }
      db.users[index] = {
        ...db.users[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      writeDb(db);
      return res.status(200).json(toSafeUser(db.users[index]));
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ msj: "El usuario no existe" });
    }
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ msj: "Actualización fallida", error: error.message });
  }
};

/**
 * DELETE /api/user/delete-user/:userId (Protegido - solo admin)
 * Elimina un usuario de la base de datos por `:userId`.
 */
const deleteUser = async (req, res) => {
  try {
    const id = req.params.userId;
    if (!checkId(id)) {
      return res.status(400).json({ msj: "ID de usuario inválido" });
    }

    const isAdmin = Boolean(req.pato && req.pato.permissions && req.pato.permissions.admin);
    if (!isAdmin) {
      return res.status(403).json({ msj: "Solo un administrador puede eliminar usuarios" });
    }

    if (isLocalDb()) {
      const db = readDb();
      const index = db.users.findIndex((u) => u._id === id);
      if (index === -1) {
        return res.status(404).json({ msj: "El usuario no existe" });
      }
      db.users.splice(index, 1);
      writeDb(db);
      return res.status(200).json({ msj: "Usuario eliminado" });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ msj: "El usuario no existe" });
    }
    return res.status(200).json({ msj: "Usuario eliminado" });
  } catch (error) {
    return res.status(400).json({ msj: "Eliminación fallida", error: error.message });
  }
};

/**
 * POST /api/user/login
 * Autentica un usuario por email y contraseña y emite un token JWT válido por 2h.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ err: "Uno o más campos están vacíos" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = isLocalDb()
      ? readDb().users.find((u) => u.email.toLowerCase() === normalizedEmail)
      : await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ err: "El usuario no existe" });
    }

    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({ err: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      {
        user_id: user._id,
        email: user.email,
        username: user.username,
        phone: user.phone,
        permissions: user.Permissions,
      },
      JWT_SECRET,
      { expiresInSeconds: 7200 }
    );

    return res.status(200).json({
      status: "Sesión iniciada",
      token,
      user: toSafeUser(user),
    });
  } catch (err) {
    return res.status(500).json({ err: err.message || "Error interno al iniciar sesión" });
  }
};

module.exports = {
  getUsers,
  getOneUser,
  createUsers,
  updateUsers,
  deleteUser,
  login,
};
