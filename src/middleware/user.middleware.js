import passport from "passport";
import UserDTO from "../dto/UserDTO.js";

export const attachUserToViews = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    // Debug log
    console.log("👤 attachUserToViews - URL:", req.originalUrl);
    console.log("👤 attachUserToViews - User found:", user ? user.email : "No user");
    
    if (err) {
      console.error("❌ Error en attachUserToViews:", err);
    }

    if (user) {
      const userDTO = new UserDTO(user);   
      res.locals.user = userDTO;
      console.log("✅ User attached to locals:", userDTO.email);
    } else {
      res.locals.user = null;
      console.log("⚠️  No user attached to locals");
    }

    next();
  })(req, res, next);
};