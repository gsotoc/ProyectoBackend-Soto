import passport from "passport";
import { UnauthorizedError, ForbiddenError } from "../utils/CustomErrors.js";

export const requireAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      // Si es una petición de API (JSON), lanzar error
      if (req.originalUrl.startsWith('/api/') || req.accepts('json')) {
        return next(new UnauthorizedError('Debes iniciar sesión'));
      }
      
      // Si es una vista, redirigir al login
      return res.redirect("/api/sessions/login");
    }

    req.user = user;
    res.locals.user = user;
    next();
  })(req, res, next);
};

// ✅ Nuevo middleware para verificar roles
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new UnauthorizedError('Debes iniciar sesión'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('No tienes permisos para realizar esta acción'));
    }

    next();
  };
};