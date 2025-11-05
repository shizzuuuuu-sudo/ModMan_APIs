import express from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js"; // ✅ import your DB connection
import productRoutes from "./src/routes/productRoutes.js"; // ✅ example route

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

app.use("/api/products", productRoutes); // example route usage

// Export serverless function for Vercel
export default serverless(app);
