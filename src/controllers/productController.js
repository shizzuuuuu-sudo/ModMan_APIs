import Product from "../models/ProductModel.js";
import path from "path";
import fs from "fs";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      brandName,
      gender,
      sizes,
      description,
      tagNumber,
      inStock,
      oldPrice,
      discount,
      tax,
      isNewArrival,
      isLatestTrend,
    } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    // Auto price calculation (rounded)
    let price = oldPrice;
    if (oldPrice && discount) {
      price = Math.round(oldPrice - (oldPrice * discount) / 100);
    }

    const newProduct = new Product({
      productName,
      category,
      brandName,
      gender,
      sizes,
      description,
      tagNumber,
      inStock,
      oldPrice,
      price,
      discount,
      tax,
      isNewArrival: isNewArrival === "true",
      isLatestTrend: isLatestTrend === "true",
      image,
    });

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};


// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;

    const products = await Product.find(filter).populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

// Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = { ...req.body };

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Handle new uploaded image
    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join("public", product.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    // Auto price recalculation (rounded)
    if (updateData.oldPrice && updateData.discount) {
      const oldPrice = parseFloat(updateData.oldPrice);
      const discount = parseFloat(updateData.discount);
      updateData.price = Math.round(oldPrice - (oldPrice * discount) / 100);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: "Failed to update product", error });
  }
};


// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Remove image file if exists
    if (product.image) {
      const imagePath = path.join("public", product.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
};

// Get Products by Category
export const getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid category ID" });
    }

    const products = await Product.find({ category: id }).populate("category");

    if (!products.length) {
      return res.status(404).json({ success: false, message: "No products found for this category" });
    }

    res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Error fetching products by category:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Latest Trends
export const getLatestTrends = async (req, res) => {
  try {
    const products = await Product.find({ isLatestTrend: true, isActive: true }).populate("category");
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch latest trends", error });
  }
};

// Get New Arrivals
export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true, isActive: true }).populate("category");
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch new arrivals", error });
  }
};
