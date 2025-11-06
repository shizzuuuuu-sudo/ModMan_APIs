import Category from "../models/catModel.js";
import cloudinary from "../utils/cloudinary.js";

// Create Category (Cloudinary Upload)
export const createCategory = async (req, res) => {
  try {
    const { Categoryname } = req.body;
    if (!Categoryname) {
      return res.status(400).json({ success: false, message: "Category name required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    // 🔍 Check duplicate
    const existingCategory = await Category.findOne({ Categoryname });
    if (existingCategory) {
      return res.status(400).json({ success: false, message: "Category name already exists" });
    }

    const newCategory = new Category({
      Categoryname,
      image: req.file.path, // Cloudinary URL
      public_id: req.file.filename, // for deletion
    });

    await newCategory.save();

    res.status(201).json({ success: true, category: newCategory });
  } catch (err) {
    console.error("❌ Create Category Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get All Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get Single Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    // validate ObjectId (optional but helpful)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid category id" });
    }

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    console.error("❌ Get Category By Id Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// Update Category (Replace image in Cloudinary)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { Categoryname, isActive } = req.body;
    const category = await Category.findById(id);

    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    // Replace image in Cloudinary
    if (req.file) {
      if (category.public_id) {
        await cloudinary.uploader.destroy(category.public_id);
      }
      category.image = req.file.path;
      category.public_id = req.file.filename;
    }

    if (Categoryname) category.Categoryname = Categoryname;
    if (typeof isActive !== "undefined") category.isActive = isActive;

    await category.save();
    res.status(200).json({ success: true, message: "Category updated successfully", category });
  } catch (error) {
    console.error("❌ Update Category Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Delete Category (remove from Cloudinary)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Delete from Cloudinary
    if (category.public_id) {
      await cloudinary.uploader.destroy(category.public_id);
    }

    await category.deleteOne();

    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
