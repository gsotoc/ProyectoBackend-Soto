import express from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import { Server } from 'socket.io';
import * as helpers from './src/public/scripts/helpers.js';
import ProductsRouter from './src/routes/productsRouter.js';
import CartsRouter from './src/routes/cartsRouter.js';
import { PORT } from './src/config/config.js';
import path from 'path';
import http from 'http';
import connectDB from './src/services/db.js';
import { fileURLToPath } from 'url';
import { cartExists, addCartToLocals } from './src/middleware/cartMiddleware.js';
import passport from 'passport';
import { initializePassport } from "./src/config/passport.config.js";
import sessionsRouter from "./src/routes/sessionRouter.js";
import cookieParser from "cookie-parser";

// import { webSockets } from './src/sockets/webSockets.js'; No está en uso actualmente
//import ProductRepository from './src/repositories/ProductRepository.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

connectDB();

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
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(session({
  secret: "lo-usare-para-crear-un-carrito-por-sesion",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 30 } 
  })
);
app.use(cookieParser());


initializePassport();

//Uso del middleware para asegurar la creacion carrito y agregar cartId a locals
app.use(cartExists);
app.use(addCartToLocals);
app.use(passport.initialize());

// Vistas
app.use('/products', ProductsRouter);
app.use('/realtimeproducts', ProductsRouter);
app.use('/carts', CartsRouter);
app.use("/api/sessions", sessionsRouter);


// webSockets(io, ProductRepository); //No está en uso actualmente

server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/products`);
});
