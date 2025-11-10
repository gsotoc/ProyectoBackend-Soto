# ProyectoBackend-Soto

Este proyecto es una aplicación backend construida con **Node.js**, utilizando **Express**, **Handlebars** para las vistas y **Socket.io** para la comunicación en tiempo real.

## Requisitos previos

- Tener instalado [Node.js](https://nodejs.org/) (versión recomendada: 14 o superior)
- Tener instalado [npm](https://www.npmjs.com/) (normalmente viene con Node.js)

## Instalación

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/gsotoc/ProyectoBackend-Soto.git
   cd ProyectoBackend1-Soto
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```
   Esto instalará todas las dependencias, incluyendo express, handlebars y socket.io.

3. **Configura las variables de entorno**

   El proyecto usa variables de entorno gestionadas por [dotenv](https://www.npmjs.com/package/dotenv).

   - Crea un archivo `.env` en la raíz del proyecto.
   - Ejemplo de contenido:
     ```
     MONGODB_URI (Te lo paso al entregar el proyecto por la plataforma!!!)
     PORT=8080
     ```
   - Si no defines el puerto, se usará el 8080 por defecto.

4. **Inicializa el proyecto**
   ```bash
   node app.js
   ```
   *(Cambia el nombre del archivo si es necesario)*

## Estructura del proyecto

├── src/
│   ├── config/
│   │   └── config.js
│   ├── controllers/
│   │   ├── cartController.js
│   │   └── productController.js
│   ├── dao/
│   │   ├── cartManager.js
│   │   └── ProductManager.js
│   ├── middleware/
│   │   └── cartMiddleware.js
│   ├── models/
│   │   ├── Carts.js
│   │   └── Products.js
│   ├── public/
│   │   ├── scripts/
│   │   │   ├── cart.js
│   │   │   ├── home.js
│   │   │   ├── helpers.js
│   │   │   └── realTimeProducts.js
│   │   └── styles/
│   ├── routes/
│   │   ├── cartsRouter.js
│   │   └── productsRouter.js
│   ├── services/
│   │   └── db.js
│   ├── sockets/
│   │   └── webSockets.js
│   └── views/
│       └── *.handlebars
└── app.js

## Tecnologías principales

- **Node.js**: Entorno de ejecución de JavaScript en el servidor.
- **Express**: Framework para servidor web.
- **Handlebars**: Motor de plantillas para las vistas.
- **Socket.io**: Comunicación en tiempo real (websockets).
- **MongoDB**: Persistencia de datos.

----

Al trabajar con websockets para agregar un producto todos los campos del formulario son requeridos, para actualizar un producto unicamente es requerido el ID del producto y puedes ajustar cualquiera de los campos, si dejas alguno vacío no se cambiará (no se puede cambiar el ID) y por último para eliminar un producto es necesario que ingreses el ID del mismo.

