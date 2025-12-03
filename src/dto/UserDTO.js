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

}

export default UserDTO;