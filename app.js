import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import * as helpers from './src/public/scripts/helpers.js';
import productsRouter from './src/routes/productsRouter.js';
import cartsRouter from './src/routes/cartsRouter.js';
import { PORT } from './src/config/config.js';
import ProductManager from './src/dao/ProductManager.js';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './src/services/db.js';
import { fileURLToPath } from 'url';
import { webSockets } from './src/sockets/webSockets.js';
import { cartExists, addCartToLocals } from './src/middleware/cartMiddleware.js';
import passport from 'passport';
import { initializePassport } from "./src/config/passport.config.js";
import sessionsRouter from "./src/routes/sessionRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

connectDB();
const productManager = new ProductManager();

// Handlebars
app.engine(
  'handlebars',
  engine({
    helpers
  })
);

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(session({
  secret: "lo-usare-para-crear-un-carrito-por-sesion",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 30 } 
  })
);

initializePassport();

//Uso del middleware para asegurar la creacion carrito y agregar cartId a locals
app.use(cartExists);
app.use(addCartToLocals);
app.use(passport.initialize());

// Vistas
app.use('/products', productsRouter);
app.use('/realtimeproducts', productsRouter);
app.use('/carts', cartsRouter);
app.use("/api/sessions", sessionsRouter);



webSockets(io, productManager);

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/products`);
});
