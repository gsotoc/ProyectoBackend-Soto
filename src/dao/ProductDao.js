import Product from "../models/Products.js";
import mongoose from "mongoose";

class ProductDao {
  paginate(filter, options) {
    return Product.paginate(filter, options);
  }

  findAll() {
    return Product.find().lean();
  }

  findById(id) {
    return Product.findById(id).lean();
  }

  findByCode(code) {
    return Product.findOne({ code }).lean();
  }

  create(product) {
    const newProduct = new Product(product);
    return newProduct.save();
  }

  update(id, updates) {
    return Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).lean();
  }

  delete(id) {
    return Product.findByIdAndDelete(id);
  }

  isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
}

export default ProductDao;
