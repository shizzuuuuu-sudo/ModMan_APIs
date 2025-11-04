import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    shopName: { type: String },
  },
  { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
