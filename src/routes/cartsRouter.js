import { Router } from 'express';
import CartDao from '../dao/CartDao.js';
import ProductDao from '../dao/ProductDao.js';
import CartRepository from '../repositories/CartRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import CartController from '../controllers/CartController.js';

const router = Router();

// ✅ Instanciar ambos DAOs
const cartDao = new CartDao();
const productDao = new ProductDao();

// ✅ Instanciar ProductRepository primero
const productRepository = new ProductRepository(productDao);

// ✅ Inyectar ProductRepository en CartRepository
const cartRepository = new CartRepository(cartDao, productRepository);

// ✅ Instanciar Controller con CartRepository
const controller = new CartController(cartRepository);

// Definir rutas
router.post('/', controller.createCart);
router.get('/', controller.getCarts);
router.get('/:cid', controller.cartById);
router.post('/:cid/products/:pid', controller.update);
router.put('/:cid', controller.updateCart);
router.put('/:cid/products/:pid', controller.updateProductQuantity);
router.delete('/:cid/products/:pid', controller.removeProduct);
router.delete('/:cid', controller.clearCart);

export default router;