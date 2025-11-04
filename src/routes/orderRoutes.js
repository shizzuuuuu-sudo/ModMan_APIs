import express from "express";
import { createOrder, getUserOrders, getAllOrders } from "../controllers/orderController.js";
const Orderrouter = express.Router();

Orderrouter.post("/createOrder", createOrder);
Orderrouter.get("/getOrdersByUser/:userId", getUserOrders);
Orderrouter.get("/getAllOrders", getAllOrders); 

export default Orderrouter;
