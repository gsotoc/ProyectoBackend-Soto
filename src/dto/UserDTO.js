class UserDTO {
  constructor(user) {
    this.id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.role = user.role;
    this.full_name = `${user.first_name} ${user.last_name}`;
  }

  // Método estático para convertir un usuario a DTO
  static fromUser(user) {
    if (!user) return null;
    return new UserDTO(user);
  }

  // Método estático para convertir array de usuarios
  static fromUserArray(users) {
    if (!users || !Array.isArray(users)) return [];
    return users.map(user => new UserDTO(user));
  }

  // DTO público (sin información sensible para otros usuarios)
  static toPublicDTO(user) {
    return {
      id: user._id,
      full_name: `${user.first_name} ${user.last_name}`,
      role: user.role
    };
  }

  // DTO para autenticación (incluye en el token)
  static toAuthDTO(user) {
    return {
      id: user._id,
      email: user.email,
      role: user.role
    };
  }
};

export default UserDTO;

