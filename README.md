ProyectoBackend-Soto
Sistema de e-commerce completo construido con Node.js, Express, MongoDB y Handlebars. Incluye gestión de productos, carritos de compra, autenticación de usuarios, procesamiento de compras y generación de tickets.

📋 Tabla de Contenidos

Características
Requisitos Previos
Instalación
Configuración
Uso
Estructura del Proyecto
API Endpoints
Tecnologías
Funcionalidades Principales

✨ Características

Gestión de Productos: CRUD completo con paginación, filtros y búsqueda
Sistema de Carritos: Gestión de carritos por sesión con validación de stock
Autenticación JWT: Login, registro y recuperación de contraseña
Procesamiento de Compras: Validación de stock, actualización de inventario y generación de tickets
Sistema de Roles: Permisos diferenciados para usuarios y administradores
Recuperación de Contraseña: Envío de emails con tokens temporales
Rate Limiting: Protección contra ataques de fuerza bruta
Manejo de Errores: Sistema centralizado con errores personalizados
DTOs: Capa de abstracción para respuestas consistentes

🔧 Requisitos Previos

Node.js (versión 14 o superior)
npm (incluido con Node.js)
MongoDB (local o Atlas)
Cuenta de Gmail (para envío de emails de recuperación)

📦 Instalación

Clona el repositorio

bashgit clone https://github.com/gsotoc/ProyectoBackend-Soto.git
cd ProyectoBackend-Soto

Instala las dependencias

npm install


Crea un archivo .env en la raíz del proyecto con las siguientes variables**(estos datos los pasé en la entrega por la plataforma de coder!!!)**:

env# Base de Datos
MONGODB_URI=mongodb+srv://tu_usuario:tu_password@cluster.mongodb.net/tu_database

# Servidor
PORT=8080
APP_URL=http://localhost:8080

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui

# Email (Gmail)
MAIL_USER=tu_email@gmail.com
MAIL_PASS=tu_app_password_de_gmail

# Entorno
NODE_ENV=development

Configuración de Gmail para recuperación de contraseña

Habilita la verificación en dos pasos en tu cuenta de Gmail
Genera una "Contraseña de aplicación" en tu cuenta de Google
Usa esa contraseña en MAIL_PASS


Inicializa el proyecto

npm run dev
El servidor estará disponible en http://localhost:8080
🚀 Uso
Acceso inicial

Accede a http://localhost:8080/products para ver el catálogo
Regístrate en /api/sessions/register
Inicia sesión en /api/sessions/login
Explora productos, agrégalos al carrito y realiza compras

Credenciales de prueba
Puedes usar un usuario administrador previamente creado:
javascript{
  "first_name": "Super",
  "last_name": "Admin",
  "email": "testeonodemailer@gmail.com",
  "password": "12345678", 
  "role": "admin",
  "age": 29
}
```

## 📁 Estructura del Proyecto
```
ProyectoBackend-Soto/
├── src/
│   ├── config/
│   │   ├── config.js              # Configuración general y nodemailer
│   │   └── passport.config.js     # Estrategias de Passport (JWT, Local)
│   ├── controllers/
│   │   ├── CartController.js
│   │   ├── productController.js
│   │   ├── purchaseController.js
│   │   ├── sessionsController.js
│   │   ├── ticketController.js
│   │   ├── UsersController.js
│   │   └── passwordRecoveryController.js
│   ├── dao/
│   │   ├── CartDao.js
│   │   ├── ProductDao.js
│   │   ├── TicketDao.js
│   │   └── UserDao.js
│   ├── dto/
│   │   ├── CartDTO.js
│   │   ├── Product.DTO.js
│   │   ├── TicketDTO.js
│   │   └── UserDTO.js
│   ├── middleware/
│   │   ├── authenticationMiddleware.js  # Verificación JWT
│   │   ├── authorizationMiddleware.js   # Control de roles
│   │   ├── cartMiddleware.js
│   │   ├── errorMiddleware.js           # Manejo centralizado de errores
│   │   ├── rateLimitMiddleware.js       # Limitación de peticiones
│   │   ├── user.middleware.js
│   │   └── validation.register.js
│   ├── models/
│   │   ├── Carts.js
│   │   ├── Products.js
│   │   ├── Ticket.js
│   │   └── User.js
│   ├── public/
│   │   ├── scripts/
│   │   └── styles/
│   ├── repositories/
│   │   ├── CartRepository.js
│   │   ├── ProductRepository.js
│   │   ├── TicketRepository.js
│   │   └── UserRepository.js
│   ├── routes/
│   │   ├── cartsRouter.js
│   │   ├── productsRouter.js
│   │   ├── sessionRouter.js
│   │   ├── ticketsRouter.js
│   │   └── userRouter.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── db.js
│   │   ├── password.recovery.js
│   │   └── purchaseService.js
│   ├── utils/
│   │   ├── CustomErrors.js
│   │   └── JwtHelper.js
│   └── views/
│       ├── layouts/
│       ├── cart.handlebars
│       ├── checkout.handlebars
│       ├── details.handlebars
│       ├── error.handlebars
│       ├── forgot-password.handlebars
│       ├── home.handlebars
│       ├── login.handlebars
│       ├── my-tickets.handlebars
│       ├── profile.handlebars
│       ├── register.handlebars
│       ├── reset-password.handlebars
│       └── ticket-details.handlebars
├── app.js                         # Punto de entrada
├── package.json
└── .env                          # Variables de entorno (no incluido en repo)
🔌 API Endpoints
Autenticación (/api/sessions)
MétodoRutaDescripciónAutenticaciónGET/registerVista de registroNoPOST/registerRegistrar usuarioNoGET/loginVista de loginNoPOST/loginIniciar sesiónNoPOST/logoutCerrar sesiónSíGET/currentPerfil del usuarioSíGET/forgot-passwordVista recuperaciónNoPOST/forgot-passwordSolicitar recuperaciónNoGET/reset-passwordVista resetear contraseñaNoPOST/reset-passwordResetear contraseñaNo
Productos (/products)
MétodoRutaDescripciónAutenticaciónGET/Listar productos (paginado)NoGET/:pidVer detalle de productoNoPOST/Crear productoAdminPUT/:pidActualizar productoAdminDELETE/:pidEliminar productoAdmin
Query params para listado:

limit: productos por página (default: 10)
page: número de página (default: 1)
sort: asc o desc (por precio)
query: búsqueda por título o categoría
available: true para solo disponibles

Carritos (/carts)
MétodoRutaDescripciónAutenticaciónPOST/Crear carritoNoGET/Listar carritosNoGET/:cidVer carritoNoPOST/:cid/products/:pidAgregar productoNoPUT/:cidActualizar carrito completoNoPUT/:cid/products/:pidActualizar cantidadNoDELETE/:cid/products/:pidRemover productoNoDELETE/:cidVaciar carritoNoGET/:cid/checkoutVista de checkoutSíPOST/:cid/purchaseProcesar compraSí
Tickets (/api/tickets)
MétodoRutaDescripciónAutenticaciónGET/my-ticketsVista de mis ticketsSíGET/my-tickets/apiMis tickets (JSON)SíGET/:tid/ticket-detailsVista detalle ticketSíGET/:tidObtener ticket (JSON)SíGET/code/:codeBuscar por códigoSí
Usuarios (/api/users)
MétodoRutaDescripciónAutenticaciónGET/currentUsuario actualSíGET/Listar usuariosAdminGET/statsEstadísticasAdminGET/role/:roleUsuarios por rolAdminGET/:uidObtener usuarioSíPUT/:uidActualizar usuarioSí/AdminDELETE/:uidEliminar usuarioAdmin
🛠️ Tecnologías
Backend

Node.js - Entorno de ejecución
Express - Framework web
MongoDB - Base de datos NoSQL
Mongoose - ODM para MongoDB
Passport.js - Autenticación
JWT - Tokens de autenticación
bcrypt - Hash de contraseñas
Nodemailer - Envío de emails

Frontend

Handlebars - Motor de plantillas
Socket.io - Comunicación en tiempo real (opcional)

Seguridad y Validación

express-validator - Validación de datos
express-rate-limit - Limitación de peticiones
cookie-parser - Manejo de cookies
express-session - Gestión de sesiones

🎯 Funcionalidades Principales
1. Sistema de Autenticación

Registro de usuarios con validación
Login con JWT almacenado en cookies HTTP-only
Recuperación de contraseña por email
Middleware de autenticación y autorización

2. Gestión de Productos

CRUD completo con validaciones
Paginación y filtros avanzados
Categorías predefinidas
Control de stock automático

3. Carrito de Compras

Creación automática por sesión
Validación de stock en tiempo real
Cálculo de totales y subtotales
Persistencia en MongoDB

4. Proceso de Compra

Verificación de stock antes de comprar
Actualización automática de inventario
Generación de tickets con código único
Manejo de compras parciales (stock insuficiente)
Transacciones MongoDB para consistencia

5. Sistema de Tickets

Generación automática de código único
Historial de compras por usuario
Detalle completo de productos comprados
Estados de ticket (pending, completed, cancelled)

6. Seguridad

Rate limiting en endpoints sensibles
Validación de entrada con express-validator
Manejo centralizado de errores
Passwords hasheadas con bcrypt
Tokens JWT con expiración

📝 Notas Adicionales

El proyecto incluye manejo de errores centralizado con clases personalizadas
Se utilizan DTOs (Data Transfer Objects) para estandarizar las respuestas
La arquitectura sigue el patrón Repository para mejor mantenibilidad
Los carritos se crean automáticamente por sesión
El stock se valida tanto al agregar productos como al finalizar la compra

👤 Autor
Germán Soto - gsotoc
