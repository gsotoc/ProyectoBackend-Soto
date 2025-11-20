import { Router } from 'express';
import CartDao from '../dao/CartDao.js';
import CartRepository from '../repositories/CartRepository.js';
import CartController from '../controllers/CartController.js';

const router = Router();

const dao = new CartDao();
const repository = new CartRepository(dao);
const controller = new CartController(repository);

router.post('/', controller.createCart);
router.get('/', controller.getCarts);
router.get('/:cid', controller.cartById);
router.post('/:cid/products/:pid', controller.update);
router.put('/:cid', controller.updateCart);
router.put('/:cid/products/:pid', controller.updateProductQuantity);
router.delete('/:cid/products/:pid', controller.removeProduct);
router.delete('/:cid', controller.clearCart);

export default router;