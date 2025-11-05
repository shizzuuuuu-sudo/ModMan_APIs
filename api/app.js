// app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import router from "./src/routes/userRoutes.js"; 
import uploadRoutes from "./src/routes/UploadRoutes.js";
import Caterouter from "./src/routes/categoryRoutes.js";
import productRouter from "./src/routes/productRoutes.js";
import Sellrouter from "./src/routes/sellerRoutes.js";
import Orderrouter from "./src/routes/orderRoutes.js";
import Adminrouter from "./src/routes/AdminRoutes.js";

dotenv.config();
const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "https://modman-admin.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/uploads", uploadRoutes);
app.use("/api", router);
app.use("/api/admin",Adminrouter)
app.use("/api/categories", Caterouter);
app.use("/api/products", productRouter);
app.use("/api/sellers",Sellrouter);
app.use("/api/orders", Orderrouter)

connectDB();

app.get("/", (req, res) => {
  res.send("Server connected to MongoDB Atlas");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));