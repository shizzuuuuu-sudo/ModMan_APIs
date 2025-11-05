import express from "express";
import upload from "../middleware/Upload.js";

const router = express.Router();

// === POST /api/uploads ===
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.status(200).json({
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
