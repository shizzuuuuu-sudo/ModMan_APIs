import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    Categoryname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String, // URL of the image
      default: "",  // empty string if no image
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Correct way to drop old index programmatically (runs once at startup)
categorySchema.on("index", async function () {
  try {
    const indexes = await this.collection.indexes();

    // Check if the old index "name_1" exists
    const hasOldIndex = indexes.some((idx) => idx.name === "name_1");

    if (hasOldIndex) {
      await this.collection.dropIndex("name_1");
      console.log(" Dropped stale index: name_1");
    }
  } catch (err) {
    if (err.codeName !== "IndexNotFound") {
      console.error("⚠️ Error dropping index:", err.message);
    }
  }
});

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
