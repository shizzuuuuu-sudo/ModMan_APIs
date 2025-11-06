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

// Multer setup (single file only)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

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
