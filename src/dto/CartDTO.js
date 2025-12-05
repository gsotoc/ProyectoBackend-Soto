import ProductDTO from './Product.DTO.js';

class CartDTO {
  constructor(cart) {
    this.id = cart._id || cart.id;
    this.products = this.formatProducts(cart.products || []);
    this.total = this.calculateTotal(cart.products || []);
    this.totalItems = this.calculateTotalItems(cart.products || []);
    this.createdAt = cart.createdAt;
    this.updatedAt = cart.updatedAt;
  }

  formatProducts(products) {
    return products.map(item => ({
      productId: item.productId?._id || item.productId,
      product: item.productId ? ProductDTO.toCartDTO(item.productId) : null,
      quantity: item.quantity,
      subtotal: item.quantity * (item.productId?.price || 0)
    }));
  }

  calculateTotal(products) {
    return products.reduce((total, item) => {
      const price = item.productId?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }

  calculateTotalItems(products) {
    return products.reduce((total, item) => total + item.quantity, 0);
  }

  // Método estático para convertir un carrito a DTO
  static fromCart(cart) {
    if (!cart) return null;
    return new CartDTO(cart);
  }

  // DTO simplificado (solo IDs, para respuestas rápidas)
  static toSimpleDTO(cart) {
    return {
      id: cart._id || cart.id,
      totalItems: new CartDTO(cart).totalItems,
      total: new CartDTO(cart).total
    };
  }

  // DTO para checkout (con toda la info necesaria)
  static toCheckoutDTO(cart) {
    const cartDTO = new CartDTO(cart);
    return {
      id: cartDTO.id,
      products: cartDTO.products,
      total: cartDTO.total,
      totalItems: cartDTO.totalItems
    };
  }
}

export default CartDTO;