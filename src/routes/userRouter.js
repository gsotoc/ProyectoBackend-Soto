// src/routes/usersRouter.js

import { Router } from 'express';
import UserDAO from '../dao/UserDao.js';
import UserRepository from '../repositories/UserRepository.js';
import UsersController from '../controllers/UsersController.js';
import { requireAuth, requireRole } from '../middleware/authenticationMiddleware.js';
 


const router = Router();

// Instanciar el repositorio y controlador
const userRepository = new UserRepository(UserDAO);
const controller = new UsersController(userRepository);

// Rutas protegidas (requieren autenticación)
router.use(requireAuth);

// Obtener perfil del usuario actual
router.get('/current', controller.getCurrentUser);

// Rutas solo para administradores
router.get('/', requireRole('admin'), controller.getAllUsers);
router.get('/stats', requireRole('admin'), controller.getUserStats);
router.get('/role/:role', requireRole('admin'), controller.getUsersByRole);

// Rutas específicas por ID
router.get('/:uid', controller.getUserById);
router.put('/:uid', controller.updateUser);
router.delete('/:uid', requireRole('admin'), controller.deleteUser);

export default router;