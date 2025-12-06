import { ValidationError } from '../utils/CustomErrors.js';
import mongoose from 'mongoose';

class PurchaseService {
  constructor(cartRepository, productRepository, ticketRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    this.ticketRepository = ticketRepository;
  }

  /**
   * Procesa la compra de un carrito
   * Verifica stock, actualiza productos, genera ticket
   */
  async processPurchase(cartId, userEmail) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Obtener el carrito
      const cart = await this.cartRepository.getCartById(cartId);
      
      if (!cart || !cart.products || cart.products.length === 0) {
        throw new ValidationError('El carrito está vacío');
      }

      // 2. Verificar stock y separar productos
      const result = await this.verifyStockAndSeparateProducts(cart.products);

      // 3. Si no hay productos con stock, abortar
      if (result.availableProducts.length === 0) {
        await session.abortTransaction();
        return {
          success: false,
          ticket: null,
          unavailableProducts: result.unavailableProducts,
          message: 'Ningún producto tiene stock disponible'
        };
      }

      // 4. Actualizar stock de productos disponibles
      await this.updateProductStock(result.availableProducts);

      // 5. Calcular monto total
      const totalAmount = this.calculateTotal(result.availableProducts);

      // 6. Crear ticket
      const ticketData = {
        purchaser: userEmail,
        amount: totalAmount,
        products: result.availableProducts.map(item => ({
          productId: item.productId._id,
          title: item.productId.title,
          quantity: item.quantity,
          price: item.productId.price,
          subtotal: item.quantity * item.productId.price
        }))
      };

      const ticket = await this.ticketRepository.createTicket(ticketData);

      // 7. Actualizar carrito (remover productos comprados)
      await this.updateCartAfterPurchase(
        cartId, 
        result.availableProducts, 
        result.unavailableProducts
      );

      // 8. Commit de la transacción
      await session.commitTransaction();

      return {
        success: true,
        ticket,
        unavailableProducts: result.unavailableProducts,
        message: result.unavailableProducts.length > 0 
          ? 'Compra parcial completada. Algunos productos no tenían stock suficiente.'
          : 'Compra completada exitosamente'
      };

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Verifica el stock de cada producto y los separa en disponibles/no disponibles
   */
  async verifyStockAndSeparateProducts(cartProducts) {
    const availableProducts = [];
    const unavailableProducts = [];

    for (const item of cartProducts) {
      // Obtener producto actualizado de la BD
      const product = await this.productRepository.getProductById(
        item.productId._id || item.productId
      );

      if (!product) {
        unavailableProducts.push({
          productId: item.productId._id || item.productId,
          title: item.productId.title || 'Producto no encontrado',
          requestedQuantity: item.quantity,
          reason: 'Producto no encontrado'
        });
        continue;
      }

      // Verificar si hay stock suficiente
      if (product.stock >= item.quantity && product.status) {
        availableProducts.push({
          productId: product,
          quantity: item.quantity
        });
      } else {
        unavailableProducts.push({
          productId: product._id || product.id,
          title: product.title,
          requestedQuantity: item.quantity,
          availableStock: product.stock,
          reason: !product.status 
            ? 'Producto inactivo' 
            : `Stock insuficiente (disponible: ${product.stock})`
        });
      }
    }

    return { availableProducts, unavailableProducts };
  }

  /**
   * Actualiza el stock de los productos comprados
   */
  async updateProductStock(availableProducts) {
    for (const item of availableProducts) {
      const product = item.productId;
      const newStock = product.stock - item.quantity;

      await this.productRepository.updateProduct(
        product._id || product.id,
        { 
          stock: newStock,
          status: newStock > 0 // Desactivar si stock llega a 0
        }
      );
    }
  }

  /**
   * Calcula el total de la compra
   */
  calculateTotal(availableProducts) {
    return availableProducts.reduce((total, item) => {
      return total + (item.productId.price * item.quantity);
    }, 0);
  }

  /**
   * Actualiza el carrito después de la compra
   * Remueve productos comprados, mantiene los no disponibles
   */
  async updateCartAfterPurchase(cartId, availableProducts, unavailableProducts) {
    if (unavailableProducts.length === 0) {
      // Si todos los productos fueron comprados, limpiar el carrito
      await this.cartRepository.clearCart(cartId);
    } else {
      // Si hay productos no disponibles, mantenerlos en el carrito
      const remainingProducts = unavailableProducts.map(item => ({
        productId: item.productId,
        quantity: item.requestedQuantity
      }));

      await this.cartRepository.updateCart(cartId, remainingProducts);
    }
  }

  /**
   * Obtiene el resumen del carrito antes de comprar
   */
  async getCartSummary(cartId) {
    const cart = await this.cartRepository.getCartById(cartId);
    
    if (!cart || !cart.products || cart.products.length === 0) {
      throw new ValidationError('El carrito está vacío');
    }

    let total = 0;
    let totalItems = 0;
    const stockWarnings = [];

    for (const item of cart.products) {
      const product = await this.productRepository.getProductById(
        item.productId._id || item.productId
      );

      if (product.stock < item.quantity) {
        stockWarnings.push({
          title: product.title,
          requested: item.quantity,
          available: product.stock
        });
      }

      if (product.stock > 0 && product.status) {
        const availableQty = Math.min(item.quantity, product.stock);
        total += product.price * availableQty;
        totalItems += availableQty;
      }
    }

    return {
      total,
      totalItems,
      stockWarnings,
      hasWarnings: stockWarnings.length > 0
    };
  }
}

export default PurchaseService;