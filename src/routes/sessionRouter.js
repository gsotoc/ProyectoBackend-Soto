import { Router } from "express";
import passport from "passport";
import {
  renderRegister,
  renderLogin,
  registerUser,
  logoutUser,
  loginUser,
  getCurrentUser
} from "../controllers/sessionsController.js";
import { requireAuth } from "../middleware/authenticationMiddleware.js";
import { validateRegister } from "../middleware/validation.register.js";
import {
  renderForgotPassword,
  requestPasswordReset,
  renderResetPassword,
  resetPassword
} from "../controllers/passwordRecoveryController.js";
import { loginLimiter, registerLimiter, passwordRecoveryLimiter, passwordResetLimiter } from '../middleware/rateLimitMiddleware.js';

const router = Router();

// ============ RUTAS DE VISTAS (GET) ============

router.get("/register", renderRegister);
router.get("/login", renderLogin);
router.get("/forgot-password", renderForgotPassword);
router.get("/reset-password", renderResetPassword);

// Perfil del usuario actual (requiere autenticación)
router.get("/current", requireAuth, getCurrentUser);

// ============ RUTAS DE PROCESAMIENTO (POST) ============

// Registro
router.post("/register", 
  validateRegister, 
  registerLimiter,
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/sessions/register?error=user_exists"
  }),
  registerUser
);

// Login
router.post("/login", 
  loginLimiter,
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/api/sessions/login?error=1"
  }),
  loginUser
);

// Logout
router.post("/logout", logoutUser);

// Recuperación de contraseña
router.post("/forgot-password", passwordRecoveryLimiter, requestPasswordReset);
router.post("/reset-password", passwordResetLimiter, resetPassword);

export default router;