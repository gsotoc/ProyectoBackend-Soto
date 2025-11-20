import Product from "../models/Products.js"; // ✅ AGREGAR ESTA IMPORTACIÓN

class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  validateId(id, name = "ID") {
    if (!this.dao.isValidId(id)) {
      throw new Error(`${name} inválido`);
    }
  }

  async getCarts() {
    return this.dao.getCarts();
  }

  async createCart(products = []) {
    // Validar que los productos existan
    for (const p of products) {
      this.validateId(p.productId, "ID de producto");

      const exists = await Product.findById(p.productId);
      if (!exists) throw new Error(`Producto no encontrado: ${p.productId}`);
    }

    return this.dao.createCart(products);
  }

  async getCartById(cartId) {
    this.validateId(cartId, "ID de carrito");

    const cart = await this.dao.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    return cart;
  }

  async updateCart(cartId, newProducts) {
    this.validateId(cartId, "ID de carrito");

    for (const p of newProducts) {
      this.validateId(p.productId, "ID de producto");
      const exists = await Product.findById(p.productId);
      if (!exists) throw new Error(`Producto no encontrado: ${p.productId}`);
    }

    return this.dao.updateCart(cartId, newProducts);
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    this.validateId(cartId, "ID de carrito");
    this.validateId(productId, "ID de producto");

    // ✅ Verificar que el producto existe
    const productExists = await Product.findById(productId);
    if (!productExists) throw new Error("Producto no encontrado");

    // ✅ Obtener el carrito
    const cart = await this.dao.getCartDocument(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    // ✅ Buscar si el producto ya está en el carrito
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
    
    // ✅ Guardar y hacer populate
    await cart.save();
    return cart.populate("products.productId");
  }

  async removeProductFromCart(cartId, productId) {
    this.validateId(cartId, "ID de carrito");
    this.validateId(productId, "ID de producto");

    return this.dao.deleteProduct(cartId, productId);
  }

  async updateProductQuantity(cartId, productId, quantity) {
    this.validateId(cartId, "ID de carrito");
    this.validateId(productId, "ID de producto");

    if (quantity <= 0) throw new Error("La cantidad debe ser mayor a 0");

    const cart = await this.dao.getCartDocument(cartId);
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

    return this.dao.clearCart(cartId);
  }
}

export default CartRepository;