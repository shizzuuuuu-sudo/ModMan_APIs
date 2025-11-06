import express from "express";
import multer from "multer";
import {
  createProduct,
  updateProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  getProductsByCategory,
  getLatestTrends,
  getNewArrivals,
} from "../controllers/productController.js";

const productRouter = express.Router();
import upload from "../middleware/Upload.js";

// Routes
productRouter.post("/createProduct", upload.array("image",5), createProduct);
productRouter.get("/getAllProducts", getAllProducts);
productRouter.get("/getProductById/:id", getProductById);
productRouter.put("/:id", upload.array("image",5), updateProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.get("/getProductsByCategory/:id", getProductsByCategory);
productRouter.get("/latestTrends", getLatestTrends);
productRouter.get("/newArrivals", getNewArrivals);

export default productRouter;
