import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import upload from "../middleware/Upload.js";

const Caterouter = express.Router();

Caterouter.post("/CreateCategory",upload.single("image"), createCategory);        
Caterouter.get("/getCategory",upload.single("image"), getCategories);          
Caterouter.get("/:id", getCategoryById);     
Caterouter.put("/:id",upload.single("image"), updateCategory);      
Caterouter.delete("/:id", deleteCategory);  

export default Caterouter;
