/**
 * ============================================================================
 * CONTROLADOR DE USUARIOS Y AUTENTICACIÓN JWT (UsersController.js)
 * ============================================================================
 * Propósito: Gestionar el CRUD de usuarios y el inicio de sesión (`login`)
 * generando un JSON Web Token (JWT) firmado con `process.env.JWT_SECRET_KEY`
 * y validez de 2 horas, incluyendo en el payload los permisos del usuario.
 */

const User = require("../Models/User");
const jwt = require("jsonwebtoken");

/**
 * Lista todos los usuarios registrados en la base de datos.
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msj: "Error al obtener usuarios", error });
  }
};

/**
 * Consulta un usuario específico por su `:userId`.
 */
const getOneUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);
    res.status(user ? 200 : 404).json(user ? user : { msj: "El usuario no existe" });
  } catch (error) {
    res.status(400).json({ msj: "Error al consultar el id", error });
  }
};

/**
 * Registra un nuevo usuario en la colección `users`.
 */
const createUsers = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ status: "Usuario creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "Usuario no creado correctamente", error });
  }
};

/**
 * Actualiza los datos de un usuario existente por `:userId`.
 */
const updateUsers = async (req, res) => {
  try {
    const id = req.params.userId;
    const updated = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ msj: "Actualización fallida", error });
  }
};

/**
 * Elimina un usuario de la base de datos por `:userId`.
 */
const deleteUser = async (req, res) => {
  try {
    const id = req.params.userId;
    await User.findByIdAndDelete(id);
    res.status(200).json({ msj: "Usuario eliminado" });
  } catch (error) {
    res.status(400).json({ msj: "Eliminación fallida", error });
  }
};

/**
 * Autentica un usuario por email y contraseña y emite un token JWT válido por 2h.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw "Uno o más campos están vacíos";

    const user = await User.findOne({ email });

    if (user) {
      if (password === user.password) {
        // Generar token JWT con datos del perfil y objeto de permisos
        const token = jwt.sign(
          {
            user_id: user._id,
            email,
            username: user.username,
            phone: user.phone,
            permissions: user.Permissions
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "2h" }
        );

        return res.status(200).json({ status: "Sesión iniciada", token });
      }

      throw "Credenciales inválidas";
    }

    throw "El usuario no existe";
  } catch (err) {
    res.status(401).json({ err });
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
