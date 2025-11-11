import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  colorName: { type: String, required: true },
  colorCode: { type: String, required: true },
  images: [
    {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  ],
  stock: {
    XS: { type: Number, default: 0 },
    S: { type: Number, default: 0 },
    M: { type: Number, default: 0 },
    L: { type: Number, default: 0 },
    XL: { type: Number, default: 0 },
    XXL: { type: Number, default: 0 },
    "3XL": { type: Number, default: 0 },
  },
});

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brandName: String,
  gender: String,
  fabric: String,
  pattern: String,
  description: String,
  tagNumber: String,
  oldPrice: Number,
  price: Number,
  discount: Number,
  tax: Number,
  isNewArrival: { type: Boolean, default: false },
  isLatestTrend: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  variants: [variantSchema], // 🎨 all color variants
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
