class CartRepository {
  constructor(cartDao, productRepository) {
    this.cartDao = cartDao;
    this.productRepository = productRepository;
  }

  validateId(id, name = "ID") {
    if (!this.cartDao.isValidId(id)) {
      throw new Error(`${name} inválido`);
    }
  }

  async getCarts() {
    return this.cartDao.getCarts();
  }

  async createCart(products = []) {
    // Validar que los productos existan usando ProductRepository
    for (const p of products) {
      this.validateId(p.productId, "ID de producto");
      
      // ✅ Usar ProductRepository en lugar del modelo
      await this.productRepository.getProductById(p.productId);
    }

    return this.cartDao.createCart(products);
  }

  async getCartById(cartId) {
    this.validateId(cartId, "ID de carrito");

    const cart = await this.cartDao.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    return cart;
  }

  async updateCart(cartId, newProducts) {
    this.validateId(cartId, "ID de carrito");

    for (const p of newProducts) {
      this.validateId(p.productId, "ID de producto");
      
      // ✅ Usar ProductRepository
      await this.productRepository.getProductById(p.productId);
    }

    return this.cartDao.updateCart(cartId, newProducts);
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    this.validateId(cartId, "ID de carrito");
    this.validateId(productId, "ID de producto");

    // ✅ Verificar que el producto existe usando ProductRepository
    await this.productRepository.getProductById(productId);

    // Obtener el carrito
    const cart = await this.cartDao.getCartDocument(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    // Buscar si el producto ya está en el carrito
    const idx = cart.products.findIndex(
      p => p.productId.toString() === productId
    );

    if (idx !== -1) {
      // Si existe, incrementar cantidad
      cart.products[idx].quantity += quantity;
    } else {
      // Si no existe, agregar nuevo producto
      cart.products.push({ productId, quantity });
    }

    cart.updatedAt = new Date();
    
    // Guardar y hacer populate
    await cart.save();
    return cart.populate("products.productId");
  }

  async removeProductFromCart(cartId, productId) {
    this.validateId(cartId, "ID de carrito");
    this.validateId(productId, "ID de producto");

    return this.cartDao.deleteProduct(cartId, productId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    this.validateId(cartId, "ID de carrito");
    this.validateId(productId, "ID de producto");

    if (quantity <= 0) throw new Error("La cantidad debe ser mayor a 0");

    const cart = await this.cartDao.getCartDocument(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const idx = cart.products.findIndex(
      p => p.productId.toString() === productId
    );

    if (idx === -1)
      throw new Error("Producto no encontrado en el carrito");

    cart.products[idx].quantity = quantity;
    cart.updatedAt = new Date();

    await cart.save();
    return cart.populate("products.productId");
  }

  async clearCart(cartId) {
    this.validateId(cartId, "ID de carrito");

    return this.cartDao.clearCart(cartId);
  }
}

export default CartRepository;