import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,

  message: {
    status: "error",
    message: "Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos."
  },

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: ipKeyGenerator,

  handler: (req, res) => {
    console.log(`Has excedido el límite de intentos: ${req.ip}`);

    if (req.originalUrl.startsWith("/api/") || req.accepts("json")) {
      return res.status(429).json({
        status: "error",
        message: "Demasiados intentos de inicio de sesión. Intenta de nuevo en 15 minutos.",
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }

    return res.redirect("/api/sessions/login?error=too_many_attempts");
  },

  skipSuccessfulRequests: false
});


export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,

  message: {
    status: "error",
    message: "Demasiados intentos de registro. Intenta de nuevo en 1 hora."
  },

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: ipKeyGenerator,

  handler: (req, res) => {
    console.log(`Has alcanzado el límite de intentos: ${req.ip}`);

    if (req.originalUrl.startsWith("/api/") || req.accepts("json")) {
      return res.status(429).json({
        status: "error",
        message: "Demasiados intentos de registro. Intenta de nuevo en 1 hora.",
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }

    return res.redirect("/api/sessions/register?error=too_many_attempts");
  },

  skipSuccessfulRequests: false
});



export const passwordRecoveryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,

  message: {
    status: "error",
    message: "Demasiadas solicitudes de recuperación. Intenta de nuevo en 15 minutos."
  },

  standardHeaders: true,
  legacyHeaders: false,

  keyGenerator: (req) => {
    const email = req.body?.email || req.query?.email;
    const ipKey = ipKeyGenerator(req);
    return email ? `${email}-${ipKey}` : ipKey;
  },

  handler: (req, res) => {
    const identifier = req.body?.email || req.ip;
    console.log(`Has excedido el límite de intentos: ${identifier}`);

    if (req.originalUrl.startsWith("/api/") || req.accepts("json")) {
      return res.status(429).json({
        status: "error",
        message: "Demasiadas solicitudes de recuperación. Intenta de nuevo en 15 minutos.",
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }

    return res.redirect("/api/sessions/forgot-password?error=too_many_attempts");
  },

  skipSuccessfulRequests: false
});



export const passwordResetLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,

  message: {
    status: "error",
    message: "Demasiados intentos de cambio de contraseña. Intenta de nuevo en 15 minutos."
  },

  standardHeaders: true,
  legacyHeaders: false,

  
  keyGenerator: ipKeyGenerator,

  handler: (req, res) => {
    console.log(`⚠️ Rate limit excedido para reset de contraseña desde IP: ${req.ip}`);

    const token = req.body?.token || req.query?.token;

    if (req.originalUrl.startsWith("/api/") || req.accepts("json")) {
      return res.status(429).json({
        status: "error",
        message: "Demasiados intentos de cambio de contraseña. Intenta de nuevo en 15 minutos.",
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }

    return res.redirect(`/api/sessions/reset-password?token=${token}&error=too_many_attempts`);
  },

  skipSuccessfulRequests: false
});
