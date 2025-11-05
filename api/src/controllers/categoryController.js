import Category from "../models/catModel.js";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { Categoryname } = req.body;
    const image = req.file ? req.file.path : null;

    if (!Categoryname || !image) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    // 🔍 Check if category already exists
    const existingCategory = await Category.findOne({ Categoryname });
    if (existingCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category name already exists" });
    }

    const newCategory = new Category({ Categoryname, image });
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
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { Categoryname, isActive } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Update name and status
    if (Categoryname) category.Categoryname = Categoryname;
    if (typeof isActive !== "undefined") category.isActive = isActive;

    // ✅ Update image if a new file was uploaded
    if (req.file) {
      category.image = req.file.path;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("❌ Update Category Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};


// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
