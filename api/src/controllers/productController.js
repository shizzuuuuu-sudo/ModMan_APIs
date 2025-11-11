import Product from "../models/ProductModel.js";
import Category from "../models/catModel.js";
import cloudinary from "../utils/cloudinary.js";

// Create Product (with multiple images)
export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      category,
      brandName,
      gender,
      fabric,
      pattern,
      description,
      tagNumber,
      oldPrice,
      discount,
      tax,
      isNewArrival,
      isLatestTrend,
    } = req.body;

    // Parse JSON variants
    const variants = JSON.parse(req.body.variants || "[]");

    if (!productName || !category || !variants.length) {
      return res.status(400).json({
        success: false,
        message:
          "Product name, category, and at least one color variant are required.",
      });
    }

    // 🔹 Multer-storage-cloudinary provides all files in req.files (array)
    const uploadedVariants = [];

    for (const variant of variants) {
      const { colorName, colorCode, stock } = variant;
      const variantImages = [];

      // Find files for this variant by fieldname (e.g. "black", "skyblue")
      const variantFiles =
        req.files?.filter(
          (file) => file.fieldname === colorName
        ) || [];

      for (const file of variantFiles) {
        // Cloudinary auto-upload handled by multer-storage-cloudinary
        variantImages.push({
          url: file.path, // cloudinary image URL
          public_id: file.filename, // public_id from Cloudinary
        });
      }

      uploadedVariants.push({
        colorName,
        colorCode,
        images: variantImages,
        stock: stock || {},
      });
    }

    // 🧮 Calculate discounted price
    const price =
      oldPrice && discount
        ? Math.round(oldPrice - (oldPrice * discount) / 100)
        : oldPrice;

    // ✅ Create product
    const newProduct = new Product({
      productName,
      category,
      brandName,
      gender,
      fabric,
      pattern,
      description,
      tagNumber,
      oldPrice,
      price,
      discount,
      tax,
      isNewArrival,
      isLatestTrend,
      variants: uploadedVariants,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "✅ Product with Cloudinary images created successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.error("❌ Create Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Get All Products (with pagination, filters, and search)
export const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (search)
      filter.productName = { $regex: search, $options: "i" };

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .populate("category", "Categoryname")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    console.error("❌ Get All Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "Categoryname"
    );
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("❌ Get Product by ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// Get Products by Category
export const getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid category ID" });
    }

    const products = await Product.find({ category: id, isActive: true })
      .populate("category", "Categoryname")
      .sort({ createdAt: -1 });

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category",
      });
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
    const products = await Product.find({
      isLatestTrend: true,
      isActive: true,
    })
      .populate("category", "Categoryname")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Get Latest Trends Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch latest trends",
      error: error.message,
    });
  }
};

// Get New Arrivals
export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({
      isNewArrival: true,
      isActive: true,
    })
      .populate("category", "Categoryname")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("❌ Get New Arrivals Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch new arrivals",
      error: error.message,
    });
  }
};

// Update Product (replace all images in Cloudinary)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
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
      images, // Cloudinary URLs
    } = req.body;

    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // 🧮 Recalculate price
    let price = oldPrice;
    if (oldPrice && discount) {
      price = Math.round(oldPrice - (oldPrice * discount) / 100);
    }

    // ✅ Replace image URLs if provided
    let updatedImages = product.images;
    if (images && images.length > 0) {
      updatedImages = Array.isArray(images)
        ? images.map((url) => ({ url }))
        : [{ url: images }];
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
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
        isNewArrival,
        isLatestTrend,
        images: updatedImages,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Update Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};


// Delete Product (remove from Cloudinary)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Delete all product images
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
