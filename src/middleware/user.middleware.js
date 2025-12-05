import passport from "passport";
import UserDTO from "../dto/UserDTO.js";

export const attachUserToViews = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (user) {
      const userDTO = new UserDTO(user);   
      res.locals.user = userDTO;           
    } else {
      res.locals.user = null;
    }

    next();
  })(req, res, next);
};
