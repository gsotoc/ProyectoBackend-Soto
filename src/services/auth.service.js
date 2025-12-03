import userDAO from "../dao/UserDao.js";
import { generateToken } from "../utils/JwtHelper.js";

class AuthService {
  async register(userData) {
    const user = await userDAO.create(userData);
    return user;
  }

  async login(user) {
    const token = generateToken(user);
    return token;
  }

  async getCurrentUser(userId) {
    return userDAO.getById(userId);
  }
}

export default new AuthService();
