import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};
