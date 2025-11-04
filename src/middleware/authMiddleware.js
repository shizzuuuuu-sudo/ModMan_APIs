import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in the Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔐 Incoming Token:", token);

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
      console.log("✅ Decoded Token:", decoded);

      // Fetch user and attach to request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next(); // ✅ Continue to controller
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("❌ JWT verification failed:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
