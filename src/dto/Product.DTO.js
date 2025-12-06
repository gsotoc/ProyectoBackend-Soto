class ProductDTO {
  constructor(product) {
    this.id = product._id || product.id;
    this.title = product.title;
    this.description = product.description;
    this.code = product.code;
    this.price = product.price;
    this.status = product.status;
    this.stock = product.stock;
    this.category = product.category;
    this.thumbnails = product.thumbnails || [];
    this.availability = this.getAvailability(product);
  }

  getAvailability(product) {
    if (!product.status) return 'Inactivo';
    if (product.stock === 0) return 'Sin stock';
    if (product.stock < 5) return 'Poco stock';
    return 'Disponible';
  }

  // Método estático para convertir un producto a DTO
  static fromProduct(product) {
    if (!product) return null;
    return new ProductDTO(product);
  }

  // Método estático para convertir un array de productos a DTOs
  static fromProductArray(products) {
    if (!products || !Array.isArray(products)) return [];
    return products.map(product => new ProductDTO(product));
  }

  static toCartDTO(product) {
    return {
      id: product._id || product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnails?.[0] || null
    };
  }
}

export default ProductDTO;
