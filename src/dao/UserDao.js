import User from "../models/User.js";

class UserDAO {
  async getByEmail(email) {
    return User.findOne({ email });
  }

  async getById(id) {
    return User.findById(id);
  }

  async create(userData) {
    return User.create(userData);
  }

  async update(id, updates) {
    return User.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );
  }

  async delete(id) {
    return User.findByIdAndDelete(id);
  }

  async findAll() {
    return User.find().select('-password').lean();
  }

  async findByRole(role) {
    return User.find({ role }).select('-password').lean();
  }

  // Verificar si existe un usuario por email
  async exists(email) {
    const user = await User.findOne({ email }).select('_id');
    return !!user;
  }

}

export default new UserDAO();