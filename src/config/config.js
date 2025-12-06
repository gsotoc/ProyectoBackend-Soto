import dotenv from 'dotenv';
import nodemailer from "nodemailer";

dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI;
export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;



export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

transporter.verify()
  .then(() => {
    console.log('✅ Servidor de correo configurado correctamente');
  })
  .catch((error) => {
    console.error('❌ Error en configuración de correo:', error.message);
    console.log('⚠️  Verifica MAIL_USER y MAIL_PASS en .env');
  });