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

const router = Router();

router.get("/register", renderRegister);
router.get("/login", renderLogin);

router.post(
  "/register",
  passport.authenticate("register", {
    session: false,
    failureRedirect: "/api/sessions/register?error=user_exists"
  }),
  registerUser
);

router.post(
  "/login",
  passport.authenticate("login", {
    session: false,
    failureRedirect: "/api/sessions/login?error=1"
  }),
  loginUser
);

router.get("/current", requireAuth, getCurrentUser, (req, res) => {
  const userDTO = new UserDTO(req.user);

  res.render("profile", {
    user: userDTO
  });
});

router.post("/logout", logoutUser);

export default router;
