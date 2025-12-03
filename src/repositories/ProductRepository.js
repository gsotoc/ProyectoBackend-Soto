import { NotFoundError, ValidationError, ConflictError } from '../utils/CustomErrors.js';
import ProductDTO from '../dto/Product.DTO.js';

class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getProducts({ limit, page, sort, query, available, baseUrl }) {
    const filter = {};

    if (available === "true") filter.status = true;

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ];
    }

    const sortOption = sort ? { price: sort === "asc" ? 1 : -1 } : undefined;

    const result = await this.dao.paginate(filter, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sort: sortOption,
      lean: true
    });

    const buildLink = (targetPage) => {
      const params = new URLSearchParams();
      params.set("page", targetPage);
      params.set("limit", limit || 10);
      if (sort) params.set("sort", sort);
      if (query) params.set("query", query);
      if (available === "true") params.set("available", "true");

      return `${baseUrl}?${params.toString()}`;
    };

    return {
      status: "success",
      payload: result.docs, // Mantener sin DTO para vistas Handlebars
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null
    };
  }

  // Versión que retorna DTOs para APIs
  async getProductsDTO({ limit, page, sort, query, available, baseUrl }) {
    const result = await this.getProducts({ limit, page, sort, query, available, baseUrl });
    return {
      ...result,
      payload: ProductDTO.fromProductArray(result.payload)
    };
  }

  async getProductById(id) {
    if (!this.dao.isValidId(id)) {
      throw new ValidationError("ID de producto inválido");
    }

    const product = await this.dao.findById(id);
    if (!product) {
      throw new NotFoundError("Producto no encontrado");
    }

    // Retornar producto sin DTO para vistas
    return product;
  }

  // Versión que retorna DTO
  async getProductByIdDTO(id) {
    const product = await this.getProductById(id);
    return ProductDTO.fromProduct(product);
  }

  async addProduct(product) {
    // Validar campos requeridos
    if (!product.code) {
      throw new ValidationError("El código del producto es obligatorio");
    }

    const existing = await this.dao.findByCode(product.code.toUpperCase());
    if (existing) {
      throw new ConflictError("Ya existe un producto con ese código");
    }

    if (product.stock === 0) product.status = false;

    const saved = await this.dao.create(product);
    return { ...saved.toObject(), id: saved._id.toString() };
  }

  async updateProduct(id, updates) {
    if (!this.dao.isValidId(id)) {
      throw new ValidationError("ID de producto inválido");
    }

    if (updates.code) {
      const existing = await this.dao.findByCode(updates.code.toUpperCase());

      if (existing && existing._id.toString() !== id) {
        throw new ConflictError("Ya existe un producto con ese código");
      }
    }

    if (updates.stock !== undefined) {
      if (updates.stock === 0) updates.status = false;
      else if (updates.stock > 0 && updates.status === undefined) updates.status = true;
    }

    const updated = await this.dao.update(id, updates);
    if (!updated) {
      throw new NotFoundError("Producto no encontrado");
    }

    return { ...updated, id: updated._id.toString() };
  }

  async deleteProduct(id) {
    if (!this.dao.isValidId(id)) {
      throw new ValidationError("ID de producto inválido");
    }

    const deleted = await this.dao.delete(id);
    if (!deleted) {
      throw new NotFoundError("Producto no encontrado");
    }

    return true;
  }
}

export default ProductRepository;