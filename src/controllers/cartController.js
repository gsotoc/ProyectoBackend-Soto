import { asyncHandler } from '../middleware/errorMiddleware.js';
import { NotFoundError, ValidationError } from '../utils/CustomErrors.js';

class CartController {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  createCart = asyncHandler(async (req, res) => {
    const cart = await this.cartRepository.createCart();
    res.status(201).json({
      status: 'success',
      payload: cart
    });
  });
  
  cartById = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const cart = await this.cartRepository.getCartById(cid);

    if (!cart) {
      throw new NotFoundError('Carrito no encontrado');
    }

    const cartObj = cart.toObject();

    let total = 0;
    cartObj.products = cartObj.products.map(item => {
      const subtotal = item.quantity * item.productId.price;
      total += subtotal;
      return { 
        ...item, 
        subtotal 
      };
    });

    cartObj.total = total;

    res.render("cart", {
      title: "Mi Carrito",
      cart: cartObj
    });
  });
  
  update = asyncHandler(async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;
    
    if (quantity < 1) {
      throw new ValidationError('La cantidad debe ser al menos 1');
    }
    
    const cart = await this.cartRepository.addProductToCart(cid, pid, quantity);
    
    res.json({
      status: 'success',
      payload: cart
    });
  });
  
  updateCart = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      throw new ValidationError('Se requiere un array de productos');
    }

    const cart = await this.cartRepository.updateCart(cid, products);

    res.json({
      status: 'success',
      payload: cart
    });
  });
  
  updateProductQuantity = asyncHandler(async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      throw new ValidationError('La cantidad debe ser mayor a 0');
    }

    const cart = await this.cartRepository.updateProductQuantity(cid, pid, quantity);
    
    res.json({
      status: 'success',
      payload: cart
    });
  });
  
  removeProduct = asyncHandler(async (req, res) => {
    const { cid, pid } = req.params;
    
    const cart = await this.cartRepository.removeProductFromCart(cid, pid);

    res.json({
      status: 'success',
      payload: cart
    });
  });
  
  clearCart = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    
    const cart = await this.cartRepository.clearCart(cid);

    res.json({
      status: 'success',
      payload: cart
    });
  });
  
  getCarts = asyncHandler(async (req, res) => {
    const carts = await this.cartRepository.getCarts();
    res.json({
      status: "success",
      payload: carts
    });
  });
}

export default CartController;