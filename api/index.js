// api/index.js
import express from "express";
import serverless from "serverless-http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js"; 

import productRouter from "./src/routes/productRoutes.js";
import Adminrouter from "./src/routes/AdminRoutes.js";
import Caterouter from "./src/routes/categoryRoutes.js";
import Sellrouter from "./src/routes/sellerRoutes.js";
import Orderrouter from "./src/routes/orderRoutes.js";
import router from "./src/routes/userRoutes.js"
import uploadRoutes from "./src/routes/UploadRoutes.js";
 

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "https://modman-admin.vercel.app"],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/images", uploadRoutes);
app.use("/api", router);
app.use("/api/admin", Adminrouter);
app.use("/api/categories", Caterouter);
app.use("/api/products", productRouter);
app.use("/api/sellers", Sellrouter);
app.use("/api/orders", Orderrouter);

// Health check
app.get("/", (req,res) => res.json({ message: "API running" }));

// Export serverless function for Vercel
export default serverless(app);
