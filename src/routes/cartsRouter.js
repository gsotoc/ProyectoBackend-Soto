import { Router } from 'express';
import CartDao from '../dao/CartDao.js';
import ProductDao from '../dao/ProductDao.js';
import TicketDao from '../dao/TicketDao.js';
import CartRepository from '../repositories/CartRepository.js';
import ProductRepository from '../repositories/ProductRepository.js';
import TicketRepository from '../repositories/TicketRepository.js';
import CartController from '../controllers/CartController.js';
import PurchaseController from '../controllers/purchaseController.js';
import PurchaseService from '../services/purchaseService.js';
import { requireAuth } from '../middleware/authenticationMiddleware.js';
import { attachUserToViews } from '../middleware/user.middleware.js';

const router = Router();

// Instanciar DAOs
const cartDao = new CartDao();
const productDao = new ProductDao();
const ticketDao = new TicketDao();

// Instanciar Repositories
const productRepository = new ProductRepository(productDao);
const cartRepository = new CartRepository(cartDao, productRepository);
const ticketRepository = new TicketRepository(ticketDao);

// Instanciar Services
const purchaseService = new PurchaseService(
  cartRepository,
  productRepository,
  ticketRepository
);

// Instanciar Controllers
const cartController = new CartController(cartRepository);
const purchaseController = new PurchaseController(purchaseService, cartRepository);

// ============ RUTAS DE CARRITO ============

// Aplicar attachUserToViews a todas las rutas de carrito
router.use(attachUserToViews);

router.post('/', cartController.createCart);
router.get('/', cartController.getCarts);
router.get('/:cid', cartController.cartById);
router.post('/:cid/products/:pid', cartController.update);
router.put('/:cid', cartController.updateCart);
router.put('/:cid/products/:pid', cartController.updateProductQuantity);
router.delete('/:cid/products/:pid', cartController.removeProduct);
router.delete('/:cid', cartController.clearCart);

// ============ RUTAS DE COMPRA (requieren autenticación) ============

// Vista de checkout
router.get('/:cid/checkout', requireAuth, purchaseController.renderCheckout);

// Procesar compra
router.post('/:cid/purchase', requireAuth, purchaseController.processPurchase);

export default router;