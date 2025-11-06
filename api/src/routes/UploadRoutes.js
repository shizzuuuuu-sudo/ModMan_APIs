import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';
import ImageModels from '../models/ImageModels.js';

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'my_app_images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const newImage = new ImageModels({
      url: req.file.path, // Cloudinary image URL
      public_id: req.file.filename, // For deletion
    });

    await newImage.save();

    res.json({
      success: true,
      message: "Image uploaded successfully!",
      image: newImage,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/images/:id', upload.single('image'), async (req, res) => {
  try {
    const image = await ImageModels.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });

    // Delete old image from Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // Update new data
    image.url = req.file.path;
    image.public_id = req.file.filename;
    await image.save();

    res.json({ success: true, updated: image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/images/:id', async (req, res) => {
  try {
    const image = await ImageModels.findById(req.params.id);
    if (!image) return res.status(404).json({ error: 'Not found' });

    await cloudinary.uploader.destroy(image.public_id);
    await image.deleteOne();

    res.json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/images', async (req, res) => {
  const images = await ImageModels.find();
  res.json(images);
});


export default router;
