import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  brandName: String,
  image: String, // single image only
  gender: String,
  sizes: [String],
  description: String,
  tagNumber: String,
  inStock: Number,
  oldPrice: Number,
  price: Number,
  discount: Number,
  tax: Number,
  isNewArrival: { type: Boolean, default: false },
  isLatestTrend: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model("Product", productSchema);
