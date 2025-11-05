import Admin from "../models/AdminModel.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secretkey", {
    expiresIn: "7d",
  });
};

// Register new admin
export const createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ success: false, message: "Email already exists" });

    const admin = await Admin.create({ username, email, password });
    res.status(201).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(404).json({ success: false, message: "Admin not found" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(admin._id);
    res.status(200).json({ success: true, token, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get admin by ID
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin)
      return res.status(404).json({ success: false, message: "Admin not found" });
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update admin
export const updateAdmin = async (req, res) => {
  try {
    const { username, email } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { username, email },
      { new: true }
    );
    if (!admin)
      return res.status(404).json({ success: false, message: "Admin not found" });
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin)
      return res.status(404).json({ success: false, message: "Admin not found" });
    res.status(200).json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
