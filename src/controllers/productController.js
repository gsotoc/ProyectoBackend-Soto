import { asyncHandler } from '../middleware/errorMiddleware.js';
import { NotFoundError, ValidationError } from '../utils/CustomErrors.js';

class ProductController {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  getProducts = asyncHandler(async (req, res) => {
    const { limit, page, sort, query, available } = req.query;

    const result = await this.productRepository.getProducts({ 
      limit, 
      page, 
      sort, 
      query,
      available,
      baseUrl: "/products" 
    });

    res.render('home', {
      products: result.payload,
      pagination: {
        page: result.page,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink,
      },
      query,
      available
    });
  });

  getProductById = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const product = await this.productRepository.getProductById(pid);
    
    if (!product) {
      throw new NotFoundError('Producto no encontrado');
    }
    
    res.render('details', { product });
  });

  addProduct = asyncHandler(async (req, res) => {
    const result = await this.productRepository.addProduct(req.body);
    res.status(201).json({
      status: 'success',
      payload: result
    });
  });

  updateProduct = asyncHandler(async (req, res) => {
    const result = await this.productRepository.updateProduct(req.params.pid, req.body);
    res.json({
      status: 'success',
      payload: result
    });
  });

  deleteProduct = asyncHandler(async (req, res) => {
    await this.productRepository.deleteProduct(req.params.pid);
    res.json({ 
      status: "success",
      message: "Producto eliminado correctamente"
    });
  });
}

export default ProductController;