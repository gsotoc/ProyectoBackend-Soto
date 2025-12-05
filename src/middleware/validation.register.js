import {body, validationResult} from 'express-validator';


export const validateRegister = [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido.'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),
    body('age').isInt({ min: 0 }).withMessage('La edad debe ser un número positivo.'),
 
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map(err => err.msg);
        return res.status(400).json({ errors: messages });
    }
    next();
  }
];