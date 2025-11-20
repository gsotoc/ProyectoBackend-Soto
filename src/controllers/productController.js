class ProductController {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  getProducts = async (req, res) => {
    const { limit, page, sort, query, available } = req.query;

    try {
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
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.render('home', { products: [], error: 'Error al cargar productos' });
    }
  };

  getProductById = async (req, res) => {
    try {
      const { pid } = req.params;
      const product = await this.productRepository.getProductById(pid);
      
      if (!product) {
        return res.status(404).json({ 
          status: 'error',
          message: "Producto no encontrado" 
        });
      }
      
      res.render('details', { product });
      
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };

  addProduct = async (req, res) => {
    try {
      const result = await this.productRepository.addProduct(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  };

  updateProduct = async (req, res) => {
    try {
      const result = await this.productRepository.updateProduct(req.params.pid, req.body);
      res.json(result);
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  };

  deleteProduct = async (req, res) => {
    try {
      const result = await this.productRepository.deleteProduct(req.params.pid);
      res.json({ status: "success" });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  };
}

export default ProductController;
