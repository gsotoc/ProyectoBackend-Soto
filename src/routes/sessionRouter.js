import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/JwtHelper.js";

const router = Router();


router.post(
  "/register",
  passport.authenticate("register", { session: false }),
  (req, res) => {
    res.status(201).send({
      status: "success",
      message: "Usuario registrado correctamente"
    });
  }
);

// Login con JWT
router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  (req, res) => {
    const user = req.user;
    const token = generateToken(user);
    res.send({
      status: "success",
      message: "Login exitoso",
      token
    });
  }
);

// Ruta protegida /current
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send({
      status: "success",
      user: {
        id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        role: req.user.role
      }
    });
  }
);

export default router;
