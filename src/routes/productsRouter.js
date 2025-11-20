import { Router } from "express";
import ProductDao from "../dao/ProductDao.js";
import ProductRepository from "../repositories/ProductRepository.js";
import ProductController from "../controllers/ProductController.js";

const router = Router();

const dao = new ProductDao();
const repository = new ProductRepository(dao);
const controller = new ProductController(repository);

router.get("/", controller.getProducts);
router.get("/:pid", controller.getProductById);
router.post("/", controller.addProduct);
router.put("/:pid", controller.updateProduct);
router.delete("/:pid", controller.deleteProduct);

export default router;
