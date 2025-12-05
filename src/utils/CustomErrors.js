class CustomError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Errores específicos
class NotFoundError extends CustomError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

class ValidationError extends CustomError {
  constructor(message = 'Error de validación') {
    super(message, 400);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = 'No autorizado') {
    super(message, 401);
  }
}

class ForbiddenError extends CustomError {
  constructor(message = 'Acceso prohibido') {
    super(message, 403);
  }
}

class ConflictError extends CustomError {
  constructor(message = 'Conflicto con el estado actual') {
    super(message, 409);
  }
}

class InternalServerError extends CustomError {
  constructor(message = 'Error interno del servidor') {
    super(message, 500);
  }
}

export {
  CustomError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError
};