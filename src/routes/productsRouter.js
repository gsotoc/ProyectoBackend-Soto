import { Router } from "express";
import ProductDao from "../dao/ProductDao.js";
import ProductRepository from "../repositories/ProductRepository.js";
import ProductController from "../controllers/ProductController.js";
import { requireAuth } from "../middleware/authenticationMiddleware.js";
import { authorizeRole } from "../middleware/authorizationMiddleware.js";

const router = Router();

const dao = new ProductDao();
const repository = new ProductRepository(dao);
const controller = new ProductController(repository);

router.get("/", controller.getProducts);
router.get("/:pid", controller.getProductById);
router.post("/", requireAuth, authorizeRole(["admin"]), controller.addProduct);
router.put("/:pid", requireAuth, authorizeRole(["admin"]), controller.updateProduct);
router.delete("/:pid", requireAuth, authorizeRole(["admin"]), controller.deleteProduct);

export default router;