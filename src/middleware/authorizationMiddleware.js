export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("No autenticado");
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send("No autorizado");
    }

    next();
  };
};
