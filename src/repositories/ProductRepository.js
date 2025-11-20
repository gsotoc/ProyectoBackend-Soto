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
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sortOption,
      lean: true
    });

    const buildLink = (targetPage) => {
      const params = new URLSearchParams();
      params.set("page", targetPage);
      params.set("limit", limit);
      if (sort) params.set("sort", sort);
      if (query) params.set("query", query);
      if (available === "true") params.set("available", "true");

      return `${baseUrl}?${params.toString()}`;
    };

    return {
      status: "success",
      payload: result.docs,
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

  //Lo usaba para el websockets pero de momento no es necesario
  // async getAllProducts() {
  //   const products = await this.dao.findAll();
  //   return products.map(p => ({ ...p, id: p._id.toString() }));
  // }

  async getProductById(id) {
    if (!this.dao.isValidId(id)) throw new Error("ID inválido");

    const product = await this.dao.findById(id);
    if (!product) throw new Error("Producto no encontrado");

    return product;
  }

  async addProduct(product) {
    const existing = await this.dao.findByCode(product.code.toUpperCase());
    if (existing) throw new Error("Ya existe un producto con ese código");

    if (product.stock === 0) product.status = false;

    const saved = await this.dao.create(product);
    return { ...saved.toObject(), id: saved._id.toString() };
  }

  async updateProduct(id, updates) {
    if (!this.dao.isValidId(id)) throw new Error("ID inválido");

    if (updates.code) {
      const existing = await this.dao.findByCode(updates.code.toUpperCase());

      if (existing && existing._id.toString() !== id) {
        throw new Error("Ya existe un producto con ese código");
      }
    }

    if (updates.stock !== undefined) {
      if (updates.stock === 0) updates.status = false;
      else if (updates.stock > 0 && updates.status === undefined) updates.status = true;
    }

    const updated = await this.dao.update(id, updates);
    if (!updated) throw new Error("Producto no encontrado");

    return { ...updated, id: updated._id.toString() };
  }

  async deleteProduct(id) {
    if (!this.dao.isValidId(id)) throw new Error("ID inválido");

    const deleted = await this.dao.delete(id);
    if (!deleted) throw new Error("Producto no encontrado");

    return true;
  }
}

export default ProductRepository;
