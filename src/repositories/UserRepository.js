import UserDTO from "../dto/UserDTO.js";

class UserRepository {
  constructor(userDao) {
    this.userDao = userDao;
  }

  // Obtener usuario por email (para login)
  async getUserByEmail(email) {
    const user = await this.userDao.findByEmail(email);
    if (!user) return null;
    return user; // Retornamos el usuario completo para verificar password
  }

  // Obtener usuario por ID (retorna DTO)
  async getUserById(id) {
    const user = await this.userDao.findById(id);
    if (!user) throw new Error("Usuario no encontrado");
    return UserDTO.fromUser(user);
  }

  // Crear usuario
  async createUser(userData) {
    const existingUser = await this.userDao.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("El email ya está registrado");
    }
    
    const newUser = await this.userDao.create(userData);
    return UserDTO.fromUser(newUser);
  }

  // Actualizar usuario
  async updateUser(id, updates) {
    // No permitir actualizar email o password por este método
    const { email, password, ...safeUpdates } = updates;
    
    const updatedUser = await this.userDao.update(id, safeUpdates);
    if (!updatedUser) throw new Error("Usuario no encontrado");
    
    return UserDTO.fromUser(updatedUser);
  }

  // Obtener todos los usuarios (para admin)
  async getAllUsers() {
    const users = await this.userDao.findAll();
    return UserDTO.fromUserArray(users);
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