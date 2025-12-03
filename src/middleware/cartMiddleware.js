import CartDao from "../dao/CartDao.js";
import CartRepository from "../repositories/CartRepository.js";

const dao = new CartDao();
const cartRepository = new CartRepository(dao);

export const cartExists = async (req, res, next) => {
  try {
    // Si ya existe un carrito en la sesión, verificar que existe en la BD
    if (req.session.cartId) {
      try {
        await cartRepository.getCartById(req.session.cartId);
        return next();
      } catch (error) {
        console.log('Carrito de sesión no encontrado en BD, creando uno nuevo.');
      }
    }

    // Crear nuevo carrito
    const newCart = await cartRepository.createCart();
    req.session.cartId = newCart._id.toString();
    
    console.log('Nuevo carrito creado:', req.session.cartId);
    next();
  } catch (error) {
    console.error('Error en middleware de carrito:', error);
    next();
  }
};

export const addCartToLocals = (req, res, next) => {
  res.locals.cartId = req.session.cartId || null;
  next();
};