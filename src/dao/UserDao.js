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
}

export default new UserDAO();
