import express from "express";
import {
  createAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/AdminuserController.js";

const Adminrouter = express.Router();

Adminrouter.post("/create", createAdmin);
Adminrouter.post("/login", loginAdmin);
Adminrouter.get("/getAll", getAllAdmins);
Adminrouter.get("/getById/:id", getAdminById);
Adminrouter.put("/update/:id", updateAdmin);
Adminrouter.delete("/delete/:id", deleteAdmin);

export default Adminrouter;
