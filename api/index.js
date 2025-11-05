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

dotenv.config();

const app = express();

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://modman-admin.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight OPTIONS requests for all routes
app.options("*", cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB Atlas
connectDB();

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "Serverless Express API running on Vercel!" });
});

// Routes
app.use("/api/uploads", uploadRoutes);
app.use("/api", router);
app.use("/api/admin", Adminrouter);
app.use("/api/categories", Caterouter);
app.use("/api/products", productRouter);
app.use("/api/sellers", Sellrouter);
app.use("/api/orders", Orderrouter);

// Export serverless function for Vercel
export default serverless(app);
