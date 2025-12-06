import { asyncHandler } from '../middleware/errorMiddleware.js';
import { NotFoundError, ForbiddenError } from '../utils/CustomErrors.js';
import UserDTO from '../dto/UserDTO.js';

class UsersController {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // Obtener todos los usuarios (solo admin)
  getAllUsers = asyncHandler(async (req, res) => {
    const users = await this.userRepository.getAllUsers();
    
    res.json({
      status: 'success',
      payload: users // Ya viene como DTOs desde el repository
    });
  });

  // Obtener usuario por ID
  getUserById = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const user = await this.userRepository.getUserById(uid);
    
    res.json({
      status: 'success',
      payload: user // Ya viene como DTO desde el repository
    });
  });

  // Actualizar usuario
  updateUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    
    // Solo el propio usuario o admin puede actualizar
    if (req.user.id !== uid && req.user.role !== 'admin') {
      throw new ForbiddenError('No tienes permiso para actualizar este usuario');
    }
    
    const updatedUser = await this.userRepository.updateUser(uid, req.body);
    
    res.json({
      status: 'success',
      payload: updatedUser
    });
  });

  // Obtener perfil del usuario actual
  getCurrentUser = asyncHandler(async (req, res) => {
    // req.user viene del middleware de autenticación
    const user = await this.userRepository.getUserById(req.user._id || req.user.id);
    
    res.json({
      status: 'success',
      payload: user
    });
  });

  // Obtener usuarios por rol (solo admin)
  getUsersByRole = asyncHandler(async (req, res) => {
    const { role } = req.params;
    
    if (!['user', 'admin'].includes(role)) {
      throw new ValidationError('Rol inválido. Debe ser "user" o "admin"');
    }
    
    const users = await this.userRepository.getUsersByRole(role);
    
    res.json({
      status: 'success',
      payload: users
    });
  });

}

export default UsersController;
