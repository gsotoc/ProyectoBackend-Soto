const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

router.get('/', controller.getAll);
router.get('/:pid', controller.getById);
router.post('/', controller.create);
router.put('/:pid', controller.update);
router.delete('/:pid', controller.delete);

module.exports = router;

//Código inicial por si tengo problemas luego
// const { Router } = require("express");
// const fs = require("fs");
// const { getFilePath } = require("../config/config.js");
// const { v4: uuidv4 } = require("uuid");


// const router = Router();

// router.get("/", (req, res) => {
//     const productsFile = getFilePath("products.json"); 
//     const products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));
//     try {
//         res.json(products);
//     } catch (error) {
//         console.error("Error al obtener productos:", error);
//         res.status(500).json({ error: "Error al obtener productos" });
//     }
  
// });

// router.get("/:pid", (req, res) => {
//   const productsFile = getFilePath("products.json"); 
//   const products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));
//   const { pid } = req.params;
//   const product = products.find(p => p.id === pid);

//   if (!product) {
//     return res.status(404).json({ error: "Producto no encontrado" });
//   }

//   res.json(product);
// });

// router.post("/", (req, res) => {
//   const productsFile = getFilePath("products.json"); 
//   const products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));
//   const { title, description, code, price, status, stock, category, thumbnails } = req.body;

//   if (!title || !description || !code || !price || !stock || !category) {
//     return res.status(400).json({ error: "Faltan campos obligatorios" });
//   }

//   const newProduct = {
//     id: uuidv4(),
//     title,
//     description,
//     code,
//     price,
//     status: status !== undefined ? status : true,
//     stock,
//     category,
//     thumbnails: thumbnails || []
//   };

//   products.push(newProduct);

//   fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));

//   res.status(201).json(newProduct);
// });

// router.put('/:pid', (req, res) => {
//   const productsFile = getFilePath("products.json"); 
//   const products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));
//   const { pid } = req.params;
//   const productoActualizar = products.find(p => p.id === pid);

//   const index = products.indexOf(productoActualizar);
//   products.splice(index, 1);

//   if (!productoActualizar) {
//     return res.status(404).json({ error: 'Producto no encontrado' });
//   }

  
//   Object.assign(productoActualizar, {
//     title: req.body.title !== undefined ? req.body.title : productoActualizar.title,
//     description: req.body.description !== undefined ? req.body.description : productoActualizar.description,
//     code: req.body.code !== undefined ? req.body.code : productoActualizar.code,
//     price: req.body.price !== undefined ? req.body.price : productoActualizar.price,
//     status: req.body.status !== undefined ? req.body.status : productoActualizar.status,
//     stock: req.body.stock !== undefined ? req.body.stock : productoActualizar.stock,
//     category: req.body.category !== undefined ? req.body.category : productoActualizar.category,
//     thumbnails: req.body.thumbnails !== undefined ? req.body.thumbnails : productoActualizar.thumbnails,
//   });

//   products.push(productoActualizar);
//   fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
//   res.status(200).json(productoActualizar);

//   /*Buscar una forma más eficiente, estoy buscando el producto y su index, lo borro completamente de products
//    luego lo actualizo y vuelvo a hacerle push y luego guardo nuevamente el contenido de products en el json*/ 
// });

// router.delete('/:pid', (req, res) => {
//   const productsFile = getFilePath("products.json"); 
//   const products = JSON.parse(fs.readFileSync(productsFile, "utf-8"));
//   const { pid } = req.params;
//   const index = products.findIndex(p => p.id === pid);

//   if (index === -1) {
//     return res.status(404).json({ error: 'Producto no encontrado' });
//   }

//   products.splice(index, 1);
//   fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));

//   res.status(200).json({ message: 'Producto eliminado' });
// });

// module.exports = router;
