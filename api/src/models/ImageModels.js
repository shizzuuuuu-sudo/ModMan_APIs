import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ImageModels = mongoose.model("Image", imageSchema);
export default ImageModels;
