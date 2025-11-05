import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js"; 
import router from "./src/routes/userRoutes.js"; 
import uploadRoutes from "./src/routes/UploadRoutes.js";
import Caterouter from "./src/routes/categoryRoutes.js";
import productRouter from "./src/routes/productRoutes.js";
import Sellrouter from "./src/routes/sellerRoutes.js";
import Orderrouter from "./src/routes/orderRoutes.js";
import Adminrouter from "./src/routes/AdminRoutes.js";

dotenv.config(); // load .env

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on Vercel with MongoDB!" });
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/uploads", uploadRoutes);
app.use("/api", router);
app.use("/api/admin",Adminrouter)
app.use("/api/categories", Caterouter);
app.use("/api/products", productRouter);
app.use("/api/sellers",Sellrouter);
app.use("/api/orders", Orderrouter)



// Export serverless function for Vercel
export default serverless(app);
