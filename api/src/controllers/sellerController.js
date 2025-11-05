import Seller from "../models/sellerModel.js";

//  Create Seller
export const createSeller = async (req, res) => {
  try {
    const { name, email, phone, address, shopName } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    const newSeller = new Seller({ name, email, phone, address, shopName });
    await newSeller.save();

    res.status(201).json({ message: "Seller created successfully", seller: newSeller });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get All Sellers
export const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Single Seller
export const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Seller
export const updateSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.status(200).json({ message: "Seller updated successfully", seller });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Seller
export const deleteSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
