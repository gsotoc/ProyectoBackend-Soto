import { CustomError, NotFoundError } from '../utils/CustomErrors.js';

// Middleware para rutas no encontradas (404)
export const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Ruta no encontrada: ${req.originalUrl}`));
};

// Middleware principal de manejo de errores
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV !== "production") {
    console.error("❌ ERROR:", err);
  }

  if (err.name === "CastError") {
    err.message = "ID inválido";
    err.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(e => e.message);
    err.message = `Error de validación: ${errors.join(", ")}`;
    err.statusCode = 400;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    err.message = `Ya existe un registro con ese ${field}`;
    err.statusCode = 409;
  }

  if (err.name === "JsonWebTokenError") {
    err.message = "Token inválido";
    err.statusCode = 401;
  }

  if (err.name === "TokenExpiredError") {
    err.message = "Token expirado";
    err.statusCode = 401;
  }

  // ✅ DETECTAR SI ES UNA RUTA DE VISTA O API
  const isApi = req.originalUrl.startsWith("/api");

  // ✅ DESARROLLO
  if (process.env.NODE_ENV !== "production") {
    if (isApi) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
      });
    }

    return res.status(err.statusCode).render("error", {
      message: err.message,
      statusCode: err.statusCode
    });
  }

  // ✅ PRODUCCIÓN
  if (err instanceof CustomError || err.isOperational) {
    if (isApi) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }

    return res.status(err.statusCode).render("error", {
      message: err.message
    });
  }

  console.error("💥 ERROR CRÍTICO:", err);

  if (isApi) {
    return res.status(500).json({
      status: "error",
      message: "Algo salió mal en el servidor"
    });
  }

  return res.status(500).render("error", {
    message: "Ocurrió un error inesperado"
  });
};

// Wrapper para funciones async (elimina la necesidad de try-catch)
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};