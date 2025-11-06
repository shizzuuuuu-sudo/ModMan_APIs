import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brandName: String,
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
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ], // multiple image support
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Product", productSchema);
