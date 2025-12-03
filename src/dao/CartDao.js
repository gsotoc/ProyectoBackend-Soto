import mongoose from "mongoose";
import Cart from "../models/Carts.js";

class CartDao {
  isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  getCarts() {
    return Cart.find()
      .populate("products.productId")
      .lean();
  }

  createCart(products = []) {
    const cart = new Cart({ products });
    return cart.save();
  }

  getCartById(cartId) {
    return Cart.findById(cartId)
      .populate("products.productId");
  }

  updateCart(cartId, products) {
    return Cart.findByIdAndUpdate(
      cartId,
      { products, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate("products.productId");
  }

  addProduct(cartId, product) {
    return Cart.findByIdAndUpdate(
      cartId,
      { $push: { products: product }, updatedAt: new Date() },
      { new: true }
    ).populate("products.productId");
  }

  
  getCartDocument(cartId) {
    return Cart.findById(cartId); 
  }

  saveCart(cart) {
    return cart.save();
  }

  deleteProduct(cartId, productId) {
    return Cart.findByIdAndUpdate(
      cartId,
      {
        $pull: { products: { productId } },
        updatedAt: new Date()
      },
      { new: true }
    ).populate("products.productId");  
  }

  clearCart(cartId) {
    return Cart.findByIdAndUpdate(
      cartId,
      { products: [], updatedAt: new Date() },
      { new: true }
    ).populate("products.productId");  
  }
}

export default CartDao;