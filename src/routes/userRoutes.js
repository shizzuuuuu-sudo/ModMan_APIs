// src/routes/userRoutes.js
import express from "express";
import { signup, login, getWishlist,toggleWishlist,addToCart,removeFromCart,getCart,getAllUsers,getUserById,deleteUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/toggle", protect, toggleWishlist);
router.post("/cart/add", protect, addToCart);
router.post("/cart/remove", protect, removeFromCart);
router.get("/cart", protect, getCart);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

export default router;
