import express from "express";
import {
  createSeller,
  getAllSellers,
  getSellerById,
  updateSeller,
  deleteSeller,
} from "../controllers/sellerController.js";

const Sellrouter = express.Router();

Sellrouter.post("/create", createSeller);
Sellrouter.get("/", getAllSellers);
Sellrouter.get("/:id", getSellerById);
Sellrouter.put("/:id", updateSeller);
Sellrouter.delete("/:id", deleteSeller);

export default Sellrouter;
