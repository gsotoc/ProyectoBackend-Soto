import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';
import { transporter } from '../config/config.js';
import userDAO from '../dao/UserDao.js';
import { NotFoundError, ValidationError } from '../utils/CustomErrors.js';
import bcrypt from 'bcrypt';

class PasswordRecovery {
  constructor() {
    this.transporter = transporter; 
  }

  generateRecoveryToken(userId, email) {
    return jwt.sign(
      { 
        id: userId, 
        email,
        type: 'password-recovery'
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  }

  verifyRecoveryToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      if (decoded.type !== 'password-recovery') {
        throw new ValidationError('Token inválido');
      }
      
      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ValidationError('El enlace ha expirado. Solicita uno nuevo.');
      }
      throw new ValidationError('Token inválido o manipulado');
    }
  }

  async requestPasswordReset(email) {
    const user = await userDAO.getByEmail(email);
    
    if (!user) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return {
        success: true,
        message: 'Si el correo existe, recibirás instrucciones para recuperar tu contraseña'
      };
    }

    const resetToken = this.generateRecoveryToken(user._id, user.email);

    const resetLink = `${process.env.APP_URL || 'http://localhost:8080'}/api/sessions/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de Contraseña',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Recuperación de Contraseña</h1>
              </div>
              <div class="content">
                <p>Hola <strong>${user.first_name}</strong>,</p>
                <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, puedes ignorar este correo.</p>
                <p>Para restablecer tu contraseña, haz clic en el siguiente botón:</p>
                <div>
                  <a href="${resetLink}">Restablecer Contraseña</a>
                </div>
                <p>O copia y pega este enlace en tu navegador:</p>
                <p>${resetLink}</p>
                <p>⚠️ Este enlace expirará en 1 hora.</p>
              </div>
              <div class="footer">
                <p>Si no solicitaste este cambio, ignora este correo.</p>
                <p> ${new Date().getFullYear()} Esto es un proyecto estudiantil.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Email de recuperación enviado a:', email);
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      throw new Error('No se pudo enviar el correo de recuperación');
    }

    return {
      success: true,
      message: 'Si el correo existe, recibirás instrucciones para recuperar tu contraseña'
    };
  }

  async resetPassword(token, newPassword) {
    const decoded = this.verifyRecoveryToken(token);

    if (!newPassword || newPassword.length < 8) {
      throw new ValidationError('La contraseña debe tener al menos 8 caracteres');
    }

    const user = await userDAO.getById(decoded.id);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const isSamePassword = bcrypt.compareSync(newPassword, user.password);
    if (isSamePassword) {
      throw new ValidationError('La nueva contraseña debe ser diferente a la actual');
    }

    user.password = newPassword;
    await user.save();

    console.log('✅ Contraseña actualizada para:', user.email);

    return {
      success: true,
      message: 'Contraseña actualizada correctamente'
    };
  }
}

export default new PasswordRecovery();