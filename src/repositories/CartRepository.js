import { NotFoundError, ValidationError } from '../utils/CustomErrors.js';
import CartDTO from '../dto/CartDTO.js';

class CartRepository {
  constructor(cartDao, productRepository) {
    this.cartDao = cartDao;
    this.productRepository = productRepository;
  }

  validateId(id, name = "ID") {
    if (!this.cartDao.isValidId(id)) {
      throw new ValidationError(`${name} inválido`);
    }
  }

  async getCarts() {
    const carts = await this.cartDao.getCarts();
    return carts.map(cart => CartDTO.toSimpleDTO(cart));
  }

  async createCart(products = []) {
    // Validar que los productos existan usando ProductRepository
    for (const p of products) {
      this.validateId(p.productId, "ID de producto");
      await this.productRepository.getProductById(p.productId);
    }

    return this.cartDao.createCart(products);
  }

  async getCartById(cartId) {
    this.validateId(cartId, "ID de carrito");

    const cart = await this.cartDao.getCartById(cartId);
    if (!cart) {
      throw new NotFoundError("Carrito no encontrado");
    }

    // Retornar el documento de Mongoose sin DTO para renderizar vistas
    // Si necesitas DTO, usa getCartByIdDTO()
    return cart;
  }

  // Nuevo método que retorna DTO
  async getCartByIdDTO(cartId) {
    const cart = await this.getCartById(cartId);
    return CartDTO.fromCart(cart);
  }

  async updateCart(cartId, newProducts) {
    this.validateId(cartId, "ID de carrito");

    for (const p of newProducts) {
      this.validateId(p.productId, "ID de producto");
      await this.productRepository.getProductById(p.productId);
    }

    return this.cartDao.updateCart(cartId, newProducts);
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    this.validateId(cartId, "ID de carrito");
    this.validateId(productId, "ID de producto");

    if (quantity < 1) {
      throw new ValidationError("La cantidad debe ser al menos 1");
    }

    // Verificar que el producto existe
    const product = await this.productRepository.getProductById(productId);

    // ✅ Validar stock disponible
    if (product.stock < quantity) {
      throw new ValidationError(`Stock insuficiente. Disponible: ${product.stock}`);
    }

    // Obtener el carrito
    const cart = await this.cartDao.getCartDocument(cartId);
    if (!cart) {
      throw new NotFoundError("Carrito no encontrado");
    }

    // Buscar si el producto ya está en el carrito
    const idx = cart.products.findIndex(
      p => p.productId.toString() === productId
    );

    if (idx !== -1) {
      // Si existe, verificar stock para la nueva cantidad total
      const newTotalQuantity = cart.products[idx].quantity + quantity;
      if (product.stock < newTotalQuantity) {
        throw new ValidationError(`Stock insuficiente. Disponible: ${product.stock}, En carrito: ${cart.products[idx].quantity}`);
      }
      cart.products[idx].quantity = newTotalQuantity;
    } else {
      // Si no existe, agregar nuevo producto
      cart.products.push({ productId, quantity });
    }

    cart.updatedAt = new Date();
    
    await cart.save();
    return cart.populate("products.productId");
  }

  async removeProductFromCart(cartId, productId) {
    this.validateId(cartId, "ID de carrito");
    this.validateId(productId, "ID de producto");

    const result = await this.cartDao.deleteProduct(cartId, productId);
    
    if (!result) {
      throw new NotFoundError("Carrito o producto no encontrado");
    }

    return result;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    this.validateId(cartId, "ID de carrito");
    this.validateId(productId, "ID de producto");

    if (quantity <= 0) {
      throw new ValidationError("La cantidad debe ser mayor a 0");
    }

    // ✅ Validar stock disponible
    const product = await this.productRepository.getProductById(productId);
    if (product.stock < quantity) {
      throw new ValidationError(`Stock insuficiente. Disponible: ${product.stock}`);
    }

    const cart = await this.cartDao.getCartDocument(cartId);
    if (!cart) {
      throw new NotFoundError("Carrito no encontrado");
    }

    const idx = cart.products.findIndex(
      p => p.productId.toString() === productId
    );

    if (idx === -1) {
      throw new NotFoundError("Producto no encontrado en el carrito");
    }

    cart.products[idx].quantity = quantity;
    cart.updatedAt = new Date();

    await cart.save();
    return cart.populate("products.productId");
  }

  async clearCart(cartId) {
    this.validateId(cartId, "ID de carrito");

    const result = await this.cartDao.clearCart(cartId);
    
    if (!result) {
      throw new NotFoundError("Carrito no encontrado");
    }

    return result;
  }
}

export default CartRepository;