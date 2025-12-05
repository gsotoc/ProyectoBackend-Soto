import UserDTO from "../dto/UserDTO.js";
import { NotFoundError, ConflictError } from "../utils/CustomErrors.js";

class UserRepository {
  constructor(userDao) {
    this.userDao = userDao;
  }

  // Obtener usuario por email (para login) - retorna usuario completo sin DTO
  async getUserByEmail(email) {
    const user = await this.userDao.getByEmail(email);
    return user; // Retornamos el usuario completo para verificar password
  }

  // Obtener usuario por ID (retorna DTO)
  async getUserById(id) {
    const user = await this.userDao.getById(id);
    if (!user) throw new NotFoundError("Usuario no encontrado");
    return UserDTO.fromUser(user);
  }

  // Crear usuario (retorna DTO)
  async createUser(userData) {
    const existingUser = await this.userDao.exists(userData.email);
    if (existingUser) {
      throw new ConflictError("El email ya está registrado");
    }
    
    const newUser = await this.userDao.create(userData);
    return UserDTO.fromUser(newUser);
  }

  // Actualizar usuario (retorna DTO)
  async updateUser(id, updates) {
    // No permitir actualizar email o password por este método
    const { email, password, role, ...safeUpdates } = updates;
    
    const updatedUser = await this.userDao.update(id, safeUpdates);
    if (!updatedUser) throw new NotFoundError("Usuario no encontrado");
    
    return UserDTO.fromUser(updatedUser);
  }

  // Eliminar usuario
  async deleteUser(id) {
    const deletedUser = await this.userDao.delete(id);
    if (!deletedUser) throw new NotFoundError("Usuario no encontrado");
    return true;
  }

  // Obtener todos los usuarios (para admin) - retorna DTOs
  async getAllUsers() {
    const users = await this.userDao.findAll();
    return UserDTO.fromUserArray(users);
  }

  // Obtener usuarios por rol
  async getUsersByRole(role) {
    const users = await this.userDao.findByRole(role);
    return UserDTO.fromUserArray(users);
  }

  // Contar usuarios
  async countUsers(filter = {}) {
    return this.userDao.count(filter);
  }

  // Verificar si el usuario es admin
  isAdmin(user) {
    return user.role === "admin";
  }

  // Verificar si el usuario es un user normal
  isUser(user) {
    return user.role === "user";
  }
}

export default UserRepository;