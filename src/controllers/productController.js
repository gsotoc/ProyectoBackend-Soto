import ProductManagerMongo from "../dao/ProductManager.js";

const productManager = new ProductManagerMongo();

export const get = async (req, res) => { 
  try {
    const { limit, page, sort, query, available } = req.query;
    
    const result = await productManager.getProducts({ 
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

export const getById = async (req, res) => { 
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    
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

export const create = async (req, res) => { 
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || stock === undefined || !category) {
      return res.status(400).json({ 
        status: 'error',
        message: "Faltan campos obligatorios" 
      });
    }

    const newProduct = {
      title,
      description,
      code,
      price,
      status: status !== undefined ? status : true,
      stock,
      category,
      thumbnails: thumbnails || []
    };
    
    const product = await productManager.addProduct(newProduct);
    
    res.status(201).json({
      status: 'success',
      payload: product
    });
  } catch (error) {
    if (error.message.includes('duplicate') || error.message.includes('código')) {
      return res.status(400).json({
        status: 'error',
        message: 'El código del producto ya existe'
      });
    }
    
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

//Unicamente usado en websockets ya que ahí si quiero mostrar toods los productos sin paginacion
export const getAll = async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.render('realTimeProducts', { products: [], error: 'Error al cargar productos' });
  }
};

export const update = async (req, res) => { 
  try {
    const { pid } = req.params;
    const updates = req.body;

    // No permitir actualizar el código si ya existe en otro producto
    if (updates.code) {
      const existingProducts = await productManager.getProducts({ query: updates.code });
      if (existingProducts.payload.length > 0 && existingProducts.payload[0]._id.toString() !== pid) {
        return res.status(400).json({
          status: 'error',
          message: 'El código del producto ya existe'
        });
      }
    }

    const updatedProduct = await productManager.updateProduct(pid, updates);
    
    if (!updatedProduct) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Producto no encontrado' 
      });
    }
    
    res.json({
      status: 'success',
      payload: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const deleteProduct = async (req, res) => { 
  try {
    const { pid } = req.params;

    const deleted = await productManager.deleteProduct(pid);
    
    if (!deleted) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Producto no encontrado' 
      });
    }

    res.json({ 
      status: 'success',
      message: 'Producto eliminado correctamente' 
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
