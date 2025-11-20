//No está en uso actualmente
// export const webSockets = (io, productManager) => {
//   io.on('connection', async (socket) => {
//     console.log('Nuevo cliente conectado ✅');

//     try {
//       const products = await productManager.getAllProducts();
//       socket.emit('updateProducts', products);

//       socket.on('createProduct', async (product) => {
//         try {
//           if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
//             return socket.emit('error', { message: 'Todos los campos son obligatorios' });
//           }

//           if (product.price <= 0) {
//             return socket.emit('error', { message: 'El precio debe ser mayor a 0' });
//           }

//           if (product.stock <= 0) {
//             return socket.emit('error', { message: 'El stock debe ser mayor o igual a 1' });
//           }

//           if (product.stock === 0) {
//             product.status = false;
//           } else {
//             product.status = true;
//           }

//           await productManager.addProduct(product);
//           const updated = await productManager.getAllProducts();
//           io.emit('updateProducts', updated);
//           socket.emit('productCreated', product);
//           console.log('Producto creado:', product.title);
//         } catch (error) {
//           console.error('Error al crear producto:', error);
//           socket.emit('error', { message: 'Error al crear el producto' });
//         }
//       });

//       socket.on('deleteProduct', async (id) => {
//         try {
//           if (!id) return socket.emit('error', { message: 'ID de producto requerido' });

//           const deleted = await productManager.deleteProduct(id);
//           if (!deleted) return socket.emit('error', { message: 'Producto no encontrado' });

//           const updated = await productManager.getAllProducts();
//           io.emit('updateProducts', updated);
//           socket.emit('productDeleted', id);
//           console.log('Producto eliminado:', id);
//         } catch (error) {
//           console.error('Error al eliminar producto:', error);
//           socket.emit('error', { message: 'Error al eliminar el producto' });
//         }
//       });

//       socket.on('updateProduct', async ({ id, updates }) => {
//         try {
//           if (!id) return socket.emit('error', { message: 'ID de producto requerido' });

//           if (!updates || Object.keys(updates).length === 0) {
//             return socket.emit('error', { message: 'Debes proporcionar al menos un campo para actualizar' });
//           }

//           if (updates.price !== undefined && updates.price <= 0) {
//             return socket.emit('error', { message: 'El precio debe ser mayor a 0' });
//           }

//           if (updates.stock !== undefined && updates.stock < 0) {
//             return socket.emit('error', { message: 'El stock no puede ser negativo' });
//           }

//           const existingProduct = await productManager.getProductById(id);
//           if (!existingProduct) return socket.emit('error', { message: 'Producto no encontrado' });

//           if (updates.code && updates.code !== existingProduct.code) {
//             const all = await productManager.getAllProducts();
//             const codeExists = all.some(p => p.id !== id && p.code === updates.code);
//             if (codeExists) {
//               return socket.emit('error', { message: 'Ya existe un producto con ese código' });
//             }
//           }

//           const updatedProduct = await productManager.updateProduct(id, updates);
//           if (!updatedProduct) return socket.emit('error', { message: 'Error al actualizar el producto' });

//           const allProducts = await productManager.getAllProducts();
//           io.emit('updateProducts', allProducts);
//           socket.emit('productUpdated', updatedProduct);
//           console.log('Producto actualizado:', updatedProduct.title);
//         } catch (error) {
//           console.error('Error al actualizar producto:', error);
//           socket.emit('error', { message: error.message || 'Error al actualizar el producto' });
//         }
//       });

//       socket.on('disconnect', () => {
//         console.log('Cliente desconectado ❌');
//       });

//     } catch (error) {
//       console.error('Error en conexión de socket:', error);
//       socket.emit('error', { message: 'Error de conexión' });
//     }
//   });
// };
