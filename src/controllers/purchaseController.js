import { asyncHandler } from '../middleware/errorMiddleware.js';
import { ValidationError, NotFoundError } from '../utils/CustomErrors.js';

class PurchaseController {
  constructor(purchaseService, cartRepository) {
    this.purchaseService = purchaseService;
    this.cartRepository = cartRepository;
  }

  
  renderCheckout = asyncHandler(async (req, res) => {
    const { cid } = req.params;

    const cart = await this.cartRepository.getCartById(cid);
    
    if (!cart || !cart.products || cart.products.length === 0) {
      return res.redirect('/products?error=empty_cart');
    }

    const cartObj = cart.toObject();
    let total = 0;
    cartObj.products = cartObj.products.map(item => {
      const subtotal = item.quantity * item.productId.price;
      total += subtotal;
      return { ...item, subtotal };
    });
    cartObj.total = total;

    const summary = await this.purchaseService.getCartSummary(cid);

    res.render('checkout', {
      title: 'Finalizar Compra',
      cart: cartObj,
      summary
    });
  });

  
  processPurchase = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const userEmail = req.user.email;

    // Procesar la compra
    const result = await this.purchaseService.processPurchase(cid, userEmail);

    // Si la compra fue exitosa (total o parcial)
    if (result.success) {
      const statusCode = result.unavailableProducts.length > 0 ? 207 : 200;
      
      return res.status(statusCode).json({
        status: 'success',
        message: result.message,
        ticket: result.ticket,
        unavailableProducts: result.unavailableProducts
      });
    }

    throw new ValidationError(result.message);
  });
}

export default PurchaseController;
