import { asyncHandler } from '../middleware/errorMiddleware.js';
import passwordRecoveryService from '../services/password.recovery.js';

// Renderizar vista para solicitar recuperación
export const renderForgotPassword = (req, res) => {
  res.render('forgot-password', {
    error: req.query.error,
    success: req.query.success
  });
};

// Procesar solicitud de recuperación
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.redirect('/api/sessions/forgot-password?error=email_required');
  }

  await passwordRecoveryService.requestPasswordReset(email);

  res.redirect('/api/sessions/forgot-password?success=email_sent');
});

// Renderizar vista para restablecer contraseña
export const renderResetPassword = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.redirect('/api/sessions/forgot-password?error=invalid_token');
  }

  // Verificar que el token sea válido antes de mostrar el formulario
  try {
    passwordRecoveryService.verifyRecoveryToken(token);
    
    res.render('reset-password', {
      token,
      error: req.query.error
    });
  } catch (error) {
    return res.redirect('/api/sessions/forgot-password?error=token_expired');
  }
});

// Procesar restablecimiento de contraseña
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password, confirmPassword } = req.body;

  // Validaciones
  if (!token || !password || !confirmPassword) {
    return res.redirect(`/api/sessions/reset-password?token=${token}&error=missing_fields`);
  }

  if (password !== confirmPassword) {
    return res.redirect(`/api/sessions/reset-password?token=${token}&error=passwords_dont_match`);
  }

  if (password.length < 8) {
    return res.redirect(`/api/sessions/reset-password?token=${token}&error=password_too_short`);
  }

  try {
    await passwordRecoveryService.resetPassword(token, password);
    res.redirect('/api/sessions/login?success=password_reset');
  } catch (error) {
    if (error.message.includes('diferente')) {
      return res.redirect(`/api/sessions/reset-password?token=${token}&error=same_password`);
    }
    throw error;
  }
});